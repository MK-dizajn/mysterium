import type { Game, GameState } from "../types/game";
import { SAVE_KEY } from "./constants";
import { createNewGameState } from "./gameEngine";
import { repairGameProgress } from "./gameProgress";

const CORRUPTED_SAVE_KEY = `${SAVE_KEY}-corrupted`;
const REPAIR_BACKUP_KEY = `${SAVE_KEY}-backup-before-repair`;

// Neplatné číslo kapitoly alebo scény nenahrádzame nulou, ale označíme ho,
// aby ho repairGameProgress rozpoznal a hráča poslal na správne miesto.
const INVALID_INDEX = -1;

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
      : INVALID_INDEX,
    currentSceneIndex: isNonNegativeInteger(saved.currentSceneIndex)
      ? saved.currentSceneIndex
      : INVALID_INDEX,
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

/**
 * Načíta uloženú hru a ak ukazuje na neexistujúcu kapitolu alebo scénu,
 * opraví ju. Pôvodné uloženie sa pred opravou odloží pod samostatný kľúč.
 */
export function loadRepairedGameState(game: Game): GameState | null {
  const gameState = loadGameState();

  if (!gameState) {
    return null;
  }

  const repairedState = repairGameProgress(game, gameState);

  if (repairedState === gameState) {
    return gameState;
  }

  try {
    const originalProgress = localStorage.getItem(SAVE_KEY);

    if (originalProgress) {
      localStorage.setItem(REPAIR_BACKUP_KEY, originalProgress);
    }
  } catch {
    // Úložisko nie je dostupné, oprava aj tak pokračuje.
  }

  saveGameState(repairedState);

  return repairedState;
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
