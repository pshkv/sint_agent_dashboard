// Policy system types and utilities

export type PolicyCategory = 'budget' | 'tools' | 'data' | 'output';
export type PolicyAction = 'allow' | 'deny' | 'require_approval';
export type PolicyConditionType = 'cost' | 'tool' | 'model' | 'time' | 'agent';

export interface PolicyCondition {
  id: string;
  type: PolicyConditionType;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'matches';
  value: string | number;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  action: PolicyAction;
  conditions: PolicyCondition[];
  priority: number; // Higher priority rules evaluated first
  enabled: boolean;
}

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: PolicyCategory;
  rules: Omit<PolicyRule, 'id'>[];
  recommended: boolean;
}

export const policyTemplates: PolicyTemplate[] = [
  {
    id: 'template-budget-daily',
    name: 'Daily Budget Limit',
    description: 'Prevent spending more than $X per day',
    icon: '💰',
    category: 'budget',
    recommended: true,
    rules: [{
      name: 'Daily Budget Cap',
      description: 'Deny operations if daily spend exceeds limit',
      category: 'budget',
      action: 'deny',
      conditions: [
        {
          id: 'cond-1',
          type: 'cost',
          operator: 'greater_than',
          value: 50,
        },
        {
          id: 'cond-2',
          type: 'time',
          operator: 'equals',
          value: 'daily',
        },
      ],
      priority: 100,
      enabled: true,
    }],
  },
  {
    id: 'template-shell-approval',
    name: 'Shell Command Approval',
    description: 'Require approval for all shell/exec commands',
    icon: '🔒',
    category: 'tools',
    recommended: true,
    rules: [{
      name: 'Approve All Shell',
      description: 'Human approval required for shell execution',
      category: 'tools',
      action: 'require_approval',
      conditions: [
        {
          id: 'cond-1',
          type: 'tool',
          operator: 'equals',
          value: 'exec',
        },
      ],
      priority: 90,
      enabled: true,
    }],
  },
  {
    id: 'template-expensive-approval',
    name: 'Expensive Operation Approval',
    description: 'Require approval for operations costing more than $X',
    icon: '💎',
    category: 'budget',
    recommended: true,
    rules: [{
      name: 'Expensive Op Approval',
      description: 'Approve operations over cost threshold',
      category: 'budget',
      action: 'require_approval',
      conditions: [
        {
          id: 'cond-1',
          type: 'cost',
          operator: 'greater_than',
          value: 1,
        },
      ],
      priority: 80,
      enabled: true,
    }],
  },
  {
    id: 'template-read-only',
    name: 'Read-Only Mode',
    description: 'Allow only read operations, deny all writes',
    icon: '👁️',
    category: 'tools',
    recommended: false,
    rules: [
      {
        name: 'Deny Writes',
        description: 'Block all write/delete operations',
        category: 'tools',
        action: 'deny',
        conditions: [
          {
            id: 'cond-1',
            type: 'tool',
            operator: 'matches',
            value: '(write|delete|remove|edit)',
          },
        ],
        priority: 100,
        enabled: true,
      },
      {
        name: 'Allow Reads',
        description: 'Permit all read operations',
        category: 'tools',
        action: 'allow',
        conditions: [
          {
            id: 'cond-1',
            type: 'tool',
            operator: 'matches',
            value: '(read|fetch|get|search)',
          },
        ],
        priority: 50,
        enabled: true,
      },
    ],
  },
  {
    id: 'template-prod-protection',
    name: 'Production Protection',
    description: 'Require dual approval for production deployments',
    icon: '🛡️',
    category: 'tools',
    recommended: true,
    rules: [{
      name: 'Dual Approval for Prod',
      description: 'Two approvals required for production changes',
      category: 'tools',
      action: 'require_approval',
      conditions: [
        {
          id: 'cond-1',
          type: 'tool',
          operator: 'contains',
          value: 'deploy',
        },
      ],
      priority: 100,
      enabled: true,
    }],
  },
  {
    id: 'template-model-whitelist',
    name: 'Model Whitelist',
    description: 'Allow only approved AI models',
    icon: '✅',
    category: 'tools',
    recommended: false,
    rules: [{
      name: 'Approved Models Only',
      description: 'Deny requests using non-whitelisted models',
      category: 'tools',
      action: 'deny',
      conditions: [
        {
          id: 'cond-1',
          type: 'model',
          operator: 'not_equals',
          value: 'claude-sonnet-4-5,gpt-4o',
        },
      ],
      priority: 90,
      enabled: true,
    }],
  },
  {
    id: 'template-auto-approve-cheap',
    name: 'Auto-Approve Cheap Operations',
    description: 'Skip approval for operations under $0.01',
    icon: '⚡',
    category: 'budget',
    recommended: false,
    rules: [{
      name: 'Auto Approve Low Cost',
      description: 'Allow operations under cost threshold',
      category: 'budget',
      action: 'allow',
      conditions: [
        {
          id: 'cond-1',
          type: 'cost',
          operator: 'less_than',
          value: 0.01,
        },
      ],
      priority: 70,
      enabled: true,
    }],
  },
  {
    id: 'template-business-hours',
    name: 'Business Hours Only',
    description: 'Deny expensive operations outside 9am-5pm',
    icon: '🕐',
    category: 'budget',
    recommended: false,
    rules: [{
      name: 'Business Hours Enforcement',
      description: 'Block high-cost ops outside working hours',
      category: 'budget',
      action: 'deny',
      conditions: [
        {
          id: 'cond-1',
          type: 'time',
          operator: 'not_equals',
          value: 'business_hours',
        },
        {
          id: 'cond-2',
          type: 'cost',
          operator: 'greater_than',
          value: 0.5,
        },
      ],
      priority: 85,
      enabled: true,
    }],
  },
];

