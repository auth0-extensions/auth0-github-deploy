import Express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import logger from './lib/logger';
import * as middlewares from './lib/middlewares';

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

  // Configure routes.
  app.use('/', routes());

  // Generic error handler.
  app.use(middlewares.errorHandler);
  return app;
};
