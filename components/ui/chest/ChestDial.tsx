"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type ChestDialProps = {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

type Direction = "up" | "down" | null;

function normalizeDigit(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return ((Math.round(value) % 10) + 10) % 10;
}

export function ChestDial({
  value,
  disabled = false,
  onChange,
}: ChestDialProps) {
  const initialValue = normalizeDigit(value);

  const [localValue, setLocalValue] =
    useState(initialValue);
  const [direction, setDirection] =
    useState<Direction>(null);

  const valueRef = useRef(initialValue);
  const animationTimerRef =
    useRef<number | null>(null);

  /*
   * Hodnotu z rodiča synchronizujeme iba vtedy,
   * keď je číselník uzamknutý.
   *
   * Počas zadávania kódu nesmie oneskorený render
   * rodiča prepísať čerstvé kliknutie hráča.
   */
  useEffect(() => {
    if (!disabled) {
      return;
    }

    const nextValue = normalizeDigit(value);

    valueRef.current = nextValue;
    setLocalValue(nextValue);
  }, [disabled, value]);

  useEffect(() => {
    return () => {
      if (animationTimerRef.current !== null) {
        window.clearTimeout(
          animationTimerRef.current
        );
      }
    };
  }, []);

  function showDirection(nextDirection: Direction) {
    setDirection(nextDirection);

    if (animationTimerRef.current !== null) {
      window.clearTimeout(
        animationTimerRef.current
      );
    }

    animationTimerRef.current =
      window.setTimeout(() => {
        setDirection(null);
      }, 140);
  }

  function changeValue(nextDirection: "up" | "down") {
    if (disabled) {
      return;
    }

    const currentValue = valueRef.current;

    const nextValue =
      nextDirection === "up"
        ? (currentValue + 1) % 10
        : (currentValue + 9) % 10;

    /*
     * Ref aktualizujeme okamžite.
     * Aj veľmi rýchly ďalší klik preto dostane
     * správnu aktuálnu hodnotu.
     */
    valueRef.current = nextValue;
    setLocalValue(nextValue);
    showDirection(nextDirection);

    /*
     * Aktualizácia rodiča prebieha mimo setter callbacku,
     * takže nevznikne React chyba setState-in-render.
     */
    onChange(nextValue);
  }

  return (
    <div className="relative z-20 flex w-10 shrink-0 select-none flex-col items-stretch">
      <button
        type="button"
        disabled={disabled}
        onClick={() => changeValue("up")}
        className="relative z-30 flex min-h-11 w-full touch-manipulation items-center justify-center rounded-t-lg border border-b-0 border-amber-200/30 bg-gradient-to-b from-amber-500/60 via-amber-800/70 to-amber-950 text-sm text-amber-50 shadow-md transition-[transform,filter,opacity] duration-100 hover:brightness-125 active:scale-[0.94] active:brightness-150 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Zvýšiť číslicu"
      >
        <span className="pointer-events-none text-base leading-none">
          ▲
        </span>
      </button>

      <div className="pointer-events-none relative z-20 flex h-16 w-full items-center justify-center overflow-hidden border-x border-amber-200/30 bg-[#080706] shadow-[inset_0_8px_14px_rgba(0,0,0,0.9),inset_0_-8px_14px_rgba(0,0,0,0.9)]">
        <div className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-black to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black to-transparent" />

        <div className="absolute inset-x-1 top-1/2 h-px bg-amber-200/15" />

        <span
          className={`relative font-mono text-3xl font-black text-amber-50 transition-transform duration-100 ${
            direction === "up"
              ? "-translate-y-0.5"
              : direction === "down"
                ? "translate-y-0.5"
                : "translate-y-0"
          }`}
        >
          {localValue}
        </span>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => changeValue("down")}
        className="relative z-30 flex min-h-11 w-full touch-manipulation items-center justify-center rounded-b-lg border border-t-0 border-amber-200/30 bg-gradient-to-t from-amber-500/60 via-amber-800/70 to-amber-950 text-sm text-amber-50 shadow-md transition-[transform,filter,opacity] duration-100 hover:brightness-125 active:scale-[0.94] active:brightness-150 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Znížiť číslicu"
      >
        <span className="pointer-events-none text-base leading-none">
          ▼
        </span>
      </button>
    </div>
  );
}