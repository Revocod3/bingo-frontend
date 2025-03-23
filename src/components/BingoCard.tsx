'use client';

import { memo, useState, useEffect, useMemo } from 'react';
import { useBingoStore } from '@/lib/stores/bingo';

// Function to parse the bingo card numbers properly
export function parseCardNumbers(numbers: string[]): { letter: string, number: number }[] {
  return numbers.map(item => {
    // Extract the letter and number parts
    console.log(item);
    const letter = item.substring(0, 1);
    const number = parseInt(item.substring(1), 10);
    return { letter, number };
  });
}

// Ensure numbers are sorted correctly by column (BINGO order)
export function organizeCardByColumn(parsedNumbers: { letter: string, number: number }[]) {
  const columns: Record<string, number[]> = {
    'B': [],
    'I': [],
    'N': [],
    'G': [],
    'O': []
  };

  // Sort into columns
  parsedNumbers.forEach(item => {
    if (columns[item.letter]) {
      columns[item.letter].push(item.number);
    }
  });

  // Sort numbers within each column, except for N column
  for (const letter in columns) {
    if (letter !== 'N') {
      columns[letter].sort((a, b) => a - b);
    }
  }

  return columns;
}

interface BingoCardProps {
  cardId: number;
  numbers: number[] | string[];
  active?: boolean;
}

export const BingoCard = memo(function BingoCard({
  cardId,
  numbers,
  active = false
}: BingoCardProps) {
  const { calledNumbers } = useBingoStore();
  const [selectedCells, setSelectedCells] = useState<boolean[]>(Array(25).fill(false));

  // Process and organize numbers correctly
  const processedCard = useMemo(() => {
    // Always assume string format numbers like "B1", "I30", etc.
    const parsedNumbers = parseCardNumbers(numbers as string[]);
    return organizeCardByColumn(parsedNumbers);
  }, [numbers]);

  // Create flat array of numbers in correct order for display
  const displayNumbers = useMemo(() => {
    const result: number[] = [];
    const columnLetters = ['B', 'I', 'N', 'G', 'O'];

    // Build the card row by row, creating the correct grid pattern
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const letter = columnLetters[col];
        // If this is the center (FREE) space, use 0
        if (row === 2 && col === 2) {
          result.push(0);
        } else {
          // Get the number from the column or 0 if not available
          const cellValue = processedCard[letter][row] || 0;
          result.push(cellValue);
        }
      }
    }

    return result;
  }, [processedCard]);

  // Auto-select cells that match called numbers
  useEffect(() => {
    setSelectedCells(prev => {
      const newSelection = [...prev];
      displayNumbers.forEach((num, idx) => {
        // Auto-mark the FREE space and called numbers
        if (num === 0 || (num !== 0 && calledNumbers.includes(num))) {
          newSelection[idx] = true;
        }
      });
      return newSelection;
    });
  }, [displayNumbers, calledNumbers]);

  // Toggle cell selection
  const toggleCell = (index: number) => {
    // Don't allow toggling the FREE space or non-interactive cards
    if (index === 12 || !active) return;

    setSelectedCells(prev => {
      const newSelection = [...prev];
      newSelection[index] = !newSelection[index];
      return newSelection;
    });
  };

  return (
    <div
      className={`grid grid-cols-5 gap-1.5 bg-white p-3 rounded-lg shadow-lg transition-all duration-300 
        ${active ? 'scale-105 shadow-xl ring-2 ring-[#7C3AED]' : 'hover:scale-102'}`}
    >
      {['B', 'I', 'N', 'G', 'O'].map((letter, i) => (
        <div
          key={`header-${i}`}
          className="bg-[#7C3AED] text-white text-center p-2 font-bold rounded-t-md"
        >
          {letter}
        </div>
      ))}

      {displayNumbers.map((num, index) => {
        const isSelected = selectedCells[index];
        const isCenter = index === 12;

        return (
          <div
            key={`${cardId}-${index}`}
            onClick={() => toggleCell(index)}
            className={`
              aspect-square flex items-center justify-center rounded-md text-center font-medium relative border border-[#DDD6FE]
              transition-all duration-300 transform hover:scale-105
              ${active ? 'cursor-pointer' : 'cursor-default'}
              ${isCenter
                ? 'bg-gradient-to-br from-green-400 to-green-600 text-white font-bold'
                : isSelected
                  ? 'bg-[#DDD6FE]'
                  : 'bg-white hover:bg-gray-50'}
              ${isSelected && active ? 'scale-95' : ''}
            `}
          >
            {isCenter ? (
              <span className="text-lg">FREE</span>
            ) : (
              <span className="text-lg text-gray-700">{num}</span>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default BingoCard;