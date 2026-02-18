import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Validation schemas
const MetricsQuerySchema = z.object({
  timeRange: z.enum(['1h', '24h', '7d', '30d']).default('24h'),
  agentId: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function metricsRoutes(app: FastifyInstance) {
  // Get aggregated metrics
  app.get('/', {
    schema: {
      description: 'Get aggregated metrics for dashboard',
      tags: ['metrics'],
      querystring: {
        type: 'object',
        properties: {
          timeRange: { type: 'string', enum: ['1h', '24h', '7d', '30d'], default: '24h' },
          agentId: { type: 'string' },
          sessionId: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            totalCost: { type: 'number' },
            totalTokens: { type: 'number' },
            avgDuration: { type: 'number' },
            errorRate: { type: 'number' },
            spanCount: { type: 'number' },
            costByModel: { type: 'object' },
            costByAgent: { type: 'object' },
            durationDistribution: { type: 'object' },
            costTimeSeries: { type: 'array' },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array' },
          },
        },
      },
    },
  }, async (request, reply) => {
    try {
      const query = MetricsQuerySchema.parse(request.query);
      
      // TODO: Calculate from database
      
      return {
        totalCost: 0,
        totalTokens: 0,
        avgDuration: 0,
        errorRate: 0,
        spanCount: 0,
        costByModel: {},
        costByAgent: {},
        durationDistribution: {},
        costTimeSeries: [],
        timeRange: query.timeRange,
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

  // Get cost breakdown
  app.get('/cost-breakdown', {
    schema: {
      description: 'Get detailed cost breakdown',
      tags: ['metrics'],
      querystring: {
        type: 'object',
        properties: {
          timeRange: { type: 'string', enum: ['1h', '24h', '7d', '30d'], default: '24h' },
          groupBy: { type: 'string', enum: ['model', 'agent', 'tool', 'session'], default: 'model' },
        },
      },
    },
  }, async (request, reply) => {
    const { timeRange = '24h', groupBy = 'model' } = request.query as any;
    
    // TODO: Query and aggregate
    
    return {
      timeRange,
      groupBy,
      breakdown: [],
      total: 0,
    };
  });

  // Get performance metrics
  app.get('/performance', {
    schema: {
      description: 'Get performance metrics (latency, throughput)',
      tags: ['metrics'],
      querystring: {
        type: 'object',
        properties: {
          timeRange: { type: 'string', enum: ['1h', '24h', '7d', '30d'], default: '24h' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            avgLatency: { type: 'number' },
            p50: { type: 'number' },
            p95: { type: 'number' },
            p99: { type: 'number' },
            throughput: { type: 'number' },
            errorRate: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { timeRange = '24h' } = request.query as any;
    
    // TODO: Calculate percentiles
    
    return {
      timeRange,
      avgLatency: 0,
      p50: 0,
      p95: 0,
      p99: 0,
      throughput: 0,
      errorRate: 0,
    };
  });

  // Get budget status
  app.get('/budget', {
    schema: {
      description: 'Get budget status and limits',
      tags: ['metrics'],
      response: {
        200: {
          type: 'object',
          properties: {
            dailyLimit: { type: 'number' },
            dailySpent: { type: 'number' },
            dailyRemaining: { type: 'number' },
            percentUsed: { type: 'number' },
            projectedDaily: { type: 'number' },
            projectedMonthly: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    // TODO: Fetch budget config and calculate
    
    return {
      dailyLimit: 50,
      dailySpent: 0,
      dailyRemaining: 50,
      percentUsed: 0,
      projectedDaily: 0,
      projectedMonthly: 0,
    };
  });

  // Get token usage
  app.get('/tokens', {
    schema: {
      description: 'Get token usage statistics',
      tags: ['metrics'],
      querystring: {
        type: 'object',
        properties: {
          timeRange: { type: 'string', enum: ['1h', '24h', '7d', '30d'], default: '24h' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            totalTokens: { type: 'number' },
            inputTokens: { type: 'number' },
            outputTokens: { type: 'number' },
            tokensByModel: { type: 'object' },
            avgTokensPerRequest: { type: 'number' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { timeRange = '24h' } = request.query as any;
    
    // TODO: Aggregate token usage
    
    return {
      timeRange,
      totalTokens: 0,
      inputTokens: 0,
      outputTokens: 0,
      tokensByModel: {},
      avgTokensPerRequest: 0,
    };
  });

  // Get real-time stats
  app.get('/realtime', {
    schema: {
      description: 'Get real-time statistics (last 5 minutes)',
      tags: ['metrics'],
      response: {
        200: {
          type: 'object',
          properties: {
            activeAgents: { type: 'number' },
            activeTraces: { type: 'number' },
            requestsPerMinute: { type: 'number' },
            costPerMinute: { type: 'number' },
            errorRate: { type: 'number' },
            timestamp: { type: 'string' },
          },
        },
      },
    },
  }, async (request, reply) => {
    return {
      activeAgents: 0,
      activeTraces: 0,
      requestsPerMinute: 0,
      costPerMinute: 0,
      errorRate: 0,
      timestamp: new Date().toISOString(),
    };
  });
}
