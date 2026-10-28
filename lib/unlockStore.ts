import type { ChapterId, Game } from "../types/game";
import { loadGameState } from "../engine";

/*
 * Odomknuté kapitoly v tomto zariadení. Ukladajú sa zvlášť od uloženej hry,
 * aby ich „Začať odznova“ nezmazalo. Neskôr ich môže potvrdzovať server.
 */
const UNLOCKS_KEY = "mysterium-unlocks-v1";
export const UNLOCKS_EVENT = "mysterium-unlocks-change";

/** Ako sa kapitola odomkla: kódom kapitoly, kódom aktu, zo staršej hry, pri vývoji. */
export type UnlockSource = "code" | "actCode" | "legacy" | "dev";

type UnlocksRecord = {
  version: 1;
  chapters: Record<ChapterId, { unlockedAt: string; via: UnlockSource }>;
};

function readUnlocks(): UnlocksRecord {
  try {
    const parsed = JSON.parse(localStorage.getItem(UNLOCKS_KEY) ?? "null");

    if (parsed?.version === 1 && parsed.chapters && typeof parsed.chapters === "object") {
      return parsed;
    }
  } catch {
    // Poškodený alebo nedostupný záznam: ako keby nebolo nič odomknuté.
  }

  return { version: 1, chapters: {} };
}

export function isChapterUnlocked(chapterId: ChapterId) {
  return Boolean(readUnlocks().chapters[chapterId]);
}

/** Odomknuté kapitoly (pre menu). */
export function getUnlockedChapterIds(): ChapterId[] {
  return Object.keys(readUnlocks().chapters);
}

/** Odomkne kapitolu; už odomknutú nechá tak (zachová, kedy a ako sa odomkla). */
export function unlockChapter(chapterId: ChapterId, via: UnlockSource) {
  const unlocks = readUnlocks();

  if (unlocks.chapters[chapterId]) {
    return;
  }

  unlocks.chapters[chapterId] = { unlockedAt: new Date().toISOString(), via };

  try {
    localStorage.setItem(UNLOCKS_KEY, JSON.stringify(unlocks));
  } catch {
    // Plné alebo zablokované úložisko nesmie zastaviť hru.
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(UNLOCKS_EVENT));
  }
}

/**
 * Staršie hry: kto má v zariadení rozohranú hru (spred menu kapitol),
 * dostane jej kapitolu odomknutú, aby sa k nej dostal bez kódu.
 */
export function migrateLegacySave(game: Game) {
  const saved = loadGameState();

  if (!saved || saved.screen === "landing") {
    return;
  }

  const chapter = game.chapters[saved.currentChapterIndex] ?? game.chapters[0];

  if (chapter) {
    unlockChapter(chapter.id, "legacy");
  }
}

/** Pre useSyncExternalStore: zmena odomknutí prekreslí menu. */
export function subscribeToUnlocks(onChange: () => void) {
  window.addEventListener(UNLOCKS_EVENT, onChange);
  window.addEventListener("storage", onChange);

  return () => {
    window.removeEventListener(UNLOCKS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
