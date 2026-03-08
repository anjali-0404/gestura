// src/services/api.ts
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse, DetectionResult, HealthCheckResponse } from '../types/detection';

// Ensure API base URL includes `/api` so frontend routes match server routes
// (server defines endpoints like /api/health and /api/detect).
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`;

// Debug: log the resolved API base URL (helps validate env variable and build-time values)
console.log('API_BASE_URL:', API_BASE_URL);

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 60000, // 60 seconds for video processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Error interceptor
    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  async checkHealth(): Promise<HealthCheckResponse> {
    try {
      const response = await this.client.get<ApiResponse<HealthCheckResponse>>('/health');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Health check failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async detectFromFile(file: File): Promise<DetectionResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.client.post<ApiResponse<DetectionResult>>(
        '/detect/file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Detection failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async detectFromStream(frameData: string): Promise<DetectionResult> {
    try {
      const response = await this.client.post<ApiResponse<DetectionResult>>(
        '/detect/stream',
        { frameData },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Detection failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'An error occurred';
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
