// Mock data generator for SINT Operator Dashboard

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  model: string;
  status: 'active' | 'idle' | 'error' | 'paused';
  lastActive: Date;
  tasksCompleted: number;
  currentTask: string | null;
}

export interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'degraded' | 'down';
  enabled: boolean;
  lastSync: Date;
}

export interface Span {
  id: string;
  traceId: string;
  type: 'llm_call' | 'tool_exec' | 'memory_search' | 'browser' | 'shell';
  tool?: string; // Tool name (for tool_exec type)
  input: any;
  output: any;
  duration: number; // ms
  startTime?: number; // Start time offset in ms
  status: 'success' | 'error' | 'slow' | 'running' | 'pending';
  cost: number; // USD
  parentSpanId: string | null;
  timestamp: Date;
  model?: string;
  tokens?: { input: number; output: number };
  error?: string; // Error message if failed
}

export interface Trace {
  id: string;
  sessionId: string;
  agentId: string;
  startTime: Date;
  endTime: Date | null;
  status: 'running' | 'success' | 'error';
  spans: Span[];
  totalCost: number;
}

export interface Policy {
  id: string;
  name: string;
  category: 'budget' | 'tools' | 'data' | 'output';
  rules: string;
  enabled: boolean;
  violations: number;
}

export interface MemoryEntry {
  id: string;
  tier: 'M0' | 'M1' | 'M2' | 'M3';
  content: string;
  source: string;
  timestamp: Date;
  promotedFrom?: 'M0' | 'M1' | 'M2';
  expiresAt?: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  agentStatus?: 'thinking' | 'executing' | 'waiting_approval' | 'idle';
  toolCalls?: ToolCall[];
  approved?: boolean;
}

export interface ToolCall {
  id: string;
  tool: string;
  input: any;
  output: any;
  duration: number;
  status: 'success' | 'error' | 'pending_approval';
  requiresApproval?: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: Date;
  agentId: string;
  action: string;
  tool: string;
  status: 'success' | 'error' | 'blocked';
  policyId: string | null;
  cost: number;
  hash: string;
}

// Mock data generators

export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'SINT',
    role: 'Executive Assistant',
    avatar: '🤖',
    model: 'claude-sonnet-4-5',
    status: 'active',
    lastActive: new Date(Date.now() - 1000 * 60 * 2), // 2 min ago
    tasksCompleted: 127,
    currentTask: 'Building SINT Operator dashboard',
  },
  {
    id: 'agent-2',
    name: 'Mia',
    role: 'Marketing Manager',
    avatar: '📊',
    model: 'gpt-4o',
    status: 'idle',
    lastActive: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    tasksCompleted: 89,
    currentTask: null,
  },
  {
    id: 'agent-3',
    name: 'Leo',
    role: 'Sales Rep',
    avatar: '💼',
    model: 'gemini-2.5-pro',
    status: 'error',
    lastActive: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    tasksCompleted: 52,
    currentTask: 'Lead qualification failed',
  },
  {
    id: 'agent-4',
    name: 'Nova',
    role: 'Research Analyst',
    avatar: '🔬',
    model: 'opus-4.6',
    status: 'paused',
    lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    tasksCompleted: 34,
    currentTask: null,
  },
];

export const mockIntegrations: Integration[] = [
  { id: 'int-1', name: 'Gmail', category: 'communication', status: 'connected', enabled: true, lastSync: new Date() },
  { id: 'int-2', name: 'Slack', category: 'communication', status: 'connected', enabled: true, lastSync: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 'int-3', name: 'Twitter', category: 'social', status: 'degraded', enabled: true, lastSync: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'int-4', name: 'GitHub', category: 'development', status: 'connected', enabled: true, lastSync: new Date() },
  { id: 'int-5', name: 'Notion', category: 'data', status: 'connected', enabled: true, lastSync: new Date(Date.now() - 1000 * 60 * 10) },
  { id: 'int-6', name: 'Perplexity', category: 'search', status: 'down', enabled: false, lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 'int-7', name: 'Calendar', category: 'productivity', status: 'connected', enabled: true, lastSync: new Date() },
  { id: 'int-8', name: 'Solana', category: 'blockchain', status: 'connected', enabled: true, lastSync: new Date(Date.now() - 1000 * 60 * 15) },
];

