# SINT Operator Dashboard - Visual Test Guide
**Quick 5-Minute Tour**

---

## Open the Dashboard
```bash
open http://localhost:5173
```

**Expected:** Dashboard loads with 3 panels visible

---

## Left Panel - Agent Registry

### Test 1: Agent Cards
**Action:** Look at the left panel  
**Expected:**
- ✅ 4 agent cards (SINT 🤖, Mia 📊, Leo 💼, Nova 🔬)
- ✅ Status badges: SINT = 🟢 Active, Mia = 🔵 Idle, Leo = 🔴 Error, Nova = 🟡 Paused
- ✅ "127 tasks", "89 tasks", etc. visible on cards
- ✅ "Building SINT Operator dashboard" shown under SINT

### Test 2: Quick Stats
**Action:** Look at top of left panel  
**Expected:**
- ✅ "Active Agents: 1/4"
- ✅ "Tasks Today: 302"
- ✅ "Cost Today: $4.18"
- ✅ "Health Score: 94%"

### Test 3: Click Agent
**Action:** Click on "Mia 📊" card  
**Expected:**
- ✅ Card highlights with blue border
- ✅ Center panel updates (shows Mia as selected)

### Test 4: Integrations
**Action:** Click "Integrations (8)" to expand  
**Expected:**
- ✅ 8 tools listed (Gmail, Slack, Twitter, GitHub, Notion, Perplexity, Calendar, Solana)
- ✅ Status dots: 🟢 connected, 🟡 degraded, 🔴 down
- ✅ Toggle switches (can click on/off)

---

## Center Panel - Chat Tab

### Test 5: Chat Messages
**Action:** Look at center panel (should be on Chat tab by default)  
**Expected:**
- ✅ 8 mock messages visible
- ✅ User messages (blue bubbles on right)
- ✅ Agent messages (gray bubbles on left)
- ✅ System messages (amber background)
- ✅ Tool call cards visible (expandable)

### Test 6: Send Message
**Action:** Type "Hello SINT" in input at bottom, press Enter  
**Expected:**
- ✅ Message appears in chat
- ✅ Agent responds with "I'll help you with that..."
- ✅ Auto-scroll to bottom

### Test 7: Approval Gate
**Action:** Type "delete something important" and press Enter  
**Expected:**
- ✅ Yellow warning card appears
- ✅ "⚠️ Approval Required: execute_shell_command"
- ✅ Three buttons: ✅ Approve | ✏️ Edit & Approve | ❌ Reject
- ✅ Countdown timer visible
- ✅ Policy rule shown: "Shell Command Approval Policy"

### Test 8: Approve Action
**Action:** Click "✅ Approve" button  
**Expected:**
- ✅ Approval gate disappears
- ✅ System message: "✅ Approved: execute_shell_command"
- ✅ Agent confirms: "Action completed successfully."

---

## Center Panel - Canvas Tab

### Test 9: Switch to Canvas
**Action:** Click "🎨 Canvas" tab (or press ⌘2)  
**Expected:**
- ✅ Tab switches immediately
- ✅ 3 cards visible:
  1. "Task Overview" card (with stats)
  2. "Create New Task" form (with input + dropdown + button)
  3. "Recent Actions" list

### Test 10: Canvas Interactions
**Action:** Type in "Task Title" input field  
**Expected:**
- ✅ Can type text
- ✅ Form input is functional
- ✅ Dropdown selector works

---

## Center Panel - Workflow Tab

### Test 11: Switch to Workflow
**Action:** Click "🔀 Workflow" tab (or press ⌘3)  
**Expected:**
- ✅ Visual node graph appears
- ✅ 6 nodes visible with labels
- ✅ SVG lines connecting nodes
- ✅ Color-coded nodes (blue for LLM, green for tools, etc.)
- ✅ One node pulsing (status = running)

### Test 12: Click Node
**Action:** Click any node in the graph  
**Expected:**
- ✅ Node highlights with blue border
- ✅ Right sidebar opens with "Node Details"
- ✅ Shows: Type, Label, Status, Duration
- ✅ Input/Output JSON visible in code blocks

---

## Right Panel - Trace Tab

### Test 13: Trace Viewer
**Action:** Look at right panel (should be on Trace tab)  
**Expected:**
- ✅ "Execution Trace" header
- ✅ "⏮ Time Travel" button visible
- ✅ One trace card: "RUNNING" status in blue
- ✅ "Session: session-main" visible
- ✅ "$0.114" cost shown
- ✅ 4 spans listed below

### Test 14: Expand Span
**Action:** Click on any span (e.g., "llm_call")  
**Expected:**
- ✅ Span expands
- ✅ Input JSON visible
- ✅ Output JSON visible
- ✅ Duration: "2340ms" or similar
- ✅ Cost: "$0.045" or similar
- ✅ Tokens: "15000 in / 2000 out" (if LLM span)

---

## Right Panel - Policy Tab

### Test 15: Switch to Policy
**Action:** Click "🛡️ Policy" tab  
**Expected:**
- ✅ "Active Policies" header
- ✅ "+ Add Policy" button visible
- ✅ Budget meter at top showing $4.18 / $50.00
- ✅ Progress bar (green, ~8% filled)
- ✅ 4 policies listed with toggle switches
- ✅ One policy shows "2 violations" in red

---

## Right Panel - Audit Tab

