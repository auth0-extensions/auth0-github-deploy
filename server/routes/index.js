import _ from 'lodash';
import { Router as router } from 'express';
import { middlewares } from 'auth0-extension-express-tools';
import html from './html';
import meta from './meta';
import rules from './rules';
import hooks from './hooks';
import webhooks from './webhooks';

import config from '../lib/config';
import deploy from '../lib/deploy';
import { readStorage } from '../lib/storage';
import { dashboardAdmins, requireUser, getStorage } from '../lib/middlewares';

const getRepository = () => {
  const repo = config('GITHUB_REPOSITORY');

  const parts = repo.split('/');
  if (parts.length === 5) {
    const [ , , , account, repository ] = parts;
    return `${account}/${repository}`;
  }

  return repo;
};

export default () => {
  const routes = router();

  routes.use(getStorage);
  routes.use(middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  }));
  routes.use('/.extensions', hooks());
  routes.use('/', dashboardAdmins());
  routes.get('/', html());
  routes.use('/meta', meta());
  routes.use('/webhooks', webhooks());

  routes.use('/api/rules', requireUser, rules());

  routes.get('/api/config', requireUser, (req, res) => {
    res.json({
      secret: config('EXTENSION_SECRET'),
      branch: config('GITHUB_BRANCH'),
      repository: getRepository()
    });
  });
  routes.get('/api/deployments', requireUser, (req, res, next) =>
    req.storage.read()
      .then(data => res.json(_.sortByOrder(data.deployments || [], [ 'date' ], [ false ])))
      .catch(next)
  );
  routes.post('/api/deployments', requireUser, (req, res, next) => {
    deploy(req.storage, 'manual', config('GITHUB_BRANCH'), getRepository(), (req.body && req.body.sha) || config('GITHUB_BRANCH'), req.user.sub, req.auth0)
      .then(stats => res.json(stats))
      .catch(next);
  });
  return routes;
};
