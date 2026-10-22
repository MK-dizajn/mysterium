import type { Chapter, Game, GameState, Scene } from "../types/game";
import { evaluateConditions } from "./conditions";

export function getPuzzleSolvedFlagId(scene: Scene) {
  return `puzzle-solved-${scene.id}`;
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