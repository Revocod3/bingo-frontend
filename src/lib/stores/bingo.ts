import { create } from 'zustand';

type BingoState = {
  cards: number[][];
  currentNumber: number | null;
  calledNumbers: number[];
  isPlaying: boolean;
  activeCardIndex: number;
  initializeGame: (cards: number[][]) => void;
  callNumber: () => void;
  resetGame: () => void;
  setActiveCardIndex: (index: number) => void;
};

export const useBingoStore = create<BingoState>((set) => ({
  cards: [],
  currentNumber: null,
  calledNumbers: [],
  isPlaying: false,
  activeCardIndex: 0,
  
  initializeGame: (cards) => set({ 
    cards, 
    isPlaying: true,
    calledNumbers: [] 
  }),
  
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
    cards: [],
    currentNumber: null,
    calledNumbers: [],
    isPlaying: false,
    activeCardIndex: 0
  }),
  
  setActiveCardIndex: (index) => set({ activeCardIndex: index }),
}));