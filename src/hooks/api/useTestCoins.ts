import apiClient from '@/src/lib/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TestCoinBalance {
  balance: number;
  last_updated: string;
}

export function useTestCoinBalance() {
  return useQuery({
    queryKey: ['testCoinBalance'],
    queryFn: async (): Promise<TestCoinBalance> => {
      const response = await apiClient.get<TestCoinBalance>('/api/test-coins/my_balance/');
      return response.data;
    },
    // Refresh every minute to keep balance updated
    refetchInterval: 60 * 1000,
  });
}

interface DepositResponse {
  unique_code: string;
  reference: string;
}
interface DepositRequest {
  amount: number;
}
interface DepositConfirmResponse {
  success: boolean;
  message: string;
}
interface DepositConfirmRequest {
  unique_code: string;
  reference: string;
  payment_method_id?: string; // Añadimos el ID del método de pago
}
interface Deposit {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  unique_code: string;
  reference: string;
  admin_notes: string;
  approved_at: string;
  rejected_at: string;
}
interface AdminDeposit {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  unique_code: string;
  reference: string;
  admin_notes: string;
  approved_at: string;
  rejected_at: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}
interface DepositApproveResponse {
  success: boolean;
  message: string;
  deposit: Deposit;
}
interface DepositApproveRequest {
  deposit_id: string;
  admin_notes?: string;
}

export function useDepositRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number): Promise<DepositResponse> => {
      const response = await apiClient.post('/api/test-coins/deposit/request_deposit/', { amount } as DepositRequest);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the test coin balance query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['testCoinBalance'] });
    },
  });
}

export function useDepositConfirm() {
  return useMutation({
    mutationFn: async ({ 
      uniqueCode, 
      reference, 
      paymentMethodId 
    }: { 
      uniqueCode: string; 
      reference: string; 
      paymentMethodId?: string 
    }): Promise<DepositConfirmResponse> => {
      const response = await apiClient.post('/api/test-coins/deposit/confirm_deposit/', { 
        unique_code: uniqueCode, 
        reference,
        // Envía ambos campos para mayor compatibilidad mientras se resuelve la discrepancia
        payment_method_id: paymentMethodId,
        payment_method: paymentMethodId
      } as DepositConfirmRequest);
      return response.data;
    },
  });
}

export function useMyDeposits() {
  return useQuery({
    queryKey: ['myDeposits'],
    queryFn: async (): Promise<Deposit[]> => {
      const response = await apiClient.get<Deposit[]>('/api/test-coins/deposit/my_deposits/');
      return response.data;
    },
  });
}
export function usePendingDeposits() {
  return useQuery({
    queryKey: ['pendingDeposits'],
    queryFn: async (): Promise<AdminDeposit[]> => {
      const response = await apiClient.get<AdminDeposit[]>('/api/test-coins/deposit/pending/');
      return response.data;
    },
  });
}

export function useApproveDeposit() {
  return useMutation({
    mutationFn: async ({ depositId, adminNotes }: { depositId: string; adminNotes?: string }): Promise<DepositApproveResponse> => {
      const response = await apiClient.post(`/api/test-coins/deposit/approve/`, { deposit_id: depositId, admin_notes: adminNotes } as DepositApproveRequest);
      return response.data;
    },
  });
}

export function useRejectDeposit() {
  return useMutation({
    mutationFn: async ({ depositId, adminNotes }: { depositId: string; adminNotes?: string }): Promise<any> => {
      const response = await apiClient.post(`/api/test-coins/deposit/${depositId}/reject/`, { admin_notes: adminNotes });
      return response.data;
    },
  });
}
export function useCardPrice() {
  return useQuery({
    queryKey: ['cardPrice'],
    queryFn: async (): Promise<number> => {
      const response = await apiClient.get<{ card_price: number }>('/api/cards/card_price/');
      return response.data.card_price;
    },
    // Refresh every minute to keep price updated
    refetchInterval: 60 * 1000,
  });
}

export function useUpdateCardPrice() {
  return useMutation({
    mutationFn: async (price: number): Promise<any> => {
      const response = await apiClient.post('/api/cards/card_price/', { card_price: price });
      return response.data;
    },
  });
}

export function usePurchaseCards() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, quantity }: { eventId: string; quantity: number }) => {
      const response = await apiClient.post('/api/cards/purchase/', {
        event_id: eventId,
        quantity,
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both the test coin balance and bingo cards queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['testCoinBalance'] });
      queryClient.invalidateQueries({ queryKey: ['bingoCards'] });
    },
  });
}
