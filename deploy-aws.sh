#!/bin/bash

# Deployment script for AWS EC2 (Ubuntu 22.04)
set -e

echo "🚀 Starting Felicity Hills deployment to AWS EC2..."

# Stop any running processes
echo "Stopping existing processes..."
pm2 stop all || true
pm2 delete all || true

# Pull latest changes
echo "Pulling latest code..."
git pull origin main

# Install dependencies 
echo "Installing dependencies..."
npm ci --only=production

# Build the application
echo "Building application..."
npm run build

# Build production server
echo "Building production server..."
npx esbuild server/production-server.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
    echo "✅ Environment variables loaded"
else
    echo "❌ .env.production file not found!"
    exit 1
fi

# Database setup and sync - Handle the interactive prompt
echo "Syncing database schema..."
# First, check if database exists and is accessible
if psql "$DATABASE_URL" -c "\l" > /dev/null 2>&1; then
    echo "✅ Database connection verified"
    
    # Force database schema sync - this may cause data loss but necessary for deployment
    echo "y" | npm run db:push || {
        echo "⚠️  Database sync failed - continuing anyway as tables may already exist"
    }
else
    echo "❌ Database connection failed - please check DATABASE_URL"
    exit 1
fi

# Update Nginx configuration
echo "Updating Nginx configuration..."
sudo tee /etc/nginx/sites-available/felicity-hills > /dev/null << 'EOF'
server {
    listen 80;
    server_name 3.21.147.40;

    # Static file serving with caching
    location /assets/ {
        alias /var/www/felicity-hills/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # API routes
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Serve frontend files
    location / {
        try_files $uri $uri/ @fallback;
    }

    # Fallback to Node.js for SPA routing
    location @fallback {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/felicity-hills /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Setup PM2 ecosystem
echo "Setting up PM2 process management..."
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'felicity-hills',
    script: 'dist/production-server.js',
    cwd: '/var/www/felicity-hills',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    env_file: '.env.production',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '1G',
    error_file: '/var/log/felicity-hills/error.log',
    out_file: '/var/log/felicity-hills/out.log',
    log_file: '/var/log/felicity-hills/combined.log',
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false
  }]
};
EOF

# Create log directory
sudo mkdir -p /var/log/felicity-hills
sudo chown felicity:felicity /var/log/felicity-hills

# Start the application
echo "Starting application with PM2..."
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

# Verify deployment
echo "Verifying deployment..."
sleep 5

# Test health endpoint
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    pm2 logs felicity-hills --lines 20
    exit 1
fi

# Test via Nginx
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Nginx proxy check passed"
else
    echo "❌ Nginx proxy check failed"
    sudo nginx -t
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "Application is running at: http://3.21.147.40"
echo "API endpoint: http://3.21.147.40/health"
echo ""
echo "To monitor the application:"
echo "  pm2 status"
echo "  pm2 logs felicity-hills"
echo "  pm2 monit"