import type { Chapter } from "../types/game";

export function getNextSceneIndex(currentSceneIndex: number) {
  return currentSceneIndex + 1;
}

export function isChapterFinished(
  chapter: Chapter,
  nextSceneIndex: number
) {
  return nextSceneIndex >= chapter.scenes.length;
}