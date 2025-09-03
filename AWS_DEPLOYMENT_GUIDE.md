# AWS Deployment Guide for Felicity Hills Real Estate Application

## Overview
This guide covers deploying your React/Node.js application to AWS using modern cloud infrastructure. We'll use AWS services that provide scalability, reliability, and cost-effectiveness.

## Recommended AWS Architecture

### Option 1: Simple Setup (Recommended for Start)
- **EC2 Instance**: Host the Node.js application
- **RDS PostgreSQL**: Managed database service
- **CloudFront**: CDN for static assets
- **Route 53**: Domain management
- **Certificate Manager**: SSL certificates

### Option 2: Advanced Setup (For Scale)
- **ECS Fargate**: Containerized application hosting
- **Application Load Balancer**: Traffic distribution
- **RDS PostgreSQL**: Managed database with Multi-AZ
- **S3**: Static asset storage
- **CloudFront**: Global CDN
- **Route 53**: DNS management

## Prerequisites

1. **AWS Account**: Create at aws.amazon.com
2. **Domain Name**: Purchase or transfer your domain
3. **AWS CLI**: Install AWS Command Line Interface
4. **Node.js**: Version 18+ locally for deployment preparation

## Step 1: Prepare Application for Production

### 1.1 Environment Configuration
Create production environment file:

```bash
# .env.production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/felicity_hills
SENDGRID_API_KEY=your_sendgrid_key
SESSION_SECRET=your_super_secret_session_key_here
ADMIN_EMAIL=admin@felicityhills.com
COMPANY_EMAIL=info@felicityhills.com
```

### 1.2 Build Optimization
```bash
# Install production dependencies only
npm ci --production

# Build the application
npm run build

# Test production build locally
NODE_ENV=production npm start
```

## Step 2: Database Setup (RDS PostgreSQL)

### 2.1 Create RDS Instance
```bash
# Using AWS CLI
aws rds create-db-instance \
    --db-instance-identifier felicity-hills-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username dbadmin \
    --master-user-password YourSecurePassword123! \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-your-security-group \
    --db-subnet-group-name your-subnet-group \
    --backup-retention-period 7 \
    --storage-encrypted \
    --publicly-accessible
```

### 2.2 Configure Security Group
- **Inbound Rules**: PostgreSQL (5432) from your EC2 security group
- **Outbound Rules**: All traffic

### 2.3 Initialize Database
```bash
# Connect to RDS and run schema
npm run db:push
```

## Step 3: EC2 Instance Setup

### 3.1 Launch EC2 Instance
- **AMI**: Amazon Linux 2023
- **Instance Type**: t3.small (recommended minimum)
- **Security Group**: 
  - SSH (22) from your IP
  - HTTP (80) from anywhere
  - HTTPS (443) from anywhere
  - Custom (3000) from load balancer

### 3.2 Connect and Setup Server
```bash
# Connect to EC2
ssh -i your-key.pem ec2-user@your-ec2-public-ip

# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo yum install -y nginx

# Start and enable services
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.3 Deploy Application
```bash
# Create app directory
sudo mkdir -p /var/www/felicity-hills
sudo chown ec2-user:ec2-user /var/www/felicity-hills

# Upload application files (using scp or git)
cd /var/www/felicity-hills
git clone your-repo-url .

# Install dependencies
npm ci --production

# Build application
npm run build

# Set up environment variables
cp .env.production .env

# Start with PM2
pm2 start npm --name "felicity-hills" -- start
pm2 startup
pm2 save
```

## Step 4: Nginx Configuration

### 4.1 Configure Nginx as Reverse Proxy
```nginx
# /etc/nginx/sites-available/felicity-hills
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
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

    # Static file serving
    location /static {
        alias /var/www/felicity-hills/dist/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/felicity-hills /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: SSL Certificate Setup

### 5.1 Using AWS Certificate Manager
```bash
# Request certificate
aws acm request-certificate \
    --domain-name your-domain.com \
    --subject-alternative-names www.your-domain.com \
    --validation-method DNS \
    --region us-east-1
```

### 5.2 Alternative: Let's Encrypt with Certbot
```bash
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 6: Domain and DNS Setup

### 6.1 Route 53 Configuration
1. **Create Hosted Zone** for your domain
2. **Create A Record** pointing to EC2 public IP
3. **Update Domain Registrar** with Route 53 name servers

### 6.2 CloudFront CDN (Optional but Recommended)
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

## Step 7: Monitoring and Logging

### 7.1 CloudWatch Setup
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm
```

### 7.2 Application Monitoring
```bash
# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Step 8: Backup Strategy

### 8.1 Database Backups
- **Automated Backups**: Enabled by default (7-day retention)
- **Manual Snapshots**: Create before major updates

### 8.2 Application Backups
```bash
# Create AMI snapshot
aws ec2 create-image \
    --instance-id i-your-instance-id \
    --name "felicity-hills-backup-$(date +%Y%m%d)" \
    --description "Application backup"
```

## Cost Optimization

### Monthly Cost Estimates (US East):
- **EC2 t3.small**: ~$15/month
- **RDS db.t3.micro**: ~$12/month
- **Data Transfer**: ~$5/month
- **Route 53**: ~$0.50/month
- **Total**: ~$32.50/month

### Cost Saving Tips:
1. **Reserved Instances**: 30-60% savings for 1-3 year commitments
2. **Spot Instances**: For development environments
3. **Auto Scaling**: Scale down during low traffic
4. **CloudWatch**: Monitor and optimize resource usage

## Security Best Practices

### 8.1 EC2 Security
- **Keep system updated**: `sudo yum update -y`
- **Use IAM roles**: Instead of access keys
- **Restrict security groups**: Minimal required access
- **SSH key management**: Rotate keys regularly

### 8.2 Application Security
- **Environment variables**: Use AWS Systems Manager Parameter Store
- **Database encryption**: Enable encryption at rest
- **HTTPS only**: Redirect all HTTP to HTTPS
- **Regular updates**: Keep Node.js and dependencies updated

## Deployment Automation

### 8.1 Simple Deployment Script
```bash
#!/bin/bash
# deploy.sh

# Build locally
npm run build

# Upload to EC2
rsync -av --delete dist/ ec2-user@your-server:/var/www/felicity-hills/dist/

# Restart application
ssh ec2-user@your-server "cd /var/www/felicity-hills && pm2 restart felicity-hills"
```

### 8.2 Advanced: AWS CodeDeploy
Set up automated deployments with GitHub integration.

## Troubleshooting

### Common Issues:
1. **502 Bad Gateway**: Check if Node.js app is running
2. **Database Connection**: Verify security group settings
3. **SSL Issues**: Check certificate validation
4. **Performance**: Monitor CloudWatch metrics

### Useful Commands:
```bash
# Check application status
pm2 status
pm2 logs felicity-hills

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Database connection test
psql $DATABASE_URL -c "SELECT 1"
```

## Support and Maintenance

### Regular Tasks:
- **Weekly**: Check application logs and performance
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review costs and optimize resources

### AWS Support:
- **Basic Support**: Free
- **Developer Support**: $29/month
- **Business Support**: $100/month (recommended for production)

## Next Steps After Deployment

1. **Test all functionality**: Forms, email notifications, downloads
2. **Set up monitoring**: CloudWatch alarms and notifications
3. **Performance testing**: Load testing with realistic traffic
4. **SEO optimization**: Submit sitemap to search engines
5. **Analytics**: Set up Google Analytics or AWS CloudWatch Insights

---

This AWS deployment provides enterprise-grade hosting with excellent scalability, security, and reliability for your real estate application.