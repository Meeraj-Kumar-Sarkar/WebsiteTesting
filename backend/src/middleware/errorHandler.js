export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error occurred.';
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}
