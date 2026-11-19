"use client";

import { useState } from "react";
import type { MiniGameSpec } from "../../types/game";
import { isDateDialsSolved, stepDateDial } from "../../engine";
import { HAPTIC, vibrate } from "../../lib/haptics";
import { soundManager } from "../../lib/soundManager";
import { ActionButton } from "../ui/ActionButton";

type DateDialsSpec = Extract<MiniGameSpec, { type: "dateDials" }>;

type DateDialsGameProps = {
  spec: DateDialsSpec;
  values: number[];
  onChange: (values: number[]) => void;
  onSolved: () => void;
};

const ARROW_BUTTON =
  "flex h-11 w-full min-w-11 items-center justify-center rounded-xl border border-amber-300/40 bg-slate-900 text-lg text-amber-200 active:scale-95 motion-reduce:active:scale-100";

/**
 * Pečať s tromi číselníkmi (deň, mesiac, rok): hráč nastaví dátum zo skutočnej
 * tabule na mieste a zlomí pečať. Zlý dátum: pečať sa zatrasie, nič sa neuloží.
 */
export function DateDialsGame({ spec, values, onChange, onSolved }: DateDialsGameProps) {
  const [isWrong, setIsWrong] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);

  function step(index: number, delta: 1 | -1) {
    setIsWrong(false);
    soundManager.play("dial-click");
    vibrate(HAPTIC.step);
    onChange(stepDateDial(spec, values, index, delta));
  }

  function submit() {
    if (isDateDialsSolved(spec, values)) {
      onSolved();
      return;
    }

    setIsWrong(true);
    setWrongCount((count) => count + 1);
    soundManager.play("minigame-wrong");
    vibrate(HAPTIC.wrong);
  }

  return (
    <div className="mt-4 w-full">
      <svg viewBox="0 0 120 60" className="mx-auto h-14 w-auto" aria-hidden="true">
        <circle cx="60" cy="30" r="26" fill="#8f1d1d" stroke="#5c0f0f" strokeWidth="3" />
        <circle cx="60" cy="30" r="18" fill="none" stroke="#c0504d" strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="60" y="36" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f3c9a8" fontFamily="Georgia, serif">✦</text>
      </svg>

      <div
        key={wrongCount}
        className={`mt-3 grid grid-cols-3 gap-2 ${isWrong ? "minigame-shake" : ""}`}
      >
        {spec.dials.map((dial, index) => (
          <div key={dial.label} data-dial-index={index} className="flex flex-col items-center gap-2">
            <button
              type="button"
              data-dial-up
              onClick={() => step(index, 1)}
              aria-label={`${dial.label}: o jeden vyššie`}
              className={ARROW_BUTTON}
            >
              ▲
            </button>
            <p
              data-dial-value
              aria-live="polite"
              aria-label={`${dial.label}: ${dial.values[values[index]]}`}
              className="w-full rounded-xl border border-amber-300/30 bg-[#f1e4c3] py-2 font-serif text-2xl font-black text-[#3b2a12]"
            >
              {dial.values[values[index]]}
            </p>
            <button
              type="button"
              data-dial-down
              onClick={() => step(index, -1)}
              aria-label={`${dial.label}: o jeden nižšie`}
              className={ARROW_BUTTON}
            >
              ▼
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400" aria-hidden="true">
              {dial.label}
            </p>
          </div>
        ))}
      </div>

      <div aria-live="polite">
        {isWrong && (
          <p className="mt-3 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-100">
            {spec.wrongText}
          </p>
        )}
      </div>

      <ActionButton onClick={submit} className="mt-4">
        {spec.submitLabel}
      </ActionButton>
    </div>
  );
}
