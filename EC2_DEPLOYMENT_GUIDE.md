# Felicity Hills - Complete EC2 Deployment Guide

## Your Infrastructure Setup
- **EC2 Instance**: Ubuntu 22.04 LTS, c7i-flex-large (4 vCPU, 8GB RAM)
- **Elastic IP**: 18.119.78.204
- **Private IP**: 172.31.26.3
- **Storage**: 50GB SSD
- **Security**: SSH, HTTP, HTTPS, Port 5000 configured
- **Domain**: GoDaddy DNS management
- **Access**: PuTTY SSH connection

---

## Phase 1: Git Repository Setup & Code Preparation

### 1.1 Create GitHub Repository (On Your Local Machine)

```bash
# If you haven't already, install Git on your local machine
# Then create a new repository on GitHub.com

# 1. Go to GitHub.com and create a new repository named "felicity-hills"
# 2. Don't initialize with README, .gitignore, or license (we'll add these)
```

### 1.2 Prepare Your Code for Production

Create production configuration files in your project:

**Create `.env.production` file:**
```bash
# Database Configuration
DATABASE_URL=postgresql://felicity_user:your_secure_password@localhost:5432/felicity_hills_db

# Application Configuration
NODE_ENV=production
PORT=8080

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Session Security
SESSION_SECRET=your_very_secure_session_secret_at_least_32_characters

# Application URLs
FRONTEND_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api
```

**Create `ecosystem.config.cjs` for PM2:**
```javascript
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
```

**Update `package.json` scripts for production:**
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "start:pm2": "pm2 start ecosystem.config.js",
    "stop:pm2": "pm2 stop felicity-hills",
    "restart:pm2": "pm2 restart felicity-hills",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

**Create `.gitignore` file:**
```
# Dependencies
node_modules/
npm-debug.log*

# Production builds
dist/
build/

# Environment files
.env
.env.local
.env.production
.env.development

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# PM2 files
.pm2/

# Temporary files
tmp/
temp/
```

### 1.3 Initialize Git and Push to GitHub

```bash
# In your project directory, initialize git
git init

# Add all files
git add .

# Commit initial version
git commit -m "Initial commit - Felicity Hills Real Estate Application"

# Add your GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/yourusername/felicity-hills.git

# Push to GitHub
git push -u origin main
```

---

## Phase 2: Initial Server Setup (Connect via PuTTY)

### 2.1 Connect to Your EC2 Instance

```bash
# Connect using PuTTY with your private key
# Host: 18.119.78.204
# Username: ubuntu
# Port: 22
```

### 2.2 Initial System Update and Security

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Create application user (for security)
sudo adduser --disabled-password --gecos "" felicity
sudo usermod -aG sudo felicity

# Create application directory
sudo mkdir -p /var/www/felicity-hills
sudo chown -R felicity:felicity /var/www/felicity-hills

# Set up basic firewall (UFW)
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 5000
sudo ufw --force enable

# Install fail2ban for SSH protection
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 2.3 Configure SSH Security

```bash
# Backup SSH config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Edit SSH configuration for security
sudo nano /etc/ssh/sshd_config

# Add/modify these lines:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# AuthorizedKeysFile .ssh/authorized_keys

# Restart SSH service
sudo systemctl restart sshd
```

---

## Phase 3: Install Node.js 18.x

### 3.1 Install Node.js using NodeSource Repository

```bash
# Download and install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show npm version

# Install global packages
sudo npm install -g pm2 tsx typescript

# Verify PM2 installation
pm2 --version
```

### 3.2 Configure npm for the felicity user

```bash
# Switch to felicity user
sudo su - felicity

# Configure npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Exit back to ubuntu user
exit
```

---

## Phase 4: Install and Configure PostgreSQL

### 4.1 Install PostgreSQL 15

```bash
# Install PostgreSQL 15
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo systemctl status postgresql
```

### 4.2 Configure PostgreSQL

```bash
# Switch to postgres user and access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE USER felicity_user WITH PASSWORD 'your_secure_password_here';
CREATE DATABASE felicity_hills_db OWNER felicity_user;

# Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE felicity_hills_db TO felicity_user;

# Grant additional permissions for schema operations
\c felicity_hills_db
GRANT ALL ON SCHEMA public TO felicity_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO felicity_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO felicity_user;

# Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Exit PostgreSQL
\q
```

