# SINT Agent Dashboard - Deployment Status

## ✅ Completed

1. **GitHub Repository Created**
   - Repository: https://github.com/pshkv/sint_agent_dashboard
   - All code pushed successfully
   - Branch: `main`

2. **Railway Project Created**
   - Project: SINT Agent Dashboard
   - Dashboard: https://railway.com/project/fcf42f90-dc1d-44e6-b7ef-733a69d2edba
   - Environment: production
   - Workspace: SINT

3. **Security Credentials Generated**
   - JWT_SECRET: `FbdTA459152DsIINxdUZwi4Qc0gckewXasL4iklC1SY=`

## 🔄 In Progress / Next Steps

### Railway Service Setup

You need to manually add two services in Railway:

#### Service 1: API Backend

1. Go to the Railway project dashboard
2. Click "+ New Service" or the canvas area
3. Select "GitHub Repository"
4. If prompted, configure GitHub App to access `pshkv/sint_agent_dashboard`
5. Select the repository
6. Configure:
   - **Name:** API
   - **Root Directory:** `apps/api`
   - **Build Command:** (auto-detected from railway.json)
   - **Start Command:** (auto-detected from railway.json)

7. Add Environment Variables:
   ```
   JWT_SECRET=FbdTA459152DsIINxdUZwi4Qc0gckewXasL4iklC1SY=
   DATABASE_PATH=/data/sint_dashboard.db
   PORT=3000
   HOST=0.0.0.0
   ```

8. Generate a public domain (Settings → Networking → Generate Domain)
9. Note the API domain for the Web service configuration

#### Service 2: Web Frontend

1. Click "+ New Service" again
2. Select the same GitHub repository (pshkv/sint_agent_dashboard)
3. Configure:
   - **Name:** Web
   - **Root Directory:** `apps/web`
   - **Build Command:** (auto-detected from railway.json)
   - **Start Command:** (auto-detected from railway.json)

4. Add Environment Variables (replace `<API_DOMAIN>` with actual domain from step 1):
   ```
   VITE_API_URL=https://<API_DOMAIN>
   VITE_WS_URL=wss://<API_DOMAIN>/ws
   ```

5. Generate a public domain (Settings → Networking → Generate Domain)
6. Note the Web domain

#### Final Configuration

1. Go back to the API service
2. Add/update environment variable:
   ```
   CORS_ORIGIN=https://<WEB_DOMAIN>
   ```

3. Both services should automatically deploy

## 📦 Local Development

To run locally:

```bash
# Install dependencies
npm install

# Run both services
./RUN-SERVERS.sh

# Or run individually:
npm run dev --workspace=apps/api
npm run dev --workspace=apps/web
```

## 🔗 URLs (After Deployment)

- **GitHub:** https://github.com/pshkv/sint_agent_dashboard
- **Railway Project:** https://railway.com/project/fcf42f90-dc1d-44e6-b7ef-733a69d2edba
- **API:** https://<API_DOMAIN> (to be generated)
- **Web:** https://<WEB_DOMAIN> (to be generated)

## 📝 Notes

- Database will be SQLite, stored in `/data/sint_dashboard.db`
- Nixpacks builder is configured via `railway.json` files
- CORS is configured to allow the Web domain only
- WebSocket support is enabled for real-time features
