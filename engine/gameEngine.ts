import type {
  Artifact,
  Chapter,
  GameState,
  Npc,
  Quest,
  Scene,
} from "../types/game";
import {
  getActForScene,
  getActTransition,
  getNextSceneIndex,
  getPuzzleSolvedFlagId,
  isChapterFinished,
} from "./gameProgress";
import { calculatePuzzleScore } from "./gameScoring";
import { runSceneEvents } from "./events";

export function createNewGameState(): GameState {
  return {
    screen: "landing",
    currentChapterIndex: 0,
    currentSceneIndex: 0,
    currentActId: "act-1",
    score: 0,
    artifacts: [],
    quests: [],
    flags: {},
    inventory: [],
    hintsUsed: {},
    foundCodeItemIds: [],
    revealedCodeItemIds: [],
  };
}

export function getHintsUsed(gameState: GameState, scene: Scene): number {
  return gameState.hintsUsed[scene.puzzle.id] ?? 0;
}

export function revealHint(gameState: GameState, scene: Scene): GameState {
  const hintsUsed = getHintsUsed(gameState, scene);

  if (
    gameState.flags[getPuzzleSolvedFlagId(scene)] ||
    hintsUsed >= scene.puzzle.hints.length
  ) {
    return gameState;
  }

  return {
    ...gameState,
    hintsUsed: {
      ...gameState.hintsUsed,
      [scene.puzzle.id]: hintsUsed + 1,
    },
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

export function talkToNpc(gameState: GameState, npc: Npc): GameState {
  return {
    ...gameState,
    screen: "npc",
    activeNpcId: npc.id,
    activeDialogueId: npc.dialogueId,
    activeDialogueNodeId: "start",
  };
}

export function startQuest(
  gameState: GameState,
  questId: string
): GameState {
  const existingQuest = gameState.quests.find(
    (quest) => quest.questId === questId
  );

  if (existingQuest) {
    return gameState;
  }

  return {
    ...gameState,
    quests: [
      ...gameState.quests,
      {
        questId,
        status: "active",
      },
    ],
  };
}

function applyQuestReward(
  gameState: GameState,
  questId: string,
  questDefinitions: Quest[]
): GameState {
  const rewardScore = questDefinitions.find(
    (quest) => quest.id === questId
  )?.reward?.score;

  if (!rewardScore) {
    return gameState;
  }

  return addScore(gameState, rewardScore);
}

/**
 * Odmena z dát úlohy (reward) sa pripíše iba pri prvom splnení.
 * Už splnená úloha sa nemení, takže odmena sa nedá získať dvakrát.
 */
export function completeQuest(
  gameState: GameState,
  questId: string,
  questDefinitions: Quest[],
  scene?: Scene
): GameState {
  const existingQuest = gameState.quests.find(
    (quest) => quest.questId === questId
  );

  if (!existingQuest) {
    return applyQuestReward(
      {
        ...gameState,
        quests: [
          ...gameState.quests,
          {
            questId,
            status: "completed",
            completedAtSceneId: scene?.id,
          },
        ],
      },
      questId,
      questDefinitions
    );
  }

  if (existingQuest.status === "completed") {
    return gameState;
  }

  return applyQuestReward(
    {
      ...gameState,
      quests: gameState.quests.map((quest) =>
        quest.questId === questId
          ? {
              ...quest,
              status: "completed",
              completedAtSceneId: scene?.id,
            }
          : quest
      ),
    },
    questId,
    questDefinitions
  );
}

export function solvePuzzle(
  gameState: GameState,
  scene: Scene,
  questDefinitions: Quest[]
): GameState {
  const solvedFlagId = getPuzzleSolvedFlagId(scene);

  if (gameState.flags[solvedFlagId]) {
    return {
      ...gameState,
      screen: "history",
    };
  }

  const hintsUsed = getHintsUsed(gameState, scene);
  const score = calculatePuzzleScore(hintsUsed);

  let nextState = addScore(gameState, score);

  if (scene.artifact) {
    nextState = addArtifact(nextState, scene.artifact);
  }

  nextState = runSceneEvents(
    nextState,
    scene,
    "puzzleSolved",
    questDefinitions,
    hintsUsed
  );

  return {
    ...nextState,
    screen: "history",
    flags: {
      ...nextState.flags,
      [solvedFlagId]: true,
    },
  };
}

export function continueAfterHistory(
  gameState: GameState,
  chapter: Chapter
): GameState {
  const nextIndex = getNextSceneIndex(chapter, gameState);
  const completedScene = chapter.scenes[gameState.currentSceneIndex];

  if (isChapterFinished(chapter, nextIndex)) {
    const lastAct = completedScene
      ? getActForScene(chapter, completedScene.id)
      : undefined;

    // Posledný akt s koncom v dátach: najprv jeho koniec, potom záver kapitoly.
    if (lastAct?.ending) {
      return {
        ...gameState,
        currentActId: lastAct.id,
        screen: "actTransition",
      };
    }

    return {
      ...gameState,
      screen: "finish",
    };
  }

  const nextScene = chapter.scenes[nextIndex];

  const completedAct = completedScene
    ? getActForScene(chapter, completedScene.id)
    : undefined;
  const nextAct = getActForScene(chapter, nextScene.id);

  if (completedAct && nextAct && completedAct.id !== nextAct.id) {
    return {
      ...gameState,
      currentSceneIndex: nextIndex,
      currentActId: completedAct.id,
      screen: "actTransition",
    };
  }

  const nextState: GameState = {
    ...gameState,
    currentSceneIndex: nextIndex,
    screen: "puzzle",
  };

  return runSceneEvents(
    nextState,
    nextScene,
    "sceneEntered",
    chapter.quests
  );
}

/**
 * Ukončí koniec aktu: udelí odmenu z dát (iba raz), prepne na ďalší akt
 * a pokračuje ďalšou scénou; po poslednom akte ide na záver kapitoly.
 * Mimo obrazovky konca aktu nerobí nič, takže opakované kliknutie
 * nič nezdvojí.
 */
export function completeActEnding(
  chapter: Chapter,
  gameState: GameState
): GameState {
  if (gameState.screen !== "actTransition") {
    return gameState;
  }

  const transition = getActTransition(chapter, gameState);

  if (!transition) {
    return {
      ...gameState,
      screen: "puzzle",
    };
  }

  const reward = transition.completedAct.ending?.reward;

  const shouldAddReward =
    reward !== undefined &&
    !gameState.inventory.some((item) => item.id === reward.id);

  return {
    ...gameState,
    currentActId: transition.nextAct?.id ?? transition.completedAct.id,
    screen: transition.nextAct ? "puzzle" : "finish",
    inventory: shouldAddReward
      ? [...gameState.inventory, reward]
      : gameState.inventory,
  };
}