// utils/validators.js - Input validation utilities
export const validateImageFile = (file) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid image format. Supported: JPG, PNG' };
  }
  
  return { valid: true };
};

export const validateVideoFile = (file) => {
  const allowedMimeTypes = ['video/mp4', 'video/quicktime'];
  
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid video format. Supported: MP4, MOV' };
  }
  
  return { valid: true };
};

export const validateBase64Data = (data) => {
  if (!data) {
    return { valid: false, error: 'No data provided' };
  }
  
  try {
    Buffer.from(data, 'base64');
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid base64 data' };
  }
};
