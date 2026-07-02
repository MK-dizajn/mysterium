import type { Chapter, GameState } from "../types/game";
import { evaluateConditions } from "./conditions";

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