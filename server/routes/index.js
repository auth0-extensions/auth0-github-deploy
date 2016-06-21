import express from 'express';

import html from './html';
import meta from './meta';
import webhooks from './webhooks';
import config from '../lib/config';

export default (storageContext) => {
  const routes = express.Router();
  routes.get('/api/config', (req, res) => {
    res.json({
      secret: config('EXTENSION_SECRET'),
      branch: config('GITHUB_BRANCH'),
      repository: config('GITHUB_REPOSITORY')
    });
  });
  routes.use('/meta', meta());
  routes.use('/webhooks', webhooks(storageContext));
  routes.use('*', html());
  return routes;
};
