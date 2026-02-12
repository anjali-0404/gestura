// controllers/detectionController.js - Sign language detection controller
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import config from '../config.js';

import mlService from '../utils/mlService.js';

// Initialize ML Worker
mlService.start();

/**
 * Detect sign language from uploaded file
 * Supported formats: images (jpg, png) and videos (mp4)
 */
export const detectFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype.split('/')[0]; // 'image' or 'video'

    // Use Persistent ML Service
    const detection = await mlService.predict(filePath, fileType);

    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.status(200).json({
      success: true,
      message: 'Detection successful',
      data: detection
    });
  } catch (error) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    console.error('Error in detectFromFile:', error);
    res.status(500).json({
      success: false,
      message: 'Detection failed',
      error: error.message
    });
  }
};

/**
 * Detect sign language from base64 encoded stream
 * Useful for real-time detection from camera feed
 */
export const detectFromStream = async (req, res) => {
  try {
    const { frameData } = req.body;

    if (!frameData) {
      return res.status(400).json({
        success: false,
        message: 'No frame data provided'
      });
    }

    const buffer = Buffer.from(frameData, 'base64');
    const tempFilePath = path.join(config.uploadDir, `temp-${Date.now()}.jpg`);

    fs.writeFileSync(tempFilePath, buffer);

    // Use Persistent ML Service
    const detection = await mlService.predict(tempFilePath, 'image');

    fs.unlink(tempFilePath, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    res.status(200).json({
      success: true,
      message: 'Detection successful',
      data: detection
    });
  } catch (error) {
    console.error('Error in detectFromStream:', error);
    res.status(500).json({
      success: false,
      message: 'Detection failed',
      error: error.message
    });
  }
};

