// src/types/detection.ts

export interface DetectionResult {
  sign: string;
  confidence: number;
  predictions: number[];
  type: 'image' | 'video';
  frames_processed?: number;
  detections?: FrameDetection[];
}

export interface FrameDetection {
  frame: number;
  sign: string;
  confidence: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
}
