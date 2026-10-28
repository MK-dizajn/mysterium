"use client";

import { useEffect, useState } from "react";
import type { Game, GameState } from "../types/game";
import {
  createNewGameState,
  loadRepairedGameState,
  saveGameState,
} from "../engine";

export function useGameEngine(game: Game) {
  const [gameState, setGameState] = useState<GameState>(
    createNewGameState()
  );

  const [savedGameState, setSavedGameState] =
    useState<GameState | null>(null);

  const [hasSavedProgress, setHasSavedProgress] =
    useState(false);

  useEffect(() => {
    const savedProgress = loadRepairedGameState(game);

    if (!savedProgress) {
      setSavedGameState(null);
      setHasSavedProgress(false);
      return;
    }

    setSavedGameState(savedProgress);
    setHasSavedProgress(true);
  }, [game]);

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
    // Pre menu kapitol (stav dlaždice: rozohraná, dokončená).
    savedGameState,
  };
}