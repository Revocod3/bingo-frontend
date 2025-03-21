import { useEffect, useState, useRef, useCallback } from 'react';
import websocketService, { WebSocketMessage } from '@/lib/websocket/websocket';

type WebSocketOptions = {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  autoReconnect?: boolean;
};

export function useWebSocket(token?: string, options: WebSocketOptions = {}, eventId: string = '') {
  const [isConnected, setIsConnected] = useState(false);
  const optionsRef = useRef(options);
  const eventIdRef = useRef(eventId);
  
  // Update refs when options or eventId change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);
  
  useEffect(() => {
    eventIdRef.current = eventId;
  }, [eventId]);
  
  // Connect to WebSocket
  const connect = useCallback((newToken?: string) => {
    if (!newToken && !token) return false;
    
    // Make sure we don't try to connect with an empty eventId
    if (!eventIdRef.current) {
      console.error('Cannot connect WebSocket: No event ID provided');
      return false;
    }
    
    const effectiveToken = newToken || token || '';
    
    return websocketService.connect(eventIdRef.current, effectiveToken, {
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
  
  // Connect automatically if token and eventId are provided
  useEffect(() => {
    if (token && eventId) {
      connect();
    }
    
    return () => {
      if (optionsRef.current.autoReconnect !== true) {
        disconnect();
      }
    };
  }, [connect, disconnect, token, eventId, options.autoReconnect]);
  
  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  };
}

export default useWebSocket;
