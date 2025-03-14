import { create } from 'zustand';

type BingoState = {
  cartones: number[][];
  currentNumber: number | null;
  calledNumbers: number[];
  isPlaying: boolean;
  initializeGame: (cartones: number[][]) => void;
  callNumber: () => void;
  resetGame: () => void;
};

export const useBingoStore = create<BingoState>((set) => ({
  cartones: [],
  currentNumber: null,
  calledNumbers: [],
  isPlaying: false,
  
  initializeGame: (cartones) => set({ cartones, isPlaying: true }),
  
  callNumber: () => {
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1)
      .filter(n => !useBingoStore.getState().calledNumbers.includes(n));
    
    if (availableNumbers.length === 0) return;
    
    const newNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    set(state => ({
      currentNumber: newNumber,
      calledNumbers: [...state.calledNumbers, newNumber]
    }));
  },
  
  resetGame: () => set({
    cartones: [],
    currentNumber: null,
    calledNumbers: [],
    isPlaying: false
  })
}));