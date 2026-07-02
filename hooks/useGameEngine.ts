"use client";

import { useEffect, useState } from "react";
import type { GameState } from "../types/game";
import {
  createNewGameState,
  loadGameState,
  saveGameState,
} from "../engine";

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(createNewGameState());
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

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

  return {
    gameState,
    setGameState,
    hasSavedProgress,
    setHasSavedProgress,
  };
}