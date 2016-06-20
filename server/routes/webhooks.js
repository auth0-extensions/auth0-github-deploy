import express from 'express';

import config from '../lib/config';
import logger from '../lib/logger';

import * as auth0 from '../lib/auth0';
import { pushToSlack } from '../lib/slack';
import { getChanges } from '../lib/github';
import { appendProgress } from '../lib/storage';
import { githubWebhook } from '../lib/middlewares';
import { getForClient } from '../lib/managementApiClient';

const trackProgress = (id, branch, repository) => {
  const logs = [];
  return {
    id,
    branch,
    repository,
    date: new Date(),
    connectionsUpdated: 0,
    rulesCreated: 0,
    rulesUpdated: 0,
    rulesDeleted: 0,
    error: null,
    logs,
    log: (message) => {
      logs.push({ date: new Date(), message });
      logger.debug(message);
    }
  };
};

export default (storageContext) => {
  const activeBranch = config('GITHUB_BRANCH');
  const githubSecret = config('EXTENSION_SECRET');

  const webhooks = express.Router();
  webhooks.post('/deploy', githubWebhook(githubSecret), (req, res, next) => {
    const { id, branch, commits, repository } = req.webhook;

    if (req.webhook.event !== 'push') {
      return res.json({ message: `Request ignored, the '${req.webhook.event}' event is not supported.` });
    }

    if (branch !== activeBranch) {
      return res.json({ message: `Request ignored, '${branch}' is not the active branch.` });
    }

    const progress = trackProgress(id, branch, repository);
    getChanges(repository, branch, commits)
      .then(context => {
        progress.log(`Webhook ${id} received: ${JSON.stringify(context, null, 2)}`);

        return getForClient(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
          .then((client) => {
            context.client = client;
          })
          .then(() => auth0.mergeDatabaseConnectionScripts(context.client, context.databases))
          .then((databases) => {
            logger.debug(`Database connections: ${JSON.stringify(databases, null, 2)}`);
            context.databases = databases;
          })
          .then(() => auth0.updateRules(progress, context.client, context.rules.modified))
          .then(() => auth0.deleteRules(progress, context.client, context.rules.removed))
          .then(() => auth0.updateDatabases(progress, context.client, context.databases));
      })
      .then(() => appendProgress(storageContext, progress))
      .then(() => pushToSlack(progress))
      .then(() => {
        progress.log('Done.');
        res.json({
          connectionsUpdated: progress.connectionsUpdated,
          rulesCreated: progress.connectionsUpdated,
          rulesUpdated: progress.connectionsUpdated,
          rulesDeleted: progress.connectionsUpdated
        });
      })
      .catch(err => {
        progress.error = err;
        progress.log(`Error: ${err.message}`);
        pushToSlack(progress);
        next(err);
      });
  });

  return webhooks;
};
