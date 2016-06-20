import _ from 'lodash';
import Promise from 'bluebird';

/*
 * Read from Webtask storage.
 */
const readStorage = (storageContext) =>
  new Promise((resolve, reject) => {
    storageContext.get((err, webtaskData) => {
      if (err) {
        return reject(err);
      }

      const data = webtaskData || { };
      return resolve({ data });
    });
  });

/*
 * Write to Webtask storage.
 */
const writeStorage = (storageContext, data) =>
  new Promise((resolve, reject) => {
    storageContext.set(data, { force: 1 }, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });

/*
 * Append progress to deployments.
 */
export const appendProgress = (storageContext, progress) => {
  if (!storageContext) {
    return Promise.resolve();
  }

  return readStorage.then(data => {
    data.deployments = data.deployments || [ ];
    data.deployments.push(progress);
    if (data.deployments.length > 10) {
      data.deployments = _.drop(data.deployments, data.deployments.length - 10);
    }
    return data;
  })
  .then(data => writeStorage(storageContext, data));
};
