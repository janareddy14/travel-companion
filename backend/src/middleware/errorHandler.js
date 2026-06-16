const config = require('../config');

/**
 * Global error-handling middleware.
 *
 * Place this AFTER all route definitions with app.use(errorHandler).
 * Express recognises it as an error handler because it has 4 parameters.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log full error in development
  if (config.nodeEnv === 'development') {
    console.error('❌ Error:', err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose Validation Error ───────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.length === 1 ? messages[0] : messages.join('; ');
  }

  // ── Mongoose CastError (invalid ObjectId, etc.) ─────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // ── MongoDB Duplicate Key Error ─────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value for "${field}". This ${field} already exists.`;
  }

  // ── JWT Errors ──────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // ── Build response ─────────────────────────────────────────────────
  const response = { message };

  if (config.nodeEnv === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
