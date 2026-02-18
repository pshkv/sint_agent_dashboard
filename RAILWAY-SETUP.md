# Railway Deployment Setup - SINT Dashboard

## ✅ Completed Steps

1. **Project Created:** `sint-dashboard`
   - URL: https://railway.com/project/527c186b-9207-4b32-83e3-b693206b201c
   - Workspace: SINT

2. **Services Created:**
   - `api` - Backend service
   - `web` - Frontend service
   
3. **Database Added:**
   - PostgreSQL (auto-provisioned)

## 🔧 Configuration Required

### Service: `api` (Backend)

**Via Railway Dashboard:**
1. Go to https://railway.com/project/527c186b-9207-4b32-83e3-b693206b201c
2. Select `api` service
3. Go to Settings → Deploy
4. Configure:
   - **Root Directory:** `apps/api`
   - **Build Command:** `npm install && npm run build --workspace=apps/api`
   - **Start Command:** `npm run start --workspace=apps/api`
   - **Watch Paths:** `apps/api/**`, `packages/**`

**Environment Variables (Settings → Variables):**
```bash
# Database (auto-injected by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# API Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# JWT Secret (generate a secure random string)
JWT_SECRET=<generate-secure-random-string>

# CORS (set to your frontend URL after web deployment)
CORS_ORIGIN=https://your-web-app.railway.app
```

### Service: `web` (Frontend)

**Via Railway Dashboard:**
1. Select `web` service
2. Go to Settings → Deploy
3. Configure:
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm install && npm run build --workspace=apps/web`
   - **Start Command:** `npm install -g serve && serve -s dist -l 3000`
   - **Watch Paths:** `apps/web/**`, `packages/**`

**Environment Variables:**
```bash
# API URL (set after API deployment)
VITE_API_URL=https://your-api.railway.app

# Gateway URL (optional, for WebSocket)
VITE_GATEWAY_URL=ws://127.0.0.1:18789
```

### Database: PostgreSQL

**Connection:**
- Railway auto-injects `DATABASE_URL` into services
- Link the database to the `api` service:
  1. Go to `api` service → Variables
  2. Click "Add Variable Reference"
  3. Select `Postgres` → `DATABASE_URL`

**Migration:**
Before first deployment, you need to migrate the database from SQLite to PostgreSQL:

1. **Update API to use PostgreSQL:**
   ```bash
   cd apps/api
   npm install pg
   ```

2. **Update `drizzle.config.ts`:**
   ```typescript
   import { defineConfig } from 'drizzle-kit';
   
   export default defineConfig({
     schema: './src/db/schema.ts',
     out: './drizzle',
     dialect: 'postgresql',
     dbCredentials: {
       url: process.env.DATABASE_URL!,
     },
   });
   ```

3. **Update database connection in `src/db/index.ts`:**
   ```typescript
   import { drizzle } from 'drizzle-orm/postgres-js';
   import postgres from 'postgres';
   import * as schema from './schema';
   
   const connectionString = process.env.DATABASE_URL!;
   const client = postgres(connectionString);
   export const db = drizzle(client, { schema });
   ```

4. **Run migrations:**
   ```bash
   npm run db:generate
   railway run npm run db:migrate
   ```

## 🚀 Deployment Steps

### Option A: Deploy via CLI

```bash
# 1. Link to API service
railway link --service api

# 2. Deploy API
railway up

# 3. Link to Web service
railway link --service web

# 4. Deploy Web
railway up
```

### Option B: Deploy via Git (Recommended)

1. **Connect GitHub Repository:**
   - Go to Railway dashboard
   - Select each service
   - Settings → Deploy → Connect to GitHub repo
   - Select branch: `main`
   - Set root directory: `apps/api` or `apps/web`

2. **Push to trigger deployment:**
   ```bash
   git add .
   git commit -m "Configure Railway deployment"
   git push origin main
   ```

## 📋 Post-Deployment Checklist

- [ ] API service deployed successfully
- [ ] Web service deployed successfully
- [ ] Database migrations ran
- [ ] Environment variables configured
- [ ] API health check passes: `https://your-api.railway.app/health`
- [ ] Web app loads: `https://your-web.railway.app`
- [ ] WebSocket connection works (if using Gateway)
- [ ] CORS configured correctly
- [ ] Custom domains added (optional)

## 🔗 Service URLs

After deployment, Railway will generate URLs:
- **API:** `https://api-production-xxxx.up.railway.app`
- **Web:** `https://web-production-xxxx.up.railway.app`
- **Database:** Internal URL (auto-connected)

Update the frontend environment variable `VITE_API_URL` with the actual API URL.

## 💰 Cost Estimate

Railway Pricing (Hobby Plan):
- **Base:** $5/month
- **Usage:** $0.000231/GB-hour (CPU/Memory)
- **Database:** Included in usage

**Estimated Monthly Cost:** $10-20/month for both services + database

## 🐛 Troubleshooting

### Build Fails
```bash
# Check logs
railway logs --service api
railway logs --service web

# Redeploy
railway up --service api
```

### Database Connection Issues
```bash
# Verify DATABASE_URL is set
railway variables --service api

# Test connection
railway run --service api npm run db:push
```

### CORS Errors
- Verify `CORS_ORIGIN` in API matches web URL
- Check browser console for exact error
- Update API environment variable

## 📚 Resources

- Railway Docs: https://docs.railway.app
- Monorepo Guide: https://docs.railway.app/guides/monorepo
- Nixpacks: https://nixpacks.com

---

**Next Steps:**
1. Complete environment variable configuration
2. Update database connection to PostgreSQL
3. Deploy both services
4. Test end-to-end functionality
5. Add custom domains (optional)
