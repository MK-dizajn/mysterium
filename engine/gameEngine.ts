import type { Artifact, GameState } from "../types/game";

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