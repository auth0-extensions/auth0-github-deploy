import _ from 'lodash';
import Promise from 'bluebird';
import request from 'superagent';

import logger from './logger';


const createPayload = (progress, extensionUrl) => {
  const msg = {
    username: 'auth0-deployments',
    icon_emoji: ':rocket:',
    attachments: []
  };

  const template = {
    fallback: 'Github to Auth0 Deployment',
    text: 'Github to Auth0 Deployment',
    fields: [
      { title: 'Repository', value: progress.repository, short: true },
      { title: 'Branch', value: progress.branch, short: true },
      { title: 'ID', value: progress.id, short: true },
      { title: 'Commit', value: progress.sha, short: true }
    ],
    error_field: { title: 'Error', value: progress.error || null, short: false }
  };

  const details = `(<${extensionUrl}|Details>)`;

  const fields = template.fields;

  if (progress.error) {
    fields.push(template.error_field);

    msg.attachments.push({
      color: '#F35A00',
      fallback: `${template.fallback} failed: ${progress.error.message}`,
      text: `${template.text} failed: ${details}`,
      fields: template.fields
    });
  } else {
    if (progress.logs) {
      _.forEach(progress.logs, (item, name) => {
        _.forEach(item, (count, type) => {
          if (count) {
            fields.push({ title: `${name} ${type}`, value: count, short: true });
          }
        });
      });
    }

    msg.attachments.push({
      color: '#7CD197',
      fallback: template.fallback,
      text: `${template.fallback} ${details}`,
      fields
    });
  }

  return msg;
};

export default function(progress, extensionUrl, hook) {
  if (!hook) {
    return Promise.resolve();
  }

  logger.log('Sending progress to Slack.');

  const msg = createPayload(progress, extensionUrl);
  return new Promise((resolve) => {
    request
      .post(hook)
      .send(msg)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err && err.status === 401) {
          logger.log(`Error sending to Slack: ${err.status}`);
        } else if (err && res && res.body) {
          logger.log(`Error sending to Slack: ${err.status} - ${res.body}`);
        } else if (err) {
          logger.log(`Error sending to Slack: ${err.status} - ${err.message}`);
        }

        return resolve();
      });
  });
}
