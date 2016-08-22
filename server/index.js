import path from 'path';
import morgan from 'morgan';
import Express from 'express';
import bodyParser from 'body-parser';

import routes from './routes';
import logger from './lib/logger';
import * as middlewares from './lib/middlewares';

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
  app.use('/app', Express.static(path.join(__dirname, '../dist')));
  app.use('/', routes());

  // Generic error handler.
  app.use(middlewares.errorHandler);
  return app;
};
