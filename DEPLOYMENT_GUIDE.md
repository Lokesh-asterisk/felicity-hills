# Felicity Hills - Hostinger Deployment Guide

## Overview
This guide covers deploying the Felicity Hills real estate application on Hostinger platforms. The application is a full-stack React/Node.js app with PostgreSQL database.

## Application Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (Neon Database)
- **Email**: SendGrid
- **File Storage**: Object Storage (GCS)

---

## Option 1: Hostinger Shared Hosting

### Limitations & Considerations
❌ **Not Recommended** for this application due to:
- No Node.js runtime support on shared hosting
- No PostgreSQL database access
- No server-side code execution
- Limited to static files (HTML, CSS, JS)

### Alternative for Shared Hosting
If you must use shared hosting, you would need to:
1. Convert the app to a static site generator (Next.js SSG)
2. Use external services for backend (Vercel, Railway, etc.)
3. Host only the frontend build files

---

## Option 2: Hostinger VPS (Recommended)

### VPS Requirements
- **Minimum**: 2 GB RAM, 1 CPU, 50 GB SSD
- **Recommended**: 4 GB RAM, 2 CPU, 100 GB SSD
- **OS**: Ubuntu 22.04 LTS

### Step-by-Step VPS Deployment

#### 1. Server Setup & Initial Configuration

```bash
# Connect to your VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git unzip software-properties-common

# Create a non-root user
adduser felicity
usermod -aG sudo felicity
```

#### 2. Install Node.js (Latest LTS)

```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

#### 3. Install and Configure PostgreSQL

```bash
# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

```sql
-- In PostgreSQL shell
CREATE DATABASE felicity_hills;
CREATE USER felicity_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE felicity_hills TO felicity_user;
\q
```

#### 4. Install and Configure Nginx

```bash
# Install Nginx
apt install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/felicity-hills
```

```nginx
# Nginx configuration file
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Serve static files directly
    location /assets/ {
        alias /home/felicity/felicity-hills/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy API requests to Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve React app for all other routes
    location / {
        root /home/felicity/felicity-hills/dist;
        try_files $uri $uri/ /index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/felicity-hills /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl reload nginx
```

#### 5. Install SSL Certificate with Certbot

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
certbot renew --dry-run
```

#### 6. Deploy the Application

```bash
# Switch to felicity user
su - felicity

# Clone the repository
git clone https://github.com/yourusername/felicity-hills.git
cd felicity-hills

# Install dependencies
npm install

# Create production environment file
nano .env.production
```

```env
# Production Environment Variables
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://felicity_user:your_secure_password@localhost:5432/felicity_hills
PGHOST=localhost
PGPORT=5432
PGUSER=felicity_user
PGPASSWORD=your_secure_password
PGDATABASE=felicity_hills

# Email Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@your-domain.com
ADMIN_EMAIL=admin@your-domain.com

# Session Secret
SESSION_SECRET=your_very_secure_session_secret_min_32_chars

# Object Storage (if using)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=your_bucket_id
PRIVATE_OBJECT_DIR=/your-bucket/private
PUBLIC_OBJECT_SEARCH_PATHS=/your-bucket/public

# Application Settings
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://your-domain.com/api
```

```bash
# Build the application
npm run build

# Set up database schema
npm run db:push

# Install tsx globally for running TypeScript
sudo npm install -g tsx

# Create systemd service
sudo nano /etc/systemd/system/felicity-hills.service
```

Add the following content to `/etc/systemd/system/felicity-hills.service`:
```ini
[Unit]
Description=Felicity Hills Node.js Application
After=network.target

[Service]
User=felicity
WorkingDirectory=/home/felicity/felicity-hills
Environment="NODE_ENV=production"
Environment="PORT=3000"
EnvironmentFile=/home/felicity/felicity-hills/.env.production
ExecStart=/usr/bin/tsx server/index.ts
Restart=always
RestartSec=10
StandardOutput=append:/home/felicity/felicity-hills/logs/out.log
StandardError=append:/home/felicity/felicity-hills/logs/err.log

[Install]
Type=simple
WantedBy=multi-user.target
```

```bash
# Create logs directory
mkdir logs

# Set up the service
sudo systemctl daemon-reload
sudo systemctl enable felicity-hills

# Start the application service
sudo systemctl start felicity-hills

# Check service status
sudo systemctl status felicity-hills
```

#### 7. Configure Firewall

```bash
# Configure UFW firewall
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Check firewall status
ufw status
```

#### 8. Set Up Monitoring & Logging

```bash
# Install htop for system monitoring
apt install -y htop

