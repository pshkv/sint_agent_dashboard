# SINT Agent Dashboard - User Guide

## What Is This?

A full-featured web dashboard for managing OpenClaw AI agents. Combines OpenClaw's official Control UI with enhanced value-add features:

- **System Status Monitoring**: Real-time Gateway health checks
- **Quick Actions**: Keyboard shortcuts and common commands
- **Cost Tracking**: Model pricing, calculators, and saving tips
- **Recent Activity**: View recent agents, sessions, and actions
- **Help & Documentation**: Built-in guides and resource links

## Getting Started

### Prerequisites
- OpenClaw Gateway running on `localhost:18789`
- Node.js 18+ (for development)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/pshkv/sint_agent_dashboard
cd sint_agent_dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Dashboard will be available at: **http://localhost:5173**

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

### 1. Tabbed Sidebar

Five organized tabs for different workflows:

#### 📊 Overview
- **System Status**: Gateway connection, WebSocket status, location
- **Recent Activity**: Latest agents, sessions, and cron jobs
- Live health monitoring with color-coded status indicators

#### ⚡ Actions
- **Quick Actions**: Common keyboard shortcuts
- One-click access to:
  - Search (`/`)
  - New Chat (`n`)
  - Cron Jobs (`c`)
  - Sessions (`s`)
  - Devices (`d`)
  - Usage (`u`)
  - Logs (`l`)
  - Help (`?`)

#### 💰 Costs
- **Model Cost Reference**: Pricing for GPT-4o, Claude, Gemini
- **Cost Saving Tips**: Practical advice for reducing API spend
- **Quick Calculator**: Estimate costs for common token amounts
- Real-time cost breakdowns (when WebSocket connects)

#### 📈 Activity
- **Recent Activity Feed**: Agents, sessions, cron jobs
- **Filtering**: View all, agents only, or sessions only
- **Status Indicators**: Active (green), idle (gray), error (red)
- Timestamps for each activity

#### ❓ Help
- **Quick Tips**: Best practices and workflow suggestions
- **Documentation Links**: OpenClaw docs, GitHub, Discord, ClawHub
- **Dashboard Info**: Current mode, protocol version
- **Protocol Notes**: WebSocket implementation status

### 2. Main Control UI

Embedded OpenClaw Control UI provides:
- Full chat interface with your agents
- Session management
- Cron job scheduling
- Device pairing
- Config editor
- Live logs
- And all other official OpenClaw features

### 3. Header Features

- **Toggle Info Banner**: Show/hide the info banner
- **Toggle Sidebar**: Collapse sidebar for full-width Control UI
- **New Tab**: Open Control UI in separate browser tab

### 4. Footer

- Version info
- Status indicator (online/offline)
- Links to GitHub and OpenClaw docs

## Keyboard Shortcuts

These work in the embedded Control UI:

- `/` - Search sessions, agents, or commands
- `?` - Show help and shortcuts
- `n` - Start new chat session
- `c` - View cron jobs
- `s` - List all sessions
- `d` - Manage paired devices
- `u` - View usage and costs
- `l` - Open live log viewer

## Architecture

### Hybrid Approach

The dashboard uses a **hybrid architecture**:

1. **Official Control UI** (embedded via iframe)
   - Proven, stable, full-featured
   - Direct WebSocket connection to Gateway
   - All official OpenClaw functionality

2. **Value-Add Components** (React sidebar)
   - Quick actions and shortcuts
   - Cost tracking and tips
   - System status monitoring
   - Help and documentation

**Why hybrid?**
- Delivers working dashboard NOW
- Avoids reimplementing complex WebSocket protocol
- Adds unique value without duplication
- Can migrate to full custom implementation later if needed

### Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Control UI**: OpenClaw official (iframe embed)
- **Connection**: Gateway WebSocket (via Control UI)

## WebSocket Protocol Status

### Current Implementation: Iframe

The dashboard embeds OpenClaw's official Control UI, which handles the full WebSocket connection.

### Future: Direct WebSocket Client

A custom WebSocket client is planned but requires:

1. **Ed25519 Cryptography**
   - Generate keypair
   - Store in localStorage
   - Sign connection payload

2. **Proper Handshake Format**
   ```typescript
   {
     type: "req",
     method: "connect",
     params: {
       minProtocol: 3,
       device: {
         id: deviceId,
         publicKey: base64,
         signature: base64Ed25519,  // Critical!
         signedAt: timestamp
       },
       // ... more fields
     }
   }
   ```

3. **Estimated Work**: ~5 hours

