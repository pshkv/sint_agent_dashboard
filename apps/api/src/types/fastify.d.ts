import 'fastify';
import type { WSEvent } from '@sint-dashboard/shared';

declare module 'fastify' {
  interface FastifyInstance {
    websocketServer: {
      broadcast: (event: WSEvent) => void;
    };
  }
}
