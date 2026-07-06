"use client";

import { useState } from "react";
import { mysteriumGame } from "../data/mysterium-game";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { PuzzleScreen } from "../components/screens/PuzzleScreen";
import { HistoryScreen } from "../components/screens/HistoryScreen";
import { ArtifactScreen } from "../components/screens/ArtifactScreen";
import type { Artifact, GameScreen } from "../types/game";
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

  const [selectedArtifact, setSelectedArtifact] =
    useState<Artifact | null>(null);

  const [previousScreen, setPreviousScreen] =
    useState<GameScreen>("puzzle");

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

  function openInventory() {
    setPreviousScreen(gameState.screen);
    updateGameScreen("inventory");
  }

  function openArtifacts() {
    setPreviousScreen(gameState.screen);
    updateGameScreen("artifacts");
  }

  function openQuests() {
    setPreviousScreen(gameState.screen);
    updateGameScreen("quests");
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
      <GameLayout
        gameState={gameState}
        currentScreen={gameState.screen}
        onOpenInventory={openInventory}
        onOpenArtifacts={openArtifacts}
        onOpenQuests={openQuests}
      >
        <PuzzleScreen
          scene={currentScene}
          onSolved={(hintsUsed) => {
            setGameState(solvePuzzle(gameState, currentScene, hintsUsed));
          }}
        />
      </GameLayout>
    );
  }

  if (gameState.screen === "history") {
    return (
      <GameLayout
        gameState={gameState}
        currentScreen={gameState.screen}
        onOpenInventory={openInventory}
        onOpenArtifacts={openArtifacts}
        onOpenQuests={openQuests}
      >
        <HistoryScreen
          scene={currentScene}
          onContinue={() => {
            setGameState(continueAfterHistory(gameState, currentChapter));
          }}
        />
      </GameLayout>
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

  if (gameState.screen === "quests") {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={() => updateGameScreen(previousScreen)}
            className="mb-6 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300"
          >
            ← Späť
          </button>

          <h1 className="mb-4 text-2xl font-bold text-emerald-100">
            📜 Úlohy
          </h1>

          {gameState.quests.length === 0 ? (
            <p className="text-sm text-slate-400">
              Zatiaľ nemáš aktívne žiadne vedľajšie úlohy.
            </p>
          ) : (
            <div className="space-y-3">
              {gameState.quests.map((quest) => (
                <div
                  key={quest.questId}
                  className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4"
                >
                  <p className="font-semibold text-emerald-100">
                    {quest.questId}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Stav: {quest.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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