import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export interface APIError {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  path: string;
}

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const timestamp = new Date().toISOString();
  const path = request.url;

  // Zod validation errors
  if (error instanceof ZodError) {
    const apiError: APIError = {
      error: 'Validation Error',
      message: 'Request validation failed',
      statusCode: 400,
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
      timestamp,
      path,
    };

    return reply.code(400).send(apiError);
  }

  // JWT authentication errors
  if (error.statusCode === 401 || error.message?.includes('token')) {
    const apiError: APIError = {
      error: 'Authentication Error',
      message: error.message || 'Invalid or missing authentication token',
      statusCode: 401,
      timestamp,
      path,
    };

    return reply.code(401).send(apiError);
  }

  // Authorization errors
  if (error.statusCode === 403) {
    const apiError: APIError = {
      error: 'Authorization Error',
      message: 'You do not have permission to access this resource',
      statusCode: 403,
      timestamp,
      path,
    };

    return reply.code(403).send(apiError);
  }

  // Not found errors
  if (error.statusCode === 404) {
    const apiError: APIError = {
      error: 'Not Found',
      message: 'The requested resource was not found',
      statusCode: 404,
      timestamp,
      path,
    };

    return reply.code(404).send(apiError);
  }

  // Rate limit errors
  if (error.statusCode === 429) {
    const apiError: APIError = {
      error: 'Rate Limit Exceeded',
      message: 'Too many requests, please try again later',
      statusCode: 429,
      timestamp,
      path,
    };

    return reply.code(429).send(apiError);
  }

  // Database errors
  if (error.message?.includes('database') || error.message?.includes('SQLITE')) {
    const apiError: APIError = {
      error: 'Database Error',
      message: 'A database error occurred',
      statusCode: 500,
      timestamp,
      path,
    };

    // Log full error for debugging
    request.log.error(error);

    return reply.code(500).send(apiError);
  }

  // Default server error
  const apiError: APIError = {
    error: 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
    statusCode: error.statusCode || 500,
    timestamp,
    path,
  };

  // Log full error for debugging
  request.log.error(error);

  return reply.code(apiError.statusCode).send(apiError);
}

// Not found handler for undefined routes
export async function notFoundHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const apiError: APIError = {
    error: 'Not Found',
    message: `Route ${request.method} ${request.url} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
    path: request.url,
  };

  return reply.code(404).send(apiError);
}
