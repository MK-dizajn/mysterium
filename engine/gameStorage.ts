import type { GameState } from "../types/game";
import { SAVE_KEY } from "./constants";

export function loadGameState(): GameState | null {
  const savedProgress = localStorage.getItem(SAVE_KEY);

  if (!savedProgress) {
    return null;
  }

  return JSON.parse(savedProgress) as GameState;
}

export function saveGameState(gameState: GameState) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

export function clearGameState() {
  localStorage.removeItem(SAVE_KEY);
}