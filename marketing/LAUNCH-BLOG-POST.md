# How I Built an AI Agent Control Panel in 9 Hours
## Mission control for the age of autonomous software

**By Illia Pashkov** | **February 15, 2026** | **8 min read**

---

## The Problem

AI agents are everywhere now. They write code, manage infrastructure, answer customer support tickets, and analyze data. But here's the thing nobody talks about: **they're complete black boxes**.

When your agent is running, you see... what exactly? Terminal logs? JSON traces? Maybe a progress spinner if you're lucky?

And when something goes wrong - when your agent tries to `rm -rf /` your production server, or burns through $500 in API calls debugging a typo - you find out *after* it's too late.

We needed better tools. Not another CLI that dumps JSON, not another dashboard that shows you what happened *yesterday*. We needed **mission control** for AI agents.

So I built it. In one sitting. 9 hours.

---

## What I Built

The **SINT Operator Dashboard** is a 3-panel control center for AI agents. Think of it like the NASA mission control rooms you see in movies, but for software agents instead of spacecraft.

**Left panel:** Agent registry - see what's running, what's connected, health status  
**Center panel:** Control interface - chat, canvas, workflows  
**Right panel:** Observability - traces, metrics, policies, memory

And the killer feature? **Approval gates**. When an agent tries something dangerous, you get a modal. Review the command. Edit it. Approve or deny. You're the human in the loop.

### The Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS + Vite
- **State:** Zustand (simple, fast, no boilerplate)
- **Protocol:** WebSocket (OpenClaw Gateway integration)
- **Design:** Custom glassmorphism theme (deep navy + electric blue)
- **Mobile:** Touch-optimized with native gestures

### The Stats

- **37 React components**
- **7,120+ lines of code**
- **9 major features**
- **122KB documentation**
- **Zero TypeScript errors**
- **410KB JS bundle (114KB gzipped)**
- **8 hours 50 minutes** build time
- **~$26** in Claude API costs

---

## The 9-Hour Build

### Hour 1-4: Core Dashboard (12:10-16:10 PST)

Started with the basics: 3-panel layout, agent registry, chat interface. Built 16 components:

- `AgentRegistry` - shows 4 agents with 8 integrations
- `ChatPanel` - AG-UI protocol streaming
- `CanvasPanel` - A2UI renderer (forms, buttons, lists)
- `WorkflowPanel` - Visual node graph
- `TracePanel` - Hierarchical session tree
- `ApprovalGate` - Human-in-the-loop modal

The design system came together fast: deep navy backgrounds, glassmorphism cards, electric blue accents. I wanted it to feel like you're in control of something powerful but precise.

**Gateway integration** was the tricky part. OpenClaw uses a challenge-response authentication flow:

```typescript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.event === 'connect.challenge') {
    ws.send(JSON.stringify({
      type: 'event',
      event: 'connect.auth',
      payload: {
        nonce: message.payload.nonce,
        token: null,  // Local dev
      },
    }));
  }
};
```

Built an `EventProcessor` class to map Gateway events to store updates. Clean separation: WebSocket client → Event processor → Zustand store → React components.

### Hour 5: Mobile Polish (16:50-17:20 PST)

Desktop worked, but mobile was cramped. Solution: **bottom navigation bar** that switches between panels.

Created `mobile-polish.css` with:
- 44px+ touch targets (Apple HIG)
- iOS safe area handling (notch, home indicator)
- Active states (scale + opacity)
- 16px minimum font size (prevents zoom on input)

Result: Native app-quality UX on mobile.

### Hour 6-7: Enhanced Features (17:30-19:07 PST)

Shipped 4 major features in 90 minutes:

**Enhanced Traces** (30min) - Timeline view, filters, summary stats  
**Metrics Dashboard** (15min) - Cost tracking, model usage, success rates  
**Policy Editor** (20min) - Visual rule builder with 8 templates  
**Memory Inspector** (15min) - M0-M3 tiered memory with search

The policy templates were fun to design:
- 💰 Daily Budget Limit
- 🔒 Shell Command Approval
- 💎 Expensive Operation Approval
- 🛡️ Production Protection
- 👁️ Read-Only Mode

### Hour 8: Advanced Features (19:07-20:10 PST)

**Chat Enhancements** - Search, threads, export (MD/JSON/Text)  
**Workflow Builder** - Drag-and-drop with 4 templates (Sequential, Parallel, Conditional, Research Pipeline)

The workflow builder uses native HTML5 drag-and-drop with SVG edge rendering. No heavy graph libraries needed.

### Hour 9: Polish & Docs (20:10-21:00 PST)

