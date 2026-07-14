"use client";

import { useEffect } from "react";
import type { GameScreen } from "../../types/game";
import {
  SOUND_SETTING_EVENT,
  soundManager,
} from "../../lib/soundManager";

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

    function updateAmbient() {
      if (
        shouldPlayAmbient &&
        !soundManager.isMuted()
      ) {
        soundManager.fadeIn(
          "city-ambient",
          1800
        );
      } else {
        soundManager.fadeOut(
          "city-ambient",
          900
        );
      }
    }

    updateAmbient();

    window.addEventListener(
      SOUND_SETTING_EVENT,
      updateAmbient
    );

    return () => {
      window.removeEventListener(
        SOUND_SETTING_EVENT,
        updateAmbient
      );

      soundManager.fadeOut(
        "city-ambient",
        900
      );
    };
  }, [currentScreen]);

  return null;
}