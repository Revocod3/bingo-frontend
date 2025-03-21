import apiClient from './client';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  VerifyEmailRequest,
  ResendVerificationRequest,
  Event,
  CreateEventRequest,
  BingoCard,
  CreateBingoCardRequest,
  BingoNumber,
} from './types';

// Auth services
export const authService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/token/', data);
    // Save the token to localStorage
    if (typeof window !== 'undefined' && response.data.access) {
      localStorage.setItem('authToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post<User>('/api/auth/register/', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<{ detail: string }> => {
    const response = await apiClient.post<{ detail: string }>('/api/auth/verify-email/', data);
    return response.data;
  },

  resendVerification: async (data: ResendVerificationRequest): Promise<{ detail: string }> => {
    const response = await apiClient.post<{ detail: string }>('/api/auth/resend-verification/', data);
    return response.data;
  },
  
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/token/refresh/', {
      refresh: refreshToken,
    });
    
    if (typeof window !== 'undefined' && response.data.access) {
      localStorage.setItem('authToken', response.data.access);
    }
    
    return response.data;
  },
  
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  }
};

// User services
export const userService = {
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/users/me/');
    return response.data;
  },
  
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/api/users/');
    return response.data;
  },
  
  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/api/users/${id}/`);
    return response.data;
  }
};

// Event services
export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/api/events/');
    return response.data;
  },
  
  getEvent: async (id: string): Promise<Event> => {
    const response = await apiClient.get<Event>(`/api/events/${id}/`);
    return response.data;
  },
  
  createEvent: async (data: CreateEventRequest): Promise<Event> => {
    // Ensure we're using start_date instead of start
    const response = await apiClient.post<Event>('/api/events/', data);
    return response.data;
  },
  
  updateEvent: async (id: number, data: Partial<CreateEventRequest>): Promise<Event> => {
    const response = await apiClient.patch<Event>(`/api/events/${id}/`, data);
    return response.data;
  },
  
  deleteEvent: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/events/${id}/`);
  }
};

// BingoCard services
export const bingoCardService = {
  getBingoCards: async (): Promise<BingoCard[]> => {
    const response = await apiClient.get<BingoCard[]>('/api/cards/');
    return response.data;
  },
  
  getBingoCard: async (id: number): Promise<BingoCard> => {
    const response = await apiClient.get<BingoCard>(`/api/cards/${id}/`);
    return response.data;
  },
  
  createBingoCard: async (data: CreateBingoCardRequest): Promise<BingoCard> => {
    const response = await apiClient.post<BingoCard>('/api/cards/', data);
    return response.data;
  },
  
  generateBingoCard: async (eventId: number): Promise<BingoCard> => {
    const response = await apiClient.post<BingoCard>('/api/cards/generate/', { event_id: eventId });
    return response.data;
  },
  
  markNumber: async (cardId: number, number: number): Promise<{ status: string }> => {
    const response = await apiClient.post<{ status: string }>(`/api/cards/${cardId}/mark_number/`, { number });
    return response.data;
  }
};

// Number services
export const numberService = {
  getNumbersByEvent: async (eventId: string): Promise<BingoNumber[]> => {
    // Usando el endpoint correcto según views.py -> by_event action
    const response = await apiClient.get<BingoNumber[]>(`/api/numbers/by_event/?event_id=${eventId}`);
    return response.data;
  },
  
  drawNumber: async (): Promise<BingoNumber> => {
    const response = await apiClient.get<BingoNumber>('/api/numbers/draw/');
    return response.data;
  },
  
  // Corrige la implementación para usar el endpoint correcto
  postByEvent: async (eventId: string, number: number): Promise<BingoNumber> => {
    // Según el backend, deberíamos crear un número en el NumberViewSet
    const response = await apiClient.post<BingoNumber>(`/api/numbers/`, {
      event_id: eventId,
      event: eventId,
      value: number
    });
    return response.data;
  },
  
  // Nuevo método para eliminar el último número llamado en un evento
  deleteLastNumberByEvent: async (eventId: string): Promise<void> => {
    const response = await apiClient.delete(`/api/numbers/delete_last/?event_id=${eventId}`);
    return response.data;
  },
  
  // Nuevo método para resetear todos los números de un evento
  resetNumbersByEvent: async (eventId: string): Promise<void> => {
    const response = await apiClient.delete(`/api/numbers/reset_event/?event_id=${eventId}`);
    return response.data;
  },
};

// Test coin services
export const testCoinService = {
  getBalance: async (): Promise<{ balance: number; last_updated: string }> => {
    const response = await apiClient.get<{ balance: number; last_updated: string }>('/api/test-coins/my_balance/');
    return response.data;
  }
};
