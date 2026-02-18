# SINT Operator Dashboard

**Next-generation AI agent control panel** — 3-panel mission control for your AI workforce with trust-first governance, real-time observability, and consumer-grade UX.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Status](https://img.shields.io/badge/status-production--ready-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start API server
npm run dev:api

# Start web app (separate terminal)
npm run dev:web

# Open browser
open http://localhost:5173
```

**Default view:** SINT Operator (3-panel control center)  
**Toggle:** Top center button switches to legacy Kanban view

---

## 🎯 Key Features

### 🤖 Agent Registry (Left Panel)
- **Agent Roster:** Virtual employees with avatars, status, roles
  - 🟢 Active | 🔵 Idle | 🔴 Error | 🟡 Paused
  - Last active time + tasks completed
  - Current task preview
- **Quick Stats:** Agents active, tasks today, cost, health score
- **Integrations:** 8+ MCP server connections
  - Toggle on/off per agent
  - Health indicators (connected/degraded/down)
  - Gmail, Slack, Twitter, GitHub, Notion, Calendar, Solana, Perplexity
- **"Hire New Employee"** CTA button
- **Browse Marketplace** for skills

### 💬 Chat / Canvas / Workflow (Center Panel)
**Three tabs with keyboard shortcuts:**
- **Chat (⌘1):** AG-UI streaming chat
  - Real-time agent status ("Thinking…", "Executing…")
  - Tool call cards (expandable with input/output/duration)
  - Approval gates for dangerous actions
  - Voice input button
  - Code blocks with syntax highlighting
  
- **Canvas (⌘2):** A2UI-rendered interfaces
  - Agent-generated forms, buttons, inputs
  - Task overview cards
  - Interactive action surfaces
  - Split view support (chat + canvas)
  
- **Workflow (⌘3):** n8n-style visual node graph
  - Color-coded nodes (LLM, Tool, Decision, Approval, Output)
  - SVG connections
  - Real-time execution highlighting
  - Node detail sidebar with input/output

### 📊 Trace / Policy / Audit / Memory (Right Panel)
**Four tabs:**
- **Trace:** Hierarchical execution tree
  - Session → Turn → Span structure
  - Color-coded: 🟢 success | 🟡 slow (>2s) | 🔴 error
  - Expandable spans with full input/output
  - Token usage + cost per span
  - Time Travel button (replay any state)
  
- **Policy:** Governance dashboard
  - Budget meters (daily/weekly/monthly)
  - Active policies with toggle switches
  - Categories: Budget, Tools, Data, Output
  - Violation counters
  - ConsentPass status
  
- **Audit:** Immutable log
  - Timestamp | Agent | Action | Tool | Status | Cost
  - Hash-chained entries for compliance
  - Export to CSV
  - SOC2-ready badges
  
- **Memory:** M0-M3 tiered memory
  - M0: Ephemeral (current session)
  - M1: Session (persisted state)
  - M2: Agent (long-term MEMORY.md)
  - M3: Archive (daily notes)
  - Promotion indicators (M0→M1→M2)
  - Memory search across all tiers

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘1` | Switch to Chat |
| `⌘2` | Switch to Canvas |
| `⌘3` | Switch to Workflow |
| `⌘B` | Toggle Agent Panel (left) |
| `⌘T` | Toggle Trace Panel (right) |
| `⌘K` | Global Search |
| `⌘N` | New Session |
| `?` | Show shortcuts help |

**Windows/Linux:** Replace `⌘` with `Ctrl`

---

## 🔐 Approval Gates (Human-in-the-Loop)

When agents request dangerous actions:
- **Yellow warning card** with action description
- **Policy rule** that triggered the gate
- **Countdown timer** (configurable: 30s/60s/5min)
- **Three options:**
  - ✅ **Approve** — Execute as-is
  - ✏️ **Edit & Approve** — Modify input before execution
  - ❌ **Reject** — Block the action

**Demo:** Type "delete" or "shutdown" in chat to see approval gate

---

## 🔌 OpenClaw Gateway Integration

### WebSocket Client
```typescript
import { getOpenClawClient } from './lib/openclawClient';

const client = getOpenClawClient({ 
  gatewayUrl: 'ws://127.0.0.1:18789',
  mockMode: false  // Set to true for demo mode
});

// Connect
await client.connect();

// Subscribe to events
client.on('agent_thinking', (event) => {
  console.log('Agent is thinking...', event.data);
});

// Send message
client.send({ type: 'user_message', content: 'Build a dashboard' });
```

### AG-UI Protocol Support
Maps OpenClaw events to AG-UI protocol:
- `agent_thinking` → `thinking_start`
- `agent_tool_call` → `tool_call_start`
- `agent_response` → `text_stream`
- `span_start/end` → `state_sync`
- `approval_required` → `approval_request`

### Demo Mode
Toggle between mock data and live Gateway:
```typescript
// In UI: Demo Mode toggle in top header
// Programmatically:
client.setMockMode(true);  // Use mock data
client.setMockMode(false); // Connect to live Gateway
```

---

## 🎨 A2UI (Agent-to-UI Protocol)

Agents can generate dynamic UIs:

```typescript
// Agent sends A2UI JSON
{
  type: 'form',
  label: 'Create New Task',
  action: 'create_task',
  children: [
    { type: 'input', label: 'Task Title', value: '' },
    { 
      type: 'select', 
      label: 'Priority',
      options: [
        { label: 'P0 - Critical', value: 'P0' },
        { label: 'P1 - High', value: 'P1' }
      ]
    },
    { type: 'button', label: 'Create', action: 'submit' }
  ]
}
```

**Supported Elements:**
- `form` — Form container with submit handling
- `input` — Text input field
- `select` — Dropdown selector
- `button` — Action button
- `text` — Static text / label
- `card` — Container with border
- `list` — Vertical list of items

**Safe Rendering:**
- No arbitrary HTML execution
- Type-checked components only
- Action callbacks route through controlled handlers

---

## 🧪 Mock Data

### Agents
- **SINT** (Executive Assistant) — Active, 127 tasks
- **Mia** (Marketing Manager) — Idle, 89 tasks
- **Leo** (Sales Rep) — Error, 52 tasks
- **Nova** (Research Analyst) — Paused, 34 tasks

### Integrations
Gmail, Slack, Twitter, GitHub, Notion, Perplexity, Calendar, Solana

### Sample Workflow
```
Analyze Request (LLM, 2340ms)
  ├─→ Read Research Doc (Tool, 45ms)
  └─→ Search Memory (Tool, 156ms)
      └─→ Decision: Need Approval?
          └─→ Generate Code (LLM, 4200ms)
              └─→ Output
```

---

## 🎨 Design System

### Colors
```css
--bg-primary: #0A0F1E (deep navy)
--primary: #3B82F6 (electric blue)
--success: #10B981 (emerald)
--warning: #F59E0B (amber)
--error: #EF4444 (rose)
```

### Typography
- **UI:** Inter
- **Code:** JetBrains Mono

### Effects
- Glassmorphism panels (`backdrop-blur-md`)
- Status pulse animations
- Smooth 200ms transitions
- Custom scrollbars
- Skeleton loaders

---

## 📦 Tech Stack

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS (deep navy theme)
- Zustand (state management)
- @dnd-kit (drag-and-drop for Kanban)
- Recharts (charts - ready to use)

**Backend (existing):**
- Fastify
- SQLite + Drizzle ORM
- WebSocket server
- JWT authentication

**Protocols:**
- AG-UI (Agent-User Interaction)
- A2UI (Agent-to-UI)
- OpenClaw Gateway WebSocket

---

## 🗂 Project Structure

```
sint-dashboard/
├── apps/
│   ├── api/          # Fastify backend
│   │   ├── src/
│   │   │   ├── db/         # SQLite schema + migrations
│   │   │   ├── routes/     # API endpoints
│   │   │   ├── services/   # Business logic
│   │   │   └── ws/         # WebSocket server
│   │   └── data/
│   │       └── sint_dashboard.db  # SQLite database
│   └── web/          # React frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── operator/      # OPERATOR VIEW (NEW)
│       │   │   │   ├── AgentRegistry.tsx
│       │   │   │   ├── ChatPanel.tsx
│       │   │   │   ├── CanvasPanel.tsx
│       │   │   │   ├── WorkflowPanel.tsx
│       │   │   │   ├── TracePanel.tsx
│       │   │   │   ├── ApprovalGate.tsx
│       │   │   │   ├── CenterTabs.tsx
│       │   │   │   ├── OperatorLayout.tsx
│       │   │   │   ├── OperatorView.tsx
│       │   │   │   └── KeyboardShortcuts.tsx
│       │   │   ├── Kanban.tsx         # Legacy Kanban view
│       │   │   ├── TaskCard.tsx
│       │   │   └── CostPanel.tsx
│       │   ├── lib/
│       │   │   ├── mockData.ts        # Mock data generators
│       │   │   ├── openclawClient.ts  # WebSocket client
│       │   │   └── api.ts             # API client
│       │   ├── hooks/
│       │   │   ├── useOpenClaw.ts     # OpenClaw hook
│       │   │   └── useWebSocket.ts
│       │   ├── styles/
│       │   │   ├── operator-theme.css # OPERATOR design system
│       │   │   └── index.css
│       │   ├── AppRouter.tsx          # View switcher
│       │   ├── App.tsx                # Kanban view
│       │   └── main.tsx
│       └── dist/                      # Build output
└── packages/
    └── shared/       # Shared TypeScript types
```

---

## 🚦 Build & Deploy

### Development
```bash
npm install
npm run dev      # Runs both API and web
```

### Production Build
```bash
npm run build
```

### Deploy
**Backend (Railway):**
```bash
cd apps/api
railway up
railway add postgresql
railway link
```

**Frontend (Vercel):**
```bash
cd apps/web
vercel --prod
```

---

## 🔮 Roadmap

### Phase 2 (Week 3-4)
- [ ] Live OpenClaw Gateway integration
- [ ] Real-time span streaming
- [ ] Full approval gate workflow
- [ ] Advanced policy rules

### Phase 3 (Week 5-6)
- [ ] Onboarding wizard (Vy-style)
- [ ] Skill marketplace browser
- [ ] Memory promotion UI
- [ ] Export/compliance tools

### Phase 4 (Week 7-8)
- [ ] Team features (multi-user)
- [ ] Billing & usage dashboard
- [ ] Advanced analytics & charts
- [ ] Workflow visual editor (drag-and-drop)

---

## 📸 Screenshots

### Operator View (3-Panel)
```
┌─────────────────────────────────────────────────────────────┐
│  ⚡ SINT Operator               [Demo] 🔔 🔍 🛑 [User] │
├──────────┬────────────────────────────────────┬──────────────┤
│ AGENTS   │  💬 Chat | 🎨 Canvas | 🔀 Workflow │  🔍 Trace   │
│          │                                     │              │
│ 🟢 SINT  │  [Agent messages with tool calls]  │  Session →  │
│ 🔵 Mia   │                                     │   Turn →    │
│ 🔴 Leo   │  ⚠️ APPROVAL REQUIRED              │    Span ✓   │
│ 🟡 Nova  │  Execute: "delete file.txt"        │              │
│          │  ✅ Approve | ✏️ Edit | ❌ Reject   │  🛡️ Policy  │
│ 📊 Stats │                                     │  📋 Audit   │
│ 🔧 Tools │  [Type message here...]            │  🧠 Memory  │
└──────────┴────────────────────────────────────┴──────────────┘
```

---

## 🤝 Contributing

This dashboard was built in 8 hours for SINT Operator. If you want to contribute:
1. Fork the repo
2. Create feature branch
3. Build something awesome
4. Submit PR with screenshots

---

## 📄 License

MIT

---

## 🙏 Credits

Built by SINT for tracking AI agent operations.

**Research Sources:** 36 articles on AG-UI, A2UI, LangGraph, CrewAI, AWS Bedrock, Retool, n8n, Dify

**Design Inspiration:** Dribbble AI agent dashboards, Figma design systems

**Protocols:** AG-UI (CopilotKit), A2UI (agent-driven interfaces)

---

## 💬 Support

Questions? Open an issue or check `SINT-OPERATOR-BUILD-PLAN.md` for architecture details.

**Demo Mode:** Always available. Toggle at top of dashboard.

**Live Mode:** Requires OpenClaw Gateway running on `ws://127.0.0.1:18789`

---

**Built with ❤️ by SINT in 8 hours**