### 4.3 Configure PostgreSQL for Application Access

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and modify these lines:
# listen_addresses = 'localhost'
# port = 5432

# Edit authentication configuration
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line for local connections:
# local   felicity_hills_db   felicity_user                   md5

# Restart PostgreSQL
sudo systemctl restart postgresql

# Test connection
psql -h localhost -U felicity_user -d felicity_hills_db -W
# Enter your password when prompted
# Type \q to exit
```

### 4.4 Create Database Schema

Create schema SQL file:
```bash
sudo nano /tmp/schema.sql
```

Add the complete schema:
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Plots table
CREATE TABLE IF NOT EXISTS plots (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    plot_number TEXT NOT NULL UNIQUE,
    size INTEGER NOT NULL,
    price_per_sq_yd INTEGER NOT NULL,
    road_width INTEGER NOT NULL,
    category TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    available BOOLEAN DEFAULT true,
    location TEXT,
    size_in_sqft INTEGER NOT NULL,
    price_per_sqft INTEGER NOT NULL,
    soil_type TEXT,
    water_access BOOLEAN DEFAULT false,
    road_access TEXT,
    nearby_amenities TEXT[] DEFAULT '{}'
);

-- Site visits table
CREATE TABLE IF NOT EXISTS site_visits (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    preferred_date TEXT,
    plot_size TEXT,
    budget TEXT,
    project_id VARCHAR,
    created_at TIMESTAMP DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    investment INTEGER NOT NULL,
    plot_size INTEGER NOT NULL,
    returns INTEGER NOT NULL,
    duration TEXT NOT NULL,
    review TEXT NOT NULL
);

-- Brochures table
CREATE TABLE IF NOT EXISTS brochures (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    download_url TEXT NOT NULL,
    file_size TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Brochure downloads table
CREATE TABLE IF NOT EXISTS brochure_downloads (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    brochure_id VARCHAR NOT NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT,
    downloaded_at TIMESTAMP DEFAULT now(),
    ip_address TEXT,
    user_agent TEXT
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    company TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    source TEXT NOT NULL,
    interest_level TEXT NOT NULL DEFAULT 'medium',
    property_interests TEXT[] DEFAULT '{}',
    budget TEXT,
    notes TEXT,
    assigned_to VARCHAR,
    last_contact_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id VARCHAR NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    appointment_type TEXT NOT NULL DEFAULT 'site_visit',
    status TEXT NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    assigned_to VARCHAR,
    location TEXT,
    duration INTEGER DEFAULT 60,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Follow ups table
CREATE TABLE IF NOT EXISTS follow_ups (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id VARCHAR NOT NULL,
    due_date TIMESTAMP NOT NULL,
    task TEXT NOT NULL,
    notes TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'pending',
    assigned_to VARCHAR,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    type TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    price_range TEXT,
    total_plots INTEGER,
    available_plots INTEGER,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Session table for connect-pg-simple
CREATE TABLE IF NOT EXISTS session (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL
);

-- Add constraints and indexes
ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX IF NOT EXISTS IDX_session_expire ON session(expire);

-- Insert sample data
INSERT INTO testimonials (name, location, investment, plot_size, returns, duration, review) VALUES
('Rajesh Kumar', 'Delhi', 2500000, 300, 18, '2 years', 'Excellent investment opportunity with great returns and transparent process.'),
('Priya Sharma', 'Gurgaon', 4000000, 500, 22, '18 months', 'Best decision for agricultural land investment. Professional team and clear documentation.'),
('Amit Patel', 'Noida', 1800000, 200, 15, '3 years', 'Peaceful location with good connectivity. Perfect for long-term investment.')
ON CONFLICT DO NOTHING;

INSERT INTO projects (name, description, location, type, featured, images, amenities, price_range, total_plots, available_plots) VALUES
('Khushalipur Phase 1', 'Premium agricultural land with modern amenities', 'Near Delhi-Dehradun Expressway', 'agricultural', true, 
 '{"https://example.com/project1.jpg"}', '{"Water Supply", "24/7 Security", "Road Access"}', '₹16L - ₹80L', 150, 42),
('Green Valley Plots', 'Eco-friendly agricultural plots with organic farming potential', 'Dehradun Highway', 'agricultural', false,
 '{"https://example.com/project2.jpg"}', '{"Organic Farming", "Solar Power", "Drip Irrigation"}', '₹12L - ₹45L', 100, 28)
ON CONFLICT DO NOTHING;
```

