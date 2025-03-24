import apiClient from '@/src/lib/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface WinningPattern {
  id: number;
  name: string;
  description: string;
  positions: number[];
  pattern: number[][];
  is_active: boolean;
}

export interface CreateWinningPatternRequest {
  name: string;
  description: string;
  positions: number[];
}

export interface UpdateWinningPatternRequest {
  name?: string;
  description?: string;
  positions?: number[];
  is_active?: boolean;
}

export const useWinningPatterns = () => {
  return useQuery<WinningPattern[]>({
    queryKey: ['winning-patterns'],
    queryFn: async () => {
      const { data } = await apiClient.get('/api/winning-patterns/');
      return data;
    },
  });
};

export const useWinningPattern = (id: string | number) => {
  return useQuery<WinningPattern>({
    queryKey: ['winning-pattern', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/winning-patterns/${id}/`);
      return data;
    },
    enabled: !!id,
  });
};

export const useWinningPatternVisualization = (id: string | number) => {
  return useQuery<{ pattern: number[][] }>({
    queryKey: ['winning-pattern-visualization', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/winning-patterns/${id}/visualize/`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateWinningPattern = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patternData: CreateWinningPatternRequest) => {
      const { data } = await apiClient.post('/api/winning-patterns/', patternData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winning-patterns'] });
    },
  });
};

export const useUpdateWinningPattern = (id: string | number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patternData: UpdateWinningPatternRequest) => {
      const { data } = await apiClient.put(`/api/winning-patterns/${id}/`, patternData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winning-patterns'] });
      queryClient.invalidateQueries({ queryKey: ['winning-pattern', id] });
    },
  });
};

export const useDeleteWinningPattern = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string | number) => {
      await apiClient.delete(`/api/winning-patterns/${id}/`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['winning-patterns'] });
    },
  });
};

export const useEventPatterns = (eventId: string | number) => {
  return useQuery<WinningPattern[]>({
    queryKey: ['event-patterns', eventId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/events/${eventId}/patterns/`);
      return data;
    },
    enabled: !!eventId,
  });
};

export const useSetEventPatterns = (eventId: string | number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patternIds: number[]) => {
      const { data } = await apiClient.post(`/api/events/${eventId}/set_patterns/`, { pattern_ids: patternIds });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-patterns', eventId] });
    },
  });
};
