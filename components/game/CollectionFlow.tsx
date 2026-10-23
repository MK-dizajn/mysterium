import type {
  Artifact,
  Chapter,
  GameState,
} from "../../types/game";
import { getCodeNotebook, getItemClue } from "../../engine";
import { InventoryScreen } from "../screens/InventoryScreen";
import { ArtifactsScreen } from "../screens/ArtifactsScreen";
import { QuestScreen } from "../screens/QuestScreen";

type CollectionFlowProps = {
  gameState: GameState;
  chapter: Chapter;
  onBack: () => void;
  onOpenArtifact: (artifact: Artifact) => void;
  onInspectItem: (itemId: string) => void;
};

export function CollectionFlow({
  gameState,
  chapter,
  onBack,
  onOpenArtifact,
  onInspectItem,
}: CollectionFlowProps) {
  if (gameState.screen === "inventory") {
    return (
      <InventoryScreen
        inventory={gameState.inventory}
        codeNotebook={getCodeNotebook(chapter, gameState)}
        guidance={chapter.guidance}
        getClue={(itemId) => getItemClue(chapter, itemId)}
        onInspectItem={onInspectItem}
        onBack={onBack}
      />
    );
  }

  if (gameState.screen === "artifacts") {
    return (
      <ArtifactsScreen
        artifacts={gameState.artifacts}
        onBack={onBack}
        onOpenArtifact={onOpenArtifact}
      />
    );
  }

  if (gameState.screen === "quests") {
    return (
      <QuestScreen
        questProgress={gameState.quests}
        availableQuests={chapter.quests ?? []}
        onBack={onBack}
      />
    );
  }

  return null;
}