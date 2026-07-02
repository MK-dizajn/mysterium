"use client";

import { useState } from "react";
import { mysteriumGame } from "../data/mysterium-game";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { PuzzleScreen } from "../components/screens/PuzzleScreen";
import { HistoryScreen } from "../components/screens/HistoryScreen";
import { FinishScreen } from "../components/screens/FinishScreen";
import { ArtifactScreen } from "../components/screens/ArtifactScreen";
import { CodexBar } from "../components/ui/CodexBar";
import type { Artifact, GameScreen } from "../types/game";
import { useGameEngine } from "../hooks/useGameEngine";
import {
  clearGameState,
  continueAfterHistory,
  createNewGameState,
  solvePuzzle,
} from "../engine";

const initialGameState = createNewGameState();

export default function Home() {
  const {
    gameState,
    setGameState,
    hasSavedProgress,
    setHasSavedProgress,
  } = useGameEngine();

  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [previousScreen, setPreviousScreen] = useState<GameScreen>("puzzle");

  const currentChapter =
    mysteriumGame.chapters[gameState.currentChapterIndex];

  const currentScene =
    currentChapter.scenes[gameState.currentSceneIndex];

  function updateGameScreen(screen: GameScreen) {
    setGameState((currentState) => ({
      ...currentState,
      screen,
    }));
  }

  function resetToMainMenu() {
    clearGameState();
    setSelectedArtifact(null);
    setHasSavedProgress(false);
    setGameState(initialGameState);
  }

  function startNewGame() {
    clearGameState();
    setSelectedArtifact(null);
    setHasSavedProgress(false);
    setGameState({
      ...initialGameState,
      screen: "intro",
    });
  }

  function continueGame() {
    if (!hasSavedProgress) {
      startNewGame();
      return;
    }

    updateGameScreen(gameState.screen);
  }

  function openArtifact(artifact: Artifact) {
    setPreviousScreen(gameState.screen);
    setSelectedArtifact(artifact);
    updateGameScreen("artifact");
  }

  if (gameState.screen === "artifact" && selectedArtifact) {
    return (
      <ArtifactScreen
        artifact={selectedArtifact}
        onBack={() => updateGameScreen(previousScreen)}
      />
    );
  }

  if (gameState.screen === "intro") {
    return (
      <IntroScreen
        chapter={currentChapter}
        onContinue={() => updateGameScreen("puzzle")}
      />
    );
  }

  if (gameState.screen === "puzzle") {
    return (
      <>
        <CodexBar
          artifacts={gameState.artifacts}
          score={gameState.score}
          onOpenArtifact={openArtifact}
        />

        <PuzzleScreen
          scene={currentScene}
          onSolved={(hintsUsed) => {
            setGameState(solvePuzzle(gameState, currentScene, hintsUsed));
          }}
        />
      </>
    );
  }

  if (gameState.screen === "history") {
    return (
      <>
        <CodexBar
          artifacts={gameState.artifacts}
          score={gameState.score}
          onOpenArtifact={openArtifact}
        />

        <HistoryScreen
          scene={currentScene}
          onContinue={() => {
            setGameState(continueAfterHistory(gameState, currentChapter));
          }}
        />
      </>
    );
  }

  if (gameState.screen === "finish") {
    return <FinishScreen onRestart={resetToMainMenu} />;
  }

  return (
    <LandingScreen
      hasSavedProgress={hasSavedProgress}
      onContinueGame={() => updateGameScreen(gameState.screen)}
      onStartNewGame={startNewGame}
    />
  );
}