import type {
  DialogueChoice,
  GameState,
  Scene,
} from "../../types/game";
import { evaluateConditions } from "../../engine";
import { GameLayout } from "../layout/GameLayout";
import { NpcScreen } from "../screens/NpcScreen";

type NpcFlowProps = {
  gameState: GameState;
  scene: Scene;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
  onChooseNode: (nodeId: string) => void;
  onApplyChoiceActions: (choice: DialogueChoice) => void;
  onClose: () => void;
};

export function NpcFlow({
  gameState,
  scene,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
  onChooseNode,
  onApplyChoiceActions,
  onClose,
    }: NpcFlowProps) {
  const activeNpc = scene.npcs?.find(
    (npc) => npc.id === gameState.activeNpcId
  );

  const activeDialogue = scene.dialogues?.find(
    (dialogue) => dialogue.id === gameState.activeDialogueId
  );

  const activeDialogueNode = activeDialogue?.nodes.find(
    (node) => node.id === gameState.activeDialogueNodeId
  );

  const visibleChoices =
    activeDialogueNode?.choices?.filter((choice) =>
      evaluateConditions(choice.conditions ?? [], gameState)
    ) ?? [];

  if (!activeNpc || !activeDialogue || !gameState.activeDialogueNodeId) {
    return (
      <GameLayout
        gameState={gameState}
        currentScreen={gameState.screen}
        onOpenInventory={onOpenInventory}
        onOpenArtifacts={onOpenArtifacts}
        onOpenQuests={onOpenQuests}
      >
        <div className="rounded-2xl border border-red-400/40 bg-red-950/30 p-6 text-red-100">
          Rozhovor sa nepodarilo načítať.

          <button
            type="button"
            onClick={onClose}
            className="mt-4 block rounded-xl border border-red-300/40 px-4 py-2"
          >
            Späť
          </button>
        </div>
      </GameLayout>
    );
  }

  function chooseDialogueChoice(choiceId: string) {
    if (!activeDialogue) {
        return;
    }

  const activeNode = activeDialogue.nodes.find(
        (node) => node.id === gameState.activeDialogueNodeId
    );

    const choice = activeNode?.choices?.find(
      (item) => item.id === choiceId
    );

    if (!choice) {
      return;
    }

    onApplyChoiceActions(choice);

    if (choice.nextDialogueNodeId) {
      onChooseNode(choice.nextDialogueNodeId);
      return;
    }

    const hasSetScreenAction = choice.actions?.some(
      (action) => action.type === "setScreen"
    );

    if (!hasSetScreenAction) {
      onClose();
    }
  }

  return (
    <NpcScreen
      npc={activeNpc}
      dialogue={activeDialogue}
      activeNodeId={gameState.activeDialogueNodeId}
      visibleChoices={visibleChoices}
      onChooseNode={onChooseNode}
      onChooseChoice={chooseDialogueChoice}
      onClose={onClose}
    />
  );
}