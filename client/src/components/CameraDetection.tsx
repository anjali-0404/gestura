// src/components/CameraDetection.tsx
import { useEffect, useState, useRef } from 'react';
import { useCamera } from '../hooks/useCamera';
import { useDetection } from '../hooks/useDetection';
import { DETECTION_UPDATE_INTERVAL } from '../utils/constants';
import { validators } from '../utils/validators';
import '../styles/CameraDetection.css';

export const CameraDetection = () => {
  const { videoRef, canvasRef, isActive, error: cameraError, startCamera, stopCamera, captureFrame } = useCamera();
  const { result, loading, error: detectionError, detectFromStream, clearResult } = useDetection();
  const [isDetecting, setIsDetecting] = useState(false);
  const detectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStartCamera = async () => {
    await startCamera();
  };

  const handleStopCamera = () => {
    stopContinuousDetection();
    stopCamera();
  };

  const handleCaptureFrame = async () => {
    const frameData = captureFrame();
    if (!frameData) return;

    try {
      await detectFromStream(frameData);
    } catch (err) {
      console.error('Stream detection error:', err);
    }
  };

  const startContinuousDetection = () => {
    if (detectionIntervalRef.current) return;

    setIsDetecting(true);
    detectionIntervalRef.current = setInterval(() => {
      const frameData = captureFrame();
      if (frameData) {
        detectFromStream(frameData).catch(err => {
          console.error('Continuous detection error:', err);
        });
      }
    }, DETECTION_UPDATE_INTERVAL);
  };

  const stopContinuousDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
  };

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="camera-container">
      <div className="camera-section">
        <h2>Real-time Detection</h2>

        <div className="video-wrapper">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video-stream"
          />
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            style={{ display: 'none' }}
          />
        </div>

        {cameraError && (
          <div className="error-message">
            <p>❌ {cameraError}</p>
          </div>
        )}

        {detectionError && (
          <div className="error-message">
            <p>⚠️ {detectionError}</p>
          </div>
        )}

        <div className="camera-controls">
          <button
            onClick={handleStartCamera}
            disabled={isActive}
            className="control-button start-btn"
          >
            ▶︎ Start Camera
          </button>

          <button
            onClick={handleCaptureFrame}
            disabled={!isActive || loading}
            className="control-button capture-btn"
          >
            {loading ? '🔄 Detecting...' : '📸 Capture & Detect'}
          </button>

          <button
            onClick={() => (isDetecting ? stopContinuousDetection() : startContinuousDetection())}
            disabled={!isActive}
            className="control-button continuous-btn"
          >
            {isDetecting ? '⏹ Stop Continuous' : '🎬 Continuous Detection'}
          </button>

          <button
            onClick={handleStopCamera}
            disabled={!isActive}
            className="control-button stop-btn"
          >
            ■ Stop Camera
          </button>
        </div>
      </div>

      {result && (
        <div className="detection-display">
          <div className="sign-box">
            <div className="sign-name">{result.sign}</div>
            <div className="confidence-indicator">
              <div className="confidence-meter">
                <div
                  className="meter-fill"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <span className="confidence-percentage">
                {validators.formatConfidence(result.confidence)}
              </span>
            </div>
          </div>

          <button
            className="clear-result-btn"
            onClick={clearResult}
          >
            ✕ Clear Result
          </button>
        </div>
      )}

      <div className="camera-info">
        <p className="status-text">
          {isActive ? '🟢 Camera Active' : '🔴 Camera Inactive'}
        </p>
        {isDetecting && <p className="detecting-text">🔄 Continuous Detection Running</p>}
      </div>
    </div>
  );
};
