import type { GameState } from "../types/game";
import { SAVE_KEY } from "./constants";
import { createNewGameState } from "./gameEngine";

const CORRUPTED_SAVE_KEY = `${SAVE_KEY}-corrupted`;

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

/**
 * Doplní chýbajúce alebo poškodené polia zo staršieho uloženia
 * predvolenými hodnotami, aby obnovená hra nespadla.
 */
function normalizeGameState(value: unknown): GameState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const saved = value as Partial<GameState>;
  const defaults = createNewGameState();

  return {
    ...defaults,
    ...saved,
    currentChapterIndex: isNonNegativeInteger(saved.currentChapterIndex)
      ? saved.currentChapterIndex
      : defaults.currentChapterIndex,
    currentSceneIndex: isNonNegativeInteger(saved.currentSceneIndex)
      ? saved.currentSceneIndex
      : defaults.currentSceneIndex,
    score:
      typeof saved.score === "number" && Number.isFinite(saved.score)
        ? saved.score
        : defaults.score,
    artifacts: Array.isArray(saved.artifacts)
      ? saved.artifacts
      : defaults.artifacts,
    inventory: Array.isArray(saved.inventory)
      ? saved.inventory
      : defaults.inventory,
    quests: Array.isArray(saved.quests) ? saved.quests : defaults.quests,
    flags:
      saved.flags && typeof saved.flags === "object" && !Array.isArray(saved.flags)
        ? saved.flags
        : defaults.flags,
    hintsUsed:
      saved.hintsUsed &&
      typeof saved.hintsUsed === "object" &&
      !Array.isArray(saved.hintsUsed)
        ? saved.hintsUsed
        : defaults.hintsUsed,
  };
}

export function loadGameState(): GameState | null {
  let savedProgress: string | null;

  try {
    savedProgress = localStorage.getItem(SAVE_KEY);
  } catch {
    return null;
  }

  if (!savedProgress) {
    return null;
  }

  let gameState: GameState | null = null;

  try {
    gameState = normalizeGameState(JSON.parse(savedProgress));
  } catch {
    gameState = null;
  }

  if (!gameState) {
    // Poškodený záznam nemažeme, iba ho odložíme bokom pre prípadnú obnovu.
    try {
      localStorage.setItem(CORRUPTED_SAVE_KEY, savedProgress);
    } catch {
      // Úložisko nie je dostupné, nič viac sa nedá urobiť.
    }
  }

  return gameState;
}

export function saveGameState(gameState: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  } catch {
    // Plné alebo zablokované úložisko nesmie zastaviť hru.
  }
}

export function clearGameState() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Úložisko nie je dostupné.
  }
}
