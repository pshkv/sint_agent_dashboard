/**
 * React Hook for OpenClaw Gateway Integration
 */

import { useEffect, useState, useCallback } from 'react';
import { getOpenClawClient, OpenClawEvent } from '../lib/openclawClient';

export function useOpenClaw(mockMode = true) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<OpenClawEvent | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const client = getOpenClawClient({ mockMode });

  useEffect(() => {
    // Connect to Gateway
    if (!mockMode) {
      client.connect().catch((err) => {
        console.error('[useOpenClaw] Connection failed:', err);
        setError(err);
      });
    } else {
      setIsConnected(true);
    }

    // Subscribe to all events
    const unsubscribe = client.on('*', (event) => {
      setLastEvent(event);
    });

    // Check connection status periodically
    const statusInterval = setInterval(() => {
      setIsConnected(client.isConnected());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, [client, mockMode]);

  const sendMessage = useCallback(
    (message: any) => {
      client.send(message);
    },
    [client]
  );

  const toggleMockMode = useCallback(
    (enabled: boolean) => {
      client.setMockMode(enabled);
      setIsConnected(enabled);
    },
    [client]
  );

  return {
    isConnected,
    lastEvent,
    error,
    sendMessage,
    toggleMockMode,
    client,
  };
}
