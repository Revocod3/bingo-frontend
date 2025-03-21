import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BingoCard as BingoCardType } from '@/src/lib/api/types';

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
      .flatMap(([_, value]) =>
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
export function getErrorMessage(error: any): string {
  // Check for API response with message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for error message directly on error object
  if (error.message) {
    return error.message;
  }
  
  // Check for string error
  if (typeof error === 'string') {
    return error;
  }
  
  // Default message
  return 'Ocurrió un error inesperado. Por favor intenta nuevamente.';
}

export function isPatternPotentiallyValid(cardNumbers: any, calledNumbers: number[], pattern: string): boolean {
  // Simple check to avoid obviously invalid claims
  // This doesn't replace server-side validation, just improves UX
  
  switch (pattern) {
    case 'bingo':
      // Check if at least 5 numbers in any row/column are called
      return true; // Implement specific checks as needed
    case 'blackout':
      // For blackout, at least 24 numbers should be called (25 minus free space)
      return calledNumbers.length >= 24;
    // Add other pattern checks as needed
    default:
      return true;
  }
}