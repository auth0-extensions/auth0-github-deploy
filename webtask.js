const tools = require('auth0-extension-tools');

const expressApp = require('./server');
const logger = require('./server/lib/logger');

module.exports = tools.createExpressServer((req, config) => {
  logger.info('Starting Github deploy extension - Version:', config('CLIENT_VERSION'));
  return expressApp(config);
});
