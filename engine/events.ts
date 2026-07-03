import type { GameAction, GameEventTrigger, GameState } from "../types/game";
import { addArtifact, addScore } from "./gameEngine";
import type { Scene } from "../types/game";
import { evaluateConditions } from "./conditions";
import { calculatePuzzleScore } from "./gameScoring";

function setFlag(gameState: GameState, flagId: string): GameState {
  return {
    ...gameState,
    flags: {
      ...gameState.flags,
      [flagId]: true,
    },
  };
}

function clearFlag(gameState: GameState, flagId: string): GameState {
  return {
    ...gameState,
    flags: {
      ...gameState.flags,
      [flagId]: false,
    },
  };
}

function toggleFlag(gameState: GameState, flagId: string): GameState {
  return {
    ...gameState,
    flags: {
      ...gameState.flags,
      [flagId]: !gameState.flags[flagId],
    },
  };
}

function applyGameAction(
  gameState: GameState,
  scene: Scene,
  hintsUsed: number,
  action: GameAction
): GameState {
  switch (action.type) {
    case "addScore":
      return addScore(gameState, action.value);

    case "addCalculatedPuzzleScore":
      return addScore(gameState, calculatePuzzleScore(hintsUsed));

    case "addArtifact":
      return addArtifact(gameState, action.artifact);

    case "addSceneArtifact":
      return addArtifact(gameState, scene.artifact);

    case "setFlag":
      return setFlag(gameState, action.flagId);

    case "clearFlag":
      return clearFlag(gameState, action.flagId);

    case "toggleFlag":
      return toggleFlag(gameState, action.flagId);

    case "setScreen":
      return {
        ...gameState,
        screen: action.screen,
      };
    
    case "startDialogue":
      return {
        ...gameState,
        activeDialogueId: action.dialogueId,
        activeDialogueNodeId: action.nodeId,
      };

    default:
      return gameState;
  }
}

export function runSceneEvents(
  gameState: GameState,
  scene: Scene,
  trigger: GameEventTrigger,
  hintsUsed = 0
): GameState {
  const matchingEvents = scene.events?.filter(
    (event) =>
      event.trigger === trigger &&
      evaluateConditions(event.conditions, gameState)
  );

  if (!matchingEvents || matchingEvents.length === 0) {
    return gameState;
  }

  return matchingEvents.reduce((currentState, event) => {
    return event.actions.reduce(
      (stateAfterAction, action) =>
        applyGameAction(stateAfterAction, scene, hintsUsed, action),
      currentState
    );
  }, gameState);
}