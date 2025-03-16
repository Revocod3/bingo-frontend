import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { numberService } from '@/lib/api/services';

export function useNumbersByEvent(eventId: number) {
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['numbers', data.event] });
    }
  });
}
