"use client";

import { useState } from "react";
import type { GameState } from "../types/game";
import { createNewGameState } from "../engine";

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState>(createNewGameState());

  return {
    gameState,
    setGameState,
  };
}