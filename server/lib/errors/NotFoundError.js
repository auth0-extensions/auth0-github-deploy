export default class NotFoundError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }

  toString() {
    return 'NotFoundError';
  }
}
