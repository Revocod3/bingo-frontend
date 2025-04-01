import { useQuery } from '@tanstack/react-query';
import apiClient from '@/src/lib/api/client';
import { ApiPaymentMethod } from '@/lib/api/types';

export function useActivePaymentMethods() {
  return useQuery({
    queryKey: ['active-payment-methods'],
    queryFn: async (): Promise<ApiPaymentMethod[]> => {
      const response = await apiClient.get<ApiPaymentMethod[]>('/api/payment-methods/active/');
      return response.data;
    },
  });
}
