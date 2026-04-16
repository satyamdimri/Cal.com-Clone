const AppError = require('../utils/AppError');

module.exports = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  if (!err.isOperational && statusCode === 500) {
    return res.status(500).json({ message: 'Something went wrong' });
  }

  if (err instanceof AppError) {
    return res.status(statusCode).json({ message: err.message });
  }

  return res.status(statusCode).json({
    message: err.message || 'Unexpected error',
    details: err.details,
  });
};
