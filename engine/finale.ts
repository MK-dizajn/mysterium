import type { ActId, Chapter, GameState } from "../types/game";
import { isAnswerAccepted } from "./answerMatching";
import { getActLockCodes } from "./gameProgress";

/*
 * Finále kapitoly: truhlica s tromi zámkami, Zlatý kľúč a ďalšie miesto.
 * Postup sa ukladá do príznakov hry (flags), takže uloženie sa nemení
 * a opakované kliknutie ani obnovenie stránky nič nezdvojí.
 */

export const FINALE_KEY_INSERTED_FLAG = "finale-key-inserted";
export const FINALE_CHEST_OPENED_FLAG = "finale-chest-opened";
export const FINALE_PLACE_SOLVED_FLAG = "finale-place-solved";

export function getFinaleLockFlagId(actId: ActId) {
  return `finale-lock-open-${actId}`;
}

function setFlag(gameState: GameState, flagId: string): GameState {
  return {
    ...gameState,
    flags: {
      ...gameState.flags,
      [flagId]: true,
    },
  };
}

export type FinaleLock = {
  actId: ActId;
  lockLabel: string;
  /** Číslice kódu z dôkazov scén aktu. */
  code: string[];
  isOpen: boolean;
  /** Tento zámok je na rade (všetky predchádzajúce sú otvorené). */
  isNext: boolean;
};

/** Zámky truhlice v poradí odomykania. */
export function getFinaleLocks(
  chapter: Chapter,
  gameState: GameState
): FinaleLock[] {
  const lockActIds = chapter.finale?.chest.lockActIds ?? [];
  let isEarlierLockClosed = false;

  return lockActIds.flatMap((actId) => {
    const act = chapter.acts.find((chapterAct) => chapterAct.id === actId);

    if (!act) {
      return [];
    }

    const isOpen = Boolean(gameState.flags[getFinaleLockFlagId(actId)]);
    const isNext = !isOpen && !isEarlierLockClosed;

    if (!isOpen) {
      isEarlierLockClosed = true;
    }

    return [
      {
        actId,
        lockLabel: act.lockLabel,
        code: getActLockCodes(chapter, act),
        isOpen,
        isNext,
      },
    ];
  });
}

export type UnlockFinaleLockResult =
  | "opened"
  | "wrong"
  | "notNext"
  | "alreadyOpen"
  | "unknownLock";

/** Skúsi odomknúť zámok kódom; zlý kód ani zámok mimo poradia nič nezmení. */
export function unlockFinaleLock(
  chapter: Chapter,
  gameState: GameState,
  actId: ActId,
  digits: string[]
): { gameState: GameState; result: UnlockFinaleLockResult } {
  const lock = getFinaleLocks(chapter, gameState).find(
    (finaleLock) => finaleLock.actId === actId
  );

  if (!lock) {
    return { gameState, result: "unknownLock" };
  }

  if (lock.isOpen) {
    return { gameState, result: "alreadyOpen" };
  }

  if (!lock.isNext) {
    return { gameState, result: "notNext" };
  }

  const isCorrect =
    digits.length === lock.code.length &&
    lock.code.every((digit, index) => digits[index] === digit);

  if (!isCorrect) {
    return { gameState, result: "wrong" };
  }

  return {
    gameState: setFlag(gameState, getFinaleLockFlagId(actId)),
    result: "opened",
  };
}

export type InsertFinaleKeyResult =
  | "inserted"
  | "locksClosed"
  | "missingKey"
  | "alreadyInserted";

/** Vloží Zlatý kľúč do stredného zámku, až keď sú otvorené všetky zámky. */
export function insertFinaleKey(
  chapter: Chapter,
  gameState: GameState
): { gameState: GameState; result: InsertFinaleKeyResult } {
  const finale = chapter.finale;
  const locks = getFinaleLocks(chapter, gameState);

  if (!finale || locks.length === 0 || locks.some((lock) => !lock.isOpen)) {
    return { gameState, result: "locksClosed" };
  }

  if (gameState.flags[FINALE_KEY_INSERTED_FLAG]) {
    return { gameState, result: "alreadyInserted" };
  }

  const hasKey = gameState.inventory.some(
    (item) => item.id === finale.chest.keyItemId
  );

  if (!hasKey) {
    return { gameState, result: "missingKey" };
  }

  return {
    gameState: setFlag(gameState, FINALE_KEY_INSERTED_FLAG),
    result: "inserted",
  };
}

export type OpenFinaleChestResult = "opened" | "keyNotInserted" | "alreadyOpen";

/** Otvorí veko po vložení kľúča a pridá štvrtý útržok (iba raz). */
export function openFinaleChest(
  chapter: Chapter,
  gameState: GameState
): { gameState: GameState; result: OpenFinaleChestResult } {
  const finale = chapter.finale;

  if (!finale || !gameState.flags[FINALE_KEY_INSERTED_FLAG]) {
    return { gameState, result: "keyNotInserted" };
  }

  if (gameState.flags[FINALE_CHEST_OPENED_FLAG]) {
    return { gameState, result: "alreadyOpen" };
  }

  const reward = finale.chest.reward;
  const hasReward = gameState.inventory.some((item) => item.id === reward.id);
  const openedState = setFlag(gameState, FINALE_CHEST_OPENED_FLAG);

  return {
    gameState: hasReward
      ? openedState
      : { ...openedState, inventory: [...openedState.inventory, reward] },
    result: "opened",
  };
}

/** Overí názov ďalšieho miesta; pri správnej odpovedi nastaví príznak. */
export function submitFinalePlace(
  chapter: Chapter,
  gameState: GameState,
  answer: string
): { gameState: GameState; isCorrect: boolean } {
  const nextPlace = chapter.finale?.nextPlace;

  if (!nextPlace || !isAnswerAccepted(answer, nextPlace.acceptedAnswers)) {
    return { gameState, isCorrect: false };
  }

  if (gameState.flags[FINALE_PLACE_SOLVED_FLAG]) {
    return { gameState, isCorrect: true };
  }

  return {
    gameState: setFlag(gameState, FINALE_PLACE_SOLVED_FLAG),
    isCorrect: true,
  };
}
