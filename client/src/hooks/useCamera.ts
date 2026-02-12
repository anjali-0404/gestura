// src/hooks/useCamera.ts
import { useRef, useCallback, useState } from 'react';
import { ERROR_MESSAGES } from '../utils/constants';

interface UseCameraState {
  isActive: boolean;
  error: string | null;
  hasPermission: boolean;
}

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<UseCameraState>({
    isActive: false,
    error: null,
    hasPermission: false,
  });

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        streamRef.current = mediaStream;
        setState({ isActive: true, error: null, hasPermission: true });
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : ERROR_MESSAGES.CAMERA_ERROR;
      setState({ isActive: false, error, hasPermission: false });
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  const captureFrame = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) {
      setState(prev => ({ ...prev, error: ERROR_MESSAGES.NO_FRAME_DATA }));
      return null;
    }

    const context = canvasRef.current.getContext('2d');
    if (!context) return null;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const frameData = canvasRef.current.toDataURL('image/jpeg').split(',')[1];

    return frameData;
  }, []);

  return {
    videoRef,
    canvasRef,
    ...state,
    startCamera,
    stopCamera,
    captureFrame,
  };
};
