"use client";

import { useEffect, useState } from "react";
import { soundManager } from "../../../lib/soundManager";

type ChestUnlockSequence = {
  isLockReleased: boolean;
  isLidOpen: boolean;
  isLightVisible: boolean;
  areFragmentsVisible: boolean;
};

export function useChestUnlockSequence(
  isUnlocked: boolean
): ChestUnlockSequence {
  const [isLockReleased, setIsLockReleased] =
    useState(false);

  const [isLidOpen, setIsLidOpen] =
    useState(false);

  const [isLightVisible, setIsLightVisible] =
    useState(false);

  const [areFragmentsVisible, setAreFragmentsVisible] =
    useState(false);

  useEffect(() => {
    if (!isUnlocked) {
      setIsLockReleased(false);
      setIsLidOpen(false);
      setIsLightVisible(false);
      setAreFragmentsVisible(false);

      return;
    }

    /*
      Filmová sekvencia

      0 ms      - správny kód
      320 ms    - mechanické odomknutie
      780 ms    - začiatok pohybu veka
      1080 ms   - prvé svetlo z vnútra
      1680 ms   - fotografia
    */

    const lockTimer = window.setTimeout(() => {
      setIsLockReleased(true);
      soundManager.play("chest-unlock");
    }, 320);

    const lidTimer = window.setTimeout(() => {
      setIsLidOpen(true);
      soundManager.play("artifact-unlock");
    }, 780);

    const lightTimer = window.setTimeout(() => {
      setIsLightVisible(true);
    }, 1080);

    const fragmentsTimer = window.setTimeout(() => {
      setAreFragmentsVisible(true);
    }, 1680);

    return () => {
      window.clearTimeout(lockTimer);
      window.clearTimeout(lidTimer);
      window.clearTimeout(lightTimer);
      window.clearTimeout(fragmentsTimer);
    };
  }, [isUnlocked]);

  return {
    isLockReleased,
    isLidOpen,
    isLightVisible,
    areFragmentsVisible,
  };
}