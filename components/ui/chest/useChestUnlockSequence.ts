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

    const lockTimer = window.setTimeout(() => {
      setIsLockReleased(true);
      soundManager.play("chest-unlock");
    }, 250);

    const lidTimer = window.setTimeout(() => {
      setIsLidOpen(true);
      soundManager.play("artifact-unlock");
    }, 700);

    const lightTimer = window.setTimeout(() => {
      setIsLightVisible(true);
    }, 1050);

    const fragmentsTimer = window.setTimeout(() => {
      setAreFragmentsVisible(true);
    }, 1450);

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