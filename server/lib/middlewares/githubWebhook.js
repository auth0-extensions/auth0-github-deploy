import crypto from 'crypto';
import { ArgumentError, UnauthorizedError } from '../errors';

const calculateSignature = (key, blob) =>
  `sha1=${crypto.createHmac('sha1', key).update(blob).digest('hex')}`;

const parse = (headers, { ref = '', commits = [], head_commit = {}, repository = {}, sender = {} }) => {
  const refParts = ref.split('/');

  return {
    id: headers['x-github-delivery'],
    event: headers['x-github-event'],
    branch: refParts.length === 3 ? refParts[2] : '',
    commits,
    repository: repository.full_name,
    user: sender.login,
    sha: head_commit.id
  };
};

module.exports = (secret) => (req, res, next) => {
  if (!secret || secret.length === 0) {
    return next(new UnauthorizedError('The extension secret is not set, unable to verify webhook signature.'));
  }

  if (!req.headers['x-github-delivery']) {
    return next(new ArgumentError('The GitHub delivery identifier is missing.'));
  }

  if (!req.headers['x-github-event']) {
    return next(new ArgumentError('The GitHub event name is missing.'));
  }

  const signature = calculateSignature(secret, req.rawBody);
  if (signature !== req.headers['x-hub-signature']) {
    return next(new UnauthorizedError('The GitHub webhook signature is incorrect.'));
  }

  req.webhook = parse(req.headers, req.body);
  return next();
};
