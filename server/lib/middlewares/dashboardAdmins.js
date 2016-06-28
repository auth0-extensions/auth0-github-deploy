import url from 'url';
import auth0 from 'auth0-oauth2-express';

import config from '../config';

export default () => {
  const options = {
    credentialsRequired: false,
    clientName: 'GitHub Deployments',
    audience: () => `https://${config('AUTH0_DOMAIN')}/api/v2/`
  };

  const middleware = auth0(options);
  return (req, res, next) => {
    const protocol = 'https';
    const pathname = url.parse(req.originalUrl).pathname.replace(req.path, '');
    const baseUrl = url.format({
      protocol,
      host: req.get('host'),
      pathname
    });

    options.clientId = baseUrl;
    return middleware(req, res, next);
  };
};
