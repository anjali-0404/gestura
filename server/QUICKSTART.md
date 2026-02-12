# Quick Start Guide - URable Backend

## Prerequisites
- Node.js v16+
- Python v3.8+
- Git

## Quick Setup (Windows)

```bash
# 1. Navigate to server directory
cd server

# 2. Run setup script (Windows)
setup.bat

# 3. Start development server
npm run dev
```

## Quick Setup (macOS/Linux)

```bash
# 1. Navigate to server directory
cd server

# 2. Run setup script
bash setup.sh

# 3. Start development server
npm run dev
```

## Manual Setup

```bash
# 1. Install Node dependencies
npm install

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install Python dependencies
pip install -r SignLanguageDetectionUsingCNN-main/requirements.txt

# 5. Copy environment variables
cp .env.example .env

# 6. Start server
npm run dev
```

## Server will be available at:
```
http://localhost:3000
```

## Test the API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Upload Image for Detection
```bash
curl -X POST http://localhost:3000/api/detect/file \
  -F "file=@/path/to/image.jpg"
```

## Training the Model

1. Open Jupyter Notebook:
```bash
jupyter notebook SignLanguageDetectionUsingCNN-main/trainmodel.ipynb
```

2. Follow the notebook instructions to:
   - Collect training data
   - Split data into train/test sets
   - Train the CNN model
   - Save the model

3. Save model at:
```
SignLanguageDetectionUsingCNN-main/model/sign_language_model.h5
```

## Troubleshooting

### Port Already in Use
Change the port in `.env`:
```env
PORT=3001
```

### Python Not Found
Ensure Python is in your PATH or use full path:
```bash
C:\Python39\python.exe -m venv venv
```

### Model Not Found
Create the model directory:
```bash
mkdir SignLanguageDetectionUsingCNN-main/model
```

Train the model using trainmodel.ipynb and save it to the model directory.

## Next Steps

1. ✅ Backend is running
2. Set up the frontend (navigate to `/client`)
3. Connect frontend to backend API
4. Test end-to-end detection flow
5. Deploy to production

## Documentation

For detailed documentation, see [README.md](./README.md)

## Support

For issues:
1. Check `.env` configuration is correct
2. Verify Python dependencies are installed
3. Ensure model file exists at the correct path
4. Check server logs for error messages
