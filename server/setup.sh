#!/bin/bash
# setup.sh - Backend setup script

echo "🚀 URable Backend Setup"
echo "========================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python3 is not found. Trying 'python' command..."
    if ! command -v python &> /dev/null; then
        echo "❌ Python is not installed. Please install Python v3.8 or higher."
        exit 1
    fi
    PYTHON_CMD="python"
else
    PYTHON_CMD="python3"
fi

echo "✅ Python version: $($PYTHON_CMD --version)"

# Install Node dependencies
echo ""
echo "📦 Installing Node dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Node dependencies"
    exit 1
fi

echo "✅ Node dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
else
    echo "⚠️  .env file already exists. Skipping..."
fi

# Create Python virtual environment
echo ""
echo "🐍 Setting up Python environment..."

if [ ! -d "venv" ]; then
    $PYTHON_CMD -m venv venv
    echo "✅ Virtual environment created"
else
    echo "⚠️  Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    source venv/Scripts/activate
else
    # macOS/Linux
    source venv/bin/activate
fi

echo "📦 Installing Python dependencies..."
pip install -r SignLanguageDetectionUsingCNN-main/requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

echo "✅ Python dependencies installed"

# Create model directory
mkdir -p SignLanguageDetectionUsingCNN-main/model

echo ""
echo "✅ Backend setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Train the ML model using: jupyter notebook SignLanguageDetectionUsingCNN-main/trainmodel.ipynb"
echo "2. Save the trained model to: SignLanguageDetectionUsingCNN-main/model/sign_language_model.h5"
echo "3. Start the server with: npm run dev"
echo ""
