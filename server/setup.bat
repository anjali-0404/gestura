@echo off
REM setup.bat - Backend setup script for Windows

echo.
echo 🚀 URable Backend Setup
echo ========================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

REM Check if Python is installed
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python is not installed. Please install Python v3.8 or higher.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Python version: %PYTHON_VERSION%

REM Install Node dependencies
echo.
echo 📦 Installing Node dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install Node dependencies
    pause
    exit /b 1
)
echo ✅ Node dependencies installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo.
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
) else (
    echo ⚠️  .env file already exists. Skipping...
)

REM Create Python virtual environment
echo.
echo 🐍 Setting up Python environment...

if not exist venv (
    call python -m venv venv
    echo ✅ Virtual environment created
) else (
    echo ⚠️  Virtual environment already exists
)

REM Activate virtual environment and install dependencies
echo ✅ Activating virtual environment...
call venv\Scripts\activate.bat

echo 📦 Installing Python dependencies...
call pip install -r SignLanguageDetectionUsingCNN-main\requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✅ Python dependencies installed

REM Create model directory
if not exist SignLanguageDetectionUsingCNN-main\model (
    mkdir SignLanguageDetectionUsingCNN-main\model
)

echo.
echo ✅ Backend setup completed successfully!
echo.
echo Next steps:
echo 1. Train the ML model using: jupyter notebook SignLanguageDetectionUsingCNN-main\trainmodel.ipynb
echo 2. Save the trained model to: SignLanguageDetectionUsingCNN-main\model\sign_language_model.h5
echo 3. Start the server with: npm run dev
echo.
pause
