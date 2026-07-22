"use client";

import { changeChestDigit } from "./chestUtils";

type UseChestCodeControlsProps = {
  codes: string[];
  onCodeChange: (index: number, value: string) => void;
};

export function useChestCodeControls({
  codes,
  onCodeChange,
}: UseChestCodeControlsProps) {
  function updateDigit(
    codeIndex: number,
    digitIndex: number,
    digit: number
  ) {
    const nextCode = changeChestDigit(
      codes,
      codeIndex,
      digitIndex,
      digit
    );

    onCodeChange(codeIndex, nextCode);
  }

  return {
    updateDigit,
  };
}