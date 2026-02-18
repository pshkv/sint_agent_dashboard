import type { FastifyInstance } from 'fastify';
import { TaskService } from '../services/TaskService';
import { z } from 'zod';

const taskService = new TaskService();

const createTaskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
  assigned_agent: z.string().optional(),
  estimated_hours: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
  status: z.enum(['backlog', 'in_progress', 'review', 'done', 'paused', 'failed']).optional(),
  assigned_agent: z.string().optional(),
  estimated_hours: z.number().optional(),
  actual_hours: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

const moveTaskSchema = z.object({
  status: z.enum(['backlog', 'in_progress', 'review', 'done', 'paused', 'failed']),
});

// Auth helper
async function authenticate(request: any, reply: any) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
    throw err;
  }
}

export async function tasksRoutes(app: FastifyInstance) {
  // List tasks
  app.get('/', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    const { status, priority, agent } = request.query as any;
    
    const filters = {
      status: status ? (Array.isArray(status) ? status : [status]) : undefined,
      priority: priority ? (Array.isArray(priority) ? priority : [priority]) : undefined,
      agent,
    };
    
    const tasks = await taskService.getTasks(userId, filters);
    return tasks;
  });

  // Create task
  app.post('/', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    const data = createTaskSchema.parse(request.body);
    
    const task = await taskService.createTask(userId, data);
    
    // Broadcast to WebSocket
    (app as any).websocketServer?.broadcast({
      type: 'task_created',
      data: task,
    });
    
    return task;
  });

  // Get task by ID
  app.get('/:id', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    const { id } = request.params as any;
    
    const task = await taskService.getTaskById(userId, id);
    
    if (!task) {
      reply.code(404);
      return { error: 'Task not found' };
    }
    
    return task;
  });

  // Update task
  app.patch('/:id', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    const { id } = request.params as any;
    const data = updateTaskSchema.parse(request.body);
    
    const task = await taskService.updateTask(userId, id, data);
    
    if (!task) {
      reply.code(404);
      return { error: 'Task not found' };
    }
    
    // Broadcast to WebSocket
    (app as any).websocketServer?.broadcast({
      type: 'task_updated',
      data: task,
    });
    
    return task;
  });

  // Delete task
  app.delete('/:id', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    const { id } = request.params as any;
    
    const deleted = await taskService.deleteTask(userId, id);
    
    if (!deleted) {
      reply.code(404);
      return { error: 'Task not found' };
    }
    
    reply.code(204);
  });

  // Move task
  app.post('/:id/move', async (request, reply) => {
    await authenticate(request, reply);
    const userId = (request.user as any).id;
    const { id } = request.params as any;
    const { status } = moveTaskSchema.parse(request.body);
    
    const task = await taskService.moveTask(userId, id, status);
    
    if (!task) {
      reply.code(404);
      return { error: 'Task not found' };
    }
    
    // Broadcast to WebSocket
    (app as any).websocketServer?.broadcast({
      type: 'task_moved',
      data: task,
    });
    
    return task;
  });
}
