"use client";

import { ChestBody } from "./ChestBody";
import { ChestCodePanel } from "./ChestCodePanel";
import { ChestRewardButton } from "./ChestRewardButton";
import { ChestStage } from "./ChestStage";
import { ChestVisual } from "./ChestVisual";
import {
  CHEST_FRAGMENT_CLASSES,
  CHEST_PAIR_LABELS,
  normalizeChestCode,
} from "./chestUtils";
import { useChestCodeControls } from "./useChestCodeControls";
import { useChestUnlockSequence } from "./useChestUnlockSequence";

type ChestProps = {
  codes: string[];
  isUnlocked?: boolean;
  onCodeChange: (
    index: number,
    value: string
  ) => void;
  onRewardClick?: () => void;
};

export function Chest({
  codes,
  isUnlocked = false,
  onCodeChange,
  onRewardClick,
}: ChestProps) {
  const {
    isLockReleased,
    isLidOpen,
    isLightVisible,
    areFragmentsVisible,
  } = useChestUnlockSequence(isUnlocked);

  const { updateDigit } =
    useChestCodeControls({
      codes,
      onCodeChange,
    });

  return (
    <ChestStage isUnlocked={isUnlocked}>
      <ChestVisual
        isLidOpen={isLidOpen}
        isLightVisible={isLightVisible}
        areFragmentsVisible={
          areFragmentsVisible
        }
        fragmentClasses={
          CHEST_FRAGMENT_CLASSES
        }
        onRewardClick={onRewardClick}
      />

      <ChestBody
        isLidOpen={isLidOpen}
        isLightVisible={isLightVisible}
      >
        <ChestCodePanel
          codes={codes}
          pairLabels={CHEST_PAIR_LABELS}
          isUnlocked={isUnlocked}
          isLockReleased={isLockReleased}
          normalizeCode={normalizeChestCode}
          updateDigit={updateDigit}
        />
      </ChestBody>

      <ChestRewardButton
        isVisible={areFragmentsVisible}
        onClick={onRewardClick}
      />
    </ChestStage>
  );
}