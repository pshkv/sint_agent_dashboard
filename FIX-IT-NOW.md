# ⚡ Fix Dashboard in 30 Seconds

## Do This Right Now:

### 1. Hard Refresh Browser
```
Press: Cmd+Shift+R (Mac)
Or:    Ctrl+Shift+F5 (Windows)
```

### 2. Open Console
```
Press: F12
Then:  Click "Console" tab
```

### 3. Watch for Emojis
```
✅ = Good
❌ = Bad
🔐 = Authenticating
👥 = Found agents
```

---

## Should See This:

```
[Gateway] ✅ WebSocket connected
[Gateway] 🔐 Handling auth challenge
[Gateway] ✅ Authenticated!
[Gateway] 👥 Found 3 sessions
```

Then status turns **GREEN** and agents appear!

---

## If Still Red:

### Quick Fix:
```bash
openclaw gateway restart
```

Then refresh browser again (Cmd+Shift+R).

---

## Check Agents Exist:
```bash
openclaw status | grep Sessions
```

Should show: `Sessions: X active` (X > 0)

If 0 sessions:
- Send message to your OpenClaw bot
- Or run: `openclaw chat "test"`

---

## Still Broken?

Read: **DEBUG-NOW.md** (detailed troubleshooting)

Or check:
1. Gateway running? `openclaw status`
2. Console errors? Look for `❌`
3. Network tab? Check WebSocket connection

---

**TL;DR:**
1. Cmd+Shift+R (hard refresh)
2. F12 (open console)
3. See ✅ emojis = working
4. See ❌ emojis = check logs

**Go do it now!** 🚀
