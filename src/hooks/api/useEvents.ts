import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { eventService } from '@/lib/api/services';
import { CreateEventRequest } from '@/lib/api/types';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventService.getEvents
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEvent(id),
    enabled: !!id
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateEventRequest> }) => 
      eventService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
    }
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: eventService.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
}
