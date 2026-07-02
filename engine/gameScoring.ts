export function calculatePuzzleScore(hintsUsed: number) {
  return Math.max(20, 100 - hintsUsed * 20);
}