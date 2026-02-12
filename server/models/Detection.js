// models/Detection.js - MongoDB model for detection history (future use)
// This file is included for future MongoDB integration

/*
import mongoose from 'mongoose';

const detectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sign: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  fileType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  fileName: String,
  filePath: String,
  predictions: [Number],
  timestamp: {
    type: Date,
    default: () => new Date()
  },
  metadata: {
    ip: String,
    userAgent: String
  }
});

export const Detection = mongoose.model('Detection', detectionSchema);
*/

// NOTE: Uncomment and implement MongoDB integration when needed
