import type { FastifyInstance } from 'fastify';
import { AuthService } from '../services/AuthService';
import { z } from 'zod';

const authService = new AuthService();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance) {
  // Login
  app.post('/login', async (request, reply) => {
    const data = loginSchema.parse(request.body);
    
    const user = await authService.login(data);
    
    if (!user) {
      reply.code(401);
      return { error: 'Invalid email or password' };
    }
    
    const token = app.jwt.sign({ id: user.id, email: user.email });
    
    return { user, token };
  });

  // Signup
  app.post('/signup', async (request, reply) => {
    try {
      const data = signupSchema.parse(request.body);
      
      const user = await authService.signup(data);
      
      const token = app.jwt.sign({ id: user.id, email: user.email });
      
      return { user, token };
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        reply.code(409);
        return { error: 'Email already exists' };
      }
      throw error;
    }
  });

  // Get current user
  app.get('/me', async (request, reply) => {
    try {
      await (request as any).jwtVerify();
    } catch (err) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }
    
    const userId = (request as any).user.id;
    
    const user = await authService.getUserById(userId);
    
    if (!user) {
      reply.code(404);
      return { error: 'User not found' };
    }
    
    return user;
  });
}