Created comprehensive documentation:
- `README.md` - Project overview
- `QUICK-START.md` - 5-minute guide
- `USER-GUIDE.md` - Full manual (18KB)
- 8 feature-specific guides

Enhanced mobile UX with:
- Swipe gestures (left/right panel switching)
- Pull-to-refresh
- Bottom drawer
- Full-screen modals
- 48px+ touch targets everywhere

---

## What I Learned

### 1. Zustand > Redux

I've built dozens of React apps. Redux is powerful but *heavy*. Zustand gave me global state in 100 lines of code. No actions, no reducers, no middleware. Just:

```typescript
const useStore = create((set) => ({
  agents: [],
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, agent]
  })),
}));
```

Clean. Fast. No ceremony.

### 2. WebSockets Are Still Hard

The Gateway integration took longer than expected. Not because WebSockets are hard, but because **protocols are hard**. Auth handshakes, event mapping, reconnection logic, error handling - there's a lot of edge cases.

My solution: Separate concerns. `OpenClawClient` handles the wire protocol. `EventProcessor` handles business logic. React components just render state.

### 3. Mobile-First Saves Time

I built desktop first, then spent an hour making it work on mobile. **Wrong order**.

Next time: Build mobile first. A responsive mobile UI scales *up* to desktop easily. A desktop UI scales *down* to mobile painfully.

### 4. Documentation Is A Feature

I spent an hour writing docs. Not because I'm nice, because **docs are a feature**.

A dashboard without docs is a puzzle. A dashboard with docs is a product. Users need:
- Quick start (get value in 5 minutes)
- User guide (learn all features)
- Feature docs (deep dives)

I shipped all three.

### 5. Demo Mode Is Critical

Building against a live Gateway would have been slow. Changes require agent restarts, state gets messy, bugs are hard to reproduce.

Solution: **Demo mode** toggle. Flip it on, get realistic mock data. Flip it off, connect to real Gateway. Same UI, two modes. Development velocity 10x.

---

## The Features

### 🎯 Approval Gates (Human-in-the-Loop)

The killer feature. When an agent tries something dangerous:

1. Execution pauses
2. Modal pops up
3. You see the command, arguments, context
4. You can approve, deny, or *edit*
5. Agent continues (or stops)

This isn't theoretical. I tested it with: `"Delete all files in /tmp"`. Approval gate fired. I edited it to `"List files in /tmp"`. Agent executed the safe version.

**This is how you deploy AI agents in production**.

### 📊 Real-Time Traces

Every agent action creates a span. Spans nest into turns. Turns nest into sessions. The trace viewer shows the full hierarchy:

```
Session: main
  ├─ Turn 1: "List my files"
  │   ├─ Span: agent_thinking (230ms, $0.001)
  │   ├─ Span: tool_call: fs.readdir (45ms, $0)
  │   └─ Span: agent_response (120ms, $0.002)
  └─ Turn 2: "Delete logs folder"
      ├─ Span: agent_thinking (180ms, $0.001)
      └─ Span: approval_required (PENDING)
```

Color-coded by status (green = success, yellow = running, red = error). Click any span to see full details: model, tokens, cost, duration, input/output.

Switch to **timeline view** to see execution flow horizontally. Add filters: show only errors, only expensive operations, only specific tools.

### 🎨 Visual Policy Builder

No code required. Drag rules from templates or build custom ones:

**Rule:** "Require approval for shell commands"  
**Condition:** tool = "exec"  
**Action:** require_approval  
**Priority:** 90

**Rule:** "Daily budget limit"  
**Condition:** cost_today > $50  
**Action:** deny  
**Priority:** 100

Rules evaluate in priority order. Higher priority wins. Simple, powerful, visual.

### 🔄 Multi-Agent Workflows

Drag nodes onto canvas. Connect with edges. Each node is an agent. Edges define data flow.

**Templates:**
- **Sequential:** Research agent → Analysis agent → Summary agent
- **Parallel:** Fetch from 3 sources → Merge results
- **Conditional:** Classifier → Route to specialist agents
- **Research Pipeline:** Query → Search → Extract → Synthesize

Save workflows as JSON. Import/export. Share with team. Run with one click.

### 📱 Native Mobile UX

This isn't "mobile responsive". This is **native-quality mobile UX**:

- 48px+ touch targets (easy to tap, even one-handed)
- Swipe left/right to switch panels
- Pull-to-refresh for live updates
- Bottom navigation (thumb-friendly)
- iOS safe area handling (notch, home indicator)
- Full-screen modals (no awkward desktop modals on mobile)
- Reduced animations (faster, less battery)

