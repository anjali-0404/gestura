// src/utils/validators.ts
import { SUPPORTED_IMAGE_FORMATS, SUPPORTED_VIDEO_FORMATS, MAX_FILE_SIZE } from './constants';

export const validators = {
  isValidImageFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      return { valid: false, error: 'Invalid image format. Supported: JPG, PNG' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` };
    }

    return { valid: true };
  },

  isValidVideoFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (!SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
      return { valid: false, error: 'Invalid video format. Supported: MP4, MOV' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` };
    }

    return { valid: true };
  },

  isValidFile(file: File): { valid: boolean; error?: string } {
    const isImage = SUPPORTED_IMAGE_FORMATS.includes(file.type);
    const isVideo = SUPPORTED_VIDEO_FORMATS.includes(file.type);

    if (!isImage && !isVideo) {
      return { valid: false, error: 'Invalid file format. Supported: JPG, PNG, MP4, MOV' };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` };
    }

    return { valid: true };
  },

  formatConfidence(confidence: number): string {
    return `${(confidence * 100).toFixed(1)}%`;
  },

  getFileType(file: File): 'image' | 'video' | 'unknown' {
    if (SUPPORTED_IMAGE_FORMATS.includes(file.type)) return 'image';
    if (SUPPORTED_VIDEO_FORMATS.includes(file.type)) return 'video';
    return 'unknown';
  },
};

export default validators;
