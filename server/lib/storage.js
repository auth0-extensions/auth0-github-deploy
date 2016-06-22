import _ from 'lodash';
import Promise from 'bluebird';

const defaultStorage = { };

/*
 * Read from Webtask storage.
 */
export const readStorage = (storageContext) => {
  if (!storageContext) {
    return Promise.resolve(defaultStorage);
  }

  return new Promise((resolve, reject) => {
    storageContext.get((err, webtaskData) => {
      if (err) {
        return reject(err);
      }

      const data = webtaskData || defaultStorage;
      return resolve({ data });
    });
  });
};

/*
 * Write to Webtask storage.
 */
export const writeStorage = (storageContext, data) => {
  if (!storageContext) {
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
