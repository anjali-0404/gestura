#!/bin/bash
# install.sh - Quick installation script for all dependencies

echo "🚀 Setting up URable Backend..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js v16+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python not found. Please install Python v3.8+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python installed${NC}"

# Install Node packages
echo ""
echo -e "${YELLOW}📦 Installing Node dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install Node dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node dependencies installed${NC}"

# Create .env if needed
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env created. Please update configuration as needed${NC}"
fi

# Create Python venv
echo ""
echo -e "${YELLOW}🐍 Setting up Python environment...${NC}"
if [ ! -d venv ]; then
    python3 -m venv venv 2>/dev/null || python -m venv venv
fi

# Activate and install Python packages
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    source venv/Scripts/activate 2>/dev/null || . venv/Scripts/activate
else
    source venv/bin/activate
fi

pip install -r SignLanguageDetectionUsingCNN-main/requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install Python dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python dependencies installed${NC}"

# Create necessary directories
mkdir -p SignLanguageDetectionUsingCNN-main/model
mkdir -p uploads

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Train the ML model using: jupyter notebook SignLanguageDetectionUsingCNN-main/trainmodel.ipynb"
echo "2. Save model to: SignLanguageDetectionUsingCNN-main/model/sign_language_model.h5"
echo "3. Start server: npm run dev"
echo ""
