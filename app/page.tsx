"use client";

import { useState } from "react";
import { mysteriumGame } from "../data/mysterium-game";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { PuzzleScreen } from "../components/screens/PuzzleScreen";
import { HistoryScreen } from "../components/screens/HistoryScreen";
import { FinishScreen } from "../components/screens/FinishScreen";
import { ArtifactScreen } from "../components/screens/ArtifactScreen";
import type { Artifact, GameScreen, InventoryItem } from "../types/game";
import { useGameEngine } from "../hooks/useGameEngine";
import {
  clearGameState,
  continueAfterHistory,
  createNewGameState,
  solvePuzzle,
} from "../engine";
import { InventoryScreen } from "../components/screens/InventoryScreen";
import { ArtifactsScreen } from "../components/screens/ArtifactsScreen";
import { GameLayout } from "../components/layout/GameLayout";

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
  const [artifactPreviousScreen, setArtifactPreviousScreen] =
  useState<GameScreen>("artifacts");

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
    setArtifactPreviousScreen(gameState.screen);
    setSelectedArtifact(artifact);
    updateGameScreen("artifact");
  }

  if (gameState.screen === "artifact" && selectedArtifact) {
    return (
      <ArtifactScreen
        artifact={selectedArtifact}
        onBack={() => updateGameScreen(artifactPreviousScreen)}
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
          <GameLayout
            gameState={gameState}
            currentScreen={gameState.screen}
            onOpenInventory={() => {
             setPreviousScreen(gameState.screen);
             updateGameScreen("inventory");
             }}
            onOpenArtifacts={() => {
             setPreviousScreen(gameState.screen);
             updateGameScreen("artifacts");
            }}
          >
          <PuzzleScreen
            scene={currentScene}
            onSolved={(hintsUsed) => {
             setGameState(solvePuzzle(gameState, currentScene, hintsUsed));
              }}
            />
          </GameLayout>
      </>
    );
  }

  if (gameState.screen === "history") {
    return (
      <>
          <GameLayout
           gameState={gameState}
           currentScreen={gameState.screen}
           onOpenInventory={() => {
            setPreviousScreen(gameState.screen);
            updateGameScreen("inventory");
            }}
          onOpenArtifacts={() => {
           setPreviousScreen(gameState.screen);
           updateGameScreen("artifacts");
           }}
          >
          <HistoryScreen
            scene={currentScene}
            onContinue={() => {
             setGameState(continueAfterHistory(gameState, currentChapter));
             }}
          />
          </GameLayout>
      </>
    );
  }

  if (gameState.screen === "inventory") {
  return (
    <InventoryScreen
      inventory={gameState.inventory}
      onBack={() => updateGameScreen(previousScreen)}
    />
  );
  }

  if (gameState.screen === "artifacts") {
  return (
    <ArtifactsScreen
      artifacts={gameState.artifacts}
      onBack={() => updateGameScreen(previousScreen)}
      onOpenArtifact={openArtifact}
    />
  );
  }

  return (
    <LandingScreen
      hasSavedProgress={hasSavedProgress}
      onContinueGame={() => updateGameScreen(gameState.screen)}
      onStartNewGame={startNewGame}
    />
  );
}