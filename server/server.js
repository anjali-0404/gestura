// server.js - Main server entry point
import app from './app.js';
import config from './config.js';

const isDev = config.nodeEnv === 'development';
const maxPortRetries = 10;
let server;

function startServer(port, retriesLeft = maxPortRetries) {
  const instance = app.listen(port, () => {
    server = instance;
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
    console.log(`🔗 Client URL: ${config.clientUrl}`);
  });

  instance.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && isDev && retriesLeft > 0) {
      const nextPort = port + 1;
      console.warn(`⚠️ Port ${port} is in use. Retrying on ${nextPort}...`);
      startServer(nextPort, retriesLeft - 1);
      return;
    }

    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });

  return instance;
}

startServer(config.port);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    return;
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
    return;
  }
  process.exit(0);
});

export { server as default };

