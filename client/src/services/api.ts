// src/services/api.ts
import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse, DetectionResult, HealthCheckResponse } from '../types/detection';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
