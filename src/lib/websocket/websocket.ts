import config from '../../api/config';

export type WebSocketMessage = {
  type: string;
  payload: unknown;
};

type WebSocketOptions = {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
};

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectInterval = 3000;
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;
  private options: WebSocketOptions = {};
  private url: string = '';
  private currentEventId: string = '';
  private currentToken: string = '';
  
  constructor() {
    if (typeof window === 'undefined') return;
    // Use the API URL but replace http/https with ws/wss if needed
    this.url = config.wsUrl || config.apiUrl.replace(/^http/, 'ws');
  }
  
  public connect(eventId: string, token: string, options: WebSocketOptions = {}) {
    if (typeof window === 'undefined') return false;
    
    // Validate eventId - don't connect if it's empty
    if (!eventId || eventId === 'undefined') {
      console.error('Cannot connect to WebSocket: Invalid event ID');
      return false;
    }
    
    this.options = options;
    this.currentEventId = eventId;
    this.currentToken = token;
    
    try {
      // First disconnect any existing connection
      this.disconnect();
      
      // Connect to the specific event WebSocket endpoint
      this.socket = new WebSocket(`${this.url}/ws/event/${eventId}/?token=${token}`);
      
      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.options.onOpen?.();
      };
      
      this.socket.onclose = (event) => {
        this.options.onClose?.(event);
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.options.onError?.(error);
      };
      
      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          this.options.onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      return true;
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      return false;
    }
  }
  
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.currentEventId) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect(this.currentEventId, this.currentToken, this.options);
      }, this.reconnectInterval);
    }
  }
  
  public send(message: WebSocketMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }
  
  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
  
  public isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;
