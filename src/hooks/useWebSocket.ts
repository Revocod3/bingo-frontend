import { useEffect, useState, useRef, useCallback } from 'react';
import websocketService, { WebSocketMessage } from '@/lib/websocket/websocket';

type WebSocketOptions = {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  autoReconnect?: boolean;
};

export function useWebSocket(token?: string, options: WebSocketOptions = {}, eventId: number = 0) {
  const [isConnected, setIsConnected] = useState(false);
  const optionsRef = useRef(options);
  
  // Update ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  
  // Connect to WebSocket
  const connect = useCallback((newToken?: string) => {
    if (!newToken && !token) return false;
    
    const effectiveToken = newToken || token || '';
    
    return websocketService.connect(eventId, effectiveToken, {
      onOpen: () => {
        setIsConnected(true);
        optionsRef.current.onOpen?.();
      },
      onClose: (event) => {
        setIsConnected(false);
        optionsRef.current.onClose?.(event);
      },
      onError: (error) => {
        optionsRef.current.onError?.(error);
      },
      onMessage: (message) => {
        optionsRef.current.onMessage?.(message);
      }
    });
  }, [token]);
  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    websocketService.disconnect();
    setIsConnected(false);
  }, []);
  
  // Send message
  const sendMessage = useCallback((message: WebSocketMessage) => {
    return websocketService.send(message);
  }, []);
  
  // Connect automatically if token is provided
  useEffect(() => {
    if (token) {
      connect();
    }
    
    return () => {
      if (optionsRef.current.autoReconnect !== true) {
        disconnect();
      }
    };
  }, [connect, disconnect, token, options.autoReconnect, eventId]);
  
  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  };
}

export default useWebSocket;
