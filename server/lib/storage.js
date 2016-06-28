import _ from 'lodash';
import Promise from 'bluebird';

import logger from '../lib/logger';

const defaultStorage = { };

/*
 * Read from Webtask storage.
 */
export const readStorage = (storageContext) => {
  if (!storageContext) {
    logger.debug('Unable to read storage. Context not available.');
    return Promise.resolve(defaultStorage);
  }

  return new Promise((resolve, reject) => {
    storageContext.get((err, webtaskData) => {
      if (err) {
        return reject(err);
      }

      const data = webtaskData || defaultStorage;
      return resolve(data);
    });
  });
};

/*
 * Write to Webtask storage.
 */
export const writeStorage = (storageContext, data) => {
  if (!storageContext) {
    logger.debug('Unable to write storage. Context not available.');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    storageContext.set(data, { force: 1 }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
};

/*
 * Append progress to deployments.
 */
export const appendProgress = (storageContext, progress) =>
  readStorage(storageContext).then(data => {
    data.deployments = data.deployments || [ ];
    data.deployments.push(progress);
    if (data.deployments.length > 10) {
      data.deployments = _.drop(data.deployments, data.deployments.length - 10);
    }
    return data;
  })
  .then(data => writeStorage(storageContext, data));
