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

const SAVE_KEY = "mysterium-progress-v2";

const initialGameState: GameState = {
  screen: "landing",
  currentChapterIndex: 0,
  currentSceneIndex: 0,
  score: 0,
  artifacts: [],
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [previousScreen, setPreviousScreen] = useState<GameScreen>("puzzle");
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  const currentChapter =
    mysteriumGame.chapters[gameState.currentChapterIndex];

  const currentScene =
    currentChapter.scenes[gameState.currentSceneIndex];

  useEffect(() => {
    const savedProgress = localStorage.getItem(SAVE_KEY);

    if (!savedProgress) {
      setHasSavedProgress(false);
      return;
    }

    const progress = JSON.parse(savedProgress) as GameState;

    setHasSavedProgress(true);
    setGameState(progress);
  }, []);

  useEffect(() => {
    if (gameState.screen === "landing") return;

    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
    setHasSavedProgress(true);
  }, [gameState]);

  function updateGameState(nextState: Partial<GameState>) {
    setGameState((currentState) => ({
      ...currentState,
      ...nextState,
    }));
  }

  function resetToMainMenu() {
  localStorage.removeItem(SAVE_KEY);
  setSelectedArtifact(null);
  setHasSavedProgress(false);
  setGameState(initialGameState);
  }

function startNewGame() {
  localStorage.removeItem(SAVE_KEY);
  setSelectedArtifact(null);
  setHasSavedProgress(false);
  setGameState({
    ...initialGameState,
    screen: "intro",
  });
  }

  function continueGame() {
    const savedProgress = localStorage.getItem(SAVE_KEY);

    if (!savedProgress) {
      startNewGame();
      return;
    }

    const progress = JSON.parse(savedProgress) as GameState;

    setGameState(progress);
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
            const points = Math.max(20, 100 - hintsUsed * 20);
            const artifact = currentScene.artifact;

            const alreadyCollected = gameState.artifacts.some(
              (item) => item.id === artifact.id
            );

            updateGameState({
              score: gameState.score + points,
              artifacts: alreadyCollected
                ? gameState.artifacts
                : [...gameState.artifacts, artifact],
              screen: "history",
            });
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
            const nextIndex = gameState.currentSceneIndex + 1;

            if (nextIndex >= currentChapter.scenes.length) {
              updateGameState({ screen: "finish" });
              return;
            }

            updateGameState({
              currentSceneIndex: nextIndex,
              screen: "puzzle",
            });
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