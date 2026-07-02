import type { GameAction, GameEventTrigger, GameState } from "../types/game";
import { addArtifact, addScore } from "./gameEngine";
import type { Scene } from "../types/game";
import { evaluateConditions } from "./conditions";

export function applyGameAction(
  gameState: GameState,
  action: GameAction
): GameState {
  switch (action.type) {
    case "addScore":
      return addScore(gameState, action.value);

    case "addArtifact":
      return addArtifact(gameState, action.artifact);

    case "setScreen":
      return {
        ...gameState,
        screen: action.screen,
      };

    default:
      return gameState;
  }
}

export function runSceneEvents(
  gameState: GameState,
  scene: Scene,
  trigger: GameEventTrigger
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
        applyGameAction(stateAfterAction, action),
      currentState
    );
  }, gameState);
}