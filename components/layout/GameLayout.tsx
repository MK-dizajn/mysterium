import type { ReactNode } from "react";
import type { GameState } from "../../types/game";
import { CodexBar } from "../ui/CodexBar";

type GameLayoutProps = {
  children: ReactNode;
  gameState: GameState;
  totalArtifacts: number;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
};

export function GameLayout({
  children,
  gameState,
  totalArtifacts,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
}: GameLayoutProps) {
  return (
    <>
      <CodexBar
        artifacts={gameState.artifacts}
        inventory={gameState.inventory}
        quests={gameState.quests}
        score={gameState.score}
        totalArtifacts={totalArtifacts}
        onOpenInventory={onOpenInventory}
        onOpenArtifacts={onOpenArtifacts}
        onOpenQuests={onOpenQuests}
      />

      {children}
    </>
  );
}