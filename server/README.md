# URable Backend - Sign Language Detection

A Node.js/Express backend server for the URable sign language detection application. This backend integrates machine learning inference with a REST API for real-time sign language detection.

## Features

- **REST API** for sign language detection
- **File upload** support (images and videos)
- **Real-time streaming** detection from camera feeds
- **ML Model Integration** with Python TensorFlow backend
- **CORS** enabled for frontend communication
- **Error handling** and validation
- **Health check** endpoint

## Project Structure

```
server/
├── app.js                      # Express app setup
├── server.js                   # Server entry point
├── config.js                   # Configuration file
├── package.json                # Node dependencies
├── .env.example                # Example environment variables
├── routes/                     # API route handlers
│   ├── health.js              # Health check routes
│   └── detection.js           # Detection API routes
├── controllers/               # Business logic
│   ├── healthController.js    # Health check logic
│   └── detectionController.js # Detection logic
├── middleware/                # Custom middleware
│   └── errorHandler.js        # Error handling
├── utils/                     # Utility functions
│   ├── validators.js          # Input validation
│   └── logger.js             # Logging utility
├── uploads/                   # Temporary file uploads
└── SignLanguageDetectionUsingCNN-main/
    ├── inference.py           # Python ML inference script
    ├── realtimedetection.py   # Real-time detection
    ├── trainmodel.ipynb       # Model training notebook
    ├── requirements.txt       # Python dependencies
    └── ... (other ML files)
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

1. **Install Node dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up Python environment:**
   ```bash
   # Create virtual environment (recommended)
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install Python dependencies
   pip install -r SignLanguageDetectionUsingCNN-main/requirements.txt
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   PYTHON_SCRIPT_PATH=./SignLanguageDetectionUsingCNN-main/inference.py
   ```

4. **Prepare ML Model:**
   - Train the model using `SignLanguageDetectionUsingCNN-main/trainmodel.ipynb`
   - Save the trained model as `SignLanguageDetectionUsingCNN-main/model/sign_language_model.h5`

## Running the Server

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot-reload enabled (requires nodemon).

### Production Mode
```bash
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-02-11T10:30:00.000Z",
  "uptime": 123.456
}
```

### Detect from File
```
POST /api/detect/file
Content-Type: multipart/form-data

Form Data:
- file: <image or video file>
```

**Response:**
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

### Detect from Stream
```
POST /api/detect/stream
Content-Type: application/json

Request Body:
{
  "frameData": "<base64-encoded-image>"
}
```

**Response:**
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

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS
- `PYTHON_SCRIPT_PATH` - Path to Python detection script
- `UPLOAD_DIR` - Directory for temporary file uploads
- `MAX_FILE_SIZE` - Maximum file size for uploads (default: 50MB)

## Development

### Adding New Routes

1. Create a new file in `routes/` directory
2. Create corresponding controller in `controllers/` directory
3. Import and use the route in `app.js`

### Adding Validation

Use the utilities in `utils/validators.js` to validate inputs before processing.

### Logging

Use the logger from `utils/logger.js`:
```javascript
import { logger } from './utils/logger.js';

logger.info('Starting server');
logger.error('An error occurred', error);
logger.warn('Warning message');
logger.debug('Debug information');
```

## Error Handling

All errors are caught and returned in a standardized JSON format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Performance Tips

1. **Frame Interval**: For video processing, increase `frame_interval` in `inference.py` to process fewer frames
2. **Model Optimization**: Consider using TensorFlow Lite for faster inference
3. **Caching**: Implement caching for frequently processed images
4. **Async Processing**: Use background jobs for large video files

## Troubleshooting

### Python not found
- Ensure Python is installed and added to PATH
- On Windows, you may need to use `python` or `py` command
- Try using absolute path to Python in spawn command

### Model not found
- Ensure trained model is saved at `SignLanguageDetectionUsingCNN-main/model/sign_language_model.h5`
- Check model training completed successfully

### CORS errors
- Verify `CLIENT_URL` in `.env` matches your frontend URL
- Check frontend is running on the correct port

### File upload errors
- Check `uploads/` directory exists and has write permissions
- Verify file size doesn't exceed `MAX_FILE_SIZE`
- Ensure file format is supported

## Future Enhancements

- [ ] Add MongoDB integration for result history
- [ ] Implement user authentication
- [ ] Add WebSocket support for real-time detection
- [ ] Create admin dashboard
- [ ] Add model versioning
- [ ] Implement result caching
- [ ] Add performance metrics
- [ ] Support for multiple languages

## License

ISC

## Support

For issues and questions, please refer to the main project repository.
