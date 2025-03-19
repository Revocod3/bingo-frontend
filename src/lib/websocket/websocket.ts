import config from '../../api/config';

export type WebSocketMessage = {
  type: string;
  payload: any;
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
  
  constructor() {
    if (typeof window === 'undefined') return;
    // Use the API URL but replace http/https with ws/wss if needed
    this.url = config.wsUrl || config.apiUrl.replace(/^http/, 'ws');
  }
  
  public connect(eventId: number, token: string, options: WebSocketOptions = {}) {
    if (typeof window === 'undefined') return false;
    
    this.options = options;
    
    try {
      // Connect to the specific event WebSocket endpoint
      this.socket = new WebSocket(`${this.url}/ws/event/${eventId}/?token=${token}`);
      
      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        console.log(`WebSocket connection established for event ${eventId}`);
        this.options.onOpen?.();
      };
      
      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
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
          console.log('WebSocket message received:', message);
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
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        // We need to get the token again, this is just a placeholder
        const token = localStorage.getItem('authToken') || '';
        this.connect(0, token, this.options); // Pass a default eventId of 0
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
export const websocketService = new WebSocketService();

export default websocketService;
