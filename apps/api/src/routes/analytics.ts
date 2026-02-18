import type { FastifyInstance } from 'fastify';
import { CostService } from '../services/CostService';

const costService = new CostService();

// Auth helper
async function authenticate(request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
    throw err;
  }
}

export async function analyticsRoutes(app: FastifyInstance) {
  // Get summary
  app.get('/summary', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    return await costService.getSummary(userId);
  });

  // Get daily costs
  app.get('/daily', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    const { days = 7 } = request.query as any;
    return await costService.getDailyCosts(userId, Number(days));
  });

  // Get costs by priority
  app.get('/by-priority', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    return await costService.getCostsByPriority(userId);
  });

  // Get model usage
  app.get('/by-model', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    return await costService.getModelUsage(userId);
  });
}
