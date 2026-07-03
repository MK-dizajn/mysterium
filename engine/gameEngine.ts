import type { Artifact, Chapter, GameState, Scene } from "../types/game";
import { getNextSceneIndex, isChapterFinished } from "./gameProgress";
import { calculatePuzzleScore } from "./gameScoring";
import { runSceneEvents } from "./events";

export function createNewGameState(): GameState {
  return {
    screen: "landing",
    currentChapterIndex: 0,
    currentSceneIndex: 0,
    score: 0,
    artifacts: [],
    quests: [],
    flags: {},
    inventory: [],
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
  const score = calculatePuzzleScore(hintsUsed);

  let nextState = addScore(gameState, score);

  if (scene.artifact) {
    nextState = addArtifact(nextState, scene.artifact);
  }

  nextState = runSceneEvents(
    nextState,
    scene,
    "puzzleSolved",
    hintsUsed
  );

  return {
    ...nextState,
    screen: "history",
  };
}

export function continueAfterHistory(
  gameState: GameState,
  chapter: Chapter
): GameState {
  const nextIndex = getNextSceneIndex(chapter, gameState);

  if (isChapterFinished(chapter, nextIndex)) {
    return {
      ...gameState,
      screen: "finish",
    };
  }

  const nextState: GameState = {
    ...gameState,
    currentSceneIndex: nextIndex,
    screen: "puzzle",
  };

  const nextScene = chapter.scenes[nextIndex];

  return runSceneEvents(nextState, nextScene, "sceneEntered");
}