Import the schema:
```bash
# Import schema to database
psql -h localhost -U felicity_user -d felicity_hills_db -f /tmp/schema.sql

# Verify tables were created
psql -h localhost -U felicity_user -d felicity_hills_db -c "\dt"
```

---

## Phase 5: Clone and Deploy Application

### 5.1 Clone Repository

```bash
# Switch to application directory
cd /var/www/felicity-hills

# Clone your repository (replace with your actual GitHub repo URL)
sudo -u felicity git clone https://github.com/yourusername/felicity-hills.git .

# Set proper ownership
sudo chown -R felicity:felicity /var/www/felicity-hills

# Switch to felicity user for the rest of the deployment
sudo su - felicity
cd /var/www/felicity-hills
```

### 5.2 Install Dependencies and Build

```bash
# Install all dependencies
npm install

# Install production dependencies only
npm ci --only=production

# Install additional required packages
npm install postgres drizzle-orm

# Build the application
npm run build

# Create logs directory
mkdir -p logs

# Verify build was successful
ls -la dist/
```

### 5.3 Configure Environment Variables

```bash
# Create production environment file
nano .env.production

# Add these variables (replace with your actual values):
DATABASE_URL=postgresql://felicity_user:your_secure_password_here@localhost:5432/felicity_hills_db
NODE_ENV=production
PORT=8080
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
SESSION_SECRET=your_very_secure_session_secret_at_least_32_characters_long
FRONTEND_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api

# Load environment variables
source .env.production

# Test database connection
node -e "
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
sql\`SELECT version()\`.then(console.log).finally(() => process.exit());
"
```

---

## Phase 6: Install and Configure Nginx

### 6.1 Install Nginx

```bash
# Exit from felicity user back to ubuntu
exit

# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 6.2 Configure Nginx for Felicity Hills

```bash
# Remove default Nginx configuration
sudo rm /etc/nginx/sites-enabled/default

# Create new configuration file
sudo nano /etc/nginx/sites-available/felicity-hills

