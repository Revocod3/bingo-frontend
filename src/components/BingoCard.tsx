'use client';

import { memo } from 'react';
import { useBingoStore } from '@/lib/stores/bingo';

interface BingoCardProps {
  cardId: number;
  numbers: number[];
  active?: boolean;
}

export const BingoCard = memo(function BingoCard({ 
  cardId, 
  numbers,
  active = false 
}: BingoCardProps) {
  const calledNumbers = useBingoStore(state => state.calledNumbers);
  
  return (
    <div className={`grid grid-cols-5 gap-2 bg-white p-4 rounded-lg shadow-lg transition-transform ${active ? 'scale-105 shadow-xl' : ''}`}>
      {['B', 'I', 'N', 'G', 'O'].map((letter, i) => (
        <div key={`header-${i}`} className="bg-[#7C3AED] text-white text-center p-2 font-bold rounded">
          {letter}
        </div>
      ))}
      
      {numbers.map((num, index) => {
        const isCalled = calledNumbers.includes(num);
        const isCenter = index === 12; // Center spot (free space)
        
        return (
          <div 
            key={`${cardId}-${index}`}
            className={`
              aspect-square flex items-center justify-center rounded-md border text-center font-medium relative overflow-hidden
              ${isCenter ? 'bg-[#2D2658] text-white' : isCalled ? 'bg-[#DDD6FE] border-[#7C3AED]' : 'bg-white border-gray-300'}
              ${active && isCalled ? 'animate-pulse' : ''}
            `}
          >
            {isCenter ? 'FREE' : num}
            {isCalled && !isCenter && (
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