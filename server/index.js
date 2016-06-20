import Express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import config from './lib/config';
import logger from './lib/logger';
import * as middlewares from './lib/middlewares';

import auth0 from 'auth0-oauth2-express';
import routes from './routes';

module.exports = () => {
  const app = new Express();
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream
  }));
  app.use(bodyParser.json({
    verify: (req, res, buf, encoding) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
      }
    }
  }));
  app.use(bodyParser.urlencoded({ extended: false }));

  // Authentication.
  app.use('/', auth0({
    clientName: 'GitHub Deployment',
    scopes: 'profile',
    audience: `https://${config('AUTH0_DOMAIN')}/api/v2/`
  }));

  // Configure routes.
  app.use('/', routes());

  // Generic error handler.
  app.use(middlewares.errorHandler);
  return app;
};
