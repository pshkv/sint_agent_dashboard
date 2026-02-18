import type { FastifyInstance } from 'fastify';
import { CostService } from '../services/CostService';
import { z } from 'zod';

const costService = new CostService();

const recordCostSchema = z.object({
  task_id: z.string().uuid(),
  model: z.string(),
  input_tokens: z.number().int().min(0),
  output_tokens: z.number().int().min(0),
  cost_usd: z.number().min(0),
  session_key: z.string().optional(),
});

export async function costsRoutes(app: FastifyInstance) {
  // Record cost (public endpoint for OpenClaw agent)
  app.post('/', async (request, reply) => {
    const data = recordCostSchema.parse(request.body);
    
    const cost = await costService.recordCost(data);
    
    // Broadcast to WebSocket
    (app as any).websocketServer?.broadcast({
      type: 'cost_recorded',
      data: cost,
    });
    
    return cost;
  });
}
