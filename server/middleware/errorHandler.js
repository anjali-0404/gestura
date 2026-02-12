// middleware/errorHandler.js - Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds limit'
    });
  }

  // Multer unexpected file error
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file uploaded'
    });
  }

  // Generic error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
};

export default errorHandler;
