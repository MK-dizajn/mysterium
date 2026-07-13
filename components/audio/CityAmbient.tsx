"use client";

import { useEffect } from "react";
import type { GameScreen } from "../../types/game";
import { soundManager } from "../../lib/soundManager";

type CityAmbientProps = {
  currentScreen: GameScreen;
};

export function CityAmbient({
  currentScreen,
}: CityAmbientProps) {
  useEffect(() => {
    const shouldPlayAmbient =
      currentScreen !== "landing" &&
      currentScreen !== "artifact" &&
      currentScreen !== "npc";

    if (shouldPlayAmbient) {
      soundManager.play("city-ambient");
    } else {
      soundManager.stop("city-ambient");
    }

    return () => {
      soundManager.stop("city-ambient");
    };
  }, [currentScreen]);

  return null;
}