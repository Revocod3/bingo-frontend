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
  start: string;
}

export interface CreateEventRequest {
  name: string;
  prize: number;
  start: string;
}

// BingoCard types
export interface BingoCard {
  id: number;
  event: number;
  user: number;
  numbers: Record<string, any>;
  is_winner: boolean;
  hash: string;
}

export interface CreateBingoCardRequest {
  event: number;
}

// Number types
export interface Number {
  id: number;
  event: number;
  value: number;
  called_at: string;
}
