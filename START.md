# Quick Start - SINT Dashboard

## 🚀 Already Running!

**API:** http://localhost:3000  
**Web:** http://localhost:5173  
**Database:** `apps/api/data/sint_dashboard.db` (SQLite)

---

## 📋 What You Have

✅ **5 sample tasks** (2x P0, 2x P1, 1x P2 done)  
✅ **User account:** illia@sint.ai / test123  
✅ **First cost tracked:** $0.33 for building this dashboard  
✅ **Login UI** - No more manual token setting!

---

## 🎯 Access the Dashboard

### Option 1: Login with UI (Easiest)

1. Open http://localhost:5173
2. Click "Login"
3. Email: `illia@sint.ai`
4. Password: `test123`
5. Done!

### Option 2: Create New Account

1. Open http://localhost:5173
2. Click "Sign Up"
3. Enter your details
4. Auto-logged in!

---

## 📊 What's In There

**Tasks in Backlog:**
- Build $SINT token contract (P0, 80h)
- GT Protocol trading agent (P0, 40h)
- Complete MCP Marketplace MVP (P1, 60h)
- Add test coverage (P1, 20h)

**Tasks Done:**
- Build dashboard (P2, 6h) - This session!

**Costs Tracked:**
- $0.33 for claude-sonnet-4-5 (50K input + 12K output tokens)

---

## 🎨 Features to Try

1. **Drag tasks** between columns (Backlog → In Progress → Review → Done)
2. **Click any card** to edit title, description, priority, tags, etc.
3. **+ button** (bottom right) for quick task creation
4. **Analytics panel** (top right) shows today/week costs, model breakdown
5. **Real-time updates** - Open in 2 tabs, changes sync instantly!

---

## 💰 Track More Costs

```bash
# Example: Track another session
curl -X POST http://localhost:3000/api/costs \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "24c39cfb-a8d6-4610-a1e4-a4488d58b4f3",
    "model": "claude-sonnet-4-5",
    "input_tokens": 20000,
    "output_tokens": 3000,
    "cost_usd": 0.105,
    "session_key": "agent:main:main"
  }'
```

Dashboard updates in real-time!

See `INTEGRATION.md` for automation options.

---

## 🛠️ Development

### Restart Servers

```bash
# If servers crashed:
cd sint-dashboard

# Terminal 1
npm run dev:api

# Terminal 2
npm run dev:web
```

### Reset Database

```bash
rm apps/api/data/sint_dashboard.db
# Restart API - fresh database!
```

### Check Logs

API logs show in Terminal 1 (JSON format)

---

## ✅ What Works

- ✅ Full authentication (signup/login/logout)
- ✅ Kanban board with drag-and-drop
- ✅ Task CRUD (create, edit, delete, move)
- ✅ Cost tracking & analytics
- ✅ Real-time WebSocket updates
- ✅ Dark mode support
- ✅ Mobile responsive

## 📈 What's Next

Add these yourself or wait for me to build:
- Charts (daily cost line, priority pie)
- Filters (search, tags, priority)
- Export tasks to CSV
- Time tracking (start/stop timer)
- Subtasks & comments

---

**Enjoy tracking your AI agent work!** 🎯
