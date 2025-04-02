import { useMutation } from '@tanstack/react-query';
import apiClient from '@/src/lib/api/client';
import { BingoCard } from '@/src/lib/api/types';

interface GenerateBulkCardsRequest {
  event_id: string;
  quantity: number;
}

interface DownloadPdfRequest {
  event_id: string;
  cards: BingoCard[];
}

interface EmailCardsRequest {
  email: string;
  event_id: string;
  cards: BingoCard[];
  subject?: string;
  message?: string;
}

// Hook to generate multiple cards at once
export function useGenerateBulkCards() {
  return useMutation({
    mutationFn: async (data: GenerateBulkCardsRequest) => {
      const response = await apiClient.post('/api/cards/generate_bulk/', data);
      return response.data;
    },
  });
}

// Hook to download cards as PDF
export function useDownloadCardsPdf() {
  return useMutation({
    mutationFn: async (data: DownloadPdfRequest) => {
      const response = await apiClient.post('/api/cards/download_pdf/', data, {
        responseType: 'blob', // Important for handling PDF file response
      });
      
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bingo-cards-event-${data.event_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return { success: true };
    },
  });
}

// Hook to email cards to recipients
export function useEmailCards() {
  return useMutation({
    mutationFn: async (data: EmailCardsRequest) => {
      const response = await apiClient.post('/api/cards/email_cards/', data);
      return response.data;
    },
  });
}
