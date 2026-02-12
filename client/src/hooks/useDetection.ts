// src/hooks/useDetection.ts
import { useState, useCallback } from 'react';
import apiClient from '../services/api';
import type { DetectionResult } from '../types/detection';
import { ERROR_MESSAGES, API_STATUS } from '../utils/constants';

interface UseDetectionState {
  result: DetectionResult | null;
  loading: boolean;
  error: string | null;
  status: typeof API_STATUS[keyof typeof API_STATUS];
}

export const useDetection = () => {
  const [state, setState] = useState<UseDetectionState>({
    result: null,
    loading: false,
    error: null,
    status: API_STATUS.IDLE,
  });

  const detectFromFile = useCallback(async (file: File) => {
    setState({ result: null, loading: true, error: null, status: API_STATUS.LOADING });
    try {
      const result = await apiClient.detectFromFile(file);
      setState({ result, loading: false, error: null, status: API_STATUS.SUCCESS });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : ERROR_MESSAGES.DETECTION_ERROR;
      setState({ result: null, loading: false, error, status: API_STATUS.ERROR });
      throw err;
    }
  }, []);

  const detectFromStream = useCallback(async (frameData: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, status: API_STATUS.LOADING }));
    try {
      const result = await apiClient.detectFromStream(frameData);
      setState(prev => ({ ...prev, result, loading: false, error: null, status: API_STATUS.SUCCESS }));
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : ERROR_MESSAGES.DETECTION_ERROR;
      setState(prev => ({ ...prev, loading: false, error, status: API_STATUS.ERROR }));
      throw err;
    }
  }, []);

  const clearResult = useCallback(() => {
    setState({ result: null, loading: false, error: null, status: API_STATUS.IDLE });
  }, []);

  return {
    ...state,
    detectFromFile,
    detectFromStream,
    clearResult,
  };
};