# Set up log rotation for application logs
nano /etc/logrotate.d/felicity-hills
```

```
/home/felicity/felicity-hills/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 felicity felicity
    postrotate
        systemctl reload felicity-hills
    endscript
}
```

#### 9. Backup Strategy

```bash
# Create backup script
nano /home/felicity/backup.sh
```

```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="/home/felicity/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="felicity_hills"
DB_USER="felicity_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

```bash
# Make script executable
chmod +x /home/felicity/backup.sh

# Add to crontab for daily backups
crontab -e
# Add this line: 0 2 * * * /home/felicity/backup.sh
```

### Deployment Checklist

#### Pre-Deployment
- [ ] Domain name configured and pointing to VPS IP
- [ ] SendGrid account set up with API key
- [ ] SSL certificate installed
- [ ] Environment variables configured
- [ ] Database schema pushed

#### Deployment
- [ ] Application built successfully
- [ ] Application service running
- [ ] Nginx serving files correctly
- [ ] Database connections working
- [ ] Email notifications functional

#### Post-Deployment
- [ ] Test all forms and functionality
- [ ] Monitor server resources
- [ ] Set up backups
- [ ] Configure monitoring alerts

### Maintenance Commands

```bash
# Application Management
sudo systemctl status felicity-hills      # Check application status
sudo journalctl -u felicity-hills -f      # View application logs
sudo systemctl restart felicity-hills     # Restart application
sudo systemctl reload felicity-hills      # Reload configuration
```

```bash
# System Monitoring
htop                       # System resource usage
df -h                      # Disk usage
free -m                    # Memory usage
systemctl status nginx    # Nginx status
systemctl status postgresql # Database status
```

```bash
# Updates and Maintenance
git pull origin main       # Update code
npm run build             # Rebuild application
sudo systemctl restart felicity-hills # Apply updates
```

### Troubleshooting

#### Common Issues & Solutions

1. **Application won't start**
   ```bash
   sudo journalctl -u felicity-hills -f  # Check logs
   npm run build                       # Rebuild if needed
   ```

2. **Database connection errors**
   ```bash
   systemctl status postgresql
   sudo -u postgres psql -c "\l"  # List databases
   ```

3. **Nginx configuration issues**
   ```bash
   nginx -t                # Test configuration
   systemctl status nginx  # Check service status
   ```

4. **SSL certificate problems**
   ```bash
   certbot certificates    # Check certificate status
   certbot renew          # Manual renewal
   ```

### Performance Optimization

#### Server-Level Optimizations
- Enable Gzip compression in Nginx
- Configure proper caching headers
- Use CDN for static assets
- Optimize database queries
- Set up Redis for session storage (optional)

#### Application-Level Optimizations
- Minimize bundle size
- Implement lazy loading
- Optimize images
- Use database indexing
- Monitor memory usage

### Security Best Practices

1. **Server Security**
   - Keep system updated
   - Use SSH keys instead of passwords
   - Configure fail2ban
   - Regular security audits

2. **Application Security**
   - Use environment variables for secrets
   - Implement rate limiting
   - Sanitize user inputs
   - Regular dependency updates

3. **Database Security**
   - Use strong passwords
   - Limit database access
   - Regular backups
   - Monitor for unusual activity

---

## Cost Estimation

### Hostinger VPS Pricing
- **VPS 1**: €3.99/month (2GB RAM, 1 CPU, 50GB SSD)
- **VPS 2**: €8.99/month (4GB RAM, 2 CPU, 100GB SSD) ⭐ **Recommended**
- **VPS 3**: €15.99/month (8GB RAM, 4 CPU, 200GB SSD)

### Additional Costs
- Domain name: ~€10/year
- SendGrid: Free tier (100 emails/day) or $19.95/month
- SSL Certificate: Free with Let's Encrypt

### Total Monthly Cost
- **Basic Setup**: €8.99/month + domain
- **With paid email**: €28.94/month + domain

---

## Support & Maintenance

### Regular Tasks
- Weekly server updates
- Monthly backup verification
- Quarterly security audits
- Monitor resource usage
- Update SSL certificates (automatic)

### Emergency Procedures
- Database restoration process
- Application rollback steps
- Server migration guide
- Disaster recovery plan

---

This deployment guide provides a complete production-ready setup for your Felicity Hills application on Hostinger VPS. The VPS option gives you full control and can handle the complete application stack with room for growth.