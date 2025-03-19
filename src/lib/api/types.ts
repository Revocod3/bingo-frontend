// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface VerifyEmailRequest {
  email: string;
  verification_code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
}

// Event types
export interface Event {
  id: number;
  name: string;
  prize: number;
  start_date: string;  // Changed from start to start_date
  description?: string;
  end_date?: string;
  creator?: number;
}

export interface CreateEventRequest {
  name: string;
  prize: number;
  start_date: string;  // Changed from start to start_date
  description?: string;
  end_date?: string;
}

// BingoCard types
export interface BingoCard {
  id: number;
  event: number;
  user: number;
  numbers: Record<string, BingoNumber>;
  is_winner: boolean;
  hash: string;
}

export interface CreateBingoCardRequest {
  event: number;
}

// Number types
export interface BingoNumber {
  id: number;
  event: number;
  value: number;
  called_at: string;
}

// Error handling types
export interface ApiError {
  response?: {
    data?: {
      detail?: string;
      [key: string]: unknown;
    };
    status?: number;
  };
  message?: string;
}

// WebSocket message types
export interface WebSocketEventInfo {
  id: number;
  name: string;
  prize: string;
  start_date: string;  // Changed from start to start_date
  called_numbers: {
    id: number;
    value: number;
    called_at: string;
  }[];
}

export interface WebSocketUserCards {
  cards: {
    id: number;
    numbers: Record<string, number>;
    is_winner: boolean;
    hash: string;
  }[];
}

export interface WebSocketNumberCalled {
  number: {
    id: number;
    value: number;
    called_at: string;
  };
}

export interface WebSocketWinnerAnnouncement {
  user_id: number;
  username: string;
  card_id: number;
  card: {
    id: number;
    numbers: Record<string, number>;
    hash: string;
  };
  pattern: string;
}

export interface WebSocketPlayerJoined {
  user_id: number;
  username: string;
}

export interface WebSocketChatMessage {
  user_id: number;
  username: string;
  message: string;
}

export interface WebSocketError {
  message: string;
}
