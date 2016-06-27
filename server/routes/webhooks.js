import express from 'express';

import config from '../lib/config';
import logger from '../lib/logger';
import * as auth0 from '../lib/auth0';

import trackProgress from '../lib/trackProgress';
import { pushToSlack } from '../lib/slack';
import { hasChanges, getChanges } from '../lib/github';
import { appendProgress } from '../lib/storage';
import { githubWebhook } from '../lib/middlewares';
import { getForClient } from '../lib/managementApiClient';

export default (storageContext) => {
  const activeBranch = config('GITHUB_BRANCH');
  const githubSecret = config('EXTENSION_SECRET');

  const webhooks = express.Router();
  webhooks.post('/deploy', githubWebhook(githubSecret), (req, res, next) => {
    const { id, branch, commits, repository, user } = req.webhook;

    // Only accept push requests.
    if (req.webhook.event !== 'push') {
      return res.json({ message: `Request ignored, the '${req.webhook.event}' event is not supported.` });
    }

    // Only for the active branch.
    if (branch !== activeBranch) {
      return res.json({ message: `Request ignored, '${branch}' is not the active branch.` });
    }

    // Only run if there really are changes.
    if (!hasChanges(commits)) {
      return res.json({ message: 'Request ignored, none of the Rules or Database Connection scripts were changed.' });
    }

    const progress = trackProgress(id, branch, repository, user);
    progress.log(`Webhook received: ${id}. Downloading changes...`);

    // Parse all commits.
    return getChanges(repository, branch)
      .then(context => {
        progress.log(`Changes: ${JSON.stringify({ id, user, ...context }, null, 2)}`);
        progress.log(`Getting access token for ${config('AUTH0_DOMAIN')}`);

        // Send all changes to Auth0.
        return getForClient(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
          .then((client) => {
            context.client = client;
          })
          .then(() => auth0.updateDatabases(progress, context.client, context.databases))
          .then(() => auth0.deleteRules(progress, context.client, context.rules))
          .then(() => auth0.updateRules(progress, context.client, context.rules))
          .then(() => progress.log('Done.'));
      })
      .then(() => appendProgress(storageContext, progress))
      .then(() => pushToSlack(progress, `${config('WT_URL')}/login`))
      .then(() => {
        res.json({
          connections: {
            updated: progress.connectionsUpdated
          },
          rules: {
            created: progress.rulesCreated,
            updated: progress.rulesUpdated,
            deleted: progress.rulesDeleted
          }
        });
      })
      .catch(err => {
        // Log error and persist.
        progress.error = err;
        progress.log(`Error: ${err.message}`);
        progress.log(`StackTrace: ${err.stack}`);
        appendProgress(storageContext, progress);

        // Final attempt to push to slack.
        pushToSlack(progress, `${config('WT_URL')}/login`);

        // Continue.
        next(err);
      });
  });

  return webhooks;
};
