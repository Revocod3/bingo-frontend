'use client';

import { memo, useState, useEffect, useMemo } from 'react';
import { useBingoStore } from '@/lib/stores/bingo';
import websocketService from '@/lib/websocket/websocket';

// Function to parse the bingo card numbers properly
export function parseCardNumbers(numbers: string[]): { letter: string, number: number }[] {
  return numbers.map(item => {
    // Extract the letter and number parts
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
  
  // Sort numbers within each column
  for (const letter in columns) {
    columns[letter].sort((a, b) => a - b);
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
  const { calledNumbers, currentNumber, eventId } = useBingoStore();
  const [selectedCells, setSelectedCells] = useState<boolean[]>(Array(25).fill(false));

  // Process and organize numbers correctly
  const processedCard = useMemo(() => {
    // Check if numbers are already in string format with letter prefixes
    const isStringNumbers = numbers.length > 0 && typeof numbers[0] === 'string';
    
    if (isStringNumbers) {
      // Parse the string numbers and organize by column
      const parsedNumbers = parseCardNumbers(numbers as string[]);
      return organizeCardByColumn(parsedNumbers);
    } else {
      // If they're just numbers, distribute them in order (legacy support)
      // This shouldn't be used anymore but kept for backward compatibility
      const result: Record<string, number[]> = {
        'B': (numbers as number[]).slice(0, 5),
        'I': (numbers as number[]).slice(5, 10),
        'N': (numbers as number[]).slice(10, 15),
        'G': (numbers as number[]).slice(15, 20),
        'O': (numbers as number[]).slice(20, 25),
      };
      return result;
    }
  }, [numbers]);

  // Create flat array of numbers in correct order for display
  const displayNumbers = useMemo(() => {
    const result: number[] = [];
    for (let i = 0; i < 5; i++) { // For each row
      result.push(processedCard['B'][i] || 0);
      result.push(processedCard['I'][i] || 0);
      result.push(processedCard['N'][i] || 0);
      result.push(processedCard['G'][i] || 0);
      result.push(processedCard['O'][i] || 0);
    }
    // Set the middle spot (index 12) to 0 for FREE space
    if (result.length > 12) {
      result[12] = 0;
    }
    return result;
  }, [processedCard]);

  // Auto-select cells that match called numbers
  useEffect(() => {
    setSelectedCells(prev => {
      const newSelection = [...prev];
      displayNumbers.forEach((num, idx) => {
        if (calledNumbers.includes(num) || idx === 12) { // 12 is the center FREE spot
          newSelection[idx] = true;
        }
      });
      return newSelection;
    });
  }, [displayNumbers, calledNumbers]);

  // Check for potential bingo
  useEffect(() => {
    if (!active || !eventId) return;

    const hasBingo = checkForBingo(selectedCells);
    if (hasBingo) {
      // Notify the server about potential bingo
      websocketService.send({
        type: 'CHECK_BINGO',
        payload: { cardId, eventId }
      });
    }
  }, [selectedCells, active, cardId, eventId]);

  // Manual selection toggle for a cell
  const toggleCell = (index: number) => {
    setSelectedCells(prev => {
      const newSelection = [...prev];
      newSelection[index] = !newSelection[index];
      return newSelection;
    });
  };

  // Check for a winning pattern (simple row/column/diagonal check)
  const checkForBingo = (cells: boolean[]): boolean => {
    // Check rows
    for (let i = 0; i < 5; i++) {
      if (cells[i * 5] && cells[i * 5 + 1] && cells[i * 5 + 2] && cells[i * 5 + 3] && cells[i * 5 + 4]) {
        return true;
      }
    }

    // Check columns
    for (let i = 0; i < 5; i++) {
      if (cells[i] && cells[i + 5] && cells[i + 10] && cells[i + 15] && cells[i + 20]) {
        return true;
      }
    }

    // Check diagonals
    if (cells[0] && cells[6] && cells[12] && cells[18] && cells[24]) {
      return true;
    }

    if (cells[4] && cells[8] && cells[12] && cells[16] && cells[20]) {
      return true;
    }

    return false;
  };

  // Animation for newly called number
  const isNewlyCalled = (num: number) => {
    return num === currentNumber;
  };

  return (
    <div className={`grid grid-cols-5 gap-2 bg-white p-4 rounded-lg shadow-lg transition-transform ${active ? 'scale-105 shadow-xl' : ''}`}>
      {['B', 'I', 'N', 'G', 'O'].map((letter, i) => (
        <div key={`header-${i}`} className="bg-[#7C3AED] text-white text-center p-2 font-bold rounded">
          {letter}
        </div>
      ))}

      {displayNumbers.map((num, index) => {
        const isNewCall = isNewlyCalled(num);
        const isSelected = selectedCells[index];
        const isCenter = index === 12; // Center spot (free space)

        return (
          <div
            key={`${cardId}-${index}`}
            className={`
              aspect-square flex items-center justify-center rounded-md border text-center font-medium relative overflow-hidden cursor-pointer
              ${isCenter ? 'bg-green-200 text-white' :
                isSelected ? 'bg-[#DDD6FE] border-[#7C3AED]' :
                  'bg-white border-gray-300 hover:bg-gray-50'}
              ${isNewCall ? 'animate-pulse' : ''}
              transition-all duration-300
            `}
            onClick={() => toggleCell(index)}
          >
            <span className="text-lg font-medium text-gray-700">
              {isCenter ? 'FREE' : num}
            </span>
            {isSelected && !isCenter && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#7C3AED] opacity-20"></div>
                <div className="w-6 h-6 rounded-full border-2 border-[#7C3AED] z-10"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

export default BingoCard;