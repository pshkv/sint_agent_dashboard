#!/bin/bash

# Railway Setup Script for SINT Agent Dashboard

echo "🚀 Setting up Railway services..."

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

echo "✅ Generated JWT_SECRET"

# Setup instructions
cat <<EOF

📋 RAILWAY SETUP INSTRUCTIONS
============================

Your GitHub repository is ready: https://github.com/pshkv/sint_agent_dashboard

Next steps to complete Railway deployment:

1. Go to: https://railway.com/project/fcf42f90-dc1d-44e6-b7ef-733a69d2edba
2. Click "+ New Service" → "GitHub Repository"  
3. Configure GitHub App to access pshkv/sint_agent_dashboard
4. Select the repository

5. ADD API SERVICE:
   - Name: "API"
   - Root Directory: apps/api
   - Environment Variables:
     * JWT_SECRET=${JWT_SECRET}
     * DATABASE_PATH=/data/sint_dashboard.db
     * PORT=3000
     * HOST=0.0.0.0
     * CORS_ORIGIN=\${RAILWAY_PUBLIC_DOMAIN} (will be set after Web deploys)

6. ADD WEB SERVICE:
   - Name: "Web"
   - Root Directory: apps/web
   - Environment Variables:
     * VITE_API_URL=https://\${API_PUBLIC_DOMAIN}
     * VITE_WS_URL=wss://\${API_PUBLIC_DOMAIN}/ws

7. Generate public domains for both services in Railway settings

8. Update API CORS_ORIGIN with the Web service domain

GENERATED SECRETS (save these):
==============================
JWT_SECRET=${JWT_SECRET}

EOF
