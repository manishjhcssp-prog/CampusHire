/**
 * Centralized error handler middleware
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  // Only log unexpected server internal errors (500+)
  if (statusCode >= 500) {
    console.error('Unhandled Server Error [500]:', err);
  }

  // Handle SQLite specific constraint errors
  if (err.message && err.message.includes('SQLITE_CONSTRAINT')) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({
        success: false,
        error: 'A duplicate record already exists (e.g. email or unique constraint violation).'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Database constraint violation: ${err.message}`
    });
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload in request body.'
    });
  }

  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack })
  });
}

module.exports = {
  errorHandler
};

