// routes/detection.js - Sign language detection routes
import express from 'express';
import multer from 'multer';
import config from '../config.js';
import { detectFromFile, detectFromStream } from '../controllers/detectionController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (config.supportedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not supported`), false);
    }
  }
});

// Routes
router.post('/file', upload.single('file'), detectFromFile);
router.post('/stream', detectFromStream);

export default router;
