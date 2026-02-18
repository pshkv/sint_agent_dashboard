# 🔍 Debug Dashboard Right Now

## Step 1: Hard Refresh Browser

**Press:** `Cmd+Shift+R` (Mac) or `Ctrl+Shift+F5` (Windows)

This loads the latest code with improved logging.

---

## Step 2: Open Browser Console

**Press:** `F12` or `Cmd+Option+I` (Mac)

**Go to:** Console tab

---

## Step 3: Watch the Logs

You should see emojis making it easy to follow:

### ✅ Good Connection:
```
[Gateway] ✅ WebSocket connected, waiting for handshake...
[Gateway] 📨 connect.challenge {...}
[Gateway] 🔐 Handling auth challenge, nonce: ...
[Gateway] 📤 Sent auth response
[Gateway] 📨 connect.ok {...}
[Gateway] ✅ Authenticated!
[Gateway] 📡 Subscribing to events...
[Gateway] 🔍 Fetching sessions...
[Gateway] 📦 Got response: {...}
[Gateway] 👥 Found X sessions
[Gateway] 🤖 Agent: {...}
```

### ❌ Bad Connection:
```
[Gateway] ❌ WebSocket error: ...
[Gateway] 🔌 Connection closed
[Gateway] 🔄 Reconnecting...
```

---

## Step 4: Check What You See

### If Connected:
- Green dot in header
- "Connected" status
- Agents listed (1-3 cards)
- Can click and chat

### If Disconnected:
- Red dot in header
- "Disconnected" status
- "No agents running" message
- Error banner at top

---

## Common Issues & Fixes

### Issue: Shows "Disconnected"

**Check:**
```bash
openclaw status | grep Gateway
```

**Should show:**
```
Gateway service: running (pid XXXXX)
```

**Fix:**
```bash
openclaw gateway restart
```

Then refresh browser.

---

### Issue: "No agents running"

**Check:**
```bash
openclaw status | grep Sessions
```

**Should show:**
```
Sessions: X active
```

**If 0 sessions:**
- Send a message to your OpenClaw bot (Telegram, Discord, etc.)
- Or start a session: `openclaw chat "Hello"`

Then refresh browser.

---

### Issue: Console shows errors

**Look for:**
- `❌` emoji - something failed
- `⚠️` emoji - warning but not critical

**Common errors:**

1. **"Not connected"**
   - Gateway isn't running
   - Run: `openclaw gateway`

2. **"Not authenticated"**
   - Handshake failed
   - Check if localhost (127.0.0.1)
   - Try: `openclaw gateway restart`

3. **"Timeout"**
   - Gateway not responding
   - Check: `openclaw logs --follow`
   - Look for errors

---

## Debug Checklist

- [ ] Gateway running? (`openclaw status`)
- [ ] Sessions exist? (`openclaw status | grep Sessions`)
- [ ] Browser console open? (F12)
- [ ] Hard refresh? (Cmd+Shift+R)
- [ ] See emoji logs? (✅ 📨 🔐 etc)
- [ ] Status turns green?
- [ ] Agents appear?

---

## What Should Happen

**Timeline:**
```
0s:  Open dashboard
1s:  Status: "Connecting..." (yellow)
2s:  WebSocket opens
3s:  Auth challenge received
4s:  Auth response sent
5s:  Auth success
6s:  Status: "Connected" (green)
7s:  Sessions fetched
8s:  Agents appear
9s:  Ready to chat!
```

**Total:** Should connect in ~9 seconds

---

## Still Not Working?

### Get Full Logs

**Browser:**
1. Right-click in console
2. "Save as..." or copy all
3. Send to me

**Gateway:**
```bash
openclaw logs --limit 100 > gateway-logs.txt
```

**System:**
```bash
openclaw status --all > system-status.txt
```

---

## Quick Fixes

### Nuclear Option
```bash
# Stop everything
openclaw gateway stop

# Clear browser
# Close browser completely
# Open new browser window

# Restart Gateway
openclaw gateway

# Open dashboard
open http://localhost:5173

# Watch console (F12)
```

### Just Restart Gateway
```bash
openclaw gateway restart
```

Then refresh browser (Cmd+Shift+R).

---

## Expected Console Output

When working correctly, you'll see this pattern:

```
[Gateway] ✅ WebSocket connected, waiting for handshake...
[Gateway] 📨 event {type: "event", event: "connect.challenge", ...}
[Gateway] 🔐 Handling auth challenge, nonce: abc123...
[Gateway] 📤 Sent auth response
[Gateway] 📨 event {type: "event", event: "connect.ok"}
[Gateway] ✅ Authenticated!
[Gateway] 📡 Subscribing to events...
[Gateway] ℹ️ Chat subscribe not available
[Gateway] 🔍 Fetching sessions...
[Gateway] 📤 RPC: sessions.list
[Gateway] 📨 {jsonrpc: "2.0", id: 1, result: {sessions: [...]}}
[Gateway] 📦 Got response: {sessions: Array(3)}
[Gateway] 👥 Found 3 sessions
[Gateway] 🤖 Agent: {id: "agent:main:...", name: "Main", ...}
[Gateway] 🤖 Agent: {id: "agent:main:telegram:...", name: "Main", ...}
[Gateway] 🤖 Agent: {id: "agent:main:cron:...", name: "Main", ...}
```

---

## 🚀 TL;DR

1. Hard refresh: `Cmd+Shift+R`
2. Open console: `F12`
3. Look for ✅ emojis
4. Check status turns green
5. See agents appear

If not working, check logs and run `openclaw gateway restart`

---

**Now go try it!** Open http://localhost:5173 with console open (F12).
