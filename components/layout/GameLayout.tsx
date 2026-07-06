import type { ReactNode } from "react";
import type { GameScreen, GameState } from "../../types/game";
import { CodexBar } from "../ui/CodexBar";

type GameLayoutProps = {
  children: ReactNode;
  gameState: GameState;
  currentScreen: GameScreen;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
};

export function GameLayout({
  children,
  gameState,
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
        onOpenInventory={onOpenInventory}
        onOpenArtifacts={onOpenArtifacts}
        onOpenQuests={onOpenQuests}
      />

      {children}
    </>
  );
}