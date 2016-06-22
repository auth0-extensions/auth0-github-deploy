import { UnauthorizedError } from '../errors';

module.exports = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required for this endpoint.'));
  }

  return next();
};
