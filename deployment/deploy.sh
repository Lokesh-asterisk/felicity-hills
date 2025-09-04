#!/bin/bash

# ===========================================
# FELICITY HILLS - AWS DEPLOYMENT SCRIPT
# ===========================================

echo "🚀 Starting Felicity Hills deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the frontend
echo "🏗️ Building frontend..."
npm run build

# Database setup
echo "🗄️ Setting up database..."
npm run db:push

# Start the application
echo "🌟 Starting application on port 5000..."
npm start

echo "✅ Deployment complete!"
echo "🌐 Application running at: http://your-ec2-ip:5000"