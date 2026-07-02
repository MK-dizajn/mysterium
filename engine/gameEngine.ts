import type { Artifact, Chapter, GameState, Scene } from "../types/game";
import { getNextSceneIndex, isChapterFinished } from "./gameProgress";
import { calculatePuzzleScore } from "./gameScoring";

export function createNewGameState(): GameState {
  return {
    screen: "landing",
    currentChapterIndex: 0,
    currentSceneIndex: 0,
    score: 0,
    artifacts: [],
  };
}

export function addArtifact(
  gameState: GameState,
  artifact: Artifact
): GameState {
  const alreadyCollected = gameState.artifacts.some(
    (item) => item.id === artifact.id
  );

  if (alreadyCollected) {
    return gameState;
  }

  return {
    ...gameState,
    artifacts: [...gameState.artifacts, artifact],
  };
}

export function addScore(
  gameState: GameState,
  points: number
): GameState {
  return {
    ...gameState,
    score: gameState.score + points,
  };
}

export function solvePuzzle(
  gameState: GameState,
  scene: Scene,
  hintsUsed: number
): GameState {
  const points = calculatePuzzleScore(hintsUsed);

  return {
    ...addArtifact(addScore(gameState, points), scene.artifact),
    screen: "history",
  };
}

export function continueAfterHistory(
  gameState: GameState,
  chapter: Chapter
): GameState {
  const nextIndex = getNextSceneIndex(gameState.currentSceneIndex);

  if (isChapterFinished(chapter, nextIndex)) {
    return {
      ...gameState,
      screen: "finish",
    };
  }

  return {
    ...gameState,
    currentSceneIndex: nextIndex,
    screen: "puzzle",
  };
}