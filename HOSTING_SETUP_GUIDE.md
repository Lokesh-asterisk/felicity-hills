# Complete Hosting Setup Guide for Khushalipur Platform

## Overview
This guide will help you deploy your Khushalipur agricultural investment platform to your own hosting server (VPS, dedicated server, or cloud platform).

## Requirements
- **Server**: VPS or dedicated server with root access
- **OS**: Ubuntu 20.04+ or CentOS 7+ (recommended: Ubuntu 22.04)
- **RAM**: Minimum 2GB (recommended: 4GB+)
- **Storage**: Minimum 20GB SSD
- **Domain**: Your registered domain name
- **Email**: SendGrid account for notifications

## Step 1: Server Setup

### 1.1 Connect to Your Server
```bash
ssh root@your-server-ip
# or
ssh username@your-server-ip
```

### 1.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Required Software
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install other utilities
sudo apt install ufw fail2ban certbot python3-certbot-nginx -y
```

## Step 2: Database Setup

### 2.1 Configure PostgreSQL
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE khushalipur_prod;
CREATE USER khushalipur_user WITH ENCRYPTED PASSWORD 'YOUR_STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE khushalipur_prod TO khushalipur_user;
ALTER USER khushalipur_user CREATEDB;
\q
```

### 2.2 Configure PostgreSQL for External Connections (if needed)
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Add: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host khushalipur_prod khushalipur_user 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

## Step 3: Upload Application Files

### 3.1 Create Application Directory
```bash
sudo mkdir -p /var/www/khushalipur
sudo chown $USER:$USER /var/www/khushalipur
cd /var/www/khushalipur
```

### 3.2 Upload Files
**Option A: Using SCP from your local machine**
```bash
# From your local machine (where you built the project)
scp -r ./dist/* username@your-server-ip:/var/www/khushalipur/
```

**Option B: Using Git (if you have a repository)**
```bash
git clone https://github.com/yourusername/khushalipur.git .
```

**Option C: Using SFTP Client**
- Use FileZilla, WinSCP, or similar
- Upload all files from `dist/` folder to `/var/www/khushalipur/`

## Step 4: Configure Environment Variables

### 4.1 Create Production Environment File
```bash
cd /var/www/khushalipur
nano .env
```

Add the following configuration:
```env
# Database Configuration
DATABASE_URL=postgresql://khushalipur_user:YOUR_STRONG_PASSWORD_HERE@localhost:5432/khushalipur_prod
PGHOST=localhost
PGPORT=5432
PGUSER=khushalipur_user
PGPASSWORD=YOUR_STRONG_PASSWORD_HERE
PGDATABASE=khushalipur_prod

# Email Configuration (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Application Configuration
NODE_ENV=production
PORT=5000
SESSION_SECRET=your_very_long_random_session_secret_minimum_32_characters

# Domain Configuration
REPLIT_DOMAINS=yourdomain.com,www.yourdomain.com
```

### 4.2 Secure Environment File
```bash
chmod 600 .env
```

## Step 5: Install Dependencies and Initialize

### 5.1 Install Production Dependencies
```bash
cd /var/www/khushalipur
npm install --production
```

### 5.2 Initialize Database Schema
```bash
npm run db:push
```

## Step 6: Configure Process Manager (PM2)

### 6.1 Create PM2 Configuration
```bash
nano ecosystem.config.js
```

Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'khushalipur',
    script: 'server/index.js',
    cwd: '/var/www/khushalipur',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/khushalipur/error.log',
    out_file: '/var/log/khushalipur/out.log',
    log_file: '/var/log/khushalipur/combined.log',
    time: true
  }]
}
```

### 6.2 Create Log Directory
```bash
sudo mkdir -p /var/log/khushalipur
sudo chown $USER:$USER /var/log/khushalipur
```

### 6.3 Start Application with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Follow the instructions shown
```

## Step 7: Configure Nginx Reverse Proxy

### 7.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/khushalipur.com
```

Add this configuration (replace yourdomain.com with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration (will be added by Certbot)
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:";
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Main Application
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static Files Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|pdf|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:5000;
        expires 1y;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }
    
    # Security
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 7.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/khushalipur.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: SSL Certificate Setup

### 8.1 Install SSL Certificate (Let's Encrypt)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 8.2 Auto-Renewal Setup
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 9: Firewall Configuration

### 9.1 Configure UFW Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 9.2 Configure Fail2ban
```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Step 10: Domain DNS Configuration

Point your domain to your server:
```
A Record: yourdomain.com → YOUR_SERVER_IP
A Record: www.yourdomain.com → YOUR_SERVER_IP
```

## Step 11: SendGrid Email Setup

### 11.1 Create SendGrid Account
1. Go to https://sendgrid.com
2. Create account and verify email
3. Generate API key in Settings > API Keys

### 11.2 Domain Authentication (Optional but Recommended)
1. In SendGrid dashboard, go to Settings > Sender Authentication
2. Authenticate your domain
3. Add DNS records provided by SendGrid

## Step 12: Final Testing

### 12.1 Test Application
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs khushalipur

# Check Nginx status
sudo systemctl status nginx

# Test database connection
psql -h localhost -U khushalipur_user -d khushalipur_prod
```

### 12.2 Test Website Features
1. Visit https://yourdomain.com
2. Test site visit booking form
3. Test brochure downloads
4. Test admin dashboard: https://yourdomain.com/admin
5. Verify email notifications

## Step 13: Monitoring and Maintenance

### 13.1 Set Up Log Rotation
```bash
sudo nano /etc/logrotate.d/khushalipur
```

Add:
```
/var/log/khushalipur/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0640 $USER $USER
    postrotate
        pm2 reload khushalipur
    endscript
}
```

### 13.2 Backup Script
```bash
nano /home/$USER/backup.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/$USER/backups"

mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U khushalipur_user khushalipur_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/khushalipur

# Keep only last 7 backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x /home/$USER/backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /home/$USER/backup.sh
```

## Troubleshooting

### Common Issues:

1. **Application won't start**
   ```bash
   pm2 logs khushalipur
   ```

2. **Database connection error**
   ```bash
   sudo systemctl status postgresql
   psql -h localhost -U khushalipur_user -d khushalipur_prod
   ```

3. **Nginx configuration error**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

## Production URLs
- Website: https://yourdomain.com
- Admin Dashboard: https://yourdomain.com/admin
- Book Visit: https://yourdomain.com/book-visit

## Support
For hosting issues, check:
1. PM2 logs: `pm2 logs khushalipur`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. System logs: `sudo journalctl -f`

Your Khushalipur agricultural investment platform is now live and ready for business!