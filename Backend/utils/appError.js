class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Flag for operational/known errors (vs system/programming bugs)

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
