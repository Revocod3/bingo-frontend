import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ApiError, BingoCard as BingoCardType } from '@/src/lib/api/types';

/**
 * Combines multiple class names or conditional class names and merges Tailwind classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCardNumbers = (card: BingoCardType): number[] => {
    if (!card.numbers) return Array(25).fill(0);
    if (Array.isArray(card.numbers)) {
      return card.numbers;
    }
    return Object.entries(card.numbers)
      .filter(([key]) => key !== 'free_space')
      .flatMap(([, value]) =>
        Array.isArray(value)
          ? value
          : typeof value === 'object' && value !== null
            ? Object.values(value)
            : [value]
      )
      .map(n => {
        const num = Number(n);
        return isNaN(num) ? 0 : num;
      });
  };

/**
 * Extracts an appropriate error message from API error responses
 */
export function getErrorMessage(error: unknown): string {
  // Check for API response with message
    console.error('Error claiming bingo:', error);
  
        // Cast to ApiError type to access properties safely
        const apiError = error as ApiError;
        // More detailed error handling
        const errorMessage = 
          typeof apiError.response?.data?.message === 'string' ? apiError.response.data.message :
          typeof apiError.message === 'string' ? apiError.message :
          'Ocurrió un error inesperado. Por favor intenta nuevamente.';

        return errorMessage;
}

export function formatBingoNumber(number: number | null) {
    if (number === null) return 'N/A';
    return number < 10 ? `0${number}` : String(number);
}
