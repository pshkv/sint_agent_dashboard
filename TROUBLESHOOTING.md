# Troubleshooting Guide

Common issues and how to fix them.

## 🔴 Connection Issues

### Dashboard shows "Disconnected"

**Symptoms:**
- Red dot in header
- "Disconnected from Gateway. Reconnecting..." message
- No agents showing

**Diagnosis:**
```bash
# Check if Gateway is running
openclaw status

# Look for this line:
# Gateway service: running (pid XXXXX)
```

**Solutions:**

1. **Gateway not running:**
   ```bash
   openclaw gateway
   ```

2. **Wrong port:**
   - Default is 18789
   - Check your config: `openclaw config get gateway.port`
   - Update `gateway-simple.ts` if different

3. **Firewall blocking:**
   ```bash
   # Allow localhost connections
   # On Mac: System Settings → Network → Firewall → Options
   # Add exception for port 18789
   ```

4. **Browser blocking WebSocket:**
   - Check browser console (F12)
   - Look for WebSocket errors
   - Try different browser

---

## 👻 No Agents Showing

### "No agents running" message

**Symptoms:**
- Connected (green dot)
- Empty agent list
- Message says "No agents running"

**Diagnosis:**
```bash
# Check active sessions
openclaw status

# Look for "Sessions" section
# Should show at least 1 active session
```

**Solutions:**

1. **No active sessions:**
   - Start a chat in OpenClaw (Telegram, Discord, etc.)
   - Or send a message to create a session

2. **Sessions.list failing:**
   - Check browser console
   - Look for error: "Failed to fetch sessions"
   - Try refreshing page

3. **Wrong session format:**
   - Gateway might be using different session keys
   - Check `gateway-simple.ts` line ~100
   - Update `getSessionName()` logic if needed

---

## 💬 Chat Not Working

### Messages don't send

**Symptoms:**
- Type message, press Enter
- Message appears in chat (user side)
- No response from agent
- Loading spinner never stops

**Diagnosis:**
- Open browser console (F12)
- Look for errors when sending
- Check Network tab for WebSocket frames

**Solutions:**

1. **Agent not selected:**
   - Click an agent card (should highlight blue)
   - Then try sending

2. **Chat.send failing:**
   - Check agent ID is valid
   - Try different agent
   - Refresh page and try again

3. **No response from Gateway:**
   - Gateway might be busy
   - Check `openclaw logs --follow`
   - Look for chat.send events

4. **Wrong session key:**
   - Agent ID might be malformed
   - Check browser console for actual ID sent
   - Update logic if needed

---

## 💸 Cost Not Updating

### Cost shows $0.00 or wrong amount

**Symptoms:**
- Connected and working
- Cost display shows $0 or outdated value

**Diagnosis:**
```bash
# Check session costs
openclaw status

# Look for token counts per session
```

**Solutions:**

1. **Session missing cost data:**
   - Not all sessions track cost
   - Some providers don't report token usage
   - This is expected for some models

2. **Cost calculation wrong:**
   - Check `calculateSessionCost()` in `gateway-simple.ts`
   - Update to match your Gateway's cost field

3. **Total not summing:**
   - Check browser console
   - Verify agents array has cost values
   - Debug total calculation in App-Simple.tsx

---

## 🚨 Approval Gates Not Working

### Approval modal doesn't appear

**Symptoms:**
- Agent should request approval
- No modal shows up
- Action might proceed without approval

**Diagnosis:**
- Check browser console
- Look for approval.required events
- Check OpenClaw logs: `openclaw logs --follow`

**Solutions:**

1. **Events not subscribed:**
   - Check `gateway-simple.ts` line ~75
   - Ensure `approvals.subscribe()` is called

2. **Wrong event format:**
   - Gateway might send different format
   - Check `handleMessage()` approval case
   - Update to match actual event structure

3. **Modal state bug:**
   - Try refreshing page
   - Check React DevTools
   - Verify pendingApproval state

---

## 🎨 UI Issues

### Layout broken or ugly

**Symptoms:**
- Components overlapping
- Text too small/large
- Colors wrong
- Responsive issues

**Solutions:**

1. **CSS not loading:**
   - Check browser console
   - Look for 404 errors on CSS files
   - Verify `main.tsx` imports

2. **Tailwind not working:**
   - Rebuild: `npm run build --workspace=apps/web`
   - Check `tailwind.config.js`
   - Verify PostCSS config

3. **Mobile issues:**
   - Check viewport meta tag in `index.html`
   - Test with browser DevTools device mode
   - Check `responsive.css`

4. **Animations janky:**
   - Check `animations.css`
   - Disable if needed: remove import from `main.tsx`
   - Check for `prefers-reduced-motion`

---

