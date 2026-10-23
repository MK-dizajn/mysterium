"use client";

import { useEffect, useState } from "react";
import { CityAmbient } from "../components/audio/CityAmbient";
import { ArtifactFlow } from "../components/game/ArtifactFlow";
import { CollectionFlow } from "../components/game/CollectionFlow";
import { HistoryFlow } from "../components/game/HistoryFlow";
import { NpcFlow } from "../components/game/NpcFlow";
import { GameLayout } from "../components/layout/GameLayout";
import { PuzzleFlow } from "../components/game/PuzzleFlow";
import { ActTransitionScreen } from "../components/screens/ActTransitionScreen";
import { FinaleChestScreen } from "../components/screens/FinaleChestScreen";
import { FinaleGuardianScreen } from "../components/screens/FinaleGuardianScreen";
import { FinalePhotoScreen } from "../components/screens/FinalePhotoScreen";
import { FinalePlaceScreen } from "../components/screens/FinalePlaceScreen";
import { FinishScreen } from "../components/screens/FinishScreen";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { ItemInspector } from "../components/items/ItemInspector";
import { ArtifactUnlock } from "../components/ui/ArtifactUnlock";
import { mysteriumGame } from "../data/mysterium-game";
import {
  applyDialogueChoiceActions,
  clearGameState,
  completeActEnding,
  continueAfterHistory,
  countChapterArtifacts,
  createNewGameState,
  getActLockEvidence,
  getActTransition,
  getCodeItemInfo,
  getSceneCodeItemId,
  FINALE_PHOTO_ASSEMBLED_FLAG,
  FINALE_PHOTO_SEEN_FLAG,
  FINALE_PLACE_SOLVED_FLAG,
  insertFinaleKey,
  leaveFinaleChest,
  leaveFinaleGuardian,
  leaveFinalePhoto,
  leaveFinalePlace,
  markCodeDigitFound,
  markFinalePhotoAssembled,
  openFinaleChest,
  revealHint,
  solvePuzzle,
  submitFinalePlace,
  talkToNpc,
  unlockFinaleLock,
} from "../engine";
import { useGameEngine } from "../hooks/useGameEngine";
import type { Artifact, GameScreen } from "../types/game";

