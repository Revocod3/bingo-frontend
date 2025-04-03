import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

// Interfaz para la verificación de patrón
export interface PatternVerificationResult {
  card_id: string;
  is_winner: boolean;
  matched_patterns?: number[];
  error?: string;
  success: boolean;
}

// Interfaz para reclamar victoria
export interface ClaimResult {
  success: boolean;
  message: string;
  winning_pattern?: number;
}

// Hook para verificar si un cartón tiene un patrón ganador
export const useVerifyCardPattern = (cardId: string, enabled = true) => {
  return useQuery<PatternVerificationResult>({
    queryKey: ['verify-card-pattern', cardId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/cards/${cardId}/verify_pattern/`);
      return data;
    },
    enabled: !!cardId && enabled,
    refetchInterval: enabled ? 5000 : false, // Only automatically refetch if enabled
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    staleTime: 30000, // Keep data fresh for 30 seconds
  });
};

// Hook para reclamar victoria (cantar Bingo)
export const useClaimBingo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cardId }: { cardId: string | number }) => {
      if (!cardId) {
        throw new Error('Card ID is required');
      }
      return apiClient.post(`/api/cards/${cardId}/claim/`, { card_id: cardId });
    },
    onSuccess: (_, { cardId }) => {
      // Invalidate verification query
      queryClient.invalidateQueries({ queryKey: ['verify-card-pattern', cardId] });
      // No need to invalidate other queries as frequently
    },
  });
};