export function evaluatePolicy(
  rule: PolicyRule,
  context: {
    cost?: number;
    tool?: string;
    model?: string;
    agent?: string;
    time?: Date;
  }
): { allowed: boolean; requiresApproval: boolean; reason: string } {
  if (!rule.enabled) {
    return { allowed: true, requiresApproval: false, reason: 'Policy disabled' };
  }

  // Check all conditions
  const allConditionsMet = rule.conditions.every(condition => {
    switch (condition.type) {
      case 'cost':
        if (context.cost === undefined) return false;
        return evaluateCondition(context.cost, condition.operator, condition.value);
      
      case 'tool':
        if (!context.tool) return false;
        return evaluateCondition(context.tool, condition.operator, condition.value);
      
      case 'model':
        if (!context.model) return false;
        return evaluateCondition(context.model, condition.operator, condition.value);
      
      case 'agent':
        if (!context.agent) return false;
        return evaluateCondition(context.agent, condition.operator, condition.value);
      
      case 'time':
        if (!context.time) return false;
        return evaluateTimeCondition(context.time, condition.operator, condition.value);
      
      default:
        return false;
    }
  });

  if (!allConditionsMet) {
    return { allowed: true, requiresApproval: false, reason: 'Conditions not met' };
  }

  // Conditions met, apply action
  switch (rule.action) {
    case 'allow':
      return { allowed: true, requiresApproval: false, reason: `Allowed by: ${rule.name}` };
    
    case 'deny':
      return { allowed: false, requiresApproval: false, reason: `Denied by: ${rule.name}` };
    
    case 'require_approval':
      return { allowed: false, requiresApproval: true, reason: `Approval required: ${rule.name}` };
    
    default:
      return { allowed: true, requiresApproval: false, reason: 'Unknown action' };
  }
}

function evaluateCondition(
  actual: string | number,
  operator: PolicyCondition['operator'],
  expected: string | number
): boolean {
  switch (operator) {
    case 'equals':
      return actual === expected;
    
    case 'not_equals':
      return actual !== expected;
    
    case 'greater_than':
      return Number(actual) > Number(expected);
    
    case 'less_than':
      return Number(actual) < Number(expected);
    
    case 'contains':
      return String(actual).toLowerCase().includes(String(expected).toLowerCase());
    
    case 'matches':
      try {
        const regex = new RegExp(String(expected), 'i');
        return regex.test(String(actual));
      } catch {
        return false;
      }
    
    default:
      return false;
  }
}

function evaluateTimeCondition(
  time: Date,
  _operator: PolicyCondition['operator'],
  value: string | number
): boolean {
  const hour = time.getHours();
  
  if (value === 'business_hours') {
    return hour >= 9 && hour < 17; // 9am-5pm
  }
  
  if (value === 'daily') {
    return true; // Always true for daily checks (handled in cost aggregation)
  }
  
  return false;
}

export function generatePolicyId(): string {
  return `policy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateRuleId(): string {
  return `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateConditionId(): string {
  return `cond-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
