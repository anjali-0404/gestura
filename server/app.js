// app.js - Express app setup
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config.js';
import detectionRoutes from './routes/detection.js';
import healthRoutes from './routes/health.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/detect', detectionRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: config.nodeEnv === 'development' ? err : {}
  });
});

export default app;
