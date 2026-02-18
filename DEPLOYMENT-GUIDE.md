# Deployment Guide - SINT Operator Dashboard
**Version:** 1.0  
**Last Updated:** 2026-02-15

---

## Quick Deploy Options

### Option 1: Vercel (Recommended)
**Best for:** Production deployment, custom domains, automatic SSL  
**Time:** 5 minutes  
**Cost:** Free (Hobby plan)

```bash
# 1. Install Vercel CLI (if not already)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from apps/web directory
cd apps/web
vercel

# 4. Follow prompts:
# - Project name: sint-operator-dashboard
# - Build command: npm run build
# - Output directory: dist
# - Install command: cd ../.. && npm install

# 5. Production deployment
vercel --prod
```

**Environment Variables:**
- `VITE_GATEWAY_URL` (optional): Custom Gateway URL (default: ws://127.0.0.1:18789)

**Post-Deployment:**
- URL: https://sint-operator-dashboard.vercel.app (or custom domain)
- SSL: Automatic
- CDN: Global edge network
- Analytics: Vercel Analytics (optional)

---

### Option 2: Netlify
**Best for:** Simple static hosting, form handling  
**Time:** 5 minutes  
**Cost:** Free (Starter plan)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
cd apps/web
netlify deploy

# 4. Production deploy
netlify deploy --prod

# 5. Build settings:
# - Build command: npm run build
# - Publish directory: dist
# - Base directory: apps/web
```

**Netlify Config (netlify.toml):**
```toml
[build]
  base = "apps/web"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

### Option 3: Cloudflare Pages
**Best for:** Global CDN, DDoS protection, Workers integration  
**Time:** 5 minutes  
**Cost:** Free (unlimited bandwidth)

```bash
# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Login
wrangler login

# 3. Deploy
cd apps/web
npm run build
wrangler pages deploy dist --project-name=sint-operator-dashboard

# 4. Configure build:
# - Build command: npm run build
# - Build output directory: dist
# - Root directory: apps/web
```

**Cloudflare Pages Config:**
```yaml
# wrangler.toml
name = "sint-operator-dashboard"
pages_build_output_dir = "dist"
compatibility_date = "2024-01-01"
```

---

### Option 4: Railway (Full Stack)
**Best for:** Deploying API + Web together  
**Time:** 10 minutes  
**Cost:** $5/month (Hobby plan)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up

# 5. Configure services:
# Service 1 (API):
#   - Build command: npm run build --workspace=apps/api
#   - Start command: npm run start --workspace=apps/api
# Service 2 (Web):
#   - Build command: npm run build --workspace=apps/web
#   - Start command: npm run preview --workspace=apps/web
```

---

### Option 5: Cloudflare Tunnel (Development/Testing)
**Best for:** Temporary public URLs, testing, demos  
**Time:** 1 minute  
**Cost:** Free

```bash
# Already running!
# PID: 11919
# URL: https://groundwater-treated-prairie-health.trycloudflare.com

# To restart:
cd apps/web
npm run dev -- --host 0.0.0.0 --port 5174 &
cloudflared tunnel --url http://localhost:5174
```

**Note:** URL changes on tunnel restart. Not for production.

---

## Current Status

### ✅ What's Deployed (Development)
**URL:** https://groundwater-treated-prairie-health.trycloudflare.com  
**Type:** Cloudflare Tunnel (temporary)  
**Status:** Running  
**Local:** http://localhost:5174

### 🔄 What Needs Deployment (Production)
**Target:** Vercel or Cloudflare Pages  
**Domain:** TBD (can use custom domain)  
**SSL:** Automatic  
**CDN:** Global

---

## Deployment Checklist

### Pre-Deployment
- [x] Build passes (zero TypeScript errors)
- [x] All features tested
- [x] Mobile responsive
- [x] Documentation complete
- [ ] Environment variables configured
- [ ] Custom domain ready (optional)
- [ ] Analytics setup (optional)

### Post-Deployment
- [ ] Production URL verified
- [ ] SSL certificate active
- [ ] CDN caching working
- [ ] Error tracking setup
- [ ] Uptime monitoring configured
- [ ] Analytics integrated
- [ ] SEO meta tags added
- [ ] Social preview images

---

## Environment Variables

### Required
None! Dashboard works with default Gateway URL (ws://127.0.0.1:18789)

### Optional
```bash
# Custom Gateway URL
VITE_GATEWAY_URL=wss://gateway.example.com

# Analytics
VITE_POSTHOG_KEY=phc_xxxxxxxxxx
VITE_GA_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_COLLAB=true
VITE_ENABLE_MARKETPLACE=true
```

---

## Custom Domain Setup

### Vercel
```bash
# Add domain
vercel domains add dashboard.sint.ai

# Configure DNS
# CNAME: dashboard -> cname.vercel-dns.com
```

### Cloudflare Pages
```bash
# Add custom domain in dashboard
# Update DNS records automatically
```

### Netlify
```bash
# Add domain
netlify domains:add dashboard.sint.ai

# Configure DNS
# CNAME: dashboard -> xxxxx.netlify.app
```

---

## Performance Optimization

### Current Stats
- **Bundle Size:** 410KB JS (114KB gzipped)
- **CSS:** 53KB (10KB gzipped)
- **First Load:** ~2s (on CDN)
- **Lighthouse Score:** 95+ (estimated)

### Optimizations Applied
- ✅ Code splitting (Vite automatic)
- ✅ Asset compression (gzip)
- ✅ CSS purging (Tailwind)
- ✅ Tree shaking (Vite)
- ✅ Lazy loading (React.lazy)

### Further Optimizations (Optional)
- [ ] Brotli compression (Cloudflare automatic)
- [ ] Image optimization (WebP)
- [ ] Font subsetting
- [ ] Service worker (PWA)
- [ ] Route-based code splitting

---

## Monitoring & Analytics

### Recommended Tools

**Uptime Monitoring:**
- UptimeRobot (free)
- Pingdom
- Checkly

**Error Tracking:**
- Sentry (free tier)
- LogRocket
- Rollbar

**Analytics:**
- PostHog (open source)
- Plausible (privacy-first)
- Google Analytics 4

**Performance:**
- Vercel Analytics (built-in)
- Cloudflare Web Analytics (free)
- PageSpeed Insights

---

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Netlify
```bash
# List deploys
netlify deploy:list

# Restore deploy
netlify deploy:restore [deploy-id]
```

### Railway
```bash
# Rollback via web UI
# https://railway.app/dashboard
```

---

## Security Checklist

- [x] HTTPS enforced
- [x] CSP headers configured
- [x] XSS protection headers
- [x] Frame options set
- [ ] Rate limiting (if using API)
- [ ] CORS configured properly
- [ ] Auth tokens secure (if added)
- [ ] Environment variables encrypted

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules
npm install
npm run build
```

### WebSocket Connection Fails
- Check VITE_GATEWAY_URL environment variable
- Verify Gateway is running (ws://127.0.0.1:18789)
- Check browser console for CORS errors
- Try Demo Mode (connects to mock data)

### Assets Not Loading
- Clear browser cache
- Check CDN cache (might take 5-10 minutes)
- Verify build output directory
- Check nginx/server config

### Slow Performance
- Enable CDN caching
- Compress assets (gzip/brotli)
- Use HTTP/2 push
- Add service worker
- Optimize images

---

## Cost Estimates

### Free Tier (Hobby)
- **Vercel:** Free (100GB bandwidth)
- **Netlify:** Free (100GB bandwidth)
- **Cloudflare Pages:** Free (unlimited bandwidth)
- **Total:** $0/month

### Production Tier
- **Vercel Pro:** $20/month (1TB bandwidth)
- **Netlify Pro:** $19/month (400GB bandwidth)
- **Cloudflare Pages Pro:** Free (unlimited)
- **Railway:** $5/month (if using API)
- **Total:** $5-20/month

### Custom Domain
- **Domain:** $12/year (.ai domain)
- **SSL:** Free (Let's Encrypt)
- **Total:** $1/month

---

## One-Command Deploy

### Vercel (Fastest)
```bash
cd apps/web && vercel --prod
```

### Netlify
```bash
cd apps/web && netlify deploy --prod
```

### Cloudflare Pages
```bash
cd apps/web && npm run build && wrangler pages deploy dist
```

---

## Post-Deployment Tasks

### 1. Update Documentation
```bash
# Update README.md with production URL
# Update MEMORY.md with deployment details
```

### 2. Announce Launch
```bash
# Twitter: "Just deployed SINT Operator Dashboard! 🚀"
# LinkedIn: Share with demo link
# Product Hunt: Submit with production URL
```

### 3. Monitor First 24h
- [ ] Check error rates (Sentry)
- [ ] Monitor uptime (UptimeRobot)
- [ ] Track analytics (PostHog)
- [ ] Review performance (Lighthouse)
- [ ] Collect user feedback

### 4. Iterate
- [ ] Fix critical bugs
- [ ] Polish UI based on feedback
- [ ] Add requested features
- [ ] Optimize performance

---

**Next Steps:**
1. Choose deployment platform (Vercel recommended)
2. Run one-command deploy
3. Configure custom domain (optional)
4. Set up monitoring
5. Announce launch 🚀

**Support:**
- Docs: See README.md, QUICK-START.md, USER-GUIDE.md
- Issues: GitHub issues or Discord
- Email: i@pshkv.com
