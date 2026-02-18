# SINT Operator Dashboard - User Guide

**Mission Control for AI Agents**

A production-ready control center for managing, monitoring, and orchestrating AI agents with real-time observability, approval gates, and cost tracking.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Interface Overview](#interface-overview)
3. [Core Features](#core-features)
4. [Common Tasks](#common-tasks)
5. [Mobile Guide](#mobile-guide)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Tips & Tricks](#tips--tricks)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Launch

1. **Open the dashboard** in your browser
2. **Choose your mode:**
   - **Demo Mode (ON)** - Explore with mock data
   - **Demo Mode (OFF)** - Connect to OpenClaw Gateway

### Interface Modes

**Desktop (3-Panel Layout):**
- **Left Panel:** Agent Registry & Integrations
- **Center Panel:** Chat, Canvas, Workflow tabs
- **Right Panel:** Metrics, Trace, Policy, Audit, Memory tabs

**Mobile (Single Panel + Bottom Nav):**
- **Agents:** Agent registry and status
- **Control:** Chat, Canvas, Workflow
- **Metrics:** Metrics, Trace, Policy, Audit, Memory

---

## Interface Overview

### Desktop Navigation

```
┌─────────────┬──────────────────┬─────────────┐
│   AGENTS    │     CONTROL      │   METRICS   │
│             │                  │             │
│ • Status    │ Tabs:            │ Tabs:       │
│ • Stats     │ • Chat 💬        │ • Metrics 📊│
│ • Integr.   │ • Canvas 🎨      │ • Trace 🔍  │
│             │ • Workflow 🔀    │ • Policy 🛡️ │
│             │                  │ • Audit 📋  │
│             │                  │ • Memory 🧠 │
└─────────────┴──────────────────┴─────────────┘
```

**Toggle Panels:**
- Bottom-left: "◀ Agents" / "▶ Agents" button
- Bottom-right: "Trace ▶" / "Trace ◀" button

### Mobile Navigation

**Bottom Nav Bar:**
- 👥 **Agents** - Agent registry
- 💬 **Control** - Main control panel
- 📊 **Metrics** - Analytics & monitoring

**Gestures:**
- **Swipe left/right** - Switch between panels
- **Pull down** - Refresh (where supported)
- **Tap & hold** - Context menus (coming soon)

---

## Core Features

### 1. Agent Registry (Left Panel / Agents Tab)

**What It Shows:**
- Active agents and their status (🟢 online, 🟡 idle, 🔴 offline)
- Quick stats (tasks completed, avg response time, success rate, total cost)
- Integrated tools (8 integrations: Web Search, Memory, Code Exec, etc.)

**Actions:**
- Click agent name → View details
- Monitor real-time status changes
- Track performance metrics

---

### 2. Chat Panel (Center Panel → Chat Tab)

**Send Messages:**
1. Type in the bottom input field
2. Press Enter or click "Send"
3. Watch agent respond with streaming text

**Search Conversations:**
1. Click search icon at top
2. Enter search query
3. Apply filters:
   - **Role:** User / Assistant / System
   - **Date Range:** Today / Week / Month / All
   - **Tool Calls:** With Tools / Without Tools
4. View filtered results with count

**View Threads:**
1. Click "Threads" toggle at top
2. Browse conversation threads
3. Click thread to load messages
4. See message count, duration, participants, tags

**Export Chat:**
1. Click "Export" button
2. Choose format: Markdown / JSON / Text
3. Select options:
   - Include timestamps ✓
   - Include tool calls ✓
   - Include system messages
4. Choose date range: All Time / Current Session
5. Click "Export {FORMAT}"
6. File downloads automatically

**Approval Gates:**
- When agent requests approval, gate appears above input
- Review action details
- Click "Approve" or "Reject"
- Optional: Add reason/note

---

### 3. Workflow Builder (Center Panel → Workflow Tab)

**View Mode:**
- See real-time execution flow
- Click nodes for details
- Monitor agent progress

**Build Mode:**
1. Click "Build" toggle at top
2. Add nodes from left palette:
   - 🤖 **Agent** - AI agent execution
   - 🔀 **Condition** - Conditional routing
   - ⚡ **Parallel** - Concurrent execution
   - ➡️ **Sequential** - Chain/merge operations
3. Drag nodes to position
4. Click node to edit properties
5. Connect nodes (edges)
6. Click "Save" to store workflow
7. Click "Run" to execute

**Use Templates:**
1. Click "Templates" button (Build mode)
2. Browse categories: Basic / Advanced / Research
3. Select template:
   - **Sequential Agents** - Linear chain
   - **Parallel Processing** - Concurrent tasks
   - **Conditional Routing** - Dynamic routing
   - **Research Pipeline** - Multi-source research
4. Template loads in builder
5. Customize as needed
6. Save & run

**Export/Import:**
- **Export:** Click download icon → JSON file saves
- **Import:** Click upload icon → select JSON file

---

### 4. Metrics Dashboard (Right Panel → Metrics Tab)

**Summary Cards:**
- **Total Cost** - All-time spending
- **Avg Duration** - Response times
- **Success Rate** - Task completion %
- **Total Time** - Cumulative execution

**Charts:**
1. **Cost Over Time** - Line chart (1h/24h/7d/30d buckets)
2. **Cost by Model** - Bar chart breakdown
3. **Cost by Agent** - Distribution
4. **Response Time** - Histogram
5. **Budget Status** - Gauge with limits
6. **Top Expensive Operations** - Rankings

**Actions:**
- Click time range buttons to change granularity
- Hover charts for detailed tooltips
- Monitor budget limits

---

### 5. Trace View (Right Panel → Trace Tab)

**Tree View (Default):**
- Hierarchical display: Session → Turn → Span
- Color-coded status: 🟢 Success, 🔴 Error, 🟡 Pending
- Click expand/collapse arrows
- Shows duration, cost, status

**Timeline View:**
1. Click "Timeline" toggle at top
2. See horizontal bar chart
3. Bars scaled by duration
4. Click bar for detailed info

**Filters:**
1. Click filter icon
2. Apply filters:
   - **Status:** Success / Error / Running / Pending
   - **Tools:** llm_call / tool_exec / memory_search / etc.
   - **Search:** Text search in names/models/errors
   - **Cost Range:** Min/max slider
   - **Time Range:** All / Today / Week / Month
3. View filtered results with count
4. Click "Reset" to clear

**Summary Stats:**
- Total Cost
- Average Duration
- Success Rate
- Most Expensive / Slowest operations

**Export:**
- Click "Export" button
- Downloads JSON with all trace data

---

### 6. Policy Editor (Right Panel → Policy Tab)

**View Policies:**
- See active rules with priority
- Enable/disable toggle switches
- View violation counts

**Add Policy from Template:**
1. Click "Templates" button
2. Browse 8 templates:
   - 💰 Daily Budget Limit
   - 🔒 Shell Command Approval
   - 💎 Expensive Operation Approval
   - 🛡️ Production Protection
   - 👁️ Read-Only Mode
   - ✅ Model Whitelist
   - ⚡ Auto-Approve Cheap Operations
   - 🕐 Business Hours Only
3. Click template to load
4. Customize settings
5. Click "Save"

**Create Custom Policy:**
1. Click "+ New Policy" button
2. Enter policy name
3. Set priority (0-100, higher = first)
4. Add conditions:
   - **Cost:** Greater than / Less than amount
   - **Tool:** Specific tool name
   - **Model:** Model whitelist
   - **Time:** Business hours
   - **Agent:** Agent ID
5. Choose action:
   - **Allow** - Permit automatically
   - **Deny** - Block automatically
   - **Require Approval** - Gate for human review
6. Click "Save"

**Edit/Delete:**
- Click policy card to edit
- Click trash icon to delete
- Changes apply immediately

---

### 7. Memory Inspector (Right Panel → Memory Tab)

**Browse Memory Tiers:**
- **M0 (Blue)** - Ephemeral (current session)
- **M1 (Green)** - Session (persistent)
- **M2 (Yellow)** - Agent (long-term)
- **M3 (Purple)** - Archive (inactive)

**Search Memories:**
1. Type in search box
2. Click filter icon for advanced options:
   - **Memory Tiers:** M0 / M1 / M2 / M3
   - **Time Range:** 1h / 24h / 7d / 30d / All
   - **Promotion Status:** All / Promoted / Not Promoted
3. Click "Apply Filters"
4. View results with count

**View Timeline:**
1. Click any memory entry
2. See promotion history:
   - 🟢 Create events
   - 🔵 Promotions (M0→M1→M2)
   - 🟡 Access events
   - ⚪ Archive actions
3. View timestamps, reasons, access counts
4. Click "Back to list" to return

**Toggle Views:**
- Click "List View" / "Timeline View" button
- Switch between list and timeline visualization

---

### 8. Audit Log (Right Panel → Audit Tab)

**View Activity:**
- Chronological log of all actions
- Shows: Action, Tool, Status, Cost, Timestamp
- Hash-chained for integrity

**Export:**
- Click "Export CSV" button
- Downloads full audit log

---

## Common Tasks

### Task 1: Monitor Agent Performance

**Steps:**
1. Open **Agent Registry** (left panel / Agents tab)
2. View quick stats for each agent
3. Switch to **Metrics** tab (right panel)
4. Review charts and cost breakdown
5. Check success rates and response times

**What to Look For:**
- ⚠️ High costs (red budget gauge)
- 🔴 Low success rates (<80%)
- ⏱️ Slow response times (>10s avg)

---

### Task 2: Debug Failed Operations

**Steps:**
1. Go to **Trace** tab (right panel)
2. Filter by Status: "Error"
3. Expand failed traces in tree view
4. Click span to see details
5. Check error message and input/output
6. Switch to **Audit** tab for full history

**Quick Tip:**
- Use Timeline view to see where execution stalled
- Check cost to identify expensive failed operations

---

### Task 3: Search Past Conversations

**Steps:**
1. Go to **Chat** tab (center panel)
2. Click search icon at top
3. Enter search query (e.g., "build dashboard")
4. Apply filters:
   - Date Range: "Week"
   - Tool Calls: "With Tools"
5. Browse results
6. Click message to see context

**Export Results:**
- With filters active, click "Export"
- Only filtered messages will be exported

---

### Task 4: Create Multi-Agent Workflow

**Steps:**
1. Go to **Workflow** tab (center panel)
2. Click "Build" mode toggle
3. Click "Templates" button
4. Select "Research Pipeline" template
5. Customize:
   - Edit node labels
   - Change agent IDs in properties
   - Adjust positions by dragging
6. Click "Save" (gives workflow name)
7. Click "Run" to execute
8. Switch to "View" mode to watch progress

**From Scratch:**
1. Enter Build mode
2. Add nodes from palette
3. Configure each node (click → properties panel)
4. Connect nodes with edges
5. Save & run

---

### Task 5: Set Budget Limits

**Steps:**
1. Go to **Policy** tab (right panel)
2. Click "Templates" button
3. Select "💰 Daily Budget Limit"
4. Set limit (e.g., $10.00)
5. Choose action: "Require Approval"
6. Click "Save"
7. Policy now active (toggle ON)

**Monitor:**
- Switch to **Metrics** tab
- Check "Budget Status" gauge
- Violations shown in Policy tab

---

### Task 6: Export Chat for Analysis

**Steps:**
1. Go to **Chat** tab
2. Optionally filter messages (date, role, tools)
3. Click "Export" button
4. Select format:
   - **Markdown** - Human-readable with headers
   - **JSON** - Structured data with metadata
   - **Text** - Plain text with separators
5. Configure options:
   - ✓ Include timestamps
   - ✓ Include tool calls
   - Include system messages (optional)
6. Choose date range: "All Time"
7. Click "Export MARKDOWN"
8. File downloads: `chat-export-2026-02-14.md`

---

### Task 7: Review Memory Promotions

**Steps:**
1. Go to **Memory** tab (right panel)
2. Click filter icon
3. Select:
   - Memory Tiers: M1, M2 (uncheck M0, M3)
   - Promotion Status: "Promoted"
4. Click "Apply Filters"
5. View promoted memories
6. Click any entry to see timeline
7. Review promotion history:
   - When promoted (timestamp)
   - Why promoted (reason)
   - Access count

**What This Tells You:**
- Which memories are important (promoted)
- How agents are learning (M0→M1→M2 progression)
- Access patterns (frequently used memories)

---

## Mobile Guide

### Navigation

**Bottom Nav Bar:**
- Tap icons to switch panels
- Active panel has blue color + indicator dot
- Top indicator line shows current panel

**Gestures:**
- **Swipe left/right** - Quick panel switching
- **Pull down** - Refresh lists (where supported)
- **Long press** - Context menus (coming soon)

### Mobile-Optimized Features

**Chat:**
- Larger message bubbles
- Floating search panel (slides in from top)
- Full-screen filters and export modal
- Keyboard-aware input (no zoom)

**Workflow:**
- Horizontal node palette (scroll left/right)
- Touch-friendly drag-and-drop
- Full-screen properties panel (slides up)
- Full-screen template library

**Traces:**
- Compact tree view
- Horizontal scroll timeline
- Bottom drawer for filters
- Two-finger tap on cards (quick actions)

**Memory:**
- Vertical-optimized timeline
- Full-screen filter modal
- Pull-to-refresh support
- Swipe cards for quick actions (coming soon)

### Mobile Tips

✅ **Use landscape mode** for workflow builder  
✅ **Two-finger pinch** to zoom canvas (coming soon)  
✅ **Long press** agent cards for quick actions (coming soon)  
✅ **Swipe cards left** to archive/delete (coming soon)  
✅ **Pull down** to refresh traces and metrics  

---

## Keyboard Shortcuts

### Global

- **Cmd/Ctrl + K** - Quick search (coming soon)
- **Cmd/Ctrl + /** - Show shortcuts help
- **Esc** - Close modals/panels

### Navigation

- **1** - Switch to Chat tab
- **2** - Switch to Canvas tab
- **3** - Switch to Workflow tab
- **Cmd/Ctrl + [** - Previous tab
- **Cmd/Ctrl + ]** - Next tab

### Chat

- **Cmd/Ctrl + Enter** - Send message
- **Cmd/Ctrl + F** - Open search
- **Cmd/Ctrl + E** - Export chat

### Workflow

- **Space + Drag** - Pan canvas
- **Del / Backspace** - Delete selected node
- **Cmd/Ctrl + D** - Duplicate node
- **Cmd/Ctrl + S** - Save workflow
- **Cmd/Ctrl + R** - Run workflow

### Trace

- **Cmd/Ctrl + T** - Toggle tree/timeline view
- **Cmd/Ctrl + F** - Open filters
- **Cmd/Ctrl + E** - Export traces

---

## Tips & Tricks

### Performance Optimization

💡 **Reduce cost by:**
- Setting budget policies (Policy tab → Daily Budget Limit)
- Using cheaper models (check Metrics → Cost by Model)
- Auto-approving low-cost operations (<$0.01)

💡 **Speed up agents by:**
- Using parallel workflows (Workflow → Parallel Processing template)
- Caching frequent queries (Memory M1/M2 tiers)
- Monitoring slow operations (Trace → Summary Stats)

### Workflow Best Practices

💡 **Start with templates:**
- Browse 4 pre-built workflows
- Customize for your use case
- Save as new template (export JSON)

💡 **Name nodes clearly:**
- "Research Agent" > "Agent 1"
- Include purpose: "Web Search", "Data Validator"
- Use emojis for quick visual identification

💡 **Use conditions wisely:**
- Route urgent tasks to faster agents
- Fallback to cheaper models for simple tasks
- Split complex workflows into smaller subflows

### Memory Management

💡 **Understand tiers:**
- **M0** - Temporary, current session only
- **M1** - Important, persists across sessions
- **M2** - Core knowledge, long-term storage
- **M3** - Archived, rarely accessed

💡 **Search effectively:**
- Use time ranges to find recent memories
- Filter by tier to find core knowledge (M2)
- Check promoted memories for important patterns

### Chat Organization

💡 **Use threads:**
- Group related conversations
- Track multi-step projects
- Review conversation history

💡 **Export regularly:**
- Weekly exports for record-keeping
- Markdown for human reading
- JSON for analysis/processing

### Policy Strategy

💡 **Layer policies by priority:**
1. **Priority 100** - Emergency stop (daily budget limit)
2. **Priority 50** - Approval gates (expensive ops, shell commands)
3. **Priority 10** - Auto-approve (cheap, read-only ops)

💡 **Test policies in demo mode:**
- Create policy
- Trigger actions
- Verify behavior
- Adjust before production

---

## Troubleshooting

### Issue: Dashboard Not Loading

**Symptoms:** Blank screen, spinning loader

**Solutions:**
1. Check browser console (F12) for errors
2. Refresh page (Cmd/Ctrl + R)
3. Clear cache and reload (Cmd/Ctrl + Shift + R)
4. Try incognito/private mode
5. Check if server is running

---

### Issue: Gateway Connection Failed

**Symptoms:** 🔴 Disconnected status, "Demo Mode ON" forced

**Solutions:**
1. Check OpenClaw Gateway is running: `openclaw status`
2. Verify Gateway URL: `ws://127.0.0.1:18789`
3. Check firewall settings (allow port 18789)
4. Restart Gateway: `openclaw gateway restart`
5. Toggle Demo Mode OFF to retry connection

---

### Issue: Chat Messages Not Sending

**Symptoms:** Input stuck, no response from agent

**Solutions:**
1. Check connection status (top of chat panel)
2. Verify agent is online (Agent Registry → status)
3. Check for pending approval gates
4. Review trace for errors (Trace tab → filter by Error)
5. Check budget limits (Policy tab → violations)

---

### Issue: Workflow Not Running

**Symptoms:** "Run" button does nothing, nodes not executing

**Solutions:**
1. Verify all nodes have required fields (agent IDs, etc.)
2. Check for disconnected nodes (no edges)
3. Save workflow before running
4. Switch to View mode to see execution
5. Check Gateway connection (workflow requires Gateway)

---

### Issue: Mobile Layout Broken

**Symptoms:** Panels overlapping, bottom nav not visible

**Solutions:**
1. Refresh page
2. Rotate device (portrait → landscape → portrait)
3. Clear browser cache
4. Update browser to latest version
5. Try different browser (Safari → Chrome)

---

### Issue: Export Not Working

**Symptoms:** Export button does nothing, no download

**Solutions:**
1. Check browser download settings
2. Allow pop-ups for this site
3. Try different export format (Markdown → JSON)
4. Check browser console for errors
5. Right-click export button → "Save link as..."

---

## Advanced Features

### Custom Styling (Coming Soon)

- Theme customization
- Custom color schemes
- Layout preferences

### Collaboration (Coming Soon)

- Multi-user support
- Shared workflows
- Team dashboards

### Integrations (Coming Soon)

- Slack notifications
- Email alerts
- Webhook triggers

### Automation (Coming Soon)

- Scheduled workflows
- Auto-scaling policies
- Smart routing

---

## Need Help?

**Documentation:**
- Technical docs: `OPERATOR-README.md`
- Feature docs: `*-COMPLETE.md` files
- Architecture: `DAY-1-COMPLETE.md`

**Community:**
- Discord: https://discord.com/invite/clawd
- GitHub: https://github.com/openclaw/openclaw
- Docs: https://docs.openclaw.ai

**Support:**
- Report bugs: GitHub Issues
- Feature requests: Discord #feature-requests
- Questions: Discord #help

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-14  
**License:** MIT

---

Built with ❤️ for AI Agent Operators
