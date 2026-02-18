import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Validation schemas
const PolicyRuleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(['budget', 'tools', 'data', 'output']),
  action: z.enum(['allow', 'deny', 'require_approval']),
  priority: z.number().min(0).max(100),
  enabled: z.boolean(),
  conditions: z.array(z.object({
    type: z.enum(['cost', 'tool', 'model', 'time', 'agent']),
    operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'contains', 'matches']),
    value: z.union([z.string(), z.number()]),
  })),
});

const PolicyTestSchema = z.object({
  cost: z.number().optional(),
  tool: z.string().optional(),
  model: z.string().optional(),
  agent: z.string().optional(),
  time: z.string().datetime().optional(),
});

export async function policiesRoutes(app: FastifyInstance) {
  // Get all policies
  app.get('/', {
    schema: {
      description: 'List all policy rules',
      tags: ['policies'],
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        200: {
          type: 'object',
          properties: {
            rules: { type: 'array' },
            total: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    // TODO: Fetch from database
    
    return {
      rules: [],
      total: 0,
    };
  });

  // Create new policy rule
  app.post('/', {
    schema: {
      description: 'Create a new policy rule',
      tags: ['policies'],
      body: {
        type: 'object',
        required: ['name', 'category', 'action', 'priority', 'enabled', 'conditions'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          category: { type: 'string', enum: ['budget', 'tools', 'data', 'output'] },
          action: { type: 'string', enum: ['allow', 'deny', 'require_approval'] },
          priority: { type: 'number', minimum: 0, maximum: 100 },
          enabled: { type: 'boolean' },
          conditions: { type: 'array' },
        },
      },
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const rule = PolicyRuleSchema.parse(request.body);
      
      // TODO: Save to database
      const id = `rule-${Date.now()}`;
      
      return reply.code(201).send({
        id,
        name: rule.name,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      throw error;
    }
  });

  // Update policy rule
  app.put('/:ruleId', {
    schema: {
      description: 'Update an existing policy rule',
      tags: ['policies'],
      params: {
        type: 'object',
        properties: {
          ruleId: { type: 'string' },
        },
        required: ['ruleId'],
      },
    },
  }, async (request, reply) => {
    const { ruleId } = request.params as { ruleId: string };
    
    try {
      const updates = PolicyRuleSchema.partial().parse(request.body);
      
      // TODO: Update in database
      
      return {
        id: ruleId,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      throw error;
    }
  });

  // Delete policy rule
  app.delete('/:ruleId', {
    schema: {
      description: 'Delete a policy rule',
      tags: ['policies'],
      params: {
        type: 'object',
        properties: {
          ruleId: { type: 'string' },
        },
        required: ['ruleId'],
      },
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        204: {
          type: 'null',
          description: 'Successfully deleted',
        },
      },
    },
  }, async (request, reply) => {
    const { ruleId } = request.params as { ruleId: string };
    
    // TODO: Delete from database
    
    return reply.code(204).send();
  });

  // Test policy rule
  app.post('/:ruleId/test', {
    schema: {
      description: 'Test a policy rule against context',
      tags: ['policies'],
      params: {
        type: 'object',
        properties: {
          ruleId: { type: 'string' },
        },
        required: ['ruleId'],
      },
      body: {
        type: 'object',
        properties: {
          cost: { type: 'number' },
          tool: { type: 'string' },
          model: { type: 'string' },
          agent: { type: 'string' },
          time: { type: 'string' },
        },
      },
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        200: {
          type: 'object',
          properties: {
            allowed: { type: 'boolean' },
            requiresApproval: { type: 'boolean' },
            reason: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { ruleId } = request.params as { ruleId: string };
    
    try {
      const context = PolicyTestSchema.parse(request.body);
      
      // TODO: Fetch rule and evaluate
      
      return {
        allowed: true,
        requiresApproval: false,
        reason: 'Mock test result',
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation Error',
          details: error.errors,
        });
      }
      throw error;
    }
  });

  // Get policy templates
  app.get('/templates', {
    schema: {
      description: 'Get pre-built policy templates',
      tags: ['policies'],
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        200: {
          type: 'object',
          properties: {
            templates: { type: 'array' },
            total: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    // Return built-in templates
    return {
      templates: [
        {
          id: 'template-budget-daily',
          name: 'Daily Budget Limit',
          description: 'Prevent spending more than $X per day',
          category: 'budget',
          recommended: true,
        },
        {
          id: 'template-shell-approval',
          name: 'Shell Command Approval',
          description: 'Require approval for all shell/exec commands',
          category: 'tools',
          recommended: true,
        },
        // ... more templates
      ],
      total: 8,
    };
  });

  // Get policy violations
  app.get('/violations', {
    schema: {
      description: 'Get recent policy violations',
      tags: ['policies'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 100, default: 50 },
          ruleId: { type: 'string' },
        },
      },
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        200: {
          type: 'object',
          properties: {
            violations: { type: 'array' },
            total: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    // TODO: Fetch violations from audit log
    
    return {
      violations: [],
      total: 0,
    };
  });
}
