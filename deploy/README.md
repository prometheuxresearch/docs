# Dual Deployment Architecture

## Overview

This project supports a **dual deployment strategy**:

1. **📖 Documentation Site**: `https://docs.prometheux.ai` (CloudFront + S3)
   - Static documentation only
   - Fast global CDN delivery
   - No server-side functionality

2. **🤖 Chat API Server**: `https://chat-docs.prometheux.ai` (EC2 + Docker) 
   - Full Node.js application with chat API
   - Handles AI requests and RAG functionality
   - Serves the same content but with live chat

## Architecture Flow

```
User visits docs.prometheux.ai (Static S3)
   ↓
Clicks chat button
   ↓
Frontend makes API call to chat-docs.prometheux.ai (EC2)
   ↓
EC2 processes request with AI + RAG
   ↓
Response streamed back to static site
```

## EC2 Deployment Guide

### Prerequisites

1. **EC2 Instance**: Ubuntu 22.04 or similar (t3.medium recommended)
2. **Docker & Docker Compose**: Installed on EC2
3. **Domain**: `chat-docs.prometheux.ai` pointing to EC2 Elastic IP
4. **SSL Certificate**: For HTTPS (Let's Encrypt)

### Deployment Steps

### 1. Clone Repository
```bash
cd /opt
sudo git clone https://github.com/prometheuxresearch/docs.git prometheux-docs
cd prometheux-docs
```

### 2. Setup Environment
```bash
# Copy production environment template
cp deploy/production.env.example .env.local

# Edit with your Azure OpenAI key
sudo nano .env.local
# Set AZURE_OPENAI_KEY=your_actual_key_here
```

### 3. Deploy with Docker
```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 4. Configure Nginx (Required for SSL & Domain)
```nginx
# /etc/nginx/sites-available/chat-docs.prometheux.ai
server {
    listen 80;
    server_name chat-docs.prometheux.ai;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name chat-docs.prometheux.ai;
    
    # SSL configuration (Let's Encrypt will add these)
    
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
        
        # CORS headers for cross-origin requests from docs.prometheux.ai
        add_header Access-Control-Allow-Origin "https://docs.prometheux.ai" always;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

### 5. Enable Nginx Site
```bash
sudo ln -s /etc/nginx/sites-available/chat-docs.prometheux.ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL with Let's Encrypt
```bash
sudo certbot --nginx -d chat-docs.prometheux.ai
```

## Deployment Benefits

✅ **Static Site (docs.prometheux.ai)**:
- ⚡ Ultra-fast loading via CloudFront CDN
- 💰 Very low cost (S3 + CloudFront)
- 🔒 High availability and reliability
- 🌍 Global edge locations

✅ **Chat API (chat-docs.prometheux.ai)**:
- 🤖 Full AI chat functionality with RAG
- 🔄 Real-time streaming responses  
- 🛠️ Server-side API processing
- 🔑 Secure API key handling

## Testing the Setup

### 1. Test Static Site
```bash
curl -I https://docs.prometheux.ai
# Should return 200 OK from CloudFront
```

### 2. Test Chat API
```bash
curl -X POST https://chat-docs.prometheux.ai/api/docsChat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
# Should return streaming AI response
```

### 3. Test CORS
```bash
curl -H "Origin: https://docs.prometheux.ai" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://chat-docs.prometheux.ai/api/docsChat
# Should return CORS headers
```

## Monitoring & Maintenance

```bash
# Check EC2 container status
sudo docker-compose ps

# View chat API logs
sudo docker-compose logs -f prometheux-docs

# Restart if needed
sudo docker-compose restart

# Monitor nginx access logs
sudo tail -f /var/log/nginx/access.log
```

## Cost Optimization

- **Static Site**: ~$1-5/month (S3 + CloudFront)
- **Chat API**: ~$20-50/month (t3.medium EC2 + EBS)
- **Total**: Much cheaper than running full dynamic site on multiple servers 