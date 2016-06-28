import _ from 'lodash';
import { Router as router } from 'express';

import html from './html';
import meta from './meta';
import hooks from './hooks';
import webhooks from './webhooks';

import config from '../lib/config';
import deploy from '../lib/deploy';
import { readStorage } from '../lib/storage';
import { dashboardAdmins, requireUser } from '../lib/middlewares';

export default (storageContext) => {
  const routes = router();
  routes.use('/', dashboardAdmins());
  routes.get('/', html());
  routes.use('/meta', meta());
  routes.use('/webhooks', webhooks(storageContext));
  routes.use('/.extensions', hooks());

  routes.get('/api/config', requireUser, (req, res) => {
    res.json({
      secret: config('EXTENSION_SECRET'),
      branch: config('GITHUB_BRANCH'),
      repository: config('GITHUB_REPOSITORY')
    });
  });
  routes.get('/api/deployments', requireUser, (req, res, next) =>
    readStorage(storageContext)
      .then(data => res.json(_.sortByOrder(data.deployments || [], [ 'date' ], [ false ])))
      .catch(next)
  );
  routes.post('/api/deployments', requireUser, (req, res, next) => {
    deploy(storageContext, 'manual', config('GITHUB_BRANCH'), config('GITHUB_REPOSITORY'), (req.body && req.body.sha) || config('GITHUB_BRANCH'), req.user.sub)
      .then(stats => {
        res.json({
          connections: {
            updated: stats.connectionsUpdated
          },
          rules: {
            created: stats.rulesCreated,
            updated: stats.rulesUpdated,
            deleted: stats.rulesDeleted
          }
        });
      })
      .catch(next);
  });
  return routes;
};
