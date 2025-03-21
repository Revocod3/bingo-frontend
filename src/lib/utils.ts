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