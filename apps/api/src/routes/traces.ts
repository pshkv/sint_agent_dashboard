import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Validation schemas
const TraceQuerySchema = z.object({
  sessionId: z.string().optional(),
  agentId: z.string().optional(),
  status: z.enum(['running', 'success', 'error']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

const SpanQuerySchema = z.object({
  traceId: z.string(),
  status: z.enum(['success', 'error', 'slow', 'running', 'pending']).optional(),
  tool: z.string().optional(),
  minCost: z.coerce.number().optional(),
  maxCost: z.coerce.number().optional(),
});

export async function tracesRoutes(app: FastifyInstance) {
  // Get all traces with optional filtering
  app.get('/', {
    schema: {
      description: 'List traces with optional filters',
      tags: ['traces'],
      querystring: {
        type: 'object',
        properties: {
          sessionId: { type: 'string' },
          agentId: { type: 'string' },
          status: { type: 'string', enum: ['running', 'success', 'error'] },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 50 },
          offset: { type: 'number', minimum: 0, default: 0 },
        },
      },
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        200: {
          type: 'object',
          properties: {
            traces: { type: 'array' },
            total: { type: 'number' },
            limit: { type: 'number' },
            offset: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const query = TraceQuerySchema.parse(request.query);
      
      // TODO: Fetch from database when we add trace persistence
      // For now, return mock response structure
      
      return {
        traces: [],
        total: 0,
        limit: query.limit,
        offset: query.offset,
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

  // Get specific trace by ID
  app.get('/:traceId', {
    schema: {
      description: 'Get trace by ID',
      tags: ['traces'],
      params: {
        type: 'object',
        properties: {
          traceId: { type: 'string' },
        },
        required: ['traceId'],
      },
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            sessionId: { type: 'string' },
            agentId: { type: 'string' },
            status: { type: 'string' },
            totalCost: { type: 'number' },
            spans: { type: 'array' },
          },
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { traceId } = request.params as { traceId: string };
    
    // TODO: Fetch from database
    
    return reply.code(404).send({ error: 'Trace not found' });
  });

  // Get spans for a trace
  app.get('/:traceId/spans', {
    schema: {
      description: 'Get spans for a specific trace',
      tags: ['traces'],
      params: {
        type: 'object',
        properties: {
          traceId: { type: 'string' },
        },
        required: ['traceId'],
      },
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          tool: { type: 'string' },
          minCost: { type: 'number' },
          maxCost: { type: 'number' },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const { traceId } = request.params as { traceId: string };
      const query = SpanQuerySchema.parse({ ...(request.query || {}), traceId });
      
      // TODO: Fetch spans from database
      
      return {
        traceId: query.traceId,
        spans: [],
        total: 0,
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

  // Export trace as JSON
  app.get('/:traceId/export', {
    schema: {
      description: 'Export trace as JSON',
      tags: ['traces'],
      params: {
        type: 'object',
        properties: {
          traceId: { type: 'string' },
        },
        required: ['traceId'],
      },
    },
  }, async (request, reply) => {
    const { traceId } = request.params as { traceId: string };
    
    // TODO: Fetch full trace with all spans
    
    reply.header('Content-Type', 'application/json');
    reply.header('Content-Disposition', `attachment; filename="trace-${traceId}.json"`);
    
    return {
      id: traceId,
      exportedAt: new Date().toISOString(),
      // ... trace data
    };
  });

  // Get trace metrics/summary
  app.get('/:traceId/metrics', {
    schema: {
      description: 'Get metrics summary for a trace',
      tags: ['traces'],
      params: {
        type: 'object',
        properties: {
          traceId: { type: 'string' },
        },
        required: ['traceId'],
      },
      response: {
        400: { type: "object", properties: { error: { type: "string" }, details: { type: "array" } } },
        200: {
          type: 'object',
          properties: {
            totalCost: { type: 'number' },
            totalDuration: { type: 'number' },
            spanCount: { type: 'number' },
            errorCount: { type: 'number' },
            successRate: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { traceId } = request.params as { traceId: string };
    
    // TODO: Calculate metrics from spans
    
    return {
      traceId,
      totalCost: 0,
      totalDuration: 0,
      spanCount: 0,
      errorCount: 0,
      successRate: 100,
    };
  });
}
