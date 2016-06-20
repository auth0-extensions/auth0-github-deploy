export default class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.statusCode = 401;
    this.name = 'UnauthorizedError';
  }

  toString() {
    return 'UnauthorizedError';
  }
}
