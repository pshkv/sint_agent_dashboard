# OpenClaw Integration Guide

This guide shows how to automatically track costs from SINT (me) to the dashboard.

## Auto-Track Costs from Agent Sessions

### Method 1: Manual Call (Testing)

```bash
curl -X POST http://localhost:3000/api/costs \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "YOUR_TASK_ID",
    "model": "claude-sonnet-4-5",
    "input_tokens": 80000,
    "output_tokens": 4000,
    "cost_usd": 0.306,
    "session_key": "agent:main:main"
  }'
```

### Method 2: Auto-Track via Script

Create `track-cost.sh` in workspace:

```bash
#!/bin/bash
# Usage: ./track-cost.sh <task_id> <model> <input_tokens> <output_tokens> <cost>

TASK_ID=$1
MODEL=$2
INPUT_TOKENS=$3
OUTPUT_TOKENS=$4
COST=$5

curl -X POST http://localhost:3000/api/costs \
  -H "Content-Type: application/json" \
  -d "{
    \"task_id\": \"$TASK_ID\",
    \"model\": \"$MODEL\",
    \"input_tokens\": $INPUT_TOKENS,
    \"output_tokens\": $OUTPUT_TOKENS,
    \"cost_usd\": $COST,
    \"session_key\": \"agent:main:main\"
  }"
```

Usage:
```bash
chmod +x track-cost.sh
./track-cost.sh "24c39cfb-a8d6-4610-a1e4-a4488d58b4f3" "claude-sonnet-4-5" 80000 4000 0.306
```

### Method 3: Node.js Integration

Create `track-cost.js`:

```javascript
import fetch from 'node-fetch';

export async function trackCost({
  taskId,
  model,
  inputTokens,
  outputTokens,
  costUsd,
  sessionKey = 'agent:main:main'
}) {
  try {
    const response = await fetch('http://localhost:3000/api/costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_id: taskId,
        model,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        cost_usd: costUsd,
        session_key: sessionKey,
      }),
    });

    if (!response.ok) {
      console.error('Failed to track cost:', await response.text());
    } else {
      console.log('✅ Cost tracked successfully');
    }
  } catch (error) {
    console.error('Error tracking cost:', error);
  }
}

// Example usage:
// trackCost({
//   taskId: '24c39cfb-a8d6-4610-a1e4-a4488d58b4f3',
//   model: 'claude-sonnet-4-5',
//   inputTokens: 80000,
//   outputTokens: 4000,
//   costUsd: 0.306,
// });
```

## Cost Calculation Helper

```javascript
const MODEL_RATES = {
  'claude-sonnet-4-5': { input: 0.003, output: 0.015 }, // per 1K tokens
  'claude-opus-4-6': { input: 0.015, output: 0.075 },
  'gemini-2.5-pro': { input: 0.00125, output: 0.005 },
  'gemini-2.5-flash': { input: 0.000075, output: 0.0003 },
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'grok-4': { input: 0.005, output: 0.015 },
  'grok-4-fast-reasoning': { input: 0.0005, output: 0.003 },
};

export function calculateCost(model, inputTokens, outputTokens) {
  const rates = MODEL_RATES[model];
  if (!rates) {
    console.warn(`Unknown model: ${model}, using default rates`);
    return (inputTokens * 0.003 + outputTokens * 0.015) / 1000;
  }
  
  return (inputTokens * rates.input + outputTokens * rates.output) / 1000;
}

// Example:
// const cost = calculateCost('claude-sonnet-4-5', 80000, 4000);
// console.log(`Cost: $${cost.toFixed(3)}`); // $0.306
```

## Task IDs

Get task IDs from dashboard or API:

```bash
# List all tasks
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get specific task
curl -X GET http://localhost:3000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Example: Track Current Session

```bash
# After completing this conversation
curl -X POST http://localhost:3000/api/costs \
  -H "Content-Type: application/json" \
  -d '{
    "task_id": "24c39cfb-a8d6-4610-a1e4-a4488d58b4f3",
    "model": "claude-sonnet-4-5",
    "input_tokens": 84254,
    "output_tokens": 7216,
    "cost_usd": 0.361,
    "session_key": "agent:main:webchat"
  }'
```

Dashboard updates in real-time via WebSocket!

## Future: Automatic Integration

To fully automate, we'd need to:

1. Add a hook in OpenClaw session completion
2. Extract usage data from session status
3. Call `/api/costs` automatically
4. Map sessions to task IDs (via session metadata or prompts)

This would make cost tracking completely transparent - every agent turn logs to dashboard automatically.

---

**For now:** Manual tracking after major tasks works perfectly. Just run the curl command with your session stats!
