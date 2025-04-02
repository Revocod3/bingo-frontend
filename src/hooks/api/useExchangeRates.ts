import { useQuery } from '@tanstack/react-query';
import apiClient from '@/src/lib/api/client';

export interface CurrentRateResponse {
  rates: JSON;
  description: string;
  last_updated: string;
}

// Hook to fetch current exchange rates
export function useCurrentExchangeRates() {
  return useQuery<CurrentRateResponse>({
    queryKey: ['exchangeRates', 'current'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/rates/current/');
      return data;
    },
    // Refresh every 5 minutes to keep rates updated
    refetchInterval: 5 * 60 * 1000,
  });
}