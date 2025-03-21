import apiClient from '../client';

export const bingoCardService = {
  getBingoCards: async () => {
    const response = await apiClient.get('/api/cards/');
    return response.data;
  },
  
  getBingoCard: async (id: number) => {
    const response = await apiClient.get(`/api/cards/${id}/`);
    return response.data;
  },
  
  createBingoCard: async (data: any) => {
    const response = await apiClient.post('/api/cards/', data);
    return response.data;
  },
  
  generateBingoCard: async (eventId: number) => {
    const response = await apiClient.post('/api/cards/generate/', { event_id: eventId });
    return response.data;
  },
  
  markNumber: async (cardId: number, number: number) => {
    const response = await apiClient.post(`/api/cards/${cardId}/mark/`, { number });
    return response.data;
  },
  
  claimBingo: async ({ cardId, pattern = 'bingo' }: { cardId: string | number; pattern: string }) => {
    // Log what we're sending for debugging
    console.log('Sending claim request with:', { card_id: cardId, pattern });
    
    const response = await apiClient.post('/api/cards/claim/', { 
      card_id: cardId,
      pattern
    });
    
    // Log the response for debugging
    console.log('Claim response:', response.data);
    return response.data;
  }
};
