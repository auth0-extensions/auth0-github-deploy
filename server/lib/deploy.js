import config from '../lib/config';
import logger from '../lib/logger';
import auth0 from '../lib/auth0';

import { pushToSlack } from './slack';
import { getChanges } from './github';
import { appendProgress } from './storage';

const trackProgress = (id, branch, repository, sha, user) => {
  const logs = [];
  const log = (message) => {
    logs.push({ date: new Date(), message });
    logger.debug(message);
  };

  return {
    id,
    user,
    sha,
    branch,
    repository,
    date: new Date(),
    connectionsUpdated: 0,
    rulesCreated: 0,
    rulesUpdated: 0,
    rulesDeleted: 0,
    error: null,
    logs,
    log
  };
};


export default (storage, id, branch, repository, sha, user, client) => {
  const progress = trackProgress(id, branch, repository, sha, user);
  if (id === 'manual') {
    progress.log('Manual deployment triggered.');
  } else {
    progress.log(`Webhook received: ${id}.`);
  }

  progress.log('Loading GitHub tree...');
  return getChanges(repository, branch, sha)
    .then(context => {
      progress.log(`Assets: ${JSON.stringify({ id, user, ...context }, null, 2)}`);
      progress.log(`Getting access token for ${config('AUTH0_CLIENT_ID')}/${config('AUTH0_DOMAIN')}`);

      context.client = client;

      // Send all changes to Auth0.
      storage.read()
        .then((data) => {
          context.excluded_rules = data.excluded_rules || [];
        })
        .then(() => auth0.validateDatabases(progress,context.client, context.databases))
        .then(() => auth0.validateRules(progress,context.client, context.rules, context.excluded_rules))
        .then(() => auth0.updateDatabases(progress, context.client, context.databases))
        .then(() => auth0.deleteRules(progress, context.client, context.rules, context.excluded_rules))
        .then(() => auth0.updateRules(progress, context.client, context.rules))
        .then(() => progress.log('Done.'));
    })
    .then(() => appendProgress(storage, progress))
    .then(() => pushToSlack(progress, `${config('WT_URL')}/login`))
    .then(() => ({
      connections: {
        updated: progress.connectionsUpdated
      },
      rules: {
        created: progress.rulesCreated,
        updated: progress.rulesUpdated,
        deleted: progress.rulesDeleted
      }
    }))
    .catch(err => {
      // Log error and persist.
      progress.error = err;
      progress.log(`Error: ${err.message}`);
      progress.log(`StackTrace: ${err.stack}`);
      appendProgress(storage, progress);

      // Final attempt to push to slack.
      pushToSlack(progress, `${config('WT_URL')}/login`);

      // Continue.
      throw err;
    });
};
