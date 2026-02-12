# Dockerfile - Optimized for Render (Debian-based for better ML support)
FROM node:18-bullseye-slim

# Install Python and system dependencies for OpenCV/TensorFlow
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm ci --only=production

# Copy Python requirements first for better caching
COPY SignLanguageDetectionUsingCNN-main/requirements.txt ./SignLanguageDetectionUsingCNN-main/

# Install Python dependencies (Using tensorflow-cpu to save space/RAM if possible)
# Note: Render free tier has limited RAM. we might need to use a smaller TF version or tensorflow-cpu
RUN pip3 install --no-cache-dir -r SignLanguageDetectionUsingCNN-main/requirements.txt

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["node", "server.js"]
