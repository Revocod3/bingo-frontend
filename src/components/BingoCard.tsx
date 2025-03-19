'use client';

import { memo, useState, useEffect } from 'react';
import { useBingoStore } from '@/lib/stores/bingo';
import websocketService from '@/lib/websocket/websocket';

interface BingoCardProps {
  cardId: number;
  numbers: number[];
  active?: boolean;
}

const getBingoColumn = (number: number): string => {
  if (number <= 15) return 'B';
  if (number <= 30) return 'I';
  if (number <= 45) return 'N';
  if (number <= 60) return 'G';
  return 'O';
};

export const BingoCard = memo(function BingoCard({
  cardId,
  numbers,
  active = false
}: BingoCardProps) {
  const { calledNumbers, currentNumber, eventId } = useBingoStore();
  const [selectedCells, setSelectedCells] = useState<boolean[]>(Array(25).fill(false));

  // Auto-select cells that match called numbers
  useEffect(() => {
    setSelectedCells(prev => {
      const newSelection = [...prev];
      numbers.forEach((num, idx) => {
        if (calledNumbers.includes(num) || idx === 12) { // 12 is the center FREE spot
          newSelection[idx] = true;
        }
      });
      return newSelection;
    });
  }, [numbers, calledNumbers]);

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

      {numbers.map((num, index) => {
        const isCalled = calledNumbers.includes(num);
        const isNewCall = isNewlyCalled(num);
        const isSelected = selectedCells[index];
        const isCenter = index === 12; // Center spot (free space)

        return (
          <div
            key={`${cardId}-${index}`}
            className={`
              aspect-square flex items-center justify-center rounded-md border text-center font-medium relative overflow-hidden cursor-pointer
              ${isCenter ? 'bg-[#2D2658] text-white' :
                isSelected ? 'bg-[#DDD6FE] border-[#7C3AED]' :
                  'bg-white border-gray-300 hover:bg-gray-50'}
              ${isNewCall ? 'animate-pulse' : ''}
              transition-all duration-300
            `}
            onClick={() => toggleCell(index)}
          >
            <span className="text-lg font-medium">{isCenter ? 'FREE' : num}</span>
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