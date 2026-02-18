# 8-Hour Simplification Sprint
**Goal:** Simplify architecture, remove complexity, focus on core value

## 🎯 Current Problems

### Complexity Issues:
1. **Too many components** (16) - most are unused
2. **Over-abstracted stores** - Zustand + complex state management
3. **Mock data everywhere** - not connected to real Gateway
4. **Unclear purpose** - what does this actually DO for users?
5. **3-panel layout** - complicated, hard to navigate
6. **Multiple modes** (Demo/Live) - confusing

### What Users Actually Need:
1. **See running agents** (from OpenClaw Gateway)
2. **Chat with agents** (send/receive messages)
3. **Approve sensitive actions** (when gates trigger)
4. **Monitor costs** (how much am I spending?)
5. **View logs** (what did agents do?)

---

## 🚀 8-Hour Sprint Plan

### Hour 1-2: Simplify Architecture
**Goal:** Reduce from 16 components to 5 core components

#### Keep:
1. **AgentList** - Show running agents from Gateway
2. **Chat** - Talk to agents
3. **ApprovalGate** - Approve/reject actions
4. **CostTracker** - Simple cost display
5. **ActivityLog** - Recent agent actions

#### Remove:
- Canvas panel (unused)
- Workflow builder (premature)
- Policy editor (premature)
- Memory inspector (premature)
- Metrics dashboard (use simple cost tracker)
- Multiple tabs (use single scrolling page)

#### New Layout:
```
┌─────────────────────────────────────┐
│ Header: SINT Agent Dashboard        │
│ Status: 🟢 Connected   Cost: $12.34 │
├─────────────────────────────────────┤
│                                     │
│ Running Agents (3)                  │
│ [SINT] 🟢 Active - 2 tasks          │
│ [Mia]  🔵 Idle                      │
│ [Alex] 🟢 Active - 1 task           │
│                                     │
│ Chat                                │
│ ┌─────────────────────────────────┐ │
│ │ You: Build a dashboard          │ │
│ │ SINT: I'll start building...    │ │
│ │ [Approval Required]             │ │
│ │ ⚠️ Delete 5 files?              │ │
│ │ [Approve] [Reject]              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Recent Activity                     │
│ • 12:34 - SINT executed search      │
│ • 12:33 - User approved file write  │
│ • 12:30 - Mia started task          │
│                                     │
└─────────────────────────────────────┘
```

**Actions:**
- [ ] Create new simple layout component
- [ ] Remove unused components
- [ ] Flatten state management (single store)
- [ ] Remove Demo mode (always live)

---

### Hour 3-4: Real Gateway Connection
**Goal:** Actually connect to OpenClaw Gateway and make it work

#### Gateway Integration:
- [ ] Connect to ws://127.0.0.1:18789 (local Gateway)
- [ ] Authenticate with token
- [ ] Subscribe to agent events
- [ ] Display real agent list (from Gateway)
- [ ] Send messages to agents
- [ ] Receive agent responses
- [ ] Handle approval gates

#### Simplify WebSocket Client:
```typescript
// Simple, straightforward Gateway client
class GatewayClient {
  connect() { /* connect to ws://127.0.0.1:18789 */ }
  sendMessage(agentId, message) { /* send */ }
  onMessage(callback) { /* receive */ }
  onApprovalRequired(callback) { /* handle gate */ }
}
```

**No mock data, no demo mode, just real connection.**

---

### Hour 5-6: Core Features That Work
**Goal:** Make the essential features actually functional

#### 1. Agent List (30 min)
- [ ] Fetch agents from Gateway
- [ ] Show status (active/idle/error)
- [ ] Show current task
- [ ] Click to focus chat on that agent

#### 2. Chat (1 hour)
- [ ] Send messages to selected agent
- [ ] Receive streaming responses
- [ ] Display tool calls clearly
- [ ] Handle errors gracefully
- [ ] Auto-scroll to latest

#### 3. Approval Flow (30 min)
- [ ] Detect approval gate events
- [ ] Show approval UI inline in chat
- [ ] Send approve/reject to Gateway
- [ ] Show result

#### 4. Cost Tracking (30 min)
- [ ] Sum token costs from Gateway events
- [ ] Display total cost (simple number)
- [ ] Show cost per agent
- [ ] Daily/weekly totals

---

### Hour 7: Polish & Bug Fixes
**Goal:** Make it smooth and reliable

- [ ] Handle disconnection/reconnection
- [ ] Show connection status clearly
- [ ] Error messages that help
- [ ] Loading states
- [ ] Empty states (no agents yet)
- [ ] Responsive layout (desktop + mobile)
- [ ] Keyboard shortcuts (Cmd+K to focus chat)

---

### Hour 8: Documentation & Handoff
**Goal:** Make it easy for you to use and extend

#### Documentation:
- [ ] Update README with simple setup
- [ ] Document Gateway connection requirements
- [ ] Add troubleshooting guide
- [ ] Record 2-minute demo video

#### Cleanup:
- [ ] Remove dead code
- [ ] Remove unused dependencies
- [ ] Simplify package.json scripts
- [ ] Clear, simple folder structure

---

## 📁 New File Structure (Simplified)

```
sint-dashboard/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── AgentList.tsx      (simple list)
│   │   │   │   ├── Chat.tsx           (messages + input)
│   │   │   │   ├── ApprovalGate.tsx   (approve/reject)
│   │   │   │   ├── CostTracker.tsx    (total cost)
│   │   │   │   └── ActivityLog.tsx    (recent events)
│   │   │   ├── lib/
│   │   │   │   └── gateway.ts         (simple WS client)
│   │   │   ├── App.tsx                (single page layout)
│   │   │   └── main.tsx
│   │   └── package.json
│   └── api/ (if needed later)
└── README.md
```

**No more:**
- Complex state management
- Multiple stores
- Mock data system
- Demo mode toggles
- Unused components
- Over-abstracted utilities

---

## 🎯 Success Criteria

After 8 hours, you should be able to:

1. **Open dashboard** → See your running agents
2. **Click an agent** → Chat with it
3. **Send message** → Get response back
4. **Trigger approval** → Approve/reject inline
5. **Check cost** → See how much you spent today

**That's it. Simple, clear, useful.**

---

## 🔥 Principles for This Sprint

1. **Delete more than you add** - Remove complexity
2. **Real over mock** - No fake data, connect to Gateway
3. **Simple over clever** - Straightforward code
4. **Working over perfect** - Ship functional > beautiful
5. **User value first** - Does this help the user?

---

## 🚀 Let's Execute

Starting now. I'll work through each hour systematically.

**Hour 1-2:** Architectural simplification  
**Hour 3-4:** Real Gateway connection  
**Hour 5-6:** Core features  
**Hour 7:** Polish  
**Hour 8:** Documentation

Let's build something simple that actually works.
