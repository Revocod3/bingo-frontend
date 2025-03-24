import apiClient from '../client';
import {  APIBingoPattern } from '@/lib/types';

export const patternsService = {
  /**
   * Obtener todos los patrones activos
   */
  getAllPatterns: async (): Promise<APIBingoPattern[]> => {
    const response = await apiClient.get('/api/winning-patterns/active/');
    return response.data;
  },
  
  /**
   * Obtener patrones para un evento específico
   */
  getPatternsForEvent: async (eventId: string | number): Promise<APIBingoPattern[]> => {
    const response = await apiClient.get(`/api/events/${eventId}/patterns/`);
    return response.data;
  },
  
  /**
   * Obtener detalles de un patrón específico
   */
  getPatternDetails: async (patternId: string): Promise<APIBingoPattern> => {
    const response = await apiClient.get(`/api/winning-patterns/${patternId}/`);
    return response.data;
  },
  
  /**
   * Visualizar un patrón (representación ASCII)
   */
  visualizePattern: async (patternId: string): Promise<string> => {
    const response = await apiClient.get(`/api/winning-patterns/${patternId}/visualize/`);
    return response.data;
  }
};
