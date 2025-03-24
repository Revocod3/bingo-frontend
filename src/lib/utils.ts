import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ApiError, BingoCard as BingoCardType } from '@/src/lib/api/types';

/**
 * Combines multiple class names or conditional class names and merges Tailwind classes properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para convertir un cartón a una matriz 5x5 para visualización
export const getCardNumbers = (card: any): string[][] => {
  // Crear matriz 5x5 para la tarjeta
  const cardMatrix: string[][] = Array(5).fill(0).map(() => Array(5).fill(''));
  
  // Asegurar que 'N0' esté en el centro
  cardMatrix[2][2] = 'N0';
  
  // Llenar el resto de la tarjeta
  if (Array.isArray(card.numbers)) {
    for (let i = 0; i < card.numbers.length; i++) {
      const number = String(card.numbers[i]); // Convertir a string si no lo es
      if (number === 'N0') continue; // Ya colocamos el FREE en el centro
      
      const letter = number.charAt(0);
      const colIndex = 'BINGO'.indexOf(letter);
      if (colIndex === -1) continue; // Si no es una letra válida, saltar
      
      // Encontrar la primera fila vacía en esta columna (excluyendo el centro)
      for (let row = 0; row < 5; row++) {
        // Saltar el centro
        if (colIndex === 2 && row === 2) continue;
        
        if (cardMatrix[row][colIndex] === '') {
          cardMatrix[row][colIndex] = number;
          break;
        }
      }
    }
  }
  
  return cardMatrix;
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
