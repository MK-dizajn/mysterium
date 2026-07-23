"use client";

import { ChestCodePanel } from "../chest/ChestCodePanel";
import {
  CHEST_PAIR_LABELS,
  normalizeChestCode,
} from "../chest/chestUtils";
import { useChestCodeControls } from "../chest/useChestCodeControls";
import { MessageBox } from "../MessageBox";

type ChestCodeFocusProps = {
  codes: string[];
  error?: string;
  onCodeChange: (
    index: number,
    value: string
  ) => void;
  onConfirm: () => void;
};

export function ChestCodeFocus({
  codes,
  error = "",
  onCodeChange,
  onConfirm,
}: ChestCodeFocusProps) {
  const { updateDigit } =
    useChestCodeControls({
      codes,
      onCodeChange,
    });

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="pointer-events-auto relative mx-auto w-full max-w-[17.5rem]">
        <ChestCodePanel
          codes={codes}
          pairLabels={CHEST_PAIR_LABELS}
          isUnlocked={false}
          isLockReleased={false}
          normalizeCode={normalizeChestCode}
          updateDigit={updateDigit}
          onConfirm={onConfirm}
        />

        {error && (
          <div className="mt-3">
            <MessageBox
              variant="danger"
              title="Nesprávna kombinácia"
            >
              {error}
            </MessageBox>
          </div>
        )}
      </div>
    </div>
  );
}