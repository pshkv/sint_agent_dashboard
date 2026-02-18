import type { FastifyInstance } from 'fastify';
import type { WebSocket } from 'ws';
import type { WSEvent } from '@sint-dashboard/shared';

const clients = new Set<WebSocket>();

export function setupWebSocket(app: FastifyInstance) {
  app.get('/ws', { websocket: true }, (socket, request) => {
    clients.add(socket);
    
    socket.on('close', () => {
      clients.delete(socket);
    });
  });

  // Add broadcast method to app
  (app as any).websocketServer = {
    broadcast: (event: WSEvent) => {
      const message = JSON.stringify(event);
      clients.forEach(client => {
        if (client.readyState === 1) { // OPEN
          client.send(message);
        }
      });
    },
  };
}
