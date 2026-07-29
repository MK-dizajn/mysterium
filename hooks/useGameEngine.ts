"use client";

import { useEffect, useState } from "react";
import type { GameState } from "../types/game";
import {
  createNewGameState,
  loadGameState,
  saveGameState,
} from "../engine";

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(
    createNewGameState()
  );

  const [savedGameState, setSavedGameState] =
    useState<GameState | null>(null);

  const [hasSavedProgress, setHasSavedProgress] =
    useState(false);

  useEffect(() => {
    const savedProgress = loadGameState();

    if (!savedProgress) {
      setSavedGameState(null);
      setHasSavedProgress(false);
      return;
    }

    setSavedGameState(savedProgress);
    setHasSavedProgress(true);
  }, []);

  useEffect(() => {
    if (gameState.screen === "landing") {
      return;
    }

    saveGameState(gameState);
    setSavedGameState(gameState);
    setHasSavedProgress(true);
  }, [gameState]);

  function continueSavedGame() {
    if (!savedGameState) {
      return;
    }

    setGameState(savedGameState);
  }

  return {
    gameState,
    setGameState,
    hasSavedProgress,
    setHasSavedProgress,
    continueSavedGame,
  };
}