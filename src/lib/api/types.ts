import { WinningPattern } from "@/src/hooks/api/useWinningPatterns";

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
  user: User;
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
  is_staff: boolean;
  is_superuser: boolean;
  is_seller: boolean; // Add this field
  uuid: string;
  last_login?: string;
  date_joined?: string;
  phone_number?: string;
}

// Event types
export interface Event {
  start?: string | number | Date;
  end?: string | number | Date;
  id: number | string;
  name: string;
  prize: number;
  start_date: string; 
  description?: string;
  end_date?: string;
  creator?: number;
  is_active?: boolean;
  is_live?: boolean;
}

export interface CreateEventRequest {
  name: string;
  prize: number;
  description?: string;
  end_date?: string;
  start: string | number | Date;
  end?: string | number | Date;
}

// BingoCard types
export interface BingoCard {
  id: number;
  event: string;
  user: number;
  numbers: Record<string, BingoNumber>;
  is_winner: boolean;
  hash: string;
}

export interface CreateBingoCardRequest {
  event: string;
}

// Number types
export interface BingoNumber {
  id: number;
  event: string;
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

export interface BingoClaimResponse {
  success: boolean;
  message: string;
  card: BingoCard;
  winning_pattern: WinningPattern;
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

// Admin types
export interface UserAdminUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  is_staff?: boolean;
  is_active?: boolean;
}

export interface UserAdminCreate extends UserAdminUpdate {
  email: string;
  password: string;
}

export interface AdminEventStats {
  total_events: number;
  active_events: number;
  total_cards_sold: number;
  total_revenue: number;
}

export interface AdminUserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
}

// Payment method types
export interface ApiPaymentMethod {
  id?: string;
  name?: string;
  payment_method?: string;
  instructions?: string;
  details: Record<string, string>;
  is_active: boolean;
  order?: number;
}
