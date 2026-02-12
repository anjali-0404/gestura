// src/components/FileUpload.tsx
import { useRef, useState } from 'react';
import { useDetection } from '../hooks/useDetection';
import { validators } from '../utils/validators';
import { ERROR_MESSAGES } from '../utils/constants';
import '../styles/FileUpload.css';

export const FileUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { result, loading, error, detectFromFile, clearResult } = useDetection();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validators.isValidFile(file);
      if (!validation.valid) {
        alert(validation.error);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedFile(file);
      clearResult();
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert(ERROR_MESSAGES.NO_FILE);
      return;
    }

    try {
      await detectFromFile(selectedFile);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="upload-section">
        <h2>Upload Image or Video</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="file-input-wrapper">
            <label htmlFor="file-input" className="file-input-label">
              <div className="upload-icon">📁</div>
              <p>Click to select or drag and drop</p>
              <span className="file-hint">Supported: JPG, PNG, MP4, MOV (Max 50MB)</span>
            </label>
            <input
              id="file-input"
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.mp4,.mov"
              disabled={loading}
              className="hidden-input"
            />
          </div>

          {selectedFile && (
            <div className="selected-file">
              <p><strong>Selected:</strong> {selectedFile.name}</p>
              <p className="file-size">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedFile || loading}
            className="upload-button"
          >
            {loading ? '🔄 Detecting...' : '🚀 Detect Sign Language'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      {result && (
        <div className="result-section">
          <h3>Detection Result</h3>
          <div className="result-card">
            <div className="sign-display">
              <div className="sign-label">{result.sign}</div>
              <div className="confidence-bar">
                <div
                  className="confidence-fill"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <p className="confidence-text">
                Confidence: {validators.formatConfidence(result.confidence)}
              </p>
            </div>

            <div className="predictions">
              <h4>All Predictions:</h4>
              <div className="predictions-grid">
                {result.predictions.map((pred, idx) => (
                  <div key={idx} className="prediction-item">
                    <span className="prediction-label">Sign {idx}</span>
                    <span className="prediction-value">
                      {validators.formatConfidence(pred)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {result.type === 'video' && result.frames_processed && (
              <div className="video-info">
                <p><strong>Frames Processed:</strong> {result.frames_processed}</p>
              </div>
            )}
          </div>

          <button className="upload-button secondary" onClick={clearResult}>
            ↻ Detect Another
          </button>
        </div>
      )}
    </div>
  );
};
