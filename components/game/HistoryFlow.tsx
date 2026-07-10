import type {
  GameState,
  Scene,
} from "../../types/game";
import { GameLayout } from "../layout/GameLayout";
import { HistoryScreen } from "../screens/HistoryScreen";

type HistoryFlowProps = {
  gameState: GameState;
  scene: Scene;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
  onContinue: () => void;
};

export function HistoryFlow({
  gameState,
  scene,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
  onContinue,
}: HistoryFlowProps) {
  return (
    <GameLayout
      gameState={gameState}
      currentScreen={gameState.screen}
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