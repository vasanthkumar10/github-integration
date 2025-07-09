export function handleError(err, res) {
  console.error('Error:', err);

  let status = 500;
  let message = 'Internal Server Error';

  if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation Error';
  } else if (err.message?.includes('not found')) {
    status = 404;
    message = 'Resource Not Found';
  } else if (err.message?.includes('Email sending failed')) {
    status = 502;
    message = 'Failed to send email';
  }

  res.status(status).json({ message, error: err.message });
}
