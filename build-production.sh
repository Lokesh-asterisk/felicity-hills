#!/bin/bash

# Production Build Script for Felicity Hills Agricultural Investment Platform

echo "🌱 Building Felicity Hills Platform for Production..."

# Create production directory
mkdir -p dist
mkdir -p dist/public

# Install production dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build client (React frontend)
echo "🏗️ Building client application..."
npm run build

# Copy server files
echo "📋 Copying server files..."
cp -r server dist/
cp -r shared dist/
cp -r public dist/

# Copy configuration files
echo "⚙️ Copying configuration files..."
cp package-production.json dist/package.json
cp drizzle.config.ts dist/
cp tsconfig.json dist/

# Copy essential files
echo "📄 Copying essential files..."
cp README.md dist/ 2>/dev/null || true
cp DEPLOYMENT.md dist/ 2>/dev/null || true

# Create start script
cat > dist/start.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
node server/index.js
EOF

chmod +x dist/start.sh

# Create environment template
cat > dist/.env.example << 'EOF'
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

# Domain Configuration (if using Replit Auth)
REPLIT_DOMAINS=yourdomain.com,www.yourdomain.com
ISSUER_URL=https://replit.com/oidc
REPL_ID=your_repl_id_if_using_replit_auth
EOF

echo "✅ Production build completed!"
echo ""
echo "📁 Production files are in: ./dist/"
echo "📖 Deployment guide: ./dist/DEPLOYMENT.md"
echo "⚙️ Environment template: ./dist/.env.example"
echo ""
echo "Next steps:"
echo "1. Copy the 'dist' folder to your server"
echo "2. Configure environment variables (.env)"
echo "3. Install Node.js 18+ and PostgreSQL"
echo "4. Run: npm install"
echo "5. Start: npm start"
echo ""
echo "🌐 Your agricultural investment platform is ready for deployment!"