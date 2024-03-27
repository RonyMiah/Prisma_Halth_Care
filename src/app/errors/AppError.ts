class AppError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string | undefined, stake = '') {
    super(message);
    this.statusCode = statusCode;
    if (stake) {
      this.stack = stake;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
