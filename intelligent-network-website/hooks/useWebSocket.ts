import { useState, useEffect, useCallback, useRef } from 'react';
import useNetworkStore from '@/lib/store/useNetworkStore';

const RECONNECT_DELAY = 3000;

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  
  // Get store actions
  const addMetric = useNetworkStore((state) => state.addMetric);

  useEffect(() => {
    // Prevent multiple connections or empty url
    if (!url || ws.current?.readyState === WebSocket.OPEN) return;

    const connect = () => {
        console.log(`[WebSocket] Connecting to ${url}...`);
        const socket = new WebSocket(url);
        ws.current = socket;

        socket.onopen = () => {
            console.log('[WebSocket] Connected');
            setIsConnected(true);
            setError(null);
        };

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'history') {
                    // Handle history if needed
                } else if (message.type === 'update') {
                    const newMetrics = message.metrics; 
                    if (newMetrics && newMetrics.length > 0) {
                        addMetric(newMetrics[0]); 
                    }
                } else if (message.error) {
                    setError(message.error);
                }
            } catch (e) {
                console.error('[WebSocket] Error parsing message:', e);
            }
        };

        socket.onclose = (event) => {
            console.log(`[WebSocket] Disconnected: Code ${event.code}, Reason: ${event.reason}`);
            setIsConnected(false);
            ws.current = null;
            
            // Reconnect if not cleanly closed
            if (event.code !== 1000) {
                setTimeout(connect, RECONNECT_DELAY);
            }
        };

        socket.onerror = (event) => {
            // Suppress generic error logging as it often contains no useful info and spams the console
            // Connection failures are handled by onclose
            setError('Connection error');
        };
    };

    connect();

    return () => {
        if (ws.current) {
            console.log('[WebSocket] Cleaning up connection');
            ws.current.close();
            ws.current = null;
        }
    };
  }, [url]); // Removed addMetric from dep array to avoid re-runs if store changes stable identity

  return { isConnected, error };
};