export const mockSpans: Span[] = [
  {
    id: 'span-1',
    traceId: 'trace-1',
    type: 'llm_call',
    tool: 'llm_call',
    input: { prompt: 'Analyze the SINT dashboard requirements' },
    output: { text: 'Based on the research...', reasoning: 'Need to implement 3-panel layout' },
    duration: 2340,
    startTime: 0,
    status: 'success',
    cost: 0.045,
    parentSpanId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    model: 'claude-sonnet-4-5',
    tokens: { input: 15000, output: 2000 },
  },
  {
    id: 'span-2',
    traceId: 'trace-1',
    type: 'tool_exec',
    tool: 'tool_exec',
    input: { tool: 'read', path: '/Users/ipashkov/.openclaw/workspace/sint-dashboard/README.md' },
    output: { content: '# SINT Task Dashboard...' },
    duration: 45,
    startTime: 2340,
    status: 'success',
    cost: 0.0,
    parentSpanId: 'span-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: 'span-3',
    traceId: 'trace-1',
    type: 'memory_search',
    tool: 'memory_search',
    input: { query: 'sint dashboard task' },
    output: { results: [{ path: 'memory/2026-02-14.md', score: 0.69 }] },
    duration: 156,
    startTime: 2385,
    status: 'success',
    cost: 0.002,
    parentSpanId: 'span-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
  {
    id: 'span-4',
    traceId: 'trace-1',
    type: 'llm_call',
    tool: 'llm_call',
    input: { prompt: 'Create mock data generators' },
    output: { text: 'Creating TypeScript interfaces and mock data...' },
    duration: 4200,
    startTime: 2541,
    status: 'slow',
    cost: 0.067,
    parentSpanId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    model: 'claude-sonnet-4-5',
    tokens: { input: 18000, output: 3500 },
  },
];

// Additional spans for trace-2
const mockSpans2: Span[] = [
  {
    id: 'span-5',
    traceId: 'trace-2',
    type: 'llm_call',
    tool: 'llm_call',
    input: { prompt: 'Analyze user feedback' },
    output: { text: 'The feedback indicates...' },
    duration: 1850,
    startTime: 0,
    status: 'success',
    cost: 0.032,
    parentSpanId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    model: 'gpt-4o',
    tokens: { input: 8000, output: 1200 },
  },
  {
    id: 'span-6',
    traceId: 'trace-2',
    type: 'browser',
    tool: 'browser',
    input: { url: 'https://example.com' },
    output: { content: 'Page content...' },
    duration: 3200,
    startTime: 1850,
    status: 'success',
    cost: 0.001,
    parentSpanId: 'span-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 178),
    model: undefined,
  },
];

// Additional spans for trace-3
const mockSpans3: Span[] = [
  {
    id: 'span-7',
    traceId: 'trace-3',
    type: 'llm_call',
    tool: 'llm_call',
    input: { prompt: 'Generate marketing copy' },
    output: { text: 'Compelling copy...' },
    duration: 2100,
    startTime: 0,
    status: 'success',
    cost: 0.052,
    parentSpanId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    model: 'gemini-2.5-pro',
    tokens: { input: 12000, output: 2500 },
  },
  {
    id: 'span-8',
    traceId: 'trace-3',
    type: 'tool_exec',
    tool: 'tool_exec',
    input: { tool: 'write', path: '/tmp/output.txt' },
    output: { success: true },
    duration: 28,
    startTime: 2100,
    status: 'success',
    cost: 0.0,
    parentSpanId: 'span-7',
    timestamp: new Date(Date.now() - 1000 * 60 * 59),
  },
];

// Additional spans for trace-4 (with error)
const mockSpans4: Span[] = [
  {
    id: 'span-9',
    traceId: 'trace-4',
    type: 'llm_call',
    tool: 'llm_call',
    input: { prompt: 'Complex analysis task' },
    output: null,
    duration: 1234,
    startTime: 0,
    status: 'error',
    cost: 0.018,
    parentSpanId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    model: 'claude-sonnet-4-5',
    tokens: { input: 6000, output: 0 },
    error: 'Rate limit exceeded',
  },
];

export const mockTraces: Trace[] = [
  {
    id: 'trace-1',
    sessionId: 'session-main',
    agentId: 'agent-1',
    startTime: new Date(Date.now() - 1000 * 60 * 10),
    endTime: null, // still running
    status: 'running',
    spans: mockSpans,
    totalCost: 0.114,
  },
  {
    id: 'trace-2',
    sessionId: 'session-dm',
    agentId: 'agent-2',
    startTime: new Date(Date.now() - 1000 * 60 * 180),
    endTime: new Date(Date.now() - 1000 * 60 * 175),
    status: 'success',
    spans: mockSpans2,
    totalCost: 0.033,
  },
  {
    id: 'trace-3',
    sessionId: 'session-main',
    agentId: 'agent-1',
    startTime: new Date(Date.now() - 1000 * 60 * 60),
    endTime: new Date(Date.now() - 1000 * 60 * 58),
    status: 'success',
    spans: mockSpans3,
    totalCost: 0.052,
  },
  {
    id: 'trace-4',
    sessionId: 'session-group',
    agentId: 'agent-3',
    startTime: new Date(Date.now() - 1000 * 60 * 30),
    endTime: new Date(Date.now() - 1000 * 60 * 29),
    status: 'error',
    spans: mockSpans4,
    totalCost: 0.018,
  },
];

export const mockPolicies: Policy[] = [
  {
    id: 'policy-1',
    name: 'Daily Budget Limit',
    category: 'budget',
    rules: 'Max $50/day across all agents',
    enabled: true,
    violations: 0,
  },
  {
    id: 'policy-2',
    name: 'Shell Command Approval',
    category: 'tools',
    rules: 'Require approval for all shell commands',
    enabled: true,
    violations: 0,
  },
  {
    id: 'policy-3',
    name: 'File Write Protection',
    category: 'tools',
    rules: 'Block writes outside workspace',
    enabled: true,
    violations: 2,
  },
  {
    id: 'policy-4',
    name: 'PII Filter',
    category: 'data',
    rules: 'Redact SSN, credit cards, API keys',
    enabled: true,
    violations: 0,
  },
];

export const mockMemory: MemoryEntry[] = [
  {
    id: 'mem-1',
    tier: 'M0',
    content: 'User asked to upgrade dashboard to 3-panel layout',
    source: 'current-session',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'mem-2',
    tier: 'M1',
    content: 'Dashboard built on Feb 14 with Kanban + cost tracking',
    source: 'session-2026-02-14',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    promotedFrom: 'M0',
  },
  {
    id: 'mem-3',
    tier: 'M2',
    content: 'Illia prefers Jarvis-style: concise, proactive, no hand-holding',
    source: 'SOUL.md',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    promotedFrom: 'M1',
  },
  {
    id: 'mem-4',
    tier: 'M3',
    content: 'Completed overnight documentation analysis - $3.68 cost',
    source: 'memory/2026-02-14.md',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Yo U stil here?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 'msg-2',
    role: 'agent',
    content: 'Still here. What\'s up?',
    timestamp: new Date(Date.now() - 1000 * 60 * 14),
    agentStatus: 'idle',
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'What in your scope now?',
    timestamp: new Date(Date.now() - 1000 * 60 * 13),
  },
  {
    id: 'msg-4',
    role: 'agent',
    content: 'Currently loaded:\n- AGENTS.md, SOUL.md, USER.md, MEMORY.md\n- All skills (github, weather, notion, etc.)\n- Full workspace access',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    agentStatus: 'idle',
  },
  {
    id: 'msg-5',
    role: 'user',
    content: 'Build me a perfect control center for agents',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: 'msg-6',
    role: 'agent',
    content: 'Building SINT Operator dashboard with 3-panel layout...',
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
    agentStatus: 'thinking',
    toolCalls: [
      {
        id: 'tc-1',
        tool: 'read',
        input: { path: 'research-document.md' },
        output: { content: '# Best Dashboards UI/UX...' },
        duration: 45,
        status: 'success',
      },
      {
        id: 'tc-2',
        tool: 'write',
        input: { path: 'SINT-OPERATOR-BUILD-PLAN.md', content: '# SINT Operator Dashboard...' },
        output: { bytes: 6108 },
        duration: 12,
        status: 'success',
      },
    ],
  },
  {
    id: 'msg-7',
    role: 'tool',
    content: 'Executing: npm install recharts zustand @dnd-kit/core',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
  },
  {
    id: 'msg-8',
    role: 'agent',
    content: 'Dependencies installed. Creating mock data generators...',
    timestamp: new Date(Date.now() - 1000 * 60 * 7),
    agentStatus: 'executing',
  },
];

export const mockAuditLog: AuditEntry[] = [
  {
    id: 'audit-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    agentId: 'agent-1',
    action: 'read_file',
    tool: 'read',
    status: 'success',
    policyId: null,
    cost: 0.0,
    hash: 'a7f4e9b2',
  },
  {
    id: 'audit-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
    agentId: 'agent-1',
    action: 'write_file',
    tool: 'write',
    status: 'success',
    policyId: 'policy-3',
    cost: 0.0,
    hash: 'b8e5f0c3',
  },
  {
    id: 'audit-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    agentId: 'agent-1',
    action: 'shell_exec',
    tool: 'exec',
    status: 'success',
    policyId: 'policy-2',
    cost: 0.0,
    hash: 'c9f6g1d4',
  },
  {
    id: 'audit-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    agentId: 'agent-1',
    action: 'llm_call',
    tool: 'anthropic',
    status: 'success',
    policyId: 'policy-1',
    cost: 0.045,
    hash: 'd0g7h2e5',
  },
];

// Generate random IDs
export const randomId = () => Math.random().toString(36).substr(2, 9);

// Generate streaming tokens (for AG-UI simulation)
export function* streamTokens(text: string): Generator<string> {
  const words = text.split(' ');
  for (const word of words) {
    yield word + ' ';
  }
}

// Simulate AG-UI event stream
export interface AGUIEvent {
  type: 
    | 'text_stream' 
    | 'tool_call_start' 
    | 'tool_call_end'
    | 'thinking_start'
    | 'thinking_end'
    | 'approval_request'
    | 'state_sync'
    | 'error';
  data: any;
  timestamp: Date;
}

export function generateAGUIEvent(type: AGUIEvent['type'], data: any): AGUIEvent {
  return {
    type,
    data,
    timestamp: new Date(),
  };
}
