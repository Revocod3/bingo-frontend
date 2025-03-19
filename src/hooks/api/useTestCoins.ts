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

export function usePurchaseCards() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ eventId, quantity }: { eventId: number; quantity: number }) => {
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
