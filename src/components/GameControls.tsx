'use client';

import { useBingoStore } from '@/lib/stores/bingo';

export const GameControls = () => {
  const { callNumber, resetGame, isPlaying } = useBingoStore();
  
  return (
    <div className="flex gap-4 mt-8">
      <button 
        onClick={callNumber}
        className="bg-bingo-secondary text-white px-6 py-2 rounded disabled:opacity-50"
        disabled={!isPlaying}
      >
        Llamar número
      </button>
      <button 
        onClick={resetGame}
        className="bg-red-500 text-white px-6 py-2 rounded"
      >
        Reiniciar
      </button>
    </div>
  );
};