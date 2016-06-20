import express from 'express';
import html from './html';
import meta from './meta';
import webhooks from './webhooks';

export default (storageContext) => {
  const routes = express.Router();
  routes.use('/meta', meta());
  routes.use('/webhooks', webhooks(storageContext));
  routes.use('*', html());
  return routes;
};
