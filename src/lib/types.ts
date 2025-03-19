// Types for Bingo-specific features

export type BingoPattern = {
  name: string;
  description: string;
  cells: number[];
};

// Standard bingo patterns
export const BINGO_PATTERNS = {
  // Horizontal lines
  ROW_1: { name: 'Primera fila', description: 'Números en la primera fila', cells: [0, 1, 2, 3, 4] },
  ROW_2: { name: 'Segunda fila', description: 'Números en la segunda fila', cells: [5, 6, 7, 8, 9] },
  ROW_3: { name: 'Tercera fila', description: 'Números en la tercera fila', cells: [10, 11, 12, 13, 14] },
  ROW_4: { name: 'Cuarta fila', description: 'Números en la cuarta fila', cells: [15, 16, 17, 18, 19] },
  ROW_5: { name: 'Quinta fila', description: 'Números en la quinta fila', cells: [20, 21, 22, 23, 24] },
  
  // Vertical lines
  COL_1: { name: 'Primera columna', description: 'Números en la primera columna', cells: [0, 5, 10, 15, 20] },
  COL_2: { name: 'Segunda columna', description: 'Números en la segunda columna', cells: [1, 6, 11, 16, 21] },
  COL_3: { name: 'Tercera columna', description: 'Números en la tercera columna', cells: [2, 7, 12, 17, 22] },
  COL_4: { name: 'Cuarta columna', description: 'Números en la cuarta columna', cells: [3, 8, 13, 18, 23] },
  COL_5: { name: 'Quinta columna', description: 'Números en la quinta columna', cells: [4, 9, 14, 19, 24] },
  
  // Diagonals
  DIAG_1: { name: 'Diagonal principal', description: 'Diagonal de izquierda superior a derecha inferior', cells: [0, 6, 12, 18, 24] },
  DIAG_2: { name: 'Diagonal secundaria', description: 'Diagonal de derecha superior a izquierda inferior', cells: [4, 8, 12, 16, 20] },
  
  // Special patterns
  CORNERS: { name: 'Esquinas', description: 'Las cuatro esquinas del cartón', cells: [0, 4, 20, 24] },
  CENTER: { name: 'Centro', description: 'El cuadrado central del cartón', cells: [6, 7, 8, 11, 12, 13, 16, 17, 18] },
  
  // Full card
  BLACKOUT: { name: 'Cartón lleno', description: 'Todos los números del cartón', cells: Array.from({ length: 25 }, (_, i) => i) },
};

export type BingoCardData = {
  id: number;
  numbers: number[];
  selected: boolean[];
  pattern?: BingoPattern;
};

export type GameState = {
  eventId: number;
  calledNumbers: number[];
  currentNumber: number | null;
  lastCalledAt: string | null;
  isPlaying: boolean;
  winnerInfo: {
    userId: number;
    userName: string;
    cardId: number;
    isCurrentUser: boolean;
  } | null;
};
