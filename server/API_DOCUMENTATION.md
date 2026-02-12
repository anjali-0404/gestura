# API Documentation - URable Backend

## Overview
The URable backend provides REST API endpoints for sign language detection using machine learning.

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Health Check
Check if the server is running and healthy.

**Request:**
```
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-02-11T10:30:00.000Z",
  "uptime": 123.456
}
```

---

### 2. Detect from File
Upload an image or video file for sign language detection.

**Request:**
```
POST /detect/file
Content-Type: multipart/form-data

Parameters:
- file: <file> (required) - Image (JPG, PNG) or Video (MP4)
```

**Request Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/detect/file \
  -F "file=@/path/to/image.jpg"
```

**Request Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3000/api/detect/file', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

**Response (200):**
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

**Response (400):**
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

**Response (500):**
```json
{
  "success": false,
  "message": "Detection failed",
  "error": "Error details here"
}
```

---

### 3. Detect from Stream (Camera/Real-time)
Send a base64 encoded image frame for real-time detection.

**Request:**
```
POST /detect/stream
Content-Type: application/json

Body:
{
  "frameData": "<base64-encoded-image-string>"
}
```

**Request Example (JavaScript):**
```javascript
// Capture frame from canvas
const canvas = document.getElementById('camera');
const frameData = canvas.toDataURL('image/jpeg').split(',')[1];

const response = await fetch('http://localhost:3000/api/detect/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ frameData })
});
const result = await response.json();
```

**Response (200):**
```json
{
  "success": true,
  "message": "Detection successful",
  "data": {
    "sign": "Sign_B",
    "confidence": 0.87,
    "predictions": [0.01, 0.87, 0.12],
    "type": "image"
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "No frame data provided"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (only in development mode)"
}
```

### Common Errors

| Status | Message | Cause |
|--------|---------|-------|
| 400 | No file uploaded | Missing file in request |
| 400 | File type not supported | Invalid file format |
| 400 | File size exceeds limit | File too large |
| 404 | Route not found | Invalid endpoint |
| 500 | Detection failed | ML processing error |
| 500 | Python process failed | Model inference error |

---

## Response Fields

### Detection Response

| Field | Type | Description |
|-------|------|-------------|
| sign | string | Detected sign label (e.g., "Sign_A") |
| confidence | number | Confidence score (0.0 - 1.0) |
| predictions | array | Confidence scores for all classes |
| type | string | Type of detection ("image" or "video") |
| frames_processed | number | (Video only) Number of frames analyzed |
| detections | array | (Video only) All detected signs per frame |

---

## Request/Response Examples

### Example 1: Image Detection

**Request:**
```bash
curl -X POST http://localhost:3000/api/detect/file \
  -F "file=@sign_image.jpg" \
  -H "Accept: application/json"
```

**Response:**
```json
{
  "success": true,
  "message": "Detection successful",
  "data": {
    "sign": "Sign_A",
    "confidence": 0.98,
    "predictions": [0.98, 0.01, 0.01],
    "type": "image"
  }
}
```

---

### Example 2: Video Detection

**Request:**
```bash
curl -X POST http://localhost:3000/api/detect/file \
  -F "file=@sign_video.mp4"
```

**Response:**
```json
{
  "success": true,
  "message": "Detection successful",
  "data": {
    "sign": "Sign_C",
    "confidence": 0.92,
    "type": "video",
    "frames_processed": 150,
    "detections": [
      {"frame": 0, "sign": "Sign_C", "confidence": 0.85},
      {"frame": 5, "sign": "Sign_C", "confidence": 0.90},
      {"frame": 10, "sign": "Sign_C", "confidence": 0.95}
    ]
  }
}
```

---

### Example 3: Real-time Camera Stream

**Request:**
```bash
curl -X POST http://localhost:3000/api/detect/stream \
  -H "Content-Type: application/json" \
  -d '{
    "frameData": "/9j/4AAQSkZJRgABAQEA..."
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Detection successful",
  "data": {
    "sign": "Sign_B",
    "confidence": 0.88,
    "predictions": [0.05, 0.88, 0.07],
    "type": "image"
  }
}
```

---

## Limits & Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| Max File Size | 50 MB | Maximum upload size |
| CORS | Localhost:5173 | Frontend URL (configurable) |
| Request Timeout | 30s | Processing timeout |
| Supported Formats | JPG, PNG, MP4 | File types supported |

---

## Best Practices

1. **Error Handling**: Always check `success` field before using detected data
2. **Timeout**: Implement client-side timeout for long-running video processing
3. **Validation**: Validate file format before uploading
4. **Confidence Threshold**: Use confidence score to determine result reliability
5. **Caching**: Cache results for frequently uploaded images to improve performance

---

## Rate Limiting (Future)

Currently no rate limiting is implemented. To add:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/detect', limiter);
```

---

## WebSocket Support (Future)

Planned for real-time stream processing without polling.

---

## Versioning

Current API Version: **v1**
Next Endpoint: `/api/v1/detect/file`

---

## Support & Feedback

For API issues or feature requests, please contact the development team.
