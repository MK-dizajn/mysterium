import type {
  Act,
  Chapter,
  Game,
  GameState,
  InventoryItem,
  Scene,
} from "../types/game";
import { evaluateConditions } from "./conditions";

export function getPuzzleSolvedFlagId(scene: Scene) {
  return `puzzle-solved-${scene.id}`;
}

export function countChapterArtifacts(chapter: Chapter) {
  return chapter.scenes.filter((scene) => Boolean(scene.artifact)).length;
}

export function getActForScene(
  chapter: Chapter,
  sceneId: string
): Act | undefined {
  return chapter.acts.find((act) => act.sceneIds.includes(sceneId));
}

/**
 * Dôkazy (so secretCode), ktoré hráč získa v scénach aktu,
 * v poradí podľa evidenceOrder. Počet nie je pevný.
 */
export function getActLockEvidence(
  chapter: Chapter,
  act: Act
): InventoryItem[] {
  return act.sceneIds
    .map((sceneId) => chapter.scenes.find((scene) => scene.id === sceneId))
    .flatMap((scene) => scene?.events ?? [])
    .flatMap((event) => event.actions)
    .flatMap((action) =>
      action.type === "addInventoryItem" && action.item.secretCode
        ? [action.item]
        : []
    )
    .sort(
      (firstItem, secondItem) =>
        (firstItem.evidenceOrder ?? 0) - (secondItem.evidenceOrder ?? 0)
    );
}

/** Kódy zámku aktu odvodené z dôkazov jeho scén. */
export function getActLockCodes(chapter: Chapter, act: Act): string[] {
  return getActLockEvidence(chapter, act).map(
    (item) => item.secretCode as string
  );
}

export type ActTransition = {
  completedAct: Act;
  nextAct?: Act;
  /** Kódy iba za dôkazy, ktoré hráč naozaj má (chýbajúci dôkaz = menej kódov). */
  expectedCodes: string[];
  evidenceCount: number;
};

/**
 * Údaje pre prechod aktu a truhlicu. Dokončený akt je currentActId,
 * ktorý engine nastaví pri prechode aktu podľa dát kapitoly.
 */
export function getActTransition(
  chapter: Chapter,
  gameState: GameState
): ActTransition | null {
  const previousScene = chapter.scenes[gameState.currentSceneIndex - 1];

  const completedAct =
    chapter.acts.find((act) => act.id === gameState.currentActId) ??
    (previousScene ? getActForScene(chapter, previousScene.id) : undefined);

  if (!completedAct) {
    return null;
  }

  const ownedEvidence = getActLockEvidence(chapter, completedAct).filter(
    (evidenceItem) =>
      gameState.inventory.some((item) => item.id === evidenceItem.id)
  );

  return {
    completedAct,
    nextAct: chapter.acts[chapter.acts.indexOf(completedAct) + 1],
    expectedCodes: ownedEvidence.map((item) => item.secretCode as string),
    evidenceCount: ownedEvidence.length,
  };
}

function isValidIndex(index: number, length: number) {
  return Number.isInteger(index) && index >= 0 && index < length;
}

/**
 * Opraví uloženú hru, ktorej kapitola alebo scéna neexistuje
 * (napríklad po zmene obsahu kapitoly). Platné uloženie vráti nezmenené.
 * Body, dôkazy, artefakty, úlohy a nápovedy zostanú; hráč pokračuje
 * prvou nevyriešenou scénou, pri všetkých vyriešených záverom kapitoly.
 */
export function repairGameProgress(
  game: Game,
  gameState: GameState
): GameState {
  const isChapterValid = isValidIndex(
    gameState.currentChapterIndex,
    game.chapters.length
  );

  const chapterIndex = isChapterValid ? gameState.currentChapterIndex : 0;
  const chapter = game.chapters[chapterIndex];

  if (
    isChapterValid &&
    isValidIndex(gameState.currentSceneIndex, chapter.scenes.length)
  ) {
    return gameState;
  }

  const firstUnsolvedIndex = chapter.scenes.findIndex(
    (scene) => !gameState.flags[getPuzzleSolvedFlagId(scene)]
  );

  const isChapterSolved = firstUnsolvedIndex === -1;

  return {
    ...gameState,
    currentChapterIndex: chapterIndex,
    currentSceneIndex: isChapterSolved
      ? chapter.scenes.length - 1
      : firstUnsolvedIndex,
    screen: isChapterSolved ? "finish" : "puzzle",
    activeDialogueId: undefined,
    activeDialogueNodeId: undefined,
    activeNpcId: undefined,
    returnScreen: undefined,
  };
}

export function getNextSceneIndex(
  chapter: Chapter,
  gameState: GameState
) {
  const currentScene = chapter.scenes[gameState.currentSceneIndex];

  const matchedBranch = currentScene.branches?.find((branch) =>
    evaluateConditions(branch.conditions, gameState)
  );

  if (matchedBranch) {
    const targetIndex = chapter.scenes.findIndex(
      (scene) => scene.id === matchedBranch.targetSceneId
    );

    if (targetIndex !== -1) {
      return targetIndex;
    }
  }

  return gameState.currentSceneIndex + 1;
}

export function isChapterFinished(
  chapter: Chapter,
  nextSceneIndex: number
) {
  return nextSceneIndex >= chapter.scenes.length;
}