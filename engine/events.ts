import type { GameAction, GameEventTrigger, GameState, InventoryItem, Scene } from "../types/game";
import { addArtifact, addScore, completeQuest, startQuest } from "./gameEngine";
import { evaluateConditions } from "./conditions";

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

function addInventoryItem(
  gameState: GameState,
  item: InventoryItem
): GameState {
  const alreadyInInventory = gameState.inventory.some(
    (inventoryItem) => inventoryItem.id === item.id
  );

  if (alreadyInInventory) {
    return gameState;
  }

  return {
    ...gameState,
    inventory: [...gameState.inventory, item],
  };
}

function removeInventoryItem(
  gameState: GameState,
  itemId: string
): GameState {
  return {
    ...gameState,
    inventory: gameState.inventory.filter(
      (item) => item.id !== itemId
    ),
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

    case "addArtifact":
      return addArtifact(gameState, action.artifact);

    case "startQuest":
      return startQuest(gameState, action.questId);

    case "completeQuest":
      return completeQuest(gameState, action.questId, scene);

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

    case "addInventoryItem":
      return addInventoryItem(gameState, action.item);

    case "removeInventoryItem":
      return removeInventoryItem(gameState, action.itemId);

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