**Decision**: Ship working hybrid solution now, implement direct WebSocket later if valuable.

See `WEBSOCKET-PROTOCOL-NOTES.md` for complete technical details.

## Customization

### Branding

Edit `apps/web/src/App-Final.tsx`:

```tsx
// Change header title
<h1 className="text-2xl font-bold">YOUR NAME</h1>

// Change subtitle
<span className="text-xs text-blue-200">Your Tagline</span>
```

### Colors

Tailwind classes in components use blue theme. To change:

```tsx
// Replace all instances of:
bg-blue-600 → bg-purple-600
text-blue-600 → text-purple-600
// etc.
```

### Sidebar Tabs

Add/remove tabs in `App-Final.tsx`:

```tsx
const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  // Add your tab here:
  { id: 'custom', label: 'Custom', icon: '🎨' },
];

// Add corresponding content:
{activeTab === 'custom' && <YourComponent />}
```

### Mock Data

Components use mock data (placeholders). When WebSocket client is ready:

1. Remove mock data from components
2. Add WebSocket hooks to fetch real data
3. Update state with live information

Example in `RecentActivity.tsx`:
```tsx
// Current:
const MOCK_ACTIVITY: ActivityItem[] = [...]

// Future:
const [activity, setActivity] = useState<ActivityItem[]>([]);
useWebSocket({
  onActivity: (data) => setActivity(data)
});
```

## Troubleshooting

### Dashboard Won't Load

1. Check Gateway is running:
   ```bash
   openclaw status
   ```

2. Verify URL:
   - Dashboard: http://localhost:5173
   - Gateway: http://127.0.0.1:18789

3. Check browser console for errors

### Control UI Shows "Connection Failed"

1. Gateway might not be running:
   ```bash
   openclaw gateway start
   ```

2. Check Gateway logs:
   ```bash
   openclaw logs
   ```

3. Try opening Control UI directly: http://127.0.0.1:18789

### Sidebar Not Showing

1. Click "▶️ Sidebar" button in header
2. Check browser zoom level (should be 100%)
3. Try wider browser window

### Components Show Mock Data

This is expected! Real data requires WebSocket client implementation (future work). Mock data demonstrates the UI.

## Development

### Project Structure

```
sint-dashboard/
├── apps/
│   └── web/
│       ├── src/
│       │   ├── components/      # Sidebar widgets
│       │   │   ├── QuickActions.tsx
│       │   │   ├── SystemStatus.tsx
│       │   │   ├── CostTracker.tsx
│       │   │   ├── RecentActivity.tsx
│       │   │   └── Documentation.tsx
│       │   ├── App-Final.tsx    # Main dashboard
│       │   ├── main.tsx         # Entry point
│       │   └── index.css        # Global styles
│       └── index.html
├── WEBSOCKET-PROTOCOL-NOTES.md  # Protocol research
├── SPRINT-STATUS-*.md           # Development logs
└── package.json
```

### Adding New Components

1. Create component in `apps/web/src/components/`
2. Import in `App-Final.tsx`
3. Add to appropriate sidebar tab
4. Style with Tailwind CSS

### Testing Changes

```bash
# Watch mode (auto-reload on file changes)
npm run dev

# Build and check for errors
npm run build

# Type checking
npm run type-check  # if configured
```

## Deployment

### Option 1: Static Host

Build and deploy to any static host:

```bash
npm run build
# Deploy ./apps/web/dist to:
# - Vercel
# - Netlify
# - Cloudflare Pages
# - GitHub Pages
# - etc.
```

**Important**: Ensure Gateway is accessible from deployed location (VPN, SSH tunnel, or public proxy).

### Option 2: Local Only

Keep dashboard on localhost, access via:
- http://localhost:5173 (dev)
- http://localhost:4173 (preview)

### Option 3: Self-Hosted

Use nginx/Apache to serve the build:

```nginx
server {
  listen 80;
  server_name dashboard.example.com;
  root /path/to/dist;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Contributing

This is a personal project, but suggestions welcome!

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

[Your License Here]

## Credits

- **OpenClaw**: https://github.com/openclaw/openclaw
- **Built by**: Illia Pashkov (@pshkv)
- **Company**: SINT (agentic AI)

## Support

- **GitHub Issues**: https://github.com/pshkv/sint_agent_dashboard/issues
- **OpenClaw Discord**: https://discord.com/invite/clawd
- **OpenClaw Docs**: https://docs.openclaw.ai

---

**Version**: 1.0.0  
**Status**: Production Ready (Hybrid Mode)  
**Last Updated**: 2026-02-18
