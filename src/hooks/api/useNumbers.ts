import { numberService } from '@/src/lib/api/services';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


export function useNumbersByEvent(eventId: string) {
  return useQuery({
    queryKey: ['numbers', eventId],
    queryFn: () => numberService.getNumbersByEvent(eventId),
    enabled: !!eventId,
    refetchInterval: 20000, // Refrescar cada 5 segundos
    refetchIntervalInBackground: true // Refrescar incluso cuando la página no está activa
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

export function usePostNumbersByEvent(eventId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (number: number) => numberService.postByEvent(eventId, number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    }
  });
}

// Nueva mutación para eliminar el último número de un evento
export function useDeleteLastNumber(eventId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => numberService.deleteLastNumberByEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    }
  });
}

// Nueva mutación para resetear todos los números de un evento
export function useResetEventNumbers(eventId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => numberService.resetNumbersByEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    }
  });
}