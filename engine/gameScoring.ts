import { DEFAULT_PUZZLE_SCORE, HINT_COSTS } from "./constants";

/** Cena nápovedy podľa poradia (0 = prvá); ďalšie by stáli ako posledná. */
export function getHintCost(hintIndex: number) {
  return HINT_COSTS[Math.min(hintIndex, HINT_COSTS.length - 1)];
}

/** Body za úlohu: 100 mínus cena prečítaných nápovied (5, 5, 10). */
export function calculatePuzzleScore(hintsUsed: number) {
  let cost = 0;

  for (let index = 0; index < hintsUsed; index += 1) {
    cost += getHintCost(index);
  }

  return Math.max(0, DEFAULT_PUZZLE_SCORE - cost);
}
