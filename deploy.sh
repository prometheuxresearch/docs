#!/bin/bash

# EC2 Deployment Script for Prometheux Docs
set -e

echo "🚀 Starting Prometheux Docs deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    cp deploy/production.env.example .env.local
    echo "📝 Please edit .env.local with your Azure OpenAI key:"
    echo "   nano .env.local"
    echo "   Set AZURE_OPENAI_KEY=your_actual_key_here"
    read -p "Press Enter after you've configured .env.local..."
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Build and start
echo "🔨 Building and starting containers..."
docker-compose up -d --build

# Wait for startup
echo "⏳ Waiting for application to start..."
sleep 10

# Health check
echo "🏥 Running health check..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access at: http://localhost:3000"
    echo "📊 Container status:"
    docker-compose ps
else
    echo "❌ Application failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your domain (chat-docs.prometheux.ai) to point to this EC2"
echo "2. Set up Nginx proxy (see deploy/README.md)"
echo "3. Configure SSL with Let's Encrypt" 