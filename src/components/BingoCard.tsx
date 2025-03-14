'use client';

import { useBingoStore } from '@/lib/stores/bingo';

export const BingoCard = ({ numbers }: { numbers: number[] }) => {
  const calledNumbers = useBingoStore(state => state.calledNumbers);
  
  return (
    <div className="grid grid-cols-5 gap-2 bg-white p-4 rounded-lg shadow-lg">
      {numbers.map((num, index) => (
        <div 
          key={index}
          className={`p-4 text-center rounded ${calledNumbers.includes(num) 
            ? 'bg-bingo-primary text-white' 
            : 'bg-gray-100'}`}
        >
          {num}
        </div>
      ))}
    </div>
  );
};