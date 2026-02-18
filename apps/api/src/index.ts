import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import rateLimit from '@fastify/rate-limit';

// Routes
import { tasksRoutes } from './routes/tasks';
import { costsRoutes } from './routes/costs';
import { analyticsRoutes } from './routes/analytics';
import { authRoutes } from './routes/auth';
import { tracesRoutes } from './routes/traces';
import { policiesRoutes } from './routes/policies';
import { metricsRoutes } from './routes/metrics';

// Middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { setupWebSocket } from './ws/server';

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' 
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

// Register error handler
app.setErrorHandler(errorHandler);
app.setNotFoundHandler(notFoundHandler);

// Register rate limiting
await app.register(rateLimit, {
  max: 100, // 100 requests
  timeWindow: '1 minute',
  cache: 10000, // Cache 10k entries
  allowList: ['127.0.0.1'], // Whitelist localhost
  redis: process.env.REDIS_URL ? { url: process.env.REDIS_URL } : undefined,
});

// Register CORS
await app.register(cors, {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://commented-resistant-pools-column.trycloudflare.com',
    process.env.CORS_ORIGIN || '',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Register JWT
await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecretkey-change-in-production',
});

// Register Swagger documentation
await app.register(swagger, {
  openapi: {
    info: {
      title: 'SINT Operator Dashboard API',
      description: 'RESTful API for SINT Operator Dashboard - AI Agent Management & Observability',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'auth', description: 'Authentication endpoints' },
      { name: 'tasks', description: 'Task management' },
      { name: 'costs', description: 'Cost tracking' },
      { name: 'analytics', description: 'Analytics and reporting' },
      { name: 'traces', description: 'Execution traces and spans' },
      { name: 'policies', description: 'Policy rules and enforcement' },
      { name: 'metrics', description: 'Real-time metrics and statistics' },
      { name: 'health', description: 'Health checks and status' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

// Register Swagger UI
await app.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Register WebSocket
await app.register(websocket);
setupWebSocket(app);

// Routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(tasksRoutes, { prefix: '/api/tasks' });
app.register(analyticsRoutes, { prefix: '/api/analytics' });
app.register(costsRoutes, { prefix: '/api/costs' });
app.register(tracesRoutes, { prefix: '/api/traces' });
app.register(policiesRoutes, { prefix: '/api/policies' });
app.register(metricsRoutes, { prefix: '/api/metrics' });

// Health check
app.get('/health', {
  schema: {
    description: 'Health check endpoint',
    tags: ['health'],
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          timestamp: { type: 'string' },
          uptime: { type: 'number' },
          version: { type: 'string' },
        },
      },
    },
  },
}, async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  };
});

// API info endpoint
app.get('/api', {
  schema: {
    description: 'API information',
    tags: ['health'],
  },
}, async () => {
  return {
    name: 'SINT Operator Dashboard API',
    version: '1.0.0',
    description: 'RESTful API for AI Agent Management & Observability',
    docs: '/docs',
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      costs: '/api/costs',
      analytics: '/api/analytics',
      traces: '/api/traces',
      policies: '/api/policies',
      metrics: '/api/metrics',
    },
  };
});

// Start server
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

try {
  await app.listen({ port: PORT, host: HOST });
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
  console.log(`📚 API documentation at http://${HOST}:${PORT}/docs`);
  console.log(`🔍 API info at http://${HOST}:${PORT}/api`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