export default function Home() {
  const {
    gameState,
    setGameState,
    hasSavedProgress,
    setHasSavedProgress,
    continueSavedGame,
  } = useGameEngine(mysteriumGame);

  const [selectedArtifact, setSelectedArtifact] =
    useState<Artifact | null>(null);

  const [unlockedArtifact, setUnlockedArtifact] =
    useState<Artifact | null>(null);

  const [inspectedItemId, setInspectedItemId] =
    useState<string | null>(null);

  const [previousScreen, setPreviousScreen] =
    useState<GameScreen>("puzzle");

  const [artifactPreviousScreen, setArtifactPreviousScreen] =
    useState<GameScreen>("artifacts");

  const fallbackChapter = mysteriumGame.chapters[0];

  const currentChapter =
    mysteriumGame.chapters[gameState.currentChapterIndex] ??
    fallbackChapter;

  const currentScene =
    currentChapter.scenes[gameState.currentSceneIndex] ??
    currentChapter.scenes[0];

  const totalArtifacts = countChapterArtifacts(currentChapter);

  const sceneCodeItemId = getSceneCodeItemId(currentScene);

  const sceneCodeItem = sceneCodeItemId
    ? getCodeItemInfo(currentChapter, gameState, sceneCodeItemId)
    : null;

  const inspectedItem = inspectedItemId
    ? getCodeItemInfo(currentChapter, gameState, inspectedItemId)
    : null;

  function findCodeDigit(itemId: string, revealed: boolean) {
    setGameState((currentState) =>
      markCodeDigitFound(currentState, itemId, { revealed })
    );
  }

  const ambientScreen: GameScreen = unlockedArtifact
    ? "artifact"
    : gameState.screen;

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [
    gameState.screen,
    gameState.currentChapterIndex,
    gameState.currentSceneIndex,
    gameState.currentActId,
  ]);

  // Uloženú hru s neexistujúcou scénou opraví už načítanie
  // (loadRepairedGameState v useGameEngine), preto tu netreba kontrolu.

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
    setGameState((currentState) => ({
      ...currentState,
      returnScreen: currentState.screen,
      screen: "inventory",
    }));
  }

  function openArtifacts() {
    setGameState((currentState) => ({
      ...currentState,
      returnScreen: currentState.screen,
      screen: "artifacts",
    }));
  }

  function openQuests() {
    setGameState((currentState) => ({
      ...currentState,
      returnScreen: currentState.screen,
      screen: "quests",
    }));
  }

  function closeCollection() {
    setGameState((currentState) => ({
      ...currentState,
      screen: currentState.returnScreen ?? "puzzle",
      returnScreen: undefined,
    }));
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

  function finishActEnding() {
    setGameState((currentState) =>
      completeActEnding(currentChapter, currentState)
    );
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
          totalArtifacts={totalArtifacts}
          scene={currentScene}
          onOpenInventory={openInventory}
          onOpenArtifacts={openArtifacts}
          onOpenQuests={openQuests}
          onChooseNode={chooseDialogueNode}
          onApplyChoiceActions={(choice) => {
            setGameState((currentState) =>
              applyDialogueChoiceActions(
                currentState,
                choice,
                currentChapter.quests
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
          onBack={closeCollection}
          onOpenArtifact={openArtifact}
          onInspectItem={setInspectedItemId}
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
          totalArtifacts={totalArtifacts}
          scene={currentScene}
          onOpenInventory={openInventory}
          onOpenArtifacts={openArtifacts}
          onOpenQuests={openQuests}
          onOpenNpcDialogue={openNpcDialogue}
          onReadDetectiveNote={(flagId) => {
            setGameState((currentState) => ({
              ...currentState,
              flags: {
                ...currentState.flags,
                [flagId]: true,
              },
            }));
          }}
          onRevealHint={() => {
            setGameState((currentState) =>
              revealHint(currentState, currentScene)
            );
          }}
          onSolved={() => {
            setGameState((currentState) => {
              const nextState = solvePuzzle(
                currentState,
                currentScene,
                currentChapter.quests
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
                setUnlockedArtifact(newlyUnlockedArtifact);
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
          totalArtifacts={totalArtifacts}
          codeItem={sceneCodeItem}
          onInspectItem={setInspectedItemId}
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

    const actTransition =
      gameState.screen === "actTransition"
        ? getActTransition(currentChapter, gameState)
        : null;

    if (gameState.screen === "actTransition" && actTransition) {
      return (
        <ActTransitionScreen
          completedActTitle={actTransition.completedAct.title}
          nextActTitle={actTransition.nextAct?.title ?? ""}
          evidenceCount={actTransition.evidenceCount}
          ending={actTransition.completedAct.ending}
          keyPieceNotches={getActLockEvidence(
            currentChapter,
            actTransition.completedAct
          )
            .filter((item) => item.inspect?.art === "keyTooth")
            .sort(
              (first, second) =>
                (first.inspect?.artPart ?? 0) - (second.inspect?.artPart ?? 0)
            )
            .map((item) => item.inspect?.countPoints)}
          onContinue={finishActEnding}
        />
      );
    }

    if (gameState.screen === "finaleGuardian" && currentChapter.finale) {
      return (
        <GameLayout
          gameState={gameState}
          totalArtifacts={totalArtifacts}
          onOpenInventory={openInventory}
          onOpenArtifacts={openArtifacts}
          onOpenQuests={openQuests}
        >
          <FinaleGuardianScreen
            guardian={currentChapter.finale.guardian}
            onContinue={() =>
              setGameState((currentState) =>
                leaveFinaleGuardian(currentChapter, currentState)
              )
            }
          />
        </GameLayout>
      );
    }

    if (gameState.screen === "finaleChest" && currentChapter.finale) {
      return (
        <GameLayout
          gameState={gameState}
          totalArtifacts={totalArtifacts}
          onOpenInventory={openInventory}
          onOpenArtifacts={openArtifacts}
          onOpenQuests={openQuests}
        >
          <FinaleChestScreen
            chapter={currentChapter}
            gameState={gameState}
            onUnlock={(actId, digits) => {
              const unlock = unlockFinaleLock(
                currentChapter,
                gameState,
                actId,
                digits
              );

              if (unlock.gameState !== gameState) {
                setGameState(unlock.gameState);
              }

              return unlock.result;
            }}
            onOpenChest={() =>
              setGameState(
                (currentState) =>
                  openFinaleChest(
                    currentChapter,
                    insertFinaleKey(currentChapter, currentState).gameState
                  ).gameState
              )
            }
            onContinue={() =>
              setGameState((currentState) =>
                leaveFinaleChest(currentChapter, currentState)
              )
            }
            onInspectItem={setInspectedItemId}
          />
        </GameLayout>
      );
    }

    if (gameState.screen === "finalePhoto" && currentChapter.finale) {
      return (
        <GameLayout
          gameState={gameState}
          totalArtifacts={totalArtifacts}
          onOpenInventory={openInventory}
          onOpenArtifacts={openArtifacts}
          onOpenQuests={openQuests}
        >
          <FinalePhotoScreen
            photo={currentChapter.finale.photo}
            ownedFragmentIds={gameState.inventory.map((item) => item.id)}
            isAssembled={Boolean(
              gameState.flags[FINALE_PHOTO_ASSEMBLED_FLAG]
            )}
            onAssembled={() =>
              setGameState((currentState) =>
                markFinalePhotoAssembled(currentChapter, currentState)
              )
            }
            onContinue={() =>
              setGameState((currentState) =>
                leaveFinalePhoto(currentChapter, currentState)
              )
            }
          />
        </GameLayout>
      );
    }

    if (gameState.screen === "finalePlace" && currentChapter.finale) {
      return (
        <GameLayout
          gameState={gameState}
          totalArtifacts={totalArtifacts}
          onOpenInventory={openInventory}
          onOpenArtifacts={openArtifacts}
          onOpenQuests={openQuests}
        >
          <FinalePlaceScreen
            finale={currentChapter.finale}
            ownedFragmentIds={gameState.inventory.map((item) => item.id)}
            isSolved={Boolean(gameState.flags[FINALE_PLACE_SOLVED_FLAG])}
            onSubmit={(answer) => {
              const result = submitFinalePlace(
                currentChapter,
                gameState,
                answer
              );

              if (result.gameState !== gameState) {
                setGameState(result.gameState);
              }

              return result.isCorrect;
            }}
            onFinish={() =>
              setGameState((currentState) =>
                leaveFinalePlace(currentChapter, currentState)
              )
            }
          />
        </GameLayout>
      );
    }

    // Inventár, zápisník kódov a Artefakty ostávajú dostupné aj po konci kapitoly.
    if (gameState.screen === "finish") {
      return (
        <GameLayout
          gameState={gameState}
          totalArtifacts={totalArtifacts}
          onOpenInventory={openInventory}
          onOpenArtifacts={openArtifacts}
          onOpenQuests={openQuests}
        >
          {currentChapter.finale && (
            <FinishScreen
              finale={currentChapter.finale}
              score={gameState.score}
              ownedFragmentIds={gameState.inventory.map((item) => item.id)}
              hasSeenPhoto={Boolean(gameState.flags[FINALE_PHOTO_SEEN_FLAG])}
              isPlaceSolved={Boolean(gameState.flags[FINALE_PLACE_SOLVED_FLAG])}
              onRestart={startNewGame}
            />
          )}
        </GameLayout>
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
          onBack={closeCollection}
          onOpenArtifact={openArtifact}
          onInspectItem={setInspectedItemId}
        />
      );
    }

    return (
      <LandingScreen
        hasSavedProgress={hasSavedProgress}
        onContinueGame={continueSavedGame}
        onStartNewGame={startNewGame}
      />
    );
  }

  return (
    <>
      <CityAmbient currentScreen={ambientScreen} />
      {renderCurrentScreen()}

      {inspectedItem && (
        <ItemInspector
          info={inspectedItem}
          onFound={() => findCodeDigit(inspectedItem.item.id, false)}
          onReveal={() => findCodeDigit(inspectedItem.item.id, true)}
          onClose={() => setInspectedItemId(null)}
        />
      )}
    </>
  );
}