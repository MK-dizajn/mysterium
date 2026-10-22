import type { CodeItemInfo } from "../../engine";
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
  codeItem: CodeItemInfo | null;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
  onInspectItem: (itemId: string) => void;
  onContinue: () => void;
};

export function HistoryFlow({
  gameState,
  scene,
  totalArtifacts,
  codeItem,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
  onInspectItem,
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
        codeItem={codeItem}
        onInspectItem={onInspectItem}
        onContinue={onContinue}
      />
    </GameLayout>
  );
}