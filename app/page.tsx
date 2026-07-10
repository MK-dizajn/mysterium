"use client";

import { useState } from "react";
import { mysteriumGame } from "../data/mysterium-game";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { PuzzleFlow } from "../components/game/PuzzleFlow";
import { HistoryFlow } from "../components/game/HistoryFlow";
import { ArtifactFlow } from "../components/game/ArtifactFlow";
import type { Artifact, GameScreen } from "../types/game";
import { useGameEngine } from "../hooks/useGameEngine";
import { NpcFlow } from "../components/game/NpcFlow";
import { GameLayout } from "../components/layout/GameLayout";
import { CollectionFlow } from "../components/game/CollectionFlow";
import {
  applyDialogueChoiceActions,
  clearGameState,
  continueAfterHistory,
  createNewGameState,
  solvePuzzle,
  talkToNpc,
} from "../engine";

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

  function openNpcDialogue(npcId: string) {
    const npc = currentScene.npcs?.find((item) => item.id === npcId);

    if (!npc) {
      return;
    }

    setPreviousScreen(gameState.screen);
    setGameState((currentState) => talkToNpc(currentState, npc));
  }

  function closeNpcDialogue() {
    setGameState((currentState) => ({
      ...currentState,
      screen: previousScreen,
      activeNpcId: undefined,
      activeDialogueId: undefined,
      activeDialogueNodeId: undefined,
    }));
  }

  function chooseDialogueNode(nodeId: string) {
    setGameState((currentState) => ({
      ...currentState,
      activeDialogueNodeId: nodeId,
    }));
  }

  if (gameState.screen === "npc") {
  return (
    <NpcFlow
      gameState={gameState}
      scene={currentScene}
      onOpenInventory={openInventory}
      onOpenArtifacts={openArtifacts}
      onOpenQuests={openQuests}
      onChooseNode={chooseDialogueNode}
      onApplyChoiceActions={(choice) => {
        setGameState((currentState) =>
        applyDialogueChoiceActions(currentState, choice)
        );
      }}
      onClose={closeNpcDialogue}
    />
  );
  }

  if (gameState.screen === "artifact" && selectedArtifact) {
    return (
      <ArtifactFlow
        artifact={selectedArtifact}
        onBack={() => updateGameScreen(artifactPreviousScreen)}
      />
    );
  }
  
  if (gameState.screen === "artifact" && !selectedArtifact) {
    return (
      <CollectionFlow
        gameState={{
         ...gameState,
         screen: "artifacts",
        }}
        chapter={currentChapter}
        onBack={() => updateGameScreen(previousScreen)}
        onOpenArtifact={openArtifact}
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
    <PuzzleFlow
      gameState={gameState}
      scene={currentScene}
      onOpenInventory={openInventory}
      onOpenArtifacts={openArtifacts}
      onOpenQuests={openQuests}
      onOpenNpcDialogue={openNpcDialogue}
      onSolved={(hintsUsed) => {
        setGameState(solvePuzzle(gameState, currentScene, hintsUsed));
      }}
    />
  );
  }

  if (gameState.screen === "history") {
    return (
      <HistoryFlow
        gameState={gameState}
        scene={currentScene}
        onOpenInventory={openInventory}
        onOpenArtifacts={openArtifacts}
        onOpenQuests={openQuests}
        onContinue={() => {
          setGameState(
            continueAfterHistory(gameState, currentChapter)
          );
        }}
      />
    );
  }

  if (
    gameState.screen === "inventory" ||
    gameState.screen === "artifacts" ||
    gameState.screen === "quests"
  ) {
    return (
      <CollectionFlow
        gameState={gameState}
        chapter={currentChapter}
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