import { numberService } from '@/src/lib/api/services';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBingoStore } from '@/src/lib/stores/bingo';
import { useEffect } from 'react';

// Hook para obtener todos los números llamados en un evento
export function useNumbersByEvent(eventId: string, options = { enabled: true }) {
  const query = useQuery({
    queryKey: ['numbers', eventId],
    queryFn: () => numberService.getNumbersByEvent(eventId),
    enabled: !!eventId && options.enabled,
    refetchInterval: 5000, // Reducido de 20000 a 5000 ms (5 segundos)
    refetchIntervalInBackground: true, // Refrescar incluso cuando la página no está activa
  });

  // Handle data updates using useEffect
  useEffect(() => {
    const data = query.data;
    // Actualizar el store de Zustand con los datos más recientes
    if (data && data.length > 0) {
      const sortedNumbers = [...data].sort(
        (a, b) => new Date(b.called_at).getTime() - new Date(a.called_at).getTime()
      );
      const lastNumber = sortedNumbers[0];

      // Obtenemos el store de Zustand y actualizamos el currentNumber
      const bingoStore = useBingoStore.getState();
      if (lastNumber && lastNumber.value !== bingoStore.currentNumber) {
        bingoStore.addCalledNumber(lastNumber.value, lastNumber.called_at);
      }
    }
  }, [query.data]);

  return query;
}

// Nuevo hook específico para obtener solo el último número llamado
// con un intervalo de refresco muy corto para mayor sincronización
export function useLastCalledNumber(eventId: string, options = { enabled: true }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['lastNumber', eventId],
    queryFn: async () => {
      const numbers = await numberService.getNumbersByEvent(eventId);
      if (!numbers || numbers.length === 0) {
        return null;
      }

      // Ordenar por fecha de llamada (descendente) y obtener el primer elemento
      const sortedNumbers = [...numbers].sort(
        (a, b) => new Date(b.called_at).getTime() - new Date(a.called_at).getTime()
      );

      return sortedNumbers[0];
    },
    enabled: !!eventId && options.enabled,
    refetchInterval: 2000, // Consulta cada 2 segundos
    refetchIntervalInBackground: true,
    staleTime: 1000, // Los datos se consideran obsoletos después de 1 segundo
  });

  // Handle data updates using useEffect
  useEffect(() => {
    const lastNumber = query.data;
    if (lastNumber) {
      // Actualizar el Zustand store directamente desde aquí
      const bingoStore = useBingoStore.getState();
      if (lastNumber.value !== bingoStore.currentNumber) {
        bingoStore.addCalledNumber(lastNumber.value, lastNumber.called_at);
      }

      // También invalidar la consulta de números para mantener todo sincronizado
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    }
  }, [query.data, eventId, queryClient]);

  return query;
}

export function useDrawNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: numberService.drawNumber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers'] });
    },
  });
}

export function usePostNumbersByEvent(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (number: number) => numberService.postByEvent(eventId, number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    },
  });
}

// Nueva mutación para eliminar el último número de un evento
export function useDeleteLastNumber(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => numberService.deleteLastNumberByEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    },
  });
}

// Nueva mutación para resetear todos los números de un evento
export function useResetEventNumbers(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => numberService.resetNumbersByEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['numbers', eventId] });
    },
  });
}
