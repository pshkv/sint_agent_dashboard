# SINT Agent Dashboard

Simple, powerful web dashboard for managing OpenClaw AI agents.

![Dashboard Preview](https://via.placeholder.com/800x400.png?text=SINT+Agent+Dashboard)

## ✨ Features

- **Real-time Agent Monitoring** - See all your running OpenClaw agents
- **Interactive Chat** - Talk to any agent directly from the dashboard
- **Approval Gates** - Review and approve sensitive agent actions
- **Cost Tracking** - Monitor token usage and costs in real-time
- **Activity Log** - View recent agent activity with color-coded events
- **Auto-reconnect** - Stays connected to your Gateway automatically
- **Keyboard Shortcuts** - Quick navigation with ⌘K
- **Mobile Responsive** - Works great on phone, tablet, and desktop

## 🚀 Quick Start

### Prerequisites

- **OpenClaw Gateway** running locally
  ```bash
  openclaw gateway
  ```
- **Node.js** 18+ and npm

### Installation

```bash
# Clone or navigate to the dashboard
cd sint-dashboard

# Install dependencies
npm install

# Start development servers
npm run dev --workspace=apps/web
```

### Access

Open http://localhost:5173 in your browser.

The dashboard will automatically connect to your local Gateway at `ws://127.0.0.1:18789`.

## 📖 Usage

### Viewing Agents

- Your running OpenClaw agents appear automatically
- Each card shows: status, current task, and cost
- Click an agent card to select it for chat

### Chatting with Agents

1. Select an agent from the list
2. Type your message in the input
3. Press Enter to send (Shift+Enter for new line)
4. Watch for responses in real-time

### Handling Approvals

When an agent requests approval:
- A modal will appear with the request details
- Click **Approve** to allow the action
- Click **Reject** to deny it
- The result is sent back to the Gateway

### Keyboard Shortcuts

- **⌘K** (Mac) / **Ctrl+K** (Windows/Linux) - Focus chat input
- **Enter** - Send message
- **Shift+Enter** - New line in message

## 🏗️ Architecture

### Simple & Clean

This dashboard is intentionally simple:

- **5 React components** (not 16!)
- **No state management libraries** (just React state)
- **Direct WebSocket connection** to Gateway
- **~3,000 lines of code** (down from 8,000)

### Components

```
App-Simple.tsx         - Main application
├── AgentCard.tsx      - Display agent info
├── ChatWindow.tsx     - Messages & input
├── ApprovalGate.tsx   - Approval modal
├── CostDisplay.tsx    - Cost tracker
└── ActivityLog.tsx    - Event log
```

### Gateway Protocol

Uses OpenClaw Gateway JSON-RPC 2.0:

- `sessions.list` - Fetch running agents
- `chat.send` - Send messages
- `chat.subscribe` - Receive messages
- `approval.respond` - Handle approvals

## 🛠️ Development

### Project Structure

```
sint-dashboard/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── components/simple/  - UI components
│       │   ├── lib/                - Gateway client
│       │   ├── styles/             - CSS
│       │   └── App-Simple.tsx      - Main app
│       └── package.json
├── README.md
└── package.json
```

### Running Locally

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev --workspace=apps/web

# Build for production
npm run build --workspace=apps/web

# Preview production build
npm run preview --workspace=apps/web
```

### Environment Variables

None required! The dashboard connects to `ws://127.0.0.1:18789` by default.

To change the Gateway URL, edit `gateway-simple.ts`:

```typescript
connect('ws://YOUR-GATEWAY-URL');
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads at http://localhost:5173
- [ ] Connection status shows green
- [ ] Agents appear from Gateway
- [ ] Can select an agent
- [ ] Can send messages
- [ ] Responses appear in chat
- [ ] Cost tracker updates
- [ ] Activity log shows events
- [ ] Approval modal works (if triggered)
- [ ] Keyboard shortcuts work (⌘K)

### Gateway Connection Test

```bash
# Check Gateway is running
openclaw status

# You should see:
# Gateway: local · ws://127.0.0.1:18789
# Sessions: X active

# Open dashboard
open http://localhost:5173

# Status should show "🟢 Connected"
```

## 🐛 Troubleshooting

### Dashboard won't connect

**Problem:** Status shows "🔴 Disconnected"

**Solutions:**
1. Check Gateway is running: `openclaw status`
2. Start Gateway: `openclaw gateway`
3. Check WebSocket port: should be 18789
4. Try refreshing the page

### No agents showing

**Problem:** "No agents running" message

**Solutions:**
1. Check you have active sessions: `openclaw status`
2. Start a chat in OpenClaw (Telegram, etc.)
3. Click the refresh button in dashboard
4. Check browser console for errors

### Messages not sending

**Problem:** Messages don't reach agent

**Solutions:**
1. Check you've selected an agent (blue highlight)
2. Verify connection is green
3. Check browser console for errors
4. Try disconnecting/reconnecting Gateway

### Port already in use

**Problem:** `Error: Port 5173 is already in use`

**Solutions:**
1. Kill existing process: `lsof -ti:5173 | xargs kill -9`
2. Or use different port: `npm run dev --workspace=apps/web -- --port 5174`

## 📊 Performance

- **Initial load:** ~300KB (gzipped)
- **Bundle size:** 306KB uncompressed
- **Build time:** ~2.8s
- **Hot reload:** <100ms
- **Connection latency:** <50ms (local Gateway)

## 🔒 Security

### Local Connection Only

The dashboard connects to `127.0.0.1` (localhost) by default. This means:

- ✅ Safe on your local machine
- ✅ No external access
- ✅ No authentication needed

### Remote Access (Not Recommended)

If you need remote access:

1. Use OpenClaw's built-in Control UI instead
2. Or set up Tailscale: `openclaw gateway --tailscale serve`
3. **Never** expose Gateway port publicly

## 🚢 Deployment

### Option 1: Local Only (Recommended)

Keep it simple - run locally with `npm run dev`.

### Option 2: Railway/Vercel (Static)

Deploy the web app separately from Gateway:

```bash
# Build static files
npm run build --workspace=apps/web

# Deploy dist/ folder to:
# - Vercel
# - Railway
# - Netlify
# - Any static host
```

Configure Gateway URL as environment variable:
```bash
VITE_GATEWAY_URL=wss://your-gateway.example.com
```

### Option 3: Docker (Advanced)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --workspace=apps/web
CMD ["npm", "run", "preview", "--workspace=apps/web"]
```

## 🤝 Contributing

This is a personal project, but suggestions welcome!

1. Keep it simple
2. No unnecessary dependencies
3. Mobile-first design
4. Accessibility matters

## 📄 License

MIT

## 🙏 Acknowledgments

- Built for [OpenClaw](https://openclaw.ai)
- Designed for simplicity and speed
- Inspired by real user needs

## 📞 Support

- **Docs:** https://docs.openclaw.ai
- **Issues:** Check browser console first
- **Questions:** See troubleshooting section above

---

**Made with ❤️ for the OpenClaw community**

Last updated: 2026-02-18
