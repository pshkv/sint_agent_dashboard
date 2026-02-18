# SINT Operator Dashboard - Quick Start

**Get up and running in 5 minutes**

---

## 🚀 Launch

**Live Demo:**
```
Open: https://groundwater-treated-prairie-health.trycloudflare.com
```

**Local Development:**
```bash
cd ~/.openclaw/workspace/sint-dashboard/apps/web
npm run dev
# Opens at http://localhost:5174
```

---

## 📱 Interface

### Desktop
```
┌──────────────┬─────────────────┬──────────────┐
│   AGENTS     │    CONTROL      │   METRICS    │
│   (Left)     │    (Center)     │   (Right)    │
└──────────────┴─────────────────┴──────────────┘
```

### Mobile
```
Bottom Nav: [👥 Agents] [💬 Control] [📊 Metrics]
Swipe left/right to switch panels
```

---

## ⚡ Top 5 Features

### 1️⃣ Chat with Agents
1. Go to **Control** → **Chat** tab
2. Type message → Press Enter
3. Agent responds with streaming text
4. **Search:** Click search icon, filter by role/date/tools
5. **Export:** Click Export → Choose format (MD/JSON/TXT)

### 2️⃣ Build Workflows
1. Go to **Control** → **Workflow** tab
2. Click **Build** mode
3. Click **Templates** → Choose template
4. Drag nodes to customize
5. Click **Save** → Click **Run**

**4 Templates:**
- Sequential Agents (linear chain)
- Parallel Processing (concurrent)
- Conditional Routing (dynamic)
- Research Pipeline (multi-source)

### 3️⃣ Monitor Performance
1. Go to **Metrics** tab (right panel / mobile Metrics)
2. View dashboard:
   - **Total Cost** - All-time spending
   - **Success Rate** - Task completion %
   - **Charts** - Cost over time, by model, by agent
3. Click time ranges: 1h / 24h / 7d / 30d

### 4️⃣ Set Policies
1. Go to **Policy** tab (right panel / mobile Metrics)
2. Click **Templates**
3. Choose policy:
   - 💰 Daily Budget Limit
   - 🔒 Shell Command Approval
   - 💎 Expensive Operation Approval
4. Configure limits
5. Click **Save** → Policy now active

### 5️⃣ Inspect Traces
1. Go to **Trace** tab (right panel / mobile Metrics)
2. See execution tree (Session → Turn → Span)
3. Click **Timeline** for bar chart view
4. **Filter:** Click filter icon → Select status/tools/cost
5. **Export:** Click Export → Download JSON

---

## 🎮 Controls

### Navigation
- **Desktop:** Click panel buttons at bottom corners
- **Mobile:** Tap bottom nav icons or swipe

### Modes
- **Demo Mode ON:** Explore with mock data
- **Demo Mode OFF:** Connect to OpenClaw Gateway

### Tabs (Center Panel)
- 💬 **Chat** - Conversation interface
- 🎨 **Canvas** - Visual UI builder (A2UI)
- 🔀 **Workflow** - Agent orchestration

### Tabs (Right Panel)
- 📊 **Metrics** - Performance dashboard
- 🔍 **Trace** - Execution visualization
- 🛡️ **Policy** - Rule management
- 📋 **Audit** - Activity log
- 🧠 **Memory** - M0-M3 tier inspector

---

## ⌨️ Shortcuts

**Global:**
- `Esc` - Close modals
- `1/2/3` - Switch center tabs

**Chat:**
- `Cmd+Enter` - Send message
- `Cmd+F` - Search
- `Cmd+E` - Export

**Workflow:**
- `Space+Drag` - Pan canvas
- `Del` - Delete node
- `Cmd+D` - Duplicate
- `Cmd+S` - Save
- `Cmd+R` - Run

---

## 🎯 Common Tasks

### Search Conversations
```
Chat → Search icon → Type query → Apply filters → View results
```

### Create Workflow from Template
```
Workflow → Build → Templates → Select → Customize → Save → Run
```

### Set Budget Limit
```
Policy → Templates → Daily Budget Limit → Set $10 → Save
```

### Debug Failed Task
```
Trace → Filter: Error → Expand trace → Check span details
```

### Export Chat History
```
Chat → Export → Markdown → Include timestamps ✓ → Export
```

---

## 📊 What Each Panel Does

| Panel | Purpose | Key Actions |
|-------|---------|-------------|
| **Agents** | Monitor agent status & stats | View performance, check integrations |
| **Chat** | Interact with agents | Send messages, search, export, approve actions |
| **Canvas** | Build visual UIs | Create forms, buttons, inputs (A2UI) |
| **Workflow** | Orchestrate multi-agent tasks | Build flows, use templates, run workflows |
| **Metrics** | Track costs & performance | View charts, monitor budget, analyze trends |
| **Trace** | Debug executions | Inspect spans, filter errors, view timeline |
| **Policy** | Set rules & limits | Create policies, enable/disable, view violations |
| **Audit** | Review activity log | Export logs, track changes |
| **Memory** | Inspect agent memory | Search tiers, view promotions, check timeline |

---

## 🔥 Pro Tips

💡 **Start with Demo Mode** - Explore features risk-free

💡 **Use Templates** - Don't build workflows from scratch

💡 **Set Budget Policies** - Avoid cost surprises

💡 **Export Regularly** - Keep records of conversations

💡 **Filter Traces** - Find issues faster

💡 **Check Metrics Daily** - Catch anomalies early

💡 **Name Things Clearly** - "Research Agent" > "Agent 1"

💡 **Use Keyboard Shortcuts** - 10x faster workflow

---

## 🆘 Troubleshooting

**Dashboard won't load?**
→ Refresh (Cmd+R), clear cache (Cmd+Shift+R)

**Gateway won't connect?**
→ Check OpenClaw running: `openclaw status`

**Chat not responding?**
→ Check agent status (Agent Registry), verify connection

**Workflow won't run?**
→ Save first, check all nodes have required fields

**Mobile layout broken?**
→ Refresh, rotate device, update browser

---

## 📚 Learn More

**Full Guide:** `USER-GUIDE.md` (18KB, comprehensive)

**Technical Docs:**
- `OPERATOR-README.md` - Architecture
- `*-COMPLETE.md` - Feature documentation
- `DAY-1-COMPLETE.md` - Build summary

**Community:**
- Discord: https://discord.com/invite/clawd
- Docs: https://docs.openclaw.ai
- GitHub: https://github.com/openclaw/openclaw

---

## ⏱️ 5-Minute Challenge

**Try this flow:**

1. **Chat** → Send "Hello, test message"
2. **Workflow** → Build → Templates → Sequential Agents
3. **Metrics** → View cost charts
4. **Policy** → Templates → Daily Budget Limit ($10)
5. **Trace** → Filter by Success → Export JSON
6. **Chat** → Search "test" → Export Markdown

**Congrats!** You've used 6 major features. 🎉

---

**Ready to dive deeper?** → Open `USER-GUIDE.md`

**Need help?** → Discord #help or GitHub Issues

---

Built for AI Agent Operators | v1.0.0 | 2026-02-14
