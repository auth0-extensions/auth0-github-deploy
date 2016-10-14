import path from 'path';
import morgan from 'morgan';
import Express from 'express';
import bodyParser from 'body-parser';
import tools from 'auth0-extension-tools';
import { middlewares } from 'auth0-extension-express-tools';

import routes from './routes';
import logger from './lib/logger';
import config from './lib/config';

module.exports = (configProvider, storageProvider) => {
  config.setProvider(configProvider);

  const storage = storageProvider
    ? new tools.WebtaskStorageContext(storageProvider, { force: 1 })
    : new tools.FileStorageContext(path.join(__dirname, './data.json'), { mergeWrites: true });

  const app = new Express();
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream
  }));
  app.use(bodyParser.json({
    verify: (req, res, buf, encoding) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8'); // eslint-disable-line no-param-reassign
      }
    }
  }));
  app.use(bodyParser.urlencoded({ extended: false }));

  // Configure routes.
  app.use('/app', Express.static(path.join(__dirname, '../dist')));
  app.use('/', routes(storage));

  // Generic error handler.
  app.use(middlewares.errorHandler(logger.error.bind(logger)));
  return app;
};
