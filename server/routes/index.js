import express from 'express';
import html from './html';
import meta from './meta';
import webhooks from './webhooks';

export default () => {
  const routes = express.Router();
  routes.use('/meta', meta());
  routes.use('/webhooks', webhooks());
  routes.use('*', html());
  return routes;
};
