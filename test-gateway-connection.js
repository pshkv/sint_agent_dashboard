/**
 * Test OpenClaw Gateway WebSocket Connection
 */

const WebSocket = require('ws');

const GATEWAY_URL = 'ws://127.0.0.1:18789';

console.log('[Test] Connecting to OpenClaw Gateway:', GATEWAY_URL);

const ws = new WebSocket(GATEWAY_URL);

ws.on('open', () => {
  console.log('[Test] ✅ Connected to Gateway!');
  
  // Send a test message
  const testMessage = {
    type: 'ping',
    timestamp: new Date().toISOString(),
  };
  
  console.log('[Test] Sending test message:', testMessage);
  ws.send(JSON.stringify(testMessage));
  
  // Wait 2 seconds then close
  setTimeout(() => {
    console.log('[Test] Closing connection...');
    ws.close();
  }, 2000);
});

ws.on('message', (data) => {
  console.log('[Test] ✅ Received message from Gateway:');
  try {
    const parsed = JSON.parse(data.toString());
    console.log(JSON.stringify(parsed, null, 2));
  } catch (e) {
    console.log(data.toString());
  }
});

ws.on('error', (error) => {
  console.error('[Test] ❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
  console.log('[Test] Connection closed. Code:', code, 'Reason:', reason.toString());
  process.exit(code === 1000 ? 0 : 1);
});

// Timeout after 10 seconds
setTimeout(() => {
  if (ws.readyState !== WebSocket.CLOSED) {
    console.error('[Test] ❌ Timeout - closing connection');
    ws.close();
    process.exit(1);
  }
}, 10000);
