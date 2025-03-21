import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { numberService } from '@/lib/api/services';

export function useNumbersByEvent(eventId: string) {
  return useQuery({
    queryKey: ['numbers', eventId],
    queryFn: () => numberService.getNumbersByEvent(eventId),
    enabled: !!eventId
  });
}

export function useDrawNumber() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: numberService.drawNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers'] });
    }
  });
}
