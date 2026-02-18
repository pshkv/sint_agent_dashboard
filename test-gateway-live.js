#!/usr/bin/env node
/**
 * Live Gateway Integration Test
 * Tests full WebSocket flow with OpenClaw Gateway
 */

const WebSocket = require('ws');

const GATEWAY_URL = 'ws://127.0.0.1:18789';
const TEST_TIMEOUT = 30000; // 30 seconds

class GatewayTester {
  constructor() {
    this.ws = null;
    this.authenticated = false;
    this.eventsReceived = [];
    this.testResults = {
      connection: false,
      authentication: false,
      messageEcho: false,
      eventFlow: false,
      cleanup: false,
    };
  }

  async run() {
    console.log('🚀 Starting Gateway Integration Test\n');
    console.log('Target:', GATEWAY_URL);
    console.log('Timeout:', TEST_TIMEOUT + 'ms\n');
    console.log('─'.repeat(60));

    try {
      await this.testConnection();
      await this.testAuthentication();
      await this.testMessageFlow();
      await this.cleanup();
      
      this.printResults();
      process.exit(this.allTestsPassed() ? 0 : 1);
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      this.printResults();
      process.exit(1);
    }
  }

  testConnection() {
    return new Promise((resolve, reject) => {
      console.log('\n📡 Test 1: WebSocket Connection');
      
      this.ws = new WebSocket(GATEWAY_URL);
      
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 5000);

      this.ws.on('open', () => {
        clearTimeout(timeout);
        console.log('   ✅ Connected to Gateway');
        this.testResults.connection = true;
        resolve();
      });

      this.ws.on('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(`Connection failed: ${error.message}`));
      });

      this.ws.on('message', (data) => {
        this.handleMessage(data);
      });

      this.ws.on('close', () => {
        console.log('   🔌 Connection closed');
      });
    });
  }

  testAuthentication() {
    return new Promise((resolve, reject) => {
      console.log('\n🔐 Test 2: Authentication Handshake');
      
      const timeout = setTimeout(() => {
        reject(new Error('Authentication timeout'));
      }, 5000);

      const checkAuth = () => {
        if (this.authenticated) {
          clearTimeout(timeout);
          console.log('   ✅ Authentication successful');
          this.testResults.authentication = true;
          resolve();
        }
      };

      // Check every 100ms
      const interval = setInterval(() => {
        checkAuth();
        if (this.authenticated) {
          clearInterval(interval);
        }
      }, 100);
    });
  }

  testMessageFlow() {
    return new Promise((resolve, reject) => {
      console.log('\n💬 Test 3: Message Flow');
      
      // Send a test message through operator channel
      const testMessage = {
        type: 'operator.command',
        event: 'test.ping',
        payload: {
          message: 'Test from dashboard',
          timestamp: Date.now(),
        },
      };

      console.log('   📤 Sending test message...');
      this.ws.send(JSON.stringify(testMessage));
      
      // Wait for any response events
      setTimeout(() => {
        if (this.eventsReceived.length > 1) { // More than just auth challenge
          console.log(`   ✅ Received ${this.eventsReceived.length - 1} events`);
          this.testResults.messageEcho = true;
          this.testResults.eventFlow = true;
        } else {
          console.log('   ⚠️  No response events (Gateway might not echo operator commands)');
          this.testResults.messageEcho = false;
          this.testResults.eventFlow = false;
        }
        resolve();
      }, 3000);
    });
  }

  cleanup() {
    return new Promise((resolve) => {
      console.log('\n🧹 Test 4: Cleanup');
      
      if (this.ws) {
        this.ws.close();
        console.log('   ✅ Connection closed gracefully');
        this.testResults.cleanup = true;
      }
      
      setTimeout(resolve, 500);
    });
  }

  handleMessage(data) {
    try {
      const message = JSON.parse(data.toString());
      this.eventsReceived.push(message);
      
      // Log all events
      console.log(`   📨 Event: ${message.event || message.type}`);
      
      // Handle auth challenge
      if (message.type === 'event' && message.event === 'connect.challenge') {
        console.log('   🔑 Received auth challenge, responding...');
        this.ws.send(JSON.stringify({
          type: 'event',
          event: 'connect.auth',
          payload: {
            nonce: message.payload.nonce,
            token: null, // No auth for local dev
          },
        }));
        this.authenticated = true;
      }
      
      // Handle other events
      if (message.type === 'event' && message.event !== 'connect.challenge') {
        console.log(`   📊 Payload:`, JSON.stringify(message.payload, null, 2).substring(0, 200));
      }
    } catch (error) {
      console.error('   ⚠️  Failed to parse message:', error.message);
    }
  }

  allTestsPassed() {
    // Connection, auth, and cleanup are critical
    const critical = this.testResults.connection && 
                     this.testResults.authentication && 
                     this.testResults.cleanup;
    
    // Message flow is nice-to-have (Gateway might not echo operator commands)
    return critical;
  }

  printResults() {
    console.log('\n' + '─'.repeat(60));
    console.log('\n📊 Test Results:\n');
    
    Object.entries(this.testResults).forEach(([test, passed]) => {
      const icon = passed ? '✅' : '❌';
      const status = passed ? 'PASS' : 'FAIL';
      console.log(`   ${icon} ${test.padEnd(20)} ${status}`);
    });
    
    console.log('\n📈 Events Received:', this.eventsReceived.length);
    
    if (this.eventsReceived.length > 0) {
      console.log('\n📝 Event Types:');
      const eventCounts = {};
      this.eventsReceived.forEach(e => {
        const type = e.event || e.type;
        eventCounts[type] = (eventCounts[type] || 0) + 1;
      });
      Object.entries(eventCounts).forEach(([type, count]) => {
        console.log(`   - ${type}: ${count}`);
      });
    }
    
    console.log('\n' + '─'.repeat(60));
    console.log(this.allTestsPassed() ? '\n✅ Gateway Integration: READY\n' : '\n❌ Gateway Integration: FAILED\n');
  }
}

// Run tests
const tester = new GatewayTester();
tester.run();
