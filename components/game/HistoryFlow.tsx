import type {
  GameState,
  Scene,
} from "../../types/game";
import { GameLayout } from "../layout/GameLayout";
import { HistoryScreen } from "../screens/HistoryScreen";

type HistoryFlowProps = {
  gameState: GameState;
  scene: Scene;
  totalArtifacts: number;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
  onContinue: () => void;
};

export function HistoryFlow({
  gameState,
  scene,
  totalArtifacts,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
  onContinue,
}: HistoryFlowProps) {
  return (
    <GameLayout
      gameState={gameState}
      totalArtifacts={totalArtifacts}
      onOpenInventory={onOpenInventory}
      onOpenArtifacts={onOpenArtifacts}
      onOpenQuests={onOpenQuests}
    >
      <HistoryScreen
        scene={scene}
        onContinue={onContinue}
      />
    </GameLayout>
  );
}