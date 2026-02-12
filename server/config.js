// config.js - Configuration file for the backend
import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server Configuration
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Client Configuration
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // ML Model Configuration
  pythonScriptPath: process.env.PYTHON_SCRIPT_PATH || './SignLanguageDetectionUsingCNN-main/persistent_ml_worker.py',

  // Upload Configuration
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: process.env.MAX_FILE_SIZE || 50 * 1024 * 1024, // 50MB

  // Supported file types for upload
  supportedFormats: ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime'],
};

export default config;
