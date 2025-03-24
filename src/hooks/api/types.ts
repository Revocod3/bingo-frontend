/**
 * Interface for a Bingo pattern
 */
export interface BingoPattern {
  id: string;
  name: string;
  display_name: string;
  positions: number[]; // Array of 0-based indices of marked positions
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
}

/**
 * Interface for pattern visualization data returned by the API
 */
export interface PatternVisualization {
  pattern: BingoPattern;
  visualization: string; // ASCII representation of the pattern
}

/**
 * Interface for the response from the useWinningPatternVisualization hook
 */
export interface UseWinningPatternVisualizationResponse {
  data: PatternVisualization | undefined;
  isLoading: boolean;
  error: unknown;
}

/**
 * Interface for the response from the useEventPatterns hook
 */
export interface UseEventPatternsResponse {
  data: BingoPattern[] | undefined;
  isLoading: boolean;
  error: unknown;
}
