import Promise from 'bluebird';
import request from 'request-promise';

import config from './config';
import logger from './logger';

const createPayload = (progress) => {
  const msg = {
    username: 'auth0-deployments',
    icon_emoji: ':rocket:',
    attachments: []
  };

  if (progress.error) {
    msg.attachments.push({
      color: '#F35A00',
      fallback: `GitHub to Auth0 Deployment failed: ${progress.error.message}`,
      text: 'GitHub to Deployment failed',
      fields: [
        { title: 'Repository', value: progress.repository, short: true },
        { title: 'Branch', value: progress.branch, short: true },
        { title: 'ID', value: progress.id, short: true },
        { title: 'Error', value: progress.error.message, short: false }
      ]
    });
  } else {
    const fields = [
      { title: 'Repository', value: progress.repository, short: true },
      { title: 'Branch', value: progress.branch, short: true },
      { title: 'ID', value: progress.id, short: true }
    ];

    if (progress.connectionsUpdated) {
      fields.push({ title: 'Connections Updated', value: progress.connectionsUpdated, short: true });
    }
    if (progress.rulesCreated) {
      fields.push({ title: 'Rules Created', value: progress.rulesCreated, short: true });
    }
    if (progress.rulesUpdated) {
      fields.push({ title: 'Rules Updated', value: progress.rulesUpdated, short: true });
    }
    if (progress.rulesDeleted) {
      fields.push({ title: 'Rules Deleted', value: progress.rulesDeleted, short: true });
    }

    msg.attachments.push({
      color: '#7CD197',
      fallback: 'GitHub to Auth0 Deployment',
      text: 'GitHub to Auth0 Deployment',
      fields
    });
  }

  return msg;
};

export const pushToSlack = (progress) => {
  if (!config('SLACK_INCOMING_WEBHOOK_URL')) {
    return Promise.resolve();
  }

  logger.debug('Sending progress to Slack.');
    const msg = createPayload(progress);
  console.log(config('SLACK_INCOMING_WEBHOOK_URL'), JSON.stringify(msg));

  return request({ uri: config('SLACK_INCOMING_WEBHOOK_URL'), method: 'POST', form: { payload: JSON.stringify(msg) } });
};
