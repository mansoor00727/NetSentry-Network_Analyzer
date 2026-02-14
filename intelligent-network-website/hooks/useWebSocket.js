import { useState, useEffect, useCallback, useRef } from 'react';

const RECONNECT_DELAY = 3000;

export const useWebSocket = (url) => {
  const [data, setData] = useState({ current: {}, history: [], alerts: [] });
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const ws = useRef(null);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket Connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'history') {
             // Initial history load
             // Message data is list of metrics
             // We want to transform it if needed.
             // Set history.
             setData(prev => ({ ...prev, history: message.data }));
          } else if (message.type === 'update') {
             // Real-time update
             // message.metrics is list (one per interface)
             // message.alerts is list of new alerts
             const newMetrics = message.metrics; 
             const newAlerts = message.alerts || [];
             
             setData(prev => {
                // Determine current snapshot (e.g. aggregate or just store list)
                // For Dashboard we likely want to know "metrics for all interfaces"
                // Let's store `latest_metrics` map or list.
                
                // Add new metrics to history (maybe just first interface for simplicity in graph?)
                // Or better: Dashboard handles visualization. We just store raw data.
                
                // Limit history size?
                const updatedHistory = [newMetrics[0], ...prev.history].slice(0, 100); 
                // Wait, newMetrics is a LIST of interfaces for one timestamp. 
                // History was a list of single records in basic version.
                // Week 2: History should probably track one primary interface or aggregate?
                // For now let's just push the raw list? No, charts need flat structure usually.
                // Let's assume we track the FIRST interface in history for the main chart,
                // or updatedHistory is a list of "snapshots" (which are lists).
                
                return {
                    current: newMetrics, // List of all interfaces
                    history: updatedHistory,
                    alerts: [...newAlerts, ...prev.alerts].slice(0, 50)
                };
             });
          } else if (message.error) {
              setError(message.error);
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket Disconnected');
        // Reconnect logic
        setTimeout(() => connect(), RECONNECT_DELAY);
      };

      ws.current.onerror = (e) => {
        console.error('WebSocket Error:', e);
        setError('Connection error');
        ws.current.close();
      };

    } catch (e) {
      console.error('Connection failed:', e);
      setTimeout(() => connect(), RECONNECT_DELAY);
    }
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return { data, isConnected, error };
};
