"use client";

import { useState } from "react";
import { CityAmbient } from "../components/audio/CityAmbient";
import { ArtifactFlow } from "../components/game/ArtifactFlow";
import { CollectionFlow } from "../components/game/CollectionFlow";
import { HistoryFlow } from "../components/game/HistoryFlow";
import { NpcFlow } from "../components/game/NpcFlow";
import { PuzzleFlow } from "../components/game/PuzzleFlow";
import { ActTransitionScreen } from "../components/screens/ActTransitionScreen";
import { FinishScreen } from "../components/screens/FinishScreen";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { ArtifactUnlock } from "../components/ui/ArtifactUnlock";
import { mysteriumGame } from "../data/mysterium-game";
import {
  applyDialogueChoiceActions,
  clearGameState,
  continueAfterHistory,
  createNewGameState,
  solvePuzzle,
  talkToNpc,
} from "../engine";
import { useGameEngine } from "../hooks/useGameEngine";
import type {
  ActId,
  Artifact,
  GameScreen,
} from "../types/game";

export default function Home() {
  const {
    gameState,
    setGameState,
    hasSavedProgress,
    setHasSavedProgress,
  } = useGameEngine();

  const [selectedArtifact, setSelectedArtifact] =
    useState<Artifact | null>(null);

  const [unlockedArtifact, setUnlockedArtifact] =
    useState<Artifact | null>(null);

  const [previousScreen, setPreviousScreen] =
    useState<GameScreen>("puzzle");

  const [artifactPreviousScreen, setArtifactPreviousScreen] =
    useState<GameScreen>("artifacts");

  const currentChapter =
    mysteriumGame.chapters[gameState.currentChapterIndex];

  const currentScene =
    currentChapter.scenes[gameState.currentSceneIndex];

  const ambientScreen: GameScreen = unlockedArtifact
    ? "artifact"
    : gameState.screen;

  function updateGameScreen(screen: GameScreen) {
    setGameState((currentState) => ({
      ...currentState,
      screen,
    }));
  }

  function startNewGame() {
    clearGameState();
    setSelectedArtifact(null);
    setUnlockedArtifact(null);
    setPreviousScreen("puzzle");
    setArtifactPreviousScreen("artifacts");
    setHasSavedProgress(false);

    setGameState({
      ...createNewGameState(),
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
    const npc = currentScene.npcs?.find(
      (item) => item.id === npcId
    );

    if (!npc) {
      return;
    }

    setPreviousScreen(gameState.screen);

    setGameState((currentState) =>
      talkToNpc(currentState, npc)
    );
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

  function continueToNextAct(nextActId: ActId) {
    setGameState((currentState) => ({
      ...currentState,
      currentActId: nextActId,
      screen: "puzzle",
    }));
  }

  function renderCurrentScreen() {
    if (unlockedArtifact) {
      return (
        <ArtifactUnlock
          artifact={unlockedArtifact}
          onComplete={() => setUnlockedArtifact(null)}
        />
      );
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
              applyDialogueChoiceActions(
                currentState,
                choice
              )
            );
          }}
          onClose={closeNpcDialogue}
        />
      );
    }

    if (
      gameState.screen === "artifact" &&
      selectedArtifact
    ) {
      return (
        <ArtifactFlow
          artifact={selectedArtifact}
          onBack={() => {
            setSelectedArtifact(null);
            updateGameScreen(artifactPreviousScreen);
          }}
        />
      );
    }

    if (
      gameState.screen === "artifact" &&
      !selectedArtifact
    ) {
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
            setGameState((currentState) => {
              const nextState = solvePuzzle(
                currentState,
                currentScene,
                hintsUsed
              );

              const newlyUnlockedArtifact =
                nextState.artifacts.find(
                  (artifact) =>
                    !currentState.artifacts.some(
                      (currentArtifact) =>
                        currentArtifact.id === artifact.id
                    )
                );

              if (newlyUnlockedArtifact) {
                setUnlockedArtifact(
                  newlyUnlockedArtifact
                );
              }

              return nextState;
            });
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
            setGameState((currentState) =>
              continueAfterHistory(
                currentState,
                currentChapter
              )
            );
          }}
        />
      );
    }

    if (gameState.screen === "actTransition") {
      const isFirstTransition =
        gameState.currentSceneIndex === 3;

      const completedActId: ActId = isFirstTransition
        ? "act-1"
        : "act-2";

      const nextActId: ActId = isFirstTransition
        ? "act-2"
        : "act-3";

      const evidenceCount = gameState.inventory.filter(
        (item) => item.actId === completedActId
      ).length;

      return (
        <ActTransitionScreen
          completedActTitle={
            isFirstTransition
              ? "Akt I – Prvé stopy"
              : "Akt II – Moc a pamäť"
          }
          nextActTitle={
            isFirstTransition
              ? "Akt II – Moc a poznanie"
              : "Akt III – Posledné tajomstvo"
          }
          evidenceCount={evidenceCount}
          onContinue={() =>
            continueToNextAct(nextActId)
          }
        />
      );
    }

    if (gameState.screen === "finish") {
      return <FinishScreen onRestart={startNewGame} />;
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
        onContinueGame={() =>
          updateGameScreen(gameState.screen)
        }
        onStartNewGame={startNewGame}
      />
    );
  }

  return (
    <>
      <CityAmbient currentScreen={ambientScreen} />
      {renderCurrentScreen()}
    </>
  );
}