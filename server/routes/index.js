import express from 'express';
import meta from './meta';
import webhooks from './webhooks';

export default () => {
  const routes = express.Router();
  routes.use('/meta', meta());
  routes.use('/webhooks', webhooks());
  return routes;
};
