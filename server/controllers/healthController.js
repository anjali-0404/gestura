// controllers/healthController.js - Health check controller
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
};

