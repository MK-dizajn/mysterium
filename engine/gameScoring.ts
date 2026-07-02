import {
  DEFAULT_PUZZLE_SCORE,
  HINT_PENALTY,
  MINIMUM_PUZZLE_SCORE,
} from "./constants";

export function calculatePuzzleScore(hintsUsed: number) {
  return Math.max(
    MINIMUM_PUZZLE_SCORE,
    DEFAULT_PUZZLE_SCORE - hintsUsed * HINT_PENALTY
  );
}