import type {
  DialogueChoice,
  GameState,
} from "../types/game";

export function applyDialogueChoiceActions(
  gameState: GameState,
  choice: DialogueChoice
): GameState {
  if (!choice.actions || choice.actions.length === 0) {
    return gameState;
  }

  let nextState = { ...gameState };

  choice.actions.forEach((action) => {
    if (action.type === "setFlag") {
      nextState = {
        ...nextState,
        flags: {
          ...nextState.flags,
          [action.flagId]: true,
        },
      };
    }

    if (action.type === "clearFlag") {
      nextState = {
        ...nextState,
        flags: {
          ...nextState.flags,
          [action.flagId]: false,
        },
      };
    }

    if (action.type === "toggleFlag") {
      nextState = {
        ...nextState,
        flags: {
          ...nextState.flags,
          [action.flagId]: !nextState.flags[action.flagId],
        },
      };
    }

    if (action.type === "addScore") {
      nextState = {
        ...nextState,
        score: nextState.score + action.value,
      };
    }

    if (action.type === "addInventoryItem") {
      const alreadyHasItem = nextState.inventory.some(
        (item) => item.id === action.item.id
      );

      if (!alreadyHasItem) {
        nextState = {
          ...nextState,
          inventory: [...nextState.inventory, action.item],
        };
      }
    }

    if (action.type === "removeInventoryItem") {
      nextState = {
        ...nextState,
        inventory: nextState.inventory.filter(
          (item) => item.id !== action.itemId
        ),
      };
    }

    if (action.type === "addArtifact") {
      const alreadyHasArtifact = nextState.artifacts.some(
        (artifact) => artifact.id === action.artifact.id
      );

      if (!alreadyHasArtifact) {
        nextState = {
          ...nextState,
          artifacts: [
            ...nextState.artifacts,
            action.artifact,
          ],
        };
      }
    }

    if (action.type === "startQuest") {
      const existingQuest = nextState.quests.find(
        (quest) => quest.questId === action.questId
      );

      if (!existingQuest) {
        nextState = {
          ...nextState,
          quests: [
            ...nextState.quests,
            {
              questId: action.questId,
              status: "active",
            },
          ],
        };
      }
    }

    if (action.type === "completeQuest") {
      const existingQuest = nextState.quests.find(
        (quest) => quest.questId === action.questId
      );

      if (!existingQuest) {
        nextState = {
          ...nextState,
          quests: [
            ...nextState.quests,
            {
              questId: action.questId,
              status: "completed",
            },
          ],
        };
      } else if (existingQuest.status !== "completed") {
        nextState = {
          ...nextState,
          quests: nextState.quests.map((quest) =>
            quest.questId === action.questId
              ? {
                  ...quest,
                  status: "completed",
                }
              : quest
          ),
        };
      }
    }

    if (action.type === "startDialogue") {
      nextState = {
        ...nextState,
        screen: "npc",
        activeDialogueId: action.dialogueId,
        activeDialogueNodeId: action.nodeId,
      };
    }

    if (action.type === "setScreen") {
      nextState = {
        ...nextState,
        screen: action.screen,
        activeNpcId: undefined,
        activeDialogueId: undefined,
        activeDialogueNodeId: undefined,
      };
    }
  });

  return nextState;
}