# Frontend Integration Guide - URable Backend

This guide explains how to connect your React frontend to the URable backend.

## Backend API Overview

The backend provides three main endpoints:

```
GET  /api/health              - Server health check
POST /api/detect/file         - Upload image/video for detection
POST /api/detect/stream       - Real-time frame detection (camera)
```

## Integration Steps

### Step 1: Create API Service Layer

Create `src/services/detectionService.js` in your React frontend:

```javascript
// detectionService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const detectionService = {
  // Check if backend is running
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Upload image or video file
  async detectFromFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/detect/file`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  },

  // Real-time detection from camera stream
  async detectFromStream(frameData) {
    const response = await fetch(`${API_BASE_URL}/detect/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ frameData })
    });
    return response.json();
  }
};

export default detectionService;
```

### Step 2: Create Upload Component

```javascript
// components/FileUpload.jsx
import React, { useState } from 'react';
import detectionService from '../services/detectionService';

export const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await detectionService.detectFromFile(file);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload">
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          onChange={handleFileChange}
          accept="image/*,video/*"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Detecting...' : 'Detect Sign Language'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="result">
          <h2>Detection Result</h2>
          <p><strong>Sign:</strong> {result.sign}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
          <div className="predictions">
            <h3>Predictions:</h3>
            {result.predictions.map((pred, idx) => (
              <div key={idx}>Sign {idx}: {(pred * 100).toFixed(2)}%</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### Step 3: Create Camera Component

```javascript
// components/CameraDetection.jsx
import React, { useRef, useState } from 'react';
import detectionService from '../services/detectionService';

export const CameraDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [stream, setStream] = useState(null);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Capture frame and detect
  const captureFrame = async () => {
    if (!videoRef.current) return;

    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Convert canvas to base64
    const frameData = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
    
    setIsDetecting(true);
    try {
      const response = await detectionService.detectFromStream(frameData);
      if (response.success) {
        setResult(response.data);
      }
    } catch (err) {
      console.error('Detection error:', err);
    } finally {
      setIsDetecting(false);
    }
  };

  // Continuous detection
  const continuousDetection = () => {
    const interval = setInterval(captureFrame, 500); // Detect every 500ms
    return () => clearInterval(interval);
  };

  return (
    <div className="camera-detection">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ display: 'block', maxWidth: '100%' }}
      />
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
        width={640}
        height={480}
      />

      <div className="controls">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={stopCamera}>Stop Camera</button>
        <button onClick={captureFrame} disabled={isDetecting}>
          {isDetecting ? 'Detecting...' : 'Capture & Detect'}
        </button>
        <button onClick={continuousDetection}>Start Continuous Detection</button>
      </div>

      {result && (
        <div className="result">
          <h2>{result.sign}</h2>
          <p>AI Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
};
```

### Step 4: Update .env

Create `.env` in your React frontend:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

### Step 5: Update Environment for Production

For production, update `.env.production`:

```env
REACT_APP_API_URL=https://yourdomain.com/api
```

## Complete Integration Example

```javascript
// App.tsx - Complete example
import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { CameraDetection } from './components/CameraDetection';

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="app">
      <h1>URable - Sign Language Detection</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
        >
          Upload Image/Video
        </button>
        <button 
          className={activeTab === 'camera' ? 'active' : ''}
          onClick={() => setActiveTab('camera')}
        >
          Live Camera Detection
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'upload' && <FileUpload />}
        {activeTab === 'camera' && <CameraDetection />}
      </div>
    </div>
  );
}
```

## Error Handling

Always handle errors from the backend:

```javascript
const response = await detectionService.detectFromFile(file);

if (!response.success) {
  // Handle error
  console.error('Detection failed:', response.message);
  // Show error to user
} else {
  // Use detection results
  console.log('Detected sign:', response.data.sign);
  console.log('Confidence:', response.data.confidence);
}
```

## Supported File Formats

- **Images**: JPG, PNG
- **Videos**: MP4, MOV

## Browser Compatibility

- Camera API: Chrome 56+, Firefox 55+, Safari 11+, Edge 79+
- File Upload: All modern browsers
- Fetch API: All modern browsers

## Performance Tips

1. **Resize images** before upload for faster processing
2. **Use JPEG** compression for reduced file size
3. **Throttle detection** requests from camera (500ms+ interval)
4. **Cache results** to avoid duplicate API calls
5. **Show loading states** for better UX

## CORS Issues

If you encounter CORS errors:

1. Make sure backend is running on `http://localhost:3000`
2. Check `CLIENT_URL` is correct in backend `.env`
3. Verify API endpoint URL is correct

Example CORS fix in backend `.env`:
```env
CLIENT_URL=http://localhost:5173  # Your React dev server
```

## Testing the Integration

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev

# Open browser
# Visit: http://localhost:5173
# Try uploading an image or using camera
```

## Troubleshooting

### Connection Refused
- Ensure backend is running: `npm run dev` in `/server`
- Check port 3000 is not blocked
- Verify `REACT_APP_API_URL` is correct

### CORS Error
- Backend is not setting CORS headers correctly
- Check `CLIENT_URL` in `.env`
- Restart backend after changing .env

### Image/Video Not Detected
- Check file format is supported
- Verify model is trained and saved
- Check backend logs for errors

### Timeout Error
- Large video files take longer to process
- Increase timeout in your fetch call
- Process video in chunks

## Advanced Integration

### Real-time Detection Loop

```javascript
const [detectionActive, setDetectionActive] = useState(false);

useEffect(() => {
  if (!detectionActive) return;

  const detectInterval = setInterval(() => {
    captureFrame();
  }, 500);

  return () => clearInterval(detectInterval);
}, [detectionActive]);
```

### Batch Processing

```javascript
async function processMultipleFiles(files) {
  const results = [];
  
  for (const file of files) {
    const result = await detectionService.detectFromFile(file);
    results.push(result);
  }
  
  return results;
}
```

### Result History

```javascript
const [history, setHistory] = useState([]);

const addToHistory = (result) => {
  setHistory([...history, {
    ...result,
    timestamp: new Date(),
    id: Date.now()
  }]);
};
```

## API Response Format

```json
{
  "success": true,
  "message": "Detection successful",
  "data": {
    "sign": "Sign_A",
    "confidence": 0.95,
    "predictions": [0.95, 0.04, 0.01],
    "type": "image"
  }
}
```

## Next Steps

1. ✅ Backend running
2. ✅ API endpoints ready
3. → Implement React components
4. → Connect to backend
5. → Test end-to-end
6. → Deploy both frontend & backend

For backend documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