### Test 16: Switch to Audit
**Action:** Click "📋 Audit" tab  
**Expected:**
- ✅ "Audit Log" header
- ✅ "Export CSV" button visible
- ✅ 4 audit entries listed
- ✅ Each entry shows: timestamp, action (font-mono), tool, cost
- ✅ Status dots: 🟢 success
- ✅ Hash IDs visible (e.g., "#a7f4e9b2")

---

## Right Panel - Memory Tab

### Test 17: Switch to Memory
**Action:** Click "🧠 Memory" tab  
**Expected:**
- ✅ "Memory Tiers" header
- ✅ "🔍 Search" button visible
- ✅ 4 memory entries listed
- ✅ Tier badges colored: M0 (blue), M1 (green), M2 (amber), M3 (red)
- ✅ Each shows: content, source, timestamp
- ✅ Promotion indicators (e.g., "↑ from M0")

---

## Top Header

### Test 18: Demo Mode Toggle
**Action:** Look at top header, find "Demo Mode" toggle  
**Expected:**
- ✅ Toggle switch visible
- ✅ Currently ON (blue)
- ✅ Next to it: "System Healthy" with 🟢 green dot

### Test 19: Toggle Demo Mode OFF
**Action:** Click the toggle to turn demo mode OFF  
**Expected:**
- ✅ Toggle turns gray
- ✅ Status changes to "Disconnected" or "Connected" (depending on Gateway)
- ✅ Dot color changes: 🔴 red if disconnected, 🟢 green if connected
- ✅ If connected: Can send real messages to Gateway

### Test 20: System Indicators
**Action:** Look at right side of header  
**Expected:**
- ✅ 🔔 Bell icon (notifications)
- ✅ 🔍 Search icon (global search)
- ✅ 🛑 Kill Switch button (red, emergency stop)
- ✅ User profile: "I" avatar with "Illia" name

---

## Keyboard Shortcuts

### Test 21: Tab Switching
**Action:** Press ⌘1, then ⌘2, then ⌘3  
**Expected:**
- ✅ ⌘1 → Chat tab activates
- ✅ ⌘2 → Canvas tab activates
- ✅ ⌘3 → Workflow tab activates
- ✅ Active tab has blue underline

---

## Responsive Design

### Test 22: Panel Toggles
**Action:** Look at bottom-left and bottom-right corners  
**Expected:**
- ✅ Bottom-left: "◀ Agents" button
- ✅ Bottom-right: "Trace ▶" button

### Test 23: Hide Left Panel
**Action:** Click "◀ Agents" button (or press ⌘B)  
**Expected:**
- ✅ Left panel slides out
- ✅ Center panel expands
- ✅ Button changes to "▶ Agents"

### Test 24: Hide Right Panel
**Action:** Click "Trace ▶" button (or press ⌘T)  
**Expected:**
- ✅ Right panel slides out
- ✅ Center panel expands to full width
- ✅ Button changes to "◀ Trace"

---

## View Switcher

### Test 25: Switch to Kanban View
**Action:** Click blue "Switch to Kanban View" button at top center  
**Expected:**
- ✅ Dashboard changes to Kanban board view
- ✅ Shows: Backlog | In Progress | Review | Done columns
- ✅ Task cards visible (from existing dashboard)
- ✅ Button now says "Switch to Operator View"

### Test 26: Switch Back
**Action:** Click "Switch to Operator View" button  
**Expected:**
- ✅ Returns to 3-panel operator dashboard
- ✅ All state preserved (same agents selected, etc.)

---

## Design System

### Test 27: Visual Polish
**Action:** Observe the overall design  
**Expected:**
- ✅ Dark navy background (#0A0F1E)
- ✅ Glassmorphism effect (blurred panels)
- ✅ Smooth transitions on hover
- ✅ Electric blue accents
- ✅ Custom scrollbars (styled)
- ✅ Consistent spacing
- ✅ Beautiful typography (Inter + JetBrains Mono)

---

## ✅ Test Checklist Summary

- [ ] Left Panel: 4 agents, quick stats, integrations
- [ ] Chat: Messages, send, approval gate
- [ ] Canvas: 3 cards, form interactions
- [ ] Workflow: Node graph, click node, sidebar
- [ ] Trace: Hierarchical spans, expand details
- [ ] Policy: Budget meter, 4 policies, toggles
- [ ] Audit: 4 entries, timestamps, hashes
- [ ] Memory: M0-M3 tiers, promotion indicators
- [ ] Demo toggle: ON/OFF, status changes
- [ ] Keyboard: ⌘1/2/3 tab switching
- [ ] Panels: Toggle left/right panels
- [ ] View switcher: Operator ↔ Kanban
- [ ] Design: Glassmorphism, animations, colors

**Expected Time:** 5-10 minutes  
**Result:** All features should work flawlessly

---

## 🐛 If Something Doesn't Work

1. **Check console:** Open browser DevTools (F12) → Console tab
2. **Check dev server:** Terminal should show Vite running
3. **Refresh page:** Cmd+R to reload
4. **Check build:** Run `npm run build` to verify no errors
5. **Report:** Copy console errors and send to developer

---

## 🎯 Success Criteria

After this 5-minute tour, you should have:
- ✅ Seen all 3 panels in action
- ✅ Tested chat with approval gate
- ✅ Explored Canvas and Workflow tabs
- ✅ Viewed all 4 right-panel tabs
- ✅ Used keyboard shortcuts
- ✅ Toggled demo mode
- ✅ Switched between Operator and Kanban views

**If 25/27 tests pass → Dashboard is production-ready** ✅

---

**Visual test complete!** Now you can show this to anyone and walk them through in 5 minutes.