# Add this configuration (replace yourdomain.com with your actual domain):
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com 18.119.78.204;
    
    # Redirect HTTP to HTTPS (will be enabled after SSL setup)
    # return 301 https://$server_name$request_uri;
    
    # Serve static files
    location /assets/ {
        alias /var/www/felicity-hills/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    location /brochures/ {
        alias /var/www/felicity-hills/public/brochures/;
        expires 1d;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # API routes - proxy to Node.js application
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Enable CORS for API
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Serve React app (catch-all for client-side routing)
    location / {
        root /var/www/felicity-hills/dist/public;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Cache control for HTML files
        location ~* \.(html)$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # Cache control for static assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Hide Nginx version
    server_tokens off;
}
```

### 6.3 Enable Nginx Configuration

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/felicity-hills /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

---

## Phase 7: Start Application with PM2

### 7.1 Start Application

```bash
# Switch to felicity user
sudo su - felicity
cd /var/www/felicity-hills

# Load environment variables
source .env.production

# Start application with PM2
pm2 start ecosystem.config.js

# Check PM2 status
pm2 status

# View logs
pm2 logs felicity-hills

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

### 7.2 Test Application

```bash
# Test if application is responding
curl http://localhost:8080/api/health

# Test if Nginx is serving the application
curl http://18.119.78.204/api/health

# Check if frontend is being served
curl -I http://18.119.78.204/
```

---

## Phase 8: Domain Configuration (GoDaddy DNS)

### 8.1 Configure DNS Records in GoDaddy

Log into your GoDaddy account and update DNS records:

1. **A Record**: 
   - Name: `@` (root domain)
   - Value: `18.119.78.204`
   - TTL: `600`

2. **A Record**: 
   - Name: `www`
   - Value: `18.119.78.204`
   - TTL: `600`

3. **CNAME Record** (optional for API subdomain):
   - Name: `api`
   - Value: `yourdomain.com`
   - TTL: `600`

### 8.2 Wait for DNS Propagation

```bash
# Check DNS propagation (wait 5-30 minutes)
nslookup yourdomain.com
nslookup www.yourdomain.com

# Test domain access
curl -I http://yourdomain.com
```

---

## Phase 9: SSL Certificate Setup (Let's Encrypt)

### 9.1 Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Stop Nginx temporarily
sudo systemctl stop nginx
```

### 9.2 Obtain SSL Certificate

```bash
# Get SSL certificate (replace with your actual domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Follow the prompts:
# - Enter your email address
# - Agree to terms of service
# - Choose whether to share email with EFF

# Start Nginx again
sudo systemctl start nginx
```

### 9.3 Update Nginx Configuration for HTTPS

```bash
# Edit Nginx configuration to include SSL
sudo nano /etc/nginx/sites-available/felicity-hills

# Replace the content with this SSL-enabled configuration:
```

```nginx
# HTTP server block - redirect to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com 18.119.78.204;
    return 301 https://$server_name$request_uri;
}

# HTTPS server block
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;
    
    # Serve static files
    location /assets/ {
        alias /var/www/felicity-hills/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    location /brochures/ {
        alias /var/www/felicity-hills/public/brochures/;
        expires 1d;
        add_header Cache-Control "public";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # API routes - proxy to Node.js application
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Enable CORS for API
        add_header Access-Control-Allow-Origin "https://yourdomain.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://yourdomain.com";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Serve React app (catch-all for client-side routing)
    location / {
        root /var/www/felicity-hills/dist/public;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;" always;
        
        # Cache control for HTML files
        location ~* \.(html)$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # Cache control for static assets
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Hide Nginx version
    server_tokens off;
}
```

### 9.4 Test and Reload Nginx

```bash
# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Test HTTPS access
curl -I https://yourdomain.com
```

### 9.5 Set Up Automatic SSL Renewal

```bash
# Test automatic renewal
sudo certbot renew --dry-run

# If test passes, the cron job is already set up automatically
# Verify cron job exists
sudo crontab -l

# If not present, add it manually
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Phase 10: Final Configuration and Testing

### 10.1 Update Application Environment for Production

```bash
# Switch to felicity user
sudo su - felicity
cd /var/www/felicity-hills

# Update environment variables with HTTPS URLs
nano .env.production

# Update these variables:
FRONTEND_URL=https://yourdomain.com
API_URL=https://yourdomain.com/api

# Restart application
pm2 restart felicity-hills

# Check application status
pm2 status
pm2 logs felicity-hills --lines 50
```

### 10.2 Test All Functionality

```bash
# Test API endpoints
curl https://yourdomain.com/api/health
curl https://yourdomain.com/api/testimonials
curl https://yourdomain.com/api/projects

# Test frontend loading
curl -I https://yourdomain.com

# Test database connectivity
node -e "
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
sql\`SELECT COUNT(*) FROM testimonials\`.then(console.log).finally(() => process.exit());
"
```

### 10.3 Set Up Log Rotation

```bash
# Exit to ubuntu user
exit

# Create logrotate configuration
sudo nano /etc/logrotate.d/felicity-hills

# Add this configuration:
```

```
/var/www/felicity-hills/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 felicity felicity
    postrotate
        sudo -u felicity pm2 reloadLogs
    endscript
}
```

### 10.4 Set Up Monitoring Script

```bash
# Create monitoring script
sudo nano /usr/local/bin/check-felicity-app.sh

# Add this content:
```

```bash
#!/bin/bash

# Check if application is responding
if ! curl -f -s https://yourdomain.com/api/health > /dev/null; then
    echo "$(date): Application not responding, restarting..." >> /var/log/felicity-monitor.log
    sudo -u felicity pm2 restart felicity-hills
    sleep 10
    
    # Send email notification (optional)
    if ! curl -f -s https://yourdomain.com/api/health > /dev/null; then
        echo "$(date): Application restart failed!" >> /var/log/felicity-monitor.log
        # You can add email notification here
    fi
fi
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/check-felicity-app.sh

# Add to crontab for every 5 minutes monitoring
sudo crontab -e
# Add this line:
# */5 * * * * /usr/local/bin/check-felicity-app.sh
```

### 10.5 Set Up Automated Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-felicity.sh

# Add this content:
```

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/felicity-hills"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -h localhost -U felicity_user felicity_hills_db > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files (excluding node_modules)
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /var/www/felicity-hills --exclude=node_modules --exclude=dist --exclude=logs .

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "$(date): Backup completed - db_backup_$DATE.sql and app_backup_$DATE.tar.gz" >> /var/log/felicity-backup.log
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-felicity.sh

# Add to crontab for daily backup at 2 AM
sudo crontab -e
# Add this line:
# 0 2 * * * /usr/local/bin/backup-felicity.sh
```

---

## Phase 11: Performance Optimization

### 11.1 Configure Node.js for Production

```bash
# Switch to felicity user
sudo su - felicity
cd /var/www/felicity-hills

# Update ecosystem.config.js for better performance
nano ecosystem.config.js

# Update with optimized configuration:
```

```javascript
module.exports = {
  apps: [{
    name: 'felicity-hills',
    script: 'dist/index.js',
    instances: 4, // Use 4 instances for c7i-flex-large
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080,
      UV_THREADPOOL_SIZE: 128
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024',
    kill_timeout: 5000,
    listen_timeout: 10000,
    reload_delay: 1000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

```bash
# Restart with new configuration
pm2 reload ecosystem.config.js
pm2 save
```

### 11.2 Optimize PostgreSQL

```bash
# Exit to ubuntu user
exit

# Edit PostgreSQL configuration for better performance
sudo nano /etc/postgresql/14/main/postgresql.conf

# Optimize these settings for your c7i-flex-large instance:
# shared_buffers = 2GB
# effective_cache_size = 6GB
# work_mem = 4MB
# maintenance_work_mem = 512MB
# max_connections = 200
# checkpoint_completion_target = 0.9
# wal_buffers = 16MB
# default_statistics_target = 100

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 11.3 Enable Nginx Caching

```bash
# Create cache directory
sudo mkdir -p /var/cache/nginx/felicity-hills
sudo chown -R www-data:www-data /var/cache/nginx

# Update Nginx configuration to include caching
sudo nano /etc/nginx/sites-available/felicity-hills

# Add this to the top of the file, before server blocks:
```

```nginx
# Cache configuration
proxy_cache_path /var/cache/nginx/felicity-hills levels=1:2 keys_zone=felicity_cache:10m max_size=100m inactive=60m use_temp_path=off;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=100r/s;

# Add to the HTTPS server block, in the /api/ location:
        # Rate limiting
        limit_req zone=api_limit burst=20 nodelay;
        
        # Cache GET requests for 5 minutes
        proxy_cache felicity_cache;
        proxy_cache_valid 200 302 5m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout invalid_header updating http_500 http_502 http_503 http_504;
        proxy_cache_revalidate on;
        proxy_cache_lock on;
        
        # Don't cache POST requests
        proxy_cache_methods GET HEAD;
        proxy_no_cache $cookie_sessionid;
        proxy_cache_bypass $cookie_sessionid;
```

```bash
# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## Phase 12: Security Hardening

### 12.1 Configure UFW Firewall

```bash
# Reset UFW to start fresh
sudo ufw --force reset

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (be careful with this!)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow specific IP ranges if needed (optional)
# sudo ufw allow from YOUR_OFFICE_IP to any port 22

# Enable firewall
sudo ufw --force enable

# Check status
sudo ufw status verbose
```

### 12.2 Install and Configure Fail2Ban

```bash
# Create Fail2Ban configuration for Nginx
sudo nano /etc/fail2ban/jail.local

# Add this configuration:
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-noscript]
enabled = true
filter = nginx-noscript
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
filter = nginx-badbots
logpath = /var/log/nginx/access.log
maxretry = 2

[nginx-noproxy]
enabled = true
filter = nginx-noproxy
logpath = /var/log/nginx/access.log
maxretry = 2
```

```bash
# Restart Fail2Ban
sudo systemctl restart fail2ban
sudo systemctl status fail2ban
```

### 12.3 Set Up Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades apt-listchanges

# Configure automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Edit configuration
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades

# Ensure these lines are uncommented:
# Unattended-Upgrade::Automatic-Reboot "false";
# Unattended-Upgrade::Remove-Unused-Dependencies "true";
# Unattended-Upgrade::Automatic-Reboot-Time "02:00";
```

---

## Phase 13: Final Testing and Verification

### 13.1 Comprehensive Testing Checklist

```bash
# 1. Test website loading
curl -I https://yourdomain.com
# Should return 200 OK

# 2. Test API endpoints
curl https://yourdomain.com/api/health
curl https://yourdomain.com/api/testimonials
curl https://yourdomain.com/api/projects

# 3. Test SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# 4. Test database connectivity
sudo -u felicity psql -h localhost -U felicity_user -d felicity_hills_db -c "SELECT COUNT(*) FROM testimonials;"

# 5. Test email functionality (if configured)
# This would require SendGrid API key setup

# 6. Check application logs
sudo -u felicity pm2 logs felicity-hills --lines 50

# 7. Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 8. Test form submission (manual testing required)
# Visit https://yourdomain.com and test the site visit booking form

# 9. Check system resources
free -h
df -h
top

# 10. Test auto-restart functionality
sudo -u felicity pm2 stop felicity-hills
# Wait 5 minutes and check if monitoring script restarts it
sudo -u felicity pm2 status
```

### 13.2 Performance Testing

```bash
# Install Apache Bench for load testing
sudo apt install -y apache2-utils

# Test website performance
ab -n 100 -c 10 https://yourdomain.com/
ab -n 100 -c 10 https://yourdomain.com/api/testimonials

# Check response times
curl -w "@/dev/stdin" -o /dev/null -s https://yourdomain.com/ <<'EOF'
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
EOF
```

---

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Application Won't Start
```bash
# Check PM2 logs
sudo -u felicity pm2 logs felicity-hills

# Check if port 8080 is available
sudo netstat -tlnp | grep :8080

# Restart application
sudo -u felicity pm2 restart felicity-hills
```

#### 2. Database Connection Issues
```bash
# Test database connection
sudo -u felicity psql -h localhost -U felicity_user -d felicity_hills_db

# Check PostgreSQL status
sudo systemctl status postgresql

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 3. Nginx Issues
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

#### 5. Performance Issues
```bash
# Check system resources
htop
iotop
df -h

# Check application performance
sudo -u felicity pm2 monit

# Analyze slow queries (if any)
sudo -u postgres psql -d felicity_hills_db -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

### Maintenance Commands

```bash
# Regular maintenance tasks
sudo apt update && sudo apt upgrade -y
sudo -u felicity pm2 restart felicity-hills
sudo systemctl restart nginx
sudo certbot renew
sudo -u postgres vacuumdb -z -d felicity_hills_db

# Monitor logs
sudo tail -f /var/log/nginx/access.log
sudo -u felicity pm2 logs felicity-hills
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Backup manually
sudo /usr/local/bin/backup-felicity.sh

# Update application code
sudo -u felicity git pull origin main
sudo -u felicity npm ci --only=production
sudo -u felicity npm run build
sudo -u felicity pm2 restart felicity-hills
```

---

## Deployment Summary

### What Was Deployed
✅ **Complete Felicity Hills Real Estate Application**
- React frontend with TypeScript and Vite
- Node.js/Express backend with TypeScript
- PostgreSQL database with all schemas
- Complete admin dashboard and CRM functionality
- Email notifications via SendGrid
- File upload and brochure management system

✅ **Production Infrastructure**
- Ubuntu 22.04 LTS on AWS EC2 (c7i-flex-large)
- Nginx reverse proxy with SSL
- PM2 process management with clustering
- PostgreSQL 15 database server
- Let's Encrypt SSL certificates with auto-renewal

✅ **Security & Performance**
- UFW firewall configuration
- Fail2Ban intrusion detection
- Automated security updates
- Nginx caching and compression
- Rate limiting and DDoS protection

✅ **Monitoring & Backup**
- Application health monitoring
- Automated daily backups
- Log rotation and management
- SSL certificate auto-renewal

### Access URLs
- **Website**: https://yourdomain.com
- **API**: https://yourdomain.com/api
- **Admin Dashboard**: https://yourdomain.com/admin-dashboard

### Next Steps
1. **Update DNS**: Point your domain to 18.119.78.204 in GoDaddy
2. **Configure SendGrid**: Add your SendGrid API key to environment variables
3. **Test Email**: Verify site visit booking emails are working
4. **Content Management**: Add your actual project content and brochures
5. **SEO Setup**: Configure meta tags and analytics
6. **Monitoring**: Set up external monitoring services if needed

Your Felicity Hills application is now fully deployed and production-ready on AWS EC2! 🚀