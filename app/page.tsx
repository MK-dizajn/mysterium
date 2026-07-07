"use client";

import { useState } from "react";
import { mysteriumGame } from "../data/mysterium-game";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { PuzzleScreen } from "../components/screens/PuzzleScreen";
import { HistoryScreen } from "../components/screens/HistoryScreen";
import { ArtifactScreen } from "../components/screens/ArtifactScreen";
import type { Artifact, DialogueChoice, GameScreen } from "../types/game";
import { useGameEngine } from "../hooks/useGameEngine";
import {
  clearGameState,
  continueAfterHistory,
  createNewGameState,
  evaluateConditions,
  solvePuzzle,
  talkToNpc,
} from "../engine";
import { InventoryScreen } from "../components/screens/InventoryScreen";
import { ArtifactsScreen } from "../components/screens/ArtifactsScreen";
import { GameLayout } from "../components/layout/GameLayout";
import { QuestScreen } from "../components/screens/QuestScreen";
import { NpcScreen } from "../components/screens/NpcScreen";

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

  function applyDialogueChoiceActions(choice: DialogueChoice) {
  if (!choice.actions || choice.actions.length === 0) {
    return;
  }

  setGameState((currentState) => {
    let nextState = { ...currentState };

    choice.actions?.forEach((action) => {
      if (action.type === "setFlag") {
        nextState = {
          ...nextState,
          flags: {
            ...nextState.flags,
            [action.flagId]: true,
          },
        };
      }

      if (action.type === "clearFlag") {
        nextState = {
          ...nextState,
          flags: {
            ...nextState.flags,
            [action.flagId]: false,
          },
        };
      }

      if (action.type === "toggleFlag") {
        nextState = {
          ...nextState,
          flags: {
            ...nextState.flags,
            [action.flagId]: !nextState.flags[action.flagId],
          },
        };
      }

      if (action.type === "addScore") {
        nextState = {
          ...nextState,
          score: nextState.score + action.value,
        };
      }

      if (action.type === "addInventoryItem") {
        const alreadyHasItem = nextState.inventory.some(
          (item) => item.id === action.item.id
        );

        if (!alreadyHasItem) {
          nextState = {
            ...nextState,
            inventory: [...nextState.inventory, action.item],
          };
        }
      }

      if (action.type === "removeInventoryItem") {
        nextState = {
          ...nextState,
          inventory: nextState.inventory.filter(
            (item) => item.id !== action.itemId
          ),
        };
      }

      if (action.type === "addArtifact") {
        const alreadyHasArtifact = nextState.artifacts.some(
          (artifact) => artifact.id === action.artifact.id
        );

        if (!alreadyHasArtifact) {
          nextState = {
            ...nextState,
            artifacts: [...nextState.artifacts, action.artifact],
          };
        }
      }

        if (action.type === "setScreen") {
          nextState = {
            ...nextState,
            screen: action.screen,
            activeNpcId: undefined,
            activeDialogueId: undefined,
            activeDialogueNodeId: undefined,
          };
        }
      });

      return nextState;
    });
  }

  if (gameState.screen === "npc") {
  const activeNpc = currentScene.npcs?.find(
    (npc) => npc.id === gameState.activeNpcId
  );

  const activeDialogue = currentScene.dialogues?.find(
    (dialogue) => dialogue.id === gameState.activeDialogueId
  );

  const activeDialogueNode = activeDialogue?.nodes.find(
  (node) => node.id === gameState.activeDialogueNodeId
  );

  const visibleChoices =
  activeDialogueNode?.choices?.filter((choice) =>
    evaluateConditions(choice.conditions ?? [], gameState)
  ) ?? [];

  if (!activeNpc || !activeDialogue || !gameState.activeDialogueNodeId) {
    return (
      <GameLayout
        gameState={gameState}
        currentScreen={gameState.screen}
        onOpenInventory={openInventory}
        onOpenArtifacts={openArtifacts}
        onOpenQuests={openQuests}
      >
        <div className="rounded-2xl border border-red-400/40 bg-red-950/30 p-6 text-red-100">
          Rozhovor sa nepodarilo načítať.
          <button
            type="button"
            onClick={closeNpcDialogue}
            className="mt-4 block rounded-xl border border-red-300/40 px-4 py-2"
          >
            Späť
          </button>
        </div>
      </GameLayout>
    );
  }

  return (
      <NpcScreen
        npc={activeNpc}
        dialogue={activeDialogue}
        activeNodeId={gameState.activeDialogueNodeId}
        visibleChoices={visibleChoices}
        onChooseNode={chooseDialogueNode}
        onChooseChoice={(choiceId) => {
          const activeNode = activeDialogue.nodes.find(
            (node) => node.id === gameState.activeDialogueNodeId
          );

          const choice = activeNode?.choices?.find(
            (item) => item.id === choiceId
          );

      if (!choice) {
        return;
        }

      applyDialogueChoiceActions(choice);

      if (choice.nextDialogueNodeId) {
        chooseDialogueNode(choice.nextDialogueNodeId);
      return;
      }

      const hasSetScreenAction = choice.actions?.some(
        (action) => action.type === "setScreen"
      );

      if (!hasSetScreenAction) {
        closeNpcDialogue();
      }
        }}
        onClose={closeNpcDialogue}
     />
    );
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
        {currentScene.npcs && currentScene.npcs.length > 0 && (
          <section className="mb-6 rounded-2xl border border-amber-400/30 bg-black/30 p-4">
            <p className="mb-3 text-sm uppercase tracking-[0.25em] text-amber-200/70">
              Postavy v okolí
            </p>

            <div className="space-y-3">
              {currentScene.npcs.map((npc) => (
                <button
                  key={npc.id}
                  type="button"
                  onClick={() => openNpcDialogue(npc.id)}
                  className="w-full rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-left transition hover:bg-amber-300/20"
                >
                  <div className="font-semibold text-amber-100">
                    {npc.name}
                  </div>

                  {npc.role && (
                    <div className="text-sm text-amber-100/60">
                      {npc.role}
                    </div>
                  )}

                  {npc.description && (
                    <div className="mt-2 text-sm text-stone-300">
                      {npc.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        )}

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
      <QuestScreen
        questProgress={gameState.quests}
        availableQuests={currentChapter.quests ?? []}
        onBack={() => updateGameScreen(previousScreen)}
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