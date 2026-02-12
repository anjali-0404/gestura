// src/utils/constants.ts

export const APP_NAME = 'URable';
export const APP_DESCRIPTION = 'Sign Language Detection using AI';

export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/jpg'];
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime'];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const DETECTION_UPDATE_INTERVAL = 500; // milliseconds

export const ERROR_MESSAGES = {
  NO_FILE: 'Please select a file',
  INVALID_FILE_TYPE: 'Invalid file format. Supported: JPG, PNG, MP4',
  FILE_TOO_LARGE: 'File size exceeds 50MB limit',
  CAMERA_ERROR: 'Unable to access camera. Please check permissions.',
  DETECTION_ERROR: 'Detection failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NO_FRAME_DATA: 'Failed to capture frame from camera',
};

export const SUCCESS_MESSAGES = {
  DETECTION_COMPLETE: 'Detection completed successfully',
  CAMERA_STARTED: 'Camera started',
  CAMERA_STOPPED: 'Camera stopped',
};

export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;
