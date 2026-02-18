# SINT Dashboard - Quick Start (SQLite)

## ✅ Zero Setup Required

This dashboard now uses **SQLite** - no database server needed!

## 1. Start the Dashboard

```bash
cd sint-dashboard

# Terminal 1: API (auto-creates database)
npm run dev:api

# Terminal 2: Web app
npm run dev:web
```

Open **http://localhost:5173**

## 2. Create Your First User

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "illia@sint.ai",
    "password": "your-password",
    "name": "Illia"
  }'
```

Copy the `token` from the response and save it.

## 3. Login in Browser

For now, set the token manually in browser console:

```javascript
localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE');
location.reload();
```

*(Auth UI coming soon - for now API-only)*

## 4. Create Your First Task

Once logged in, click the **+** button (bottom right) and create a task!

## 5. Track Costs from OpenClaw

To log costs from your AI agent:

```bash
curl -X POST http://localhost:3000/api/costs \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "YOUR_TASK_UUID",
    "model": "claude-sonnet-4-5",
    "input_tokens": 15000,
    "output_tokens": 2000,
    "cost_usd": 0.123,
    "session_key": "agent:main:main"
  }'
```

The dashboard updates in real-time via WebSocket!

## Database Location

SQLite database is created at: `apps/api/data/sint_dashboard.db`

**Backup:** Just copy this file  
**Reset:** Delete it and restart API

## Environment Variables

Optional - create `apps/api/.env`:

```bash
DATABASE_PATH=./data/sint_dashboard.db  # Default location
JWT_SECRET=your-secret-key-here         # Change in production
CORS_ORIGIN=http://localhost:5173      # Frontend URL
PORT=3000
HOST=0.0.0.0
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database locked error
Close any SQLite browser/editor viewing the database.

### Can't find auth token
Check browser console → Application → Local Storage → `auth_token`

## Features

- ✅ Kanban board (drag-and-drop)
- ✅ Task CRUD (create, edit, delete)
- ✅ Cost tracking & analytics
- ✅ Real-time updates (WebSocket)
- ✅ Dark mode
- ✅ Mobile responsive

## What's Next?

1. Build auth UI (login/signup forms)
2. Add charts (daily cost, priority breakdown)
3. Add filters (search, tags, priority)
4. Export tasks to CSV
5. Time tracking

## Migrating to PostgreSQL Later

When you need multi-user or deploy to production:

1. Set `DATABASE_URL` in `.env`
2. Change `drizzle.config.ts` dialect to `postgresql`
3. Update `src/db/index.ts` to use postgres
4. Run migrations
5. Done!

Drizzle ORM makes this painless.

---

**Have fun tracking your AI agent tasks!** 🚀
