"use client";

import { useEffect, useState } from "react";
import { mysteriumGame } from "../data/mysterium-game";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { PuzzleScreen } from "../components/screens/PuzzleScreen";
import { HistoryScreen } from "../components/screens/HistoryScreen";
import { FinishScreen } from "../components/screens/FinishScreen";
import { ArtifactScreen } from "../components/screens/ArtifactScreen";
import { CodexBar } from "../components/ui/CodexBar";
import type { Artifact, GameState, GameScreen } from "../types/game";
import { useGameEngine } from "../hooks/useGameEngine";
import {
  createNewGameState,
  clearGameState,
  loadGameState,
  saveGameState,
  solvePuzzle,
  continueAfterHistory,
} from "../engine";

const initialGameState = createNewGameState();

export default function Home() {
  const { gameState, setGameState } = useGameEngine();
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [previousScreen, setPreviousScreen] = useState<GameScreen>("puzzle");
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  const currentChapter =
    mysteriumGame.chapters[gameState.currentChapterIndex];

  const currentScene =
    currentChapter.scenes[gameState.currentSceneIndex];

  useEffect(() => {
    const savedProgress = loadGameState();

    if (!savedProgress) {
  setHasSavedProgress(false);
  return;
  }

  setHasSavedProgress(true);
  setGameState(savedProgress);
  }, []);

  useEffect(() => {
    if (gameState.screen === "landing") return;

    saveGameState(gameState);
    setHasSavedProgress(true);
  }, [gameState]);

  function updateGameState(nextState: Partial<GameState>) {
    setGameState((currentState) => ({
      ...currentState,
      ...nextState,
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
    const savedProgress = loadGameState();

  if (!savedProgress) {
  startNewGame();
  return;
  }

  setGameState(savedProgress);
  }

  function openArtifact(artifact: Artifact) {
    setPreviousScreen(gameState.screen);
    setSelectedArtifact(artifact);
    updateGameState({ screen: "artifact" });
  }

  if (gameState.screen === "artifact" && selectedArtifact) {
    return (
      <ArtifactScreen
        artifact={selectedArtifact}
        onBack={() => updateGameState({ screen: previousScreen })}
      />
    );
  }

  if (gameState.screen === "intro") {
    return (
      <IntroScreen
        chapter={currentChapter}
        onContinue={() => updateGameState({ screen: "puzzle" })}
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
      onContinueGame={continueGame}
      onStartNewGame={startNewGame}
    />
  );
}