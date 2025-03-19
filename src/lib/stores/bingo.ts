import { create } from 'zustand';
import websocketService, { WebSocketMessage } from '../websocket/websocket';

type WinnerInfo = {
  userId: number;
  userName: string;
  cardId: number;
  isCurrentUser: boolean;
};

type BingoState = {
  // Existing properties
  cards: number[][];
  currentNumber: number | null;
  calledNumbers: number[];
  isPlaying: boolean;
  activeCardIndex: number;
  
  // New properties
  isConnected: boolean;
  isWinner: boolean;
  winnerInfo: WinnerInfo | null;
  lastCalledAt: string | null;
  eventId: number | null;
  
  // Existing methods
  initializeGame: (cards: number[][]) => void;
  callNumber: () => void;
  resetGame: () => void;
  setActiveCardIndex: (index: number) => void;
  
  // New methods
  connectToGame: (eventId: number, token: string) => void;
  disconnectFromGame: () => void;
  handleWebSocketMessage: (message: WebSocketMessage) => void;
  markWinner: (winnerInfo: WinnerInfo) => void;
  clearWinner: () => void;
  addCalledNumber: (number: number, calledAt: string) => void;
};

export const useBingoStore = create<BingoState>((set, get) => ({
  // Existing state properties
  cards: [],
  currentNumber: null,
  calledNumbers: [],
  isPlaying: false,
  activeCardIndex: 0,
  
  // New state properties
  isConnected: false,
  isWinner: false,
  winnerInfo: null,
  lastCalledAt: null,
  eventId: null,
  
  // Existing methods with modifications as needed
  initializeGame: (cards) => set({ 
    cards, 
    isPlaying: true,
    calledNumbers: [] 
  }),
  
  callNumber: () => {
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
      .filter(n => !get().calledNumbers.includes(n));
    
    if (availableNumbers.length === 0) return;
    
    const newNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    
    // If connected to WebSocket, send the call through there instead of updating locally
    if (get().isConnected && get().eventId) {
      websocketService.send({
        type: 'CALL_NUMBER',
        payload: {
          eventId: get().eventId,
          number: newNumber
        }
      });
      return;
    }
    
    // Otherwise, update locally (for offline testing)
    set(state => ({
      currentNumber: newNumber,
      calledNumbers: [...state.calledNumbers, newNumber],
      lastCalledAt: new Date().toISOString()
    }));
  },
  
  resetGame: () => set({
    cards: [],
    currentNumber: null,
    calledNumbers: [],
    isPlaying: false,
    activeCardIndex: 0,
    isWinner: false,
    winnerInfo: null,
    lastCalledAt: null
  }),
  
  setActiveCardIndex: (index) => set({ activeCardIndex: index }),
  
  // New methods
  connectToGame: (eventId, token) => {
    websocketService.connect(eventId, token, {
      onOpen: () => {
        // No need to send JOIN_GAME separately, the connection to event-specific
        // endpoint already identifies the game
        set({ isConnected: true, eventId });
      },
      onClose: () => {
        set({ isConnected: false });
      },
      onMessage: (message) => {
        get().handleWebSocketMessage(message);
      }
    });
  },
  
  disconnectFromGame: () => {
    websocketService.disconnect();
    set({ isConnected: false, eventId: null });
  },
  
  handleWebSocketMessage: (message) => {
    switch (message.type) {
      case 'NUMBER_CALLED':
        get().addCalledNumber(
          message.payload.number,
          message.payload.calledAt
        );
        break;
        
      case 'WINNER_DECLARED':
        get().markWinner(message.payload);
        break;
        
      case 'GAME_RESET':
        set({ 
          calledNumbers: [],
          currentNumber: null,
          isWinner: false,
          winnerInfo: null
        });
        break;
        
      case 'GAME_STATE':
        // Handle initial game state
        set({
          calledNumbers: message.payload.calledNumbers || [],
          currentNumber: message.payload.currentNumber || null,
          isPlaying: message.payload.isPlaying || false,
          isWinner: !!message.payload.winnerInfo,
          winnerInfo: message.payload.winnerInfo || null,
          lastCalledAt: message.payload.lastCalledAt || null
        });
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  },
  
  markWinner: (winnerInfo) => {
    set({ 
      isWinner: true, 
      winnerInfo, 
      isPlaying: false 
    });
  },
  
  clearWinner: () => {
    set({
      isWinner: false,
      winnerInfo: null,
    });
  },
  
  addCalledNumber: (number, calledAt) => {
    set(state => {
      // Don't add duplicates
      if (state.calledNumbers.includes(number)) {
        return state;
      }
      
      return {
        currentNumber: number,
        calledNumbers: [...state.calledNumbers, number],
        lastCalledAt: calledAt || new Date().toISOString()
      };
    });
  }
}));