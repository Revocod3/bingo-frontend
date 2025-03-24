import { useQuery } from '@tanstack/react-query';
import { patternsService } from '@/lib/api/services/patternsService';
import { APIBingoPattern, convertAPIPatternToLocal, BingoPattern } from '@/lib/types';

/**
 * Hook para obtener todos los patrones activos de bingo
 */
export function usePatterns() {
  return useQuery<APIBingoPattern[], Error>({
    queryKey: ['patterns', 'active'],
    queryFn: patternsService.getAllPatterns,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener patrones específicos de un evento
 */
export function useEventPatterns(eventId: string | number | undefined) {
  return useQuery<APIBingoPattern[], Error>({
    queryKey: ['patterns', 'event', eventId],
    queryFn: () => 
      eventId ? patternsService.getPatternsForEvent(eventId) : Promise.reject('No event ID provided'),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener los detalles de un patrón específico
 */
export function usePatternDetails(patternId: string | undefined) {
  return useQuery<APIBingoPattern, Error>({
    queryKey: ['patterns', 'details', patternId],
    queryFn: () => 
      patternId ? patternsService.getPatternDetails(patternId) : Promise.reject('No pattern ID provided'),
    enabled: !!patternId,
  });
}

/**
 * Hook para visualizar un patrón en formato ASCII
 */
export function usePatternVisualization(patternId: string | undefined) {
  return useQuery<string, Error>({
    queryKey: ['patterns', 'visualize', patternId],
    queryFn: () => 
      patternId ? patternsService.visualizePattern(patternId) : Promise.reject('No pattern ID provided'),
    enabled: !!patternId,
  });
}

/**
 * Utilidad para convertir patrones del formato de API a formato local
 */
export function convertPatternsToLocal(apiPatterns: APIBingoPattern[] | undefined): BingoPattern[] {
  if (!apiPatterns) return [];
  return apiPatterns.map(convertAPIPatternToLocal);
}
