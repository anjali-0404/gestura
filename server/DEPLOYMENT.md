# Deployment Guide - URable Backend

## Prerequisites
- Node.js v16+
- Python v3.8+
- (Optional) Docker and Docker Compose
- (Optional) MongoDB for data persistence

## Deployment Options

### Option 1: Traditional Deployment (VPS/Cloud Server)

#### Step 1: Prepare Server
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python
sudo apt-get install -y python3 python3-pip python3-venv

# Install Git
sudo apt-get install -y git
```

#### Step 2: Clone Repository
```bash
cd /var/www
git clone <your-repo-url> urable-backend
cd urable-backend/server
```

#### Step 3: Setup Application
```bash
# Install Node dependencies
npm install --production

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r SignLanguageDetectionUsingCNN-main/requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with production values
nano .env
```

#### Step 4: Setup Process Manager (PM2)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'urable-backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log'
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js

# Set to restart on system reboot
pm2 startup
pm2 save
```

#### Step 5: Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt-get install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/urable

# Add configuration:
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/urable /etc/nginx/sites-enabled/

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Setup SSL (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

---

### Option 2: Docker Deployment

#### Step 1: Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Deploy with Docker Compose
```bash
# Clone repository
git clone <your-repo-url>
cd urable-backend/server

# Create .env file
cp .env.example .env
# Edit .env

# Build and start containers
docker-compose up -d

# Check logs
docker-compose logs -f backend
```

#### Step 3: Setup Nginx with Docker
```bash
# Create Nginx configuration for Docker
docker run --name urable-nginx \
  -p 80:3000 \
  -p 443:3000 \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  --link urable-backend:backend \
  -d nginx:latest
```

---

### Option 3: Cloud Platform Deployment

#### Heroku
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create urable-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://yourdomain.com

# Deploy
git push heroku main
```

#### AWS (EC2 + Elastic Beanstalk)
```bash
# Install EB CLI
pip install awsebcli --upgrade --user

# Initialize EB
eb init -p node.js-18 urable-backend

# Create environment
eb create production-env

# Deploy
eb deploy
```

---

## Production Configuration

### Environment Variables
```env
# Server
PORT=3000
NODE_ENV=production

# Client
CLIENT_URL=https://yourdomain.com

# ML Model
PYTHON_SCRIPT_PATH=/app/SignLanguageDetectionUsingCNN-main/inference.py

# Upload
UPLOAD_DIR=/var/data/uploads
MAX_FILE_SIZE=52428800

# Database (when implemented)
DATABASE_URL=mongodb://user:password@mongodb:27017/urable

# Security
JWT_SECRET=your-secret-key-here
SESSION_SECRET=your-session-secret-here
```

### Security Checklist
- [ ] Update NODE_ENV to 'production'
- [ ] Set strong SECRET keys
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Setup firewall rules
- [ ] Regular backups enabled
- [ ] Monitor error logs
- [ ] Setup rate limiting
- [ ] Enable GZIP compression
- [ ] Update dependencies regularly

### Performance Optimization
```javascript
// app.js
import compression from 'compression';

// Enable compression
app.use(compression());

// Cache static assets
app.use(express.static('public', {
  maxAge: '1d'
}));
```

### Monitoring & Logging

#### PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 web

# Access at http://localhost:9615
```

#### Application Logging
```javascript
// Use the built-in logger
import { logger } from './utils/logger.js';

logger.info('Application started');
logger.error('An error occurred', error);
```

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://user:password@localhost:27017/urable" \
  --archive=backup.archive

# Restore
mongorestore --uri="mongodb://user:password@localhost:27017/urable" \
  --archive=backup.archive
```

---

## Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs urable-backend

# Check port
lsof -i :3000

# Check Node version
node --version

# Restart
pm2 restart urable-backend
```

### High Memory Usage
```bash
# Check memory usage
pm2 monit

# Restart with memory limit
pm2 start server.js --max-memory-restart 500M
```

### Python Script Errors
```bash
# Verify Python installation
python3 --version

# Test ML inference manually
python3 SignLanguageDetectionUsingCNN-main/inference.py \
  --file test_image.jpg \
  --type image
```

---

## Scaling

### Horizontal Scaling (Multiple Servers)
1. Setup load balancer (Nginx, HAProxy)
2. Run multiple instances behind load balancer
3. Use shared storage for uploads
4. Use centralized database

### Vertical Scaling (Bigger Server)
1. Increase CPU/Memory
2. Configure PM2 to use more CPU cores
3. Optimize database queries
4. Cache frequently accessed data

---

## Maintenance

### Regular Updates
```bash
# Update Node packages
npm update

# Update Python packages
pip install --upgrade -r requirements.txt

# Update OS
sudo apt-get update && sudo apt-get upgrade
```

### Database Maintenance
```bash
# MongoDB optimization
db.analizeSchema()
db.reIndex()

# Backup
mongodump --uri "mongodb://..." --archive=backup.archive
```

---

## Recovery

### System Failure
1. Check PM2 status: `pm2 status`
2. Restart application: `pm2 restart urable-backend`
3. Check recent logs for errors
4. Review and fix issues
5. Restart: `pm2 restart all`

### Data Loss
1. Restore from backup
2. Check upload directory
3. Verify database integrity
4. Test critical functions

---

## Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test API endpoints
4. Contact support team
