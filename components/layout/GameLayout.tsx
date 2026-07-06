import type { ReactNode } from "react";
import type { Artifact, GameScreen, GameState } from "../../types/game";
import { CodexBar } from "../ui/CodexBar";

type GameLayoutProps = {
  children: ReactNode;
  gameState: GameState;
  currentScreen: GameScreen;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
};

export function GameLayout({
  children,
  gameState,
  onOpenInventory,
  onOpenArtifacts,
}: GameLayoutProps) {
  return (
    <>
      <CodexBar
        artifacts={gameState.artifacts}
        inventory={gameState.inventory}
        score={gameState.score}
        onOpenInventory={onOpenInventory}
        onOpenArtifacts={onOpenArtifacts}
      />

      {children}
    </>
  );
}