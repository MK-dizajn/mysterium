import type {
  ActId,
  Chapter,
  GameState,
  InventoryItem,
  Scene,
} from "../types/game";
import { getActLockEvidence } from "./gameProgress";

export type CodeNotebookSlot = {
  itemId: string;
  /** Názov predmetu (napríklad pre tlačidlo „Prezrieť“ v čítačke). */
  itemTitle: string;
  /** Nájdená číslica, alebo null, ak ju hráč zatiaľ nenašiel. */
  digit: string | null;
  /** Predmet má obrazovku „Prezrieť“, na ktorej sa číslica hľadá. */
  isInspectable: boolean;
};

export type CodeNotebookLock = {
  actId: ActId;
  lockLabel: string;
  slots: CodeNotebookSlot[];
};

/**
 * Číslica je nájdená, ak hráč predmet má a predmet buď nemá obrazovku
 * „Prezrieť“ (inspect), alebo ju hráč na ňom už našiel.
 */
function isCodeDigitFound(gameState: GameState, item: InventoryItem) {
  const hasItem = gameState.inventory.some(
    (inventoryItem) => inventoryItem.id === item.id
  );

  if (!hasItem) {
    return false;
  }

  return !item.inspect || gameState.foundCodeItemIds.includes(item.id);
}

/**
 * Zapíše, že hráč našiel číslicu na predmete. Zapíše iba predmet,
 * ktorý hráč má a ktorý nesie číslicu, a iba raz.
 */
export function markCodeDigitFound(
  gameState: GameState,
  itemId: string,
  options: { revealed?: boolean } = {}
): GameState {
  const item = gameState.inventory.find(
    (inventoryItem) => inventoryItem.id === itemId
  );

  if (!item?.secretCode) {
    return gameState;
  }

  const isFound = gameState.foundCodeItemIds.includes(itemId);
  const isRevealed = gameState.revealedCodeItemIds.includes(itemId);
  const shouldMarkRevealed = Boolean(options.revealed) && !isRevealed;

  if (isFound && !shouldMarkRevealed) {
    return gameState;
  }

  return {
    ...gameState,
    foundCodeItemIds: isFound
      ? gameState.foundCodeItemIds
      : [...gameState.foundCodeItemIds, itemId],
    revealedCodeItemIds: shouldMarkRevealed
      ? [...gameState.revealedCodeItemIds, itemId]
      : gameState.revealedCodeItemIds,
  };
}

/**
 * Zápisník kódov: pre každý akt jeden zámok, miesta v poradí dôkazov.
 * Číslice sa berú z dát kapitoly, nie z uloženého inventára.
 */
export function getCodeNotebook(
  chapter: Chapter,
  gameState: GameState
): CodeNotebookLock[] {
  return chapter.acts.map((act) => ({
    actId: act.id,
    lockLabel: act.lockLabel,
    slots: getActLockEvidence(chapter, act).map((item) => ({
      itemId: item.id,
      itemTitle: item.title,
      digit: isCodeDigitFound(gameState, item)
        ? (item.secretCode ?? null)
        : null,
      isInspectable: Boolean(item.inspect),
    })),
  }));
}

/** Predmet s číslicou, ktorý hráč dostane za vyriešenie scény. */
export function getSceneCodeItemId(scene: Scene): string | null {
  const action = (scene.events ?? [])
    .flatMap((event) => event.actions)
    .find(
      (gameAction) =>
        gameAction.type === "addInventoryItem" &&
        Boolean(gameAction.item.secretCode)
    );

  return action?.type === "addInventoryItem" ? action.item.id : null;
}

function getSceneRewardItems(scene: Scene): InventoryItem[] {
  return (scene.events ?? [])
    .flatMap((event) => event.actions)
    .flatMap((action) =>
      action.type === "addInventoryItem" ? [action.item] : []
    );
}

/** Vodidlo na ďalšie miesto z odmeny scény (predmet „nesie“ stopu). */
export function getSceneClue(scene: Scene): string | undefined {
  return getSceneRewardItems(scene).find((item) => item.clue)?.clue;
}

/**
 * Predmet podľa dát kapitoly (z odmien scén aj z rozhovorov). Uložená
 * kópia v starej hre môže mať starší názov alebo popis.
 */
export function getChapterItem(
  chapter: Chapter,
  itemId: string
): InventoryItem | undefined {
  for (const scene of chapter.scenes) {
    const dialogueItems = (scene.dialogues ?? [])
      .flatMap((dialogue) => dialogue.nodes)
      .flatMap((node) => node.choices ?? [])
      .flatMap((choice) => choice.actions ?? [])
      .flatMap((action) =>
        action.type === "addInventoryItem" ? [action.item] : []
      );
    const item = [...getSceneRewardItems(scene), ...dialogueItems].find(
      (candidate) => candidate.id === itemId
    );

    if (item) {
      return item;
    }
  }

  return undefined;
}

/**
 * Vodidlo predmetu podľa dát kapitoly – uložená kópia predmetu
 * zo staršej hry ho nemusí mať.
 */
export function getItemClue(
  chapter: Chapter,
  itemId: string
): string | undefined {
  for (const scene of chapter.scenes) {
    const item = getSceneRewardItems(scene).find(
      (rewardItem) => rewardItem.id === itemId
    );

    if (item?.clue) {
      return item.clue;
    }
  }

  return undefined;
}

export type CodeItemInfo = {
  /** Predmet podľa dát kapitoly (nie uložená kópia). */
  item: InventoryItem;
  lockLabel: string;
  /** Poradie miesta v zámku od 1. */
  slotNumber: number;
  isFound: boolean;
  isRevealed: boolean;
};

/** Údaje pre obrazovku „Prezrieť“ a pre tlačidlá pri predmete. */
export function getCodeItemInfo(
  chapter: Chapter,
  gameState: GameState,
  itemId: string
): CodeItemInfo | null {
  for (const act of chapter.acts) {
    const evidence = getActLockEvidence(chapter, act);
    const slotIndex = evidence.findIndex((item) => item.id === itemId);

    if (slotIndex !== -1) {
      const item = evidence[slotIndex];

      return {
        item,
        lockLabel: act.lockLabel,
        slotNumber: slotIndex + 1,
        isFound: isCodeDigitFound(gameState, item),
        isRevealed: gameState.revealedCodeItemIds.includes(itemId),
      };
    }
  }

  return null;
}
