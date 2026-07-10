import type {
  Artifact,
  Chapter,
  GameState,
} from "../../types/game";
import { InventoryScreen } from "../screens/InventoryScreen";
import { ArtifactsScreen } from "../screens/ArtifactsScreen";
import { QuestScreen } from "../screens/QuestScreen";

type CollectionFlowProps = {
  gameState: GameState;
  chapter: Chapter;
  onBack: () => void;
  onOpenArtifact: (artifact: Artifact) => void;
};

export function CollectionFlow({
  gameState,
  chapter,
  onBack,
  onOpenArtifact,
}: CollectionFlowProps) {
  if (gameState.screen === "inventory") {
    return (
      <InventoryScreen
        inventory={gameState.inventory}
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