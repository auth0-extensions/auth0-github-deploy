import { Router as router } from 'express';

import config from '../lib/config';
import logger from '../lib/logger';
import { getForClient } from '../lib/managementApiClient';
import { validateHookToken } from '../lib/middlewares';

export default () => {
  const hooks = router();
  hooks.use('/on-uninstall', validateHookToken('/.extensions/on-uninstall'));
  hooks.delete('/on-uninstall', (req, res) => {
    logger.debug('Uninstall running...');

    getForClient(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'))
      .then(client => client.clients.delete({ client_id: config('AUTH0_CLIENT_ID') }))
      .then(() => {
        logger.debug(`Deleted client ${config('AUTH0_CLIENT_ID')}`);
        res.sendStatus(204);
      })
      .catch((err) => {
        logger.debug(`Error deleting client ${config('AUTH0_CLIENT_ID')}`);
        logger.error(err);
        res.sendStatus(500);
      });
  });
  return hooks;
};
