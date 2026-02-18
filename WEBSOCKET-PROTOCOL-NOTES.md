# WebSocket Protocol Investigation

## Problem
Custom WebSocket client fails with: `invalid request frame` error code 1008.

## What We Know

### Connection Flow (Expected)
```
1. Client opens WebSocket to ws://127.0.0.1:18789
2. Gateway sends: {type:"event", event:"connect.challenge", payload:{nonce, ts}}
3. Client must respond with connect.response
4. Gateway sends: {type:"event", event:"connect.ok"}
5. Client can now make JSON-RPC 2.0 calls
```

### What Fails
Every format we tried for `connect.response` results in "invalid request frame":

#### Attempt 1: No type wrapper
```json
{
  "nonce": "uuid-here"
}
```
❌ Failed

#### Attempt 2: Type wrapper, no payload
```json
{
  "type": "connect.response",
  "nonce": "uuid-here"
}
```
❌ Failed

#### Attempt 3: Type + payload wrapper
```json
{
  "type": "connect.response",
  "payload": {
    "nonce": "uuid-here",
    "deviceInfo": {
      "deviceId": "test-123",
      "deviceName": "Test",
      "deviceType": "cli"
    }
  }
}
```
❌ Failed

#### Attempt 4: Just the nonce string
```javascript
ws.send("uuid-here")
```
❌ Failed

### Gateway Logs Show
```
invalid handshake conn=... 
lastFrameType=connect.response
handshakeError=invalid request frame
```

This means Gateway IS receiving our connect.response but rejecting the frame structure itself.

## What the Official Control UI Does

The Control UI at http://127.0.0.1:18789/ works perfectly. Its JavaScript is minified at:
```
/usr/local/lib/node_modules/openclaw/dist/control-ui/assets/index-mlB3SJ08.js
```

### Key Observations from Source

1. **Device Identity System**
   - Uses Ed25519 keypair stored in localStorage
   - Key: `openclaw-device-identity-v1`
   - Contains: deviceId, publicKey, privateKey

2. **Signature Required**
   - Signs a specific payload with Ed25519
   - Payload format includes: deviceId, clientId, clientMode, role, scopes, signedAtMs, token, nonce
   - Separated by `|` character

3. **Connect Request Format (from decompiled code)**
```typescript
{
  minProtocol: 3,
  maxProtocol: 3,
  client: {
    id: "openclaw-control-ui",
    version: "dev",
    platform: "web",
    mode: "webchat",
    instanceId: string
  },
  role: "operator",
  scopes: ["operator.admin", "operator.approvals", "operator.pairing"],
  device: {
    id: deviceId,
    publicKey: base64,
    signature: base64,  // Ed25519 signature!
    signedAt: timestamp,
    nonce: string
  },
  caps: [],
  auth: {
    token: string | null,
    password: string | undefined
  },
  userAgent: string,
  locale: string
}
```

**This is sent as method="connect" via JSON-RPC 2.0!**

## The Real Protocol

The connect.response is NOT a simple event response. It's a full JSON-RPC 2.0 request:

```json
{
  "type": "req",
  "id": "uuid",
  "method": "connect",
  "params": {
    "minProtocol": 3,
    "maxProtocol": 3,
    "client": {...},
    "role": "operator",
    "scopes": [...],
    "device": {
      "id": "...",
      "publicKey": "...",
      "signature": "...",  // Ed25519!
      "signedAt": 1234567890,
      "nonce": "challenge-nonce"
    },
    "auth": {...}
  }
}
```

## Why We Failed

1. **We sent an event, not an RPC request**
   - Should be `type: "req"` not `type: "connect.response"`
   - Should be `method: "connect"`

2. **Missing Ed25519 signature**
   - Device must have Ed25519 keypair
   - Must sign payload with private key
   - Gateway verifies with public key

3. **Missing protocol negotiation**
   - Need minProtocol/maxProtocol
   - Need full client metadata

## Next Steps

### Option 1: Implement Proper Protocol
1. Generate Ed25519 keypair (use Web Crypto API)
2. Store in localStorage with proper format
3. Sign payload correctly
4. Send full connect RPC request

### Option 2: Localhost Auto-Approval
Docs say "Local connections (127.0.0.1) are auto-approved" but still need proper handshake format.

### Option 3: Use Official Control UI
Embed it (current solution) while we figure out the protocol.

## Required Libraries

To implement this properly, we need:
- Ed25519 signing library (TweetNaCl, noble-ed25519, or Web Crypto)
- Base64 encoding/decoding
- Proper payload serialization

## Code Reference

From Control UI source (decompiled):
- Function: `Ui()` - Gets device identity from localStorage
- Function: `Jd()` - Signs message with Ed25519
- Function: `sendConnect()` - Builds and sends connect request
- Storage key: `openclaw-device-identity-v1`

## Estimated Work

- **Quick hack (skip signing):** 30 minutes - may not work
- **Proper implementation:** 3-4 hours including Ed25519 integration
- **Testing & debugging:** 1-2 hours

**Total:** ~5 hours for proper WebSocket client

## Current Solution

For the 8-hour sprint, using iframe approach:
```tsx
<iframe src="http://127.0.0.1:18789/" />
```

This works immediately and lets us focus on value-add features.

## Future Work

When we have time:
1. Add noble-ed25519 library
2. Implement proper device identity
3. Build correct connect RPC request
4. Replace iframe with custom client

---

**Status:** Protocol understood, implementation deferred  
**Workaround:** iframe embed (working)  
**Priority:** Medium (official UI works fine)
