"use client";

import { ChestDial } from "./ChestDial";

type ChestCodeProps = {
  value: string;
  label: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function normalizeCode(value: string) {
  return value.replace(/\D/g, "").padStart(2, "0").slice(-2);
}

export function ChestCode({
  value,
  label,
  disabled = false,
  onChange,
}: ChestCodeProps) {
  const normalizedValue = normalizeCode(value);

  const firstDigit = Number(normalizedValue[0]);
  const secondDigit = Number(normalizedValue[1]);

  function updateDigit(
    position: "first" | "second",
    digit: number
  ) {
    const nextValue =
      position === "first"
        ? `${digit}${secondDigit}`
        : `${firstDigit}${digit}`;

    onChange(nextValue);
  }

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="relative flex gap-1">
        <ChestDial
          value={firstDigit}
          disabled={disabled}
          onChange={(digit) =>
            updateDigit("first", digit)
          }
        />

        <ChestDial
          value={secondDigit}
          disabled={disabled}
          onChange={(digit) =>
            updateDigit("second", digit)
          }
        />

        <div className="pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-amber-100/15" />
      </div>

      <p className="mt-2 text-center font-serif text-[0.65rem] font-black uppercase tracking-[0.2em] text-amber-200/60 sm:text-xs">
        {label}
      </p>
    </div>
  );
}