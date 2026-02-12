// utils/constants.js - Application constants

export const SIGN_LANGUAGES = {
  SIGN_A: 'A',
  SIGN_B: 'B',
  SIGN_C: 'C',
  SIGN_D: 'D',
  SIGN_E: 'E',
  // Add more signs as you expand the model
};

export const FILE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video'
};

export const SUPPORTED_FORMATS = {
  images: ['image/jpeg', 'image/png', 'image/jpg'],
  videos: ['video/mp4', 'video/quicktime']
};

export const ERROR_CODES = {
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  MODEL_NOT_FOUND: 'MODEL_NOT_FOUND',
  PYTHON_ERROR: 'PYTHON_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export default {
  SIGN_LANGUAGES,
  FILE_TYPES,
  SUPPORTED_FORMATS,
  ERROR_CODES,
  HTTP_STATUS
};