## ⌨️ Keyboard Shortcuts Not Working

### ⌘K doesn't focus chat

**Symptoms:**
- Press ⌘K (or Ctrl+K)
- Nothing happens
- Input doesn't focus

**Solutions:**

1. **Event listener not attached:**
   - Check browser console for errors
   - Verify `useEffect` in App-Simple.tsx line ~50
   - Check event handler is added

2. **Browser capturing shortcut:**
   - Some browsers use ⌘K for search
   - Try Ctrl+K instead
   - Or click input manually

3. **Input disabled:**
   - Must have agent selected
   - Check connection is active
   - Verify input isn't disabled

---

## 🔥 Performance Issues

### Dashboard slow or laggy

**Symptoms:**
- Typing delayed
- Scrolling jerky
- High CPU usage
- Browser fan spinning

**Solutions:**

1. **Too many activities:**
   - Activity log keeps last 50
   - Check if it's growing unbounded
   - Clear: refresh page

2. **Too many messages:**
   - Messages array grows forever
   - Add limit (e.g., last 100)
   - Or implement pagination

3. **Animations too heavy:**
   - Disable animations in `animations.css`
   - Remove `animate-*` classes
   - Check CSS transitions

4. **WebSocket spam:**
   - Gateway sending too many events
   - Check Network tab
   - Throttle event handling if needed

---

## 🐛 Build Issues

### npm install fails

**Symptoms:**
- Dependency errors
- Version conflicts
- Peer dependency warnings

**Solutions:**

1. **Node version:**
   ```bash
   node --version  # Should be 18+
   nvm use 18      # Or install Node 18
   ```

2. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Cache issues:**
   ```bash
   npm cache clean --force
   npm install
   ```

### npm run dev fails

**Symptoms:**
- Vite won't start
- Port errors
- Module not found

**Solutions:**

1. **Port in use:**
   ```bash
   lsof -ti:5173 | xargs kill -9
   npm run dev --workspace=apps/web
   ```

2. **Wrong workspace:**
   ```bash
   # Must include --workspace flag
   npm run dev --workspace=apps/web
   ```

3. **Missing dependencies:**
   ```bash
   cd apps/web
   npm install
   cd ../..
   npm run dev --workspace=apps/web
   ```

---

## 🔍 Debugging Tips

### Enable Verbose Logging

**Browser Console:**
```javascript
// In browser console
localStorage.setItem('debug', 'gateway:*');
```

Then refresh page. Gateway client will log everything.

### Check WebSocket Messages

1. Open DevTools (F12)
2. Go to Network tab
3. Filter: WS
4. Click the WebSocket connection
5. View Messages tab
6. See all frames sent/received

### React DevTools

Install React DevTools extension:
- Chrome: https://chrome.google.com/webstore (search "React Developer Tools")
- Firefox: https://addons.mozilla.org/firefox (search "React Developer Tools")

Then:
1. Open DevTools
2. Click "Components" tab
3. Inspect state/props
4. Time-travel through state changes

### Gateway Logs

```bash
# Follow Gateway logs in real-time
openclaw logs --follow

# Search logs
openclaw logs | grep "chat.send"

# Last 100 lines
openclaw logs --limit 100
```

---

## 📞 Getting Help

### Before Asking

1. ✅ Check this guide
2. ✅ Check browser console
3. ✅ Check Gateway logs
4. ✅ Try refreshing page
5. ✅ Try restarting Gateway

### When Asking

Include:
- **Dashboard URL:** http://localhost:5173
- **Gateway status:** `openclaw status` output
- **Browser:** Chrome 120, Firefox 121, etc.
- **OS:** macOS 14, Windows 11, etc.
- **Console errors:** Screenshot or copy/paste
- **What you tried:** List steps taken

### Where to Ask

- OpenClaw Discord: https://discord.com/invite/clawd
- OpenClaw Docs: https://docs.openclaw.ai
- GitHub Issues: (if code bug)

---

## 🎯 Quick Fixes

### "It's not working!"

Try this first:
```bash
# 1. Restart Gateway
openclaw gateway restart

# 2. Clear browser cache
# Chrome: Cmd+Shift+R (force refresh)

# 3. Restart dev server
# Kill terminal, restart:
npm run dev --workspace=apps/web

# 4. Check status
openclaw status
```

### Nuclear Option

When all else fails:
```bash
# Stop everything
pkill -f "openclaw"
pkill -f "vite"

# Clean install
rm -rf node_modules package-lock.json
npm install

# Restart Gateway
openclaw gateway

# Start dashboard
npm run dev --workspace=apps/web

# Open fresh browser window
open -n -a "Google Chrome" --args --incognito http://localhost:5173
```

---

**Still stuck? Check the main README.md or ask for help!**
