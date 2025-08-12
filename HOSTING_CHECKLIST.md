# 🌱 Felicity Hills Platform - Hosting Deployment Checklist

## Pre-Deployment Requirements ✅

### 1. Server Requirements
- [ ] Node.js 18+ installed
- [ ] PostgreSQL database available
- [ ] Domain name configured
- [ ] SSL certificate ready
- [ ] Minimum 2GB RAM, 20GB storage

### 2. Email Service Setup
- [ ] SendGrid account created
- [ ] API key generated
- [ ] Domain authentication configured
- [ ] From email verified

### 3. Database Preparation
- [ ] PostgreSQL database created
- [ ] Database user with full permissions
- [ ] Database connection details ready
- [ ] Firewall configured for database access

## Deployment Process 📦

### Step 1: Prepare Files
```bash
# Run the build script
./build-production.sh

# Your deployment package will be in ./dist/
```

### Step 2: Upload to Server
```bash
# Upload the dist folder to your server
scp -r ./dist/* user@yourserver.com:/var/www/felicity-hills/

# Or use FTP/SFTP client to upload all files
```

### Step 3: Configure Environment
```bash
# On your server, create .env file
cp .env.example .env
nano .env

# Fill in your actual values:
DATABASE_URL=postgresql://user:password@localhost:5432/felicity_hills
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=admin@yourdomain.com
SESSION_SECRET=your_very_long_random_secret_here
```

### Step 4: Install & Start
```bash
# Install dependencies
npm install

# Start the application
npm start

# Or use PM2 for production
npm install -g pm2
pm2 start npm --name "felicity-hills" -- start
pm2 save
pm2 startup
```

### Step 5: Configure Reverse Proxy (Nginx)
```nginx
# Add to /etc/nginx/sites-available/yourdomain.com
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
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
    }
}
```

## Post-Deployment Testing ✅

### Test Core Features
- [ ] Homepage loads correctly
- [ ] Site visit booking form works
- [ ] Email notifications sent
- [ ] Brochure downloads work
- [ ] Admin dashboard accessible
- [ ] All statistics display correctly
- [ ] Mobile responsiveness working

### Test Admin Functions
- [ ] Admin login works
- [ ] Testimonial management
- [ ] Download tracking
- [ ] Excel export functionality
- [ ] Bulk operations working

### Performance Checks
- [ ] Page load times < 3 seconds
- [ ] Database queries optimized
- [ ] Static files served correctly
- [ ] HTTPS working properly

## Monitoring Setup 📊

### Essential Monitoring
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Server resource monitoring
- [ ] Database performance monitoring
- [ ] Error logging (PM2 logs)
- [ ] SSL certificate expiry alerts

### Backup Strategy
- [ ] Automated database backups daily
- [ ] File system backups weekly
- [ ] Backup restoration tested
- [ ] Off-site backup storage

## Security Hardening 🔒

### Server Security
- [ ] Firewall configured (only required ports open)
- [ ] SSH key authentication
- [ ] Fail2ban installed
- [ ] Regular security updates scheduled
- [ ] Non-root user for application

### Application Security
- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Session security configured

## Support Contacts 📞

### Technical Support
- Hosting Provider: [Your hosting provider support]
- Domain Registrar: [Your domain provider support]
- Email Service: SendGrid Support
- SSL Provider: [Your SSL provider support]

### Emergency Contacts
- Server Admin: [Your admin contact]
- Database Admin: [Your DBA contact]
- Application Developer: [Your developer contact]

## Troubleshooting Quick Fixes 🔧

### Common Issues
```bash
# Application not starting
pm2 logs felicity-hills
systemctl status nginx

# Database connection issues
psql -h localhost -U username -d felicity_hills

# Email not sending
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"

# Static files not loading
nginx -t
systemctl reload nginx
```

### Log Locations
- Application: `pm2 logs` or `/var/log/felicity-hills.log`
- Nginx: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- PostgreSQL: `/var/log/postgresql/`

## Maintenance Schedule 📅

### Daily
- [ ] Check application status
- [ ] Monitor error logs
- [ ] Verify backup completion

### Weekly
- [ ] Review performance metrics
- [ ] Check disk space usage
- [ ] Update application dependencies

### Monthly
- [ ] Security updates
- [ ] Database maintenance
- [ ] SSL certificate check
- [ ] Performance optimization review

---

🎉 **Congratulations!** Your Felicity Hills Agricultural Investment Platform is now live!

Visit your website at: https://yourdomain.com
Admin Dashboard: https://yourdomain.com/admin

For support, refer to the DEPLOYMENT.md guide or contact your technical team.