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
    refetchInterval: enabled ? 5000 : false, // Verificar cada 5 segundos si está habilitado
    refetchIntervalInBackground: false
  });
};

// Hook para reclamar victoria (cantar Bingo)
export const useClaimBingo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cardId: string) => {
      const { data } = await apiClient.post('/api/cards/claim/', { card_id: cardId });
      return data as ClaimResult;
    },
    onSuccess: (_, cardId) => {
      // Invalidar consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ['verify-card-pattern', cardId] });
      queryClient.invalidateQueries({ queryKey: ['card', cardId] });
      queryClient.invalidateQueries({ queryKey: ['user-cards'] });
    }
  });
};