Test it on your phone. Feels like a native app.

---

## What's Next

This was a 9-hour sprint. It's production-ready, but there's more to build:

### Phase 4 Features (Planned)
- **Integration Hub** - MCP server registry (install/configure integrations visually)
- **Real-Time Collaboration** - Multi-user with live cursors
- **Gateway Health Monitor** - Real-time Gateway metrics
- **Template Marketplace** - Buy/sell workflow templates

### Long-Term Vision
- **Multi-tenant SaaS** - Host dashboards for teams
- **AI Copilot** - Agent that helps you operate agents (meta!)
- **Time-travel Debugging** - Replay agent sessions
- **Workflow Marketplace** - Community-contributed templates

---

## Try It Yourself

**Live Demo:** [dashboard.sint.ai](https://dashboard.sint.ai)  
**Source Code:** [github.com/sint-ai/operator-dashboard](https://github.com/sint-ai/operator-dashboard)  
**Docs:** [docs.sint.ai/operator](https://docs.sint.ai/operator)

### Quick Start (5 minutes)

```bash
# Clone repo
git clone https://github.com/sint-ai/operator-dashboard
cd operator-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev:web

# Open browser
open http://localhost:5174
```

Toggle **Demo Mode** to see it in action with mock data. Toggle it *off* to connect to your local OpenClaw Gateway.

### Deploy Your Own

One command:

```bash
vercel --prod
```

Supports Vercel, Netlify, Cloudflare Pages, Railway. Full deployment guide included.

---

## Lessons for Builders

### 1. Ship Fast, Iterate Later

9 hours from idea to production. No perfectionism. No bikeshedding. Just build.

The first version doesn't need to be perfect. It needs to be **useful**. Then iterate based on real feedback.

### 2. Documentation = Product

I spent 11% of build time on docs. Worth it. Users need docs to understand value. Docs turn a demo into a product.

### 3. Mobile Can't Be an Afterthought

40% of users are on mobile (probably). Mobile UX takes time. Plan for it from day one.

### 4. Demo Mode Accelerates Development

Building against mock data is 10x faster than building against live systems. Invest in good mock data early.

### 5. Open Source Wins

I used: React, TypeScript, Tailwind, Vite, Zustand. All open source. All best-in-class. Standing on shoulders of giants.

---

## The Business Model

This isn't just a side project. It's a business:

**Week 1 Target:** $2,300-$6,500  
**Month 1 Target:** $8,500-$50,000

**Revenue Streams:**
1. **Consulting** - Custom dashboard setup for enterprises ($5K-$15K per engagement)
2. **SaaS** - Hosted dashboards with team features ($29-$99/mo)
3. **Digital Products** - Workflow templates, video courses ($49-$499)
4. **Partnerships** - OpenClaw ecosystem, MCP providers (rev share)

**Target Market:**
- AI agent operators (DevOps, SREs)
- Enterprise AI teams
- AI startups (LangChain, CrewAI, AutoGPT users)
- OpenClaw community

**Go-to-Market:**
- Product Hunt launch (Monday)
- Twitter/LinkedIn launch (today)
- Email 100 AI operators (this week)
- Guest posts on AI newsletters
- Conference speaking (Q1)

---

## Join The Mission

Building the future of AI observability. If you're:

- Running AI agents in production
- Building agent frameworks
- Struggling with black-box agents
- Want better monitoring tools

**Let's talk.**

📧 i@pshkv.com  
🐦 [@pshkv](https://twitter.com/pshkv)  
💬 [Discord](https://discord.gg/sint)  
🚀 [Live Demo](https://dashboard.sint.ai)

---

**SINT** - Making AI agents observable, controllable, and trustworthy.

*Posted in: AI, Startups, Building in Public, Technical, Case Studies*

---

## Engagement Prompts

**Twitter:**
> "I built an AI agent control panel in 9 hours. Real-time traces, approval gates, mobile-optimized. Here's how 👇"

**LinkedIn:**
> "Shipped a production-ready AI agent dashboard in one sitting. 37 components, zero TypeScript errors, comprehensive docs. The future of AI observability. See it live →"

**Hacker News:**
> "Show HN: I built an AI agent control panel in 9 hours"

**Reddit r/SideProject:**
> "Built an AI agent dashboard in 9 hours - mission control for autonomous software"

---

**Word Count:** 1,847 words  
**Reading Time:** 8 minutes  
**SEO Keywords:** AI agents, observability, dashboard, OpenClaw, control panel, approval gates, real-time monitoring
