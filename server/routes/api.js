import _ from 'lodash';
import express from 'express';

import rules from './rules';
import deploy from '../lib/deploy';
import config from '../lib/config';

const getRepository = () => {
  const repo = config('GITHUB_REPOSITORY');

  const parts = repo.split('/');
  if (parts.length === 5) {
    const [ , , , account, repository ] = parts;
    return `${account}/${repository}`;
  }

  return repo;
};

const setNotified = (storage) =>
  storage.read()
    .then(data => {
      data.isNotified = true; // eslint-disable-line no-param-reassign
      return data;
    })
    .then(data => storage.write(data));

export default (storage) => {
  const api = express.Router(); // eslint-disable-line new-cap
  api.use('/rules', rules(storage));

  api.post('/notified', (req, res, next) => {
    setNotified(storage)
      .then(() => res.status(204).send())
      .catch(next);
  });

  api.get('/config', (req, res, next) => {
    storage.read()
      .then(data => {
        if (data.isNotified) {
          return {
            showNotification: false,
            secret: config('EXTENSION_SECRET'),
            branch: config('GITHUB_BRANCH'),
            repository: getRepository()
          };
        }

        return req.auth0.rules.get()
          .then(existingRules => {
            const result = {
              showNotification: false,
              secret: config('EXTENSION_SECRET'),
              branch: config('GITHUB_BRANCH'),
              repository: getRepository()
            };

            if (existingRules && existingRules.length) {
              result.showNotification = true;
            } else {
              setNotified(storage);
            }

            return result;
          });
      })
      .then(data => res.json(data))
      .catch(next);
  });

  api.get('/deployments', (req, res, next) =>
    storage.read()
      .then(data => res.json(_.orderBy(data.deployments || [], [ 'date' ], [ 'desc' ])))
      .catch(next)
  );

  api.post('/deployments', (req, res, next) => {
    deploy(storage, 'manual', config('GITHUB_BRANCH'), getRepository(), (req.body && req.body.sha) || config('GITHUB_BRANCH'), req.user.sub, req.auth0)
      .then(stats => res.json(stats))
      .catch(next);
  });
  return api;
};
