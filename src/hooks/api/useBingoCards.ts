import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bingoCardService } from '@/lib/api/services';


export function useBingoCards() {
  return useQuery({
    queryKey: ['bingoCards'],
    queryFn: bingoCardService.getBingoCards
  });
}

export function useBingoCard(id: number) {
  return useQuery({
    queryKey: ['bingoCard', id],
    queryFn: () => bingoCardService.getBingoCard(id),
    enabled: !!id
  });
}

export function useCreateBingoCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bingoCardService.createBingoCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bingoCards'] });
    }
  });
}

export function useGenerateBingoCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: bingoCardService.generateBingoCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bingoCards'] });
    }
  });
}

export function useMarkNumber() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cardId, number }: { cardId: number; number: number }) => 
      bingoCardService.markNumber(cardId, number),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bingoCard', variables.cardId] });
    }
  });
}

export function useClaimBingo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cardId, pattern }: { cardId: string | number; pattern: string }) => 
      bingoCardService.claimBingo({ cardId: Number(cardId), pattern }),
    onSuccess: () => {
      // Refresh cards data after successful claim
      queryClient.invalidateQueries({ queryKey: ['bingoCards'] });
    },
    onError: (error: any) => {
      // Log detailed error information
      console.error('Claim Bingo mutation error:', error);
      console.error('Response data:', error.response?.data);
    }
  });
}
