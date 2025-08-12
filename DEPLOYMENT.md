# Deployment Guide for Felicity Hills Agricultural Investment Platform

This guide will help you deploy your agricultural land investment platform to your own hosting provider.

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed on your server
- PostgreSQL database setup
- Domain name configured
- SSL certificate for HTTPS
- Environment variables configured

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name
PGHOST=your_postgres_host
PGPORT=5432
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGDATABASE=your_database_name

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Application Configuration
NODE_ENV=production
PORT=5000
SESSION_SECRET=your_very_long_random_session_secret_here

# Domain Configuration
REPLIT_DOMAINS=yourdomain.com,www.yourdomain.com
ISSUER_URL=https://replit.com/oidc
REPL_ID=your_repl_id_if_using_replit_auth
```

## Database Setup

1. Create a PostgreSQL database
2. Run the application once to auto-create tables via Drizzle ORM
3. Alternatively, you can run migrations manually:

```bash
npm run db:push
```

## Building for Production

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

## Deployment Options

### Option 1: Traditional VPS/Dedicated Server

1. **Upload files** to your server
2. **Install Node.js and PostgreSQL**
3. **Configure environment variables**
4. **Install PM2** for process management:
```bash
npm install -g pm2
```

5. **Start the application**:
```bash
pm2 start npm --name "felicity-hills" -- start
pm2 save
pm2 startup
```

6. **Configure Nginx** as reverse proxy:
```nginx
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

### Option 2: Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - SESSION_SECRET=${SESSION_SECRET}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: felicity_hills
      POSTGRES_USER: ${PGUSER}
      POSTGRES_PASSWORD: ${PGPASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Option 3: Cloud Platforms

#### Vercel (Frontend + Serverless)
- Deploy frontend to Vercel
- Use Vercel Postgres for database
- Configure environment variables in Vercel dashboard

#### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your_session_secret
heroku config:set SENDGRID_API_KEY=your_sendgrid_key
git push heroku main
```

#### DigitalOcean App Platform
- Connect your Git repository
- Configure environment variables
- Add PostgreSQL database addon

## Files to Upload

When deploying to your own server, include these files:
- All source code files
- `package.json` and `package-lock.json`
- `.env` file (with your production values)
- `public/` directory with PDFs and assets
- Built application files

**Exclude these files/folders:**
- `node_modules/` (install via npm)
- `.git/` directory
- Development environment files
- Any local database files

## Post-Deployment Steps

1. **Test the application** - Visit your domain and verify all features work
2. **Set up monitoring** - Use tools like PM2 logs, New Relic, or DataDog
3. **Configure backups** - Set up automated database backups
4. **Set up SSL** - Ensure HTTPS is properly configured
5. **Monitor performance** - Set up uptime monitoring

## File Structure for Deployment

```
your-domain.com/
├── package.json
├── package-lock.json
├── .env (production values)
├── server/
├── client/
├── shared/
├── public/
│   ├── pdfs/
│   └── brochures/
└── node_modules/ (created by npm install)
```

## Troubleshooting

### Common Issues:
1. **Database connection errors** - Check DATABASE_URL and firewall settings
2. **Email not sending** - Verify SENDGRID_API_KEY and domain authentication
3. **Static files not loading** - Ensure public directory is properly configured
4. **CORS issues** - Configure proper domain settings in environment variables

### Log Locations:
- Application logs: PM2 logs or server console
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: Database server logs

## Security Considerations

1. **Use HTTPS** - Always enable SSL/TLS
2. **Secure headers** - Configure security headers in Nginx
3. **Database security** - Use strong passwords and restrict access
4. **Environment variables** - Never commit secrets to version control
5. **Regular updates** - Keep dependencies and server updated

## Performance Optimization

1. **Enable gzip compression** in Nginx
2. **Set up CDN** for static assets
3. **Configure caching** headers
4. **Monitor database performance**
5. **Use connection pooling** for database

For additional support, refer to your hosting provider's documentation or contact their support team.