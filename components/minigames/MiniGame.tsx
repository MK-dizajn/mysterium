"use client";

import { useEffect, useState } from "react";
import type { MiniGameSavedState, MiniGameSpec } from "../../types/game";
import { SKIP_PENALTY, createDateDialsState } from "../../engine";
import { soundManager } from "../../lib/soundManager";
import { ActionButton } from "../ui/ActionButton";
import { DateDialsGame } from "./DateDialsGame";
import { SecretCompartment } from "./SecretCompartment";

type MiniGameProps = {
  spec: MiniGameSpec;
  digit: string;
  introId: string;
  savedState?: MiniGameSavedState;
  onStateChange: (state: MiniGameSavedState) => void;
  /** Hra skončila: vyriešená, alebo preskočená (free = bez pokuty pre čítačku). */
  onComplete: (result: { skipped: boolean; free?: boolean }) => void;
};

/** Po koľkých sekundách nečinnosti sa nápoveda sama ponúkne. */
const HINT_OFFER_MS = 30_000;
/** Po koľkých sekundách je „Preskočiť“ dostupné aj bez troch nápovedí. */
const SKIP_AVAILABLE_MS = 120_000;

/**
 * Spoločný rám mini hry: úvod, hracia plocha, nápovedy v troch stupňoch,
 * „Preskočiť“ s pokutou (po troch nápovedách alebo po 2 minútach), tajná
 * schránka na konci. Stav (nápovedy, nastavenie) sa ukladá – po F5 pokračuje.
 */
export function MiniGame({
  spec,
  digit,
  introId,
  savedState,
  onStateChange,
  onComplete,
}: MiniGameProps) {
  const [hintsRead, setHintsRead] = useState(savedState?.hintsRead ?? 0);
  const [values, setValues] = useState<number[]>(
    () => savedState?.values ?? createDateDialsState(spec)
  );
  const [phase, setPhase] = useState<"play" | "confirmSkip" | "opening">("play");
  const [result, setResult] = useState<{ skipped: boolean; free?: boolean }>({ skipped: false });
  const [isHintOffered, setIsHintOffered] = useState(false);
  const [isSkipTimeUp, setIsSkipTimeUp] = useState(false);
  const [activity, setActivity] = useState(0);

  useEffect(() => {
    if (phase !== "play") {
      return;
    }

    const timer = window.setTimeout(() => setIsHintOffered(true), HINT_OFFER_MS);

    return () => window.clearTimeout(timer);
  }, [activity, phase]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsSkipTimeUp(true), SKIP_AVAILABLE_MS);

    return () => window.clearTimeout(timer);
  }, []);

  function save(next: MiniGameSavedState) {
    onStateChange({ hintsRead, values, ...next });
  }

  function registerActivity() {
    setIsHintOffered(false);
    setActivity((count) => count + 1);
  }

  function readHint() {
    const next = Math.min(3, hintsRead + 1);
    setHintsRead(next);
    soundManager.play("hint-open");
    save({ hintsRead: next });
  }

  function finish(nextResult: { skipped: boolean; free?: boolean }) {
    setResult(nextResult);
    setPhase("opening");
  }

  if (phase === "opening") {
    return (
      <SecretCompartment
        digit={digit}
        text={spec.compartment?.openText ?? "Objavil si číslicu."}
        onDone={() => onComplete(result)}
      />
    );
  }

  const canSkip = hintsRead >= 3 || isSkipTimeUp;

  return (
    <div data-minigame className="w-full" onPointerDown={registerActivity} onKeyDown={registerActivity}>
      <p id={introId} className="mt-3 text-sm leading-6 text-slate-300">
        {spec.intro}
      </p>

      {phase === "play" && spec.type === "dateDials" && (
        <DateDialsGame
          spec={spec}
          values={values}
          onChange={(next) => {
            setValues(next);
            save({ values: next });
          }}
          onSolved={() => finish({ skipped: false })}
        />
      )}

      <div aria-live="polite" className="w-full">
        {spec.hints.slice(0, hintsRead).map((hint, index) => (
          <p
            key={hint}
            className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-left text-sm leading-6 text-amber-100"
          >
            <span className="font-bold">Nápoveda {index + 1}: </span>
            {hint}
          </p>
        ))}
        {isHintOffered && hintsRead < 3 && phase === "play" && (
          <p className="mt-3 text-sm italic text-amber-100/80">
            Potrebuješ pomoc? Ťukni na „Nápoveda“.
          </p>
        )}
      </div>

      {phase === "confirmSkip" ? (
        <div role="alertdialog" aria-labelledby="minigame-skip-title" className="mt-4 rounded-2xl border border-amber-300/30 bg-slate-900 p-4">
          <p id="minigame-skip-title" className="font-bold text-amber-100">
            Preskočiť túto hru?
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            {`Číslicu dostaneš, ale strhne sa ${SKIP_PENALTY} bodov.`}
          </p>
          <div className="mt-3 flex flex-col gap-3">
            <ActionButton variant="danger" onClick={() => finish({ skipped: true })}>
              Áno, preskočiť
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => setPhase("play")}>
              Späť k hre
            </ActionButton>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex w-full flex-col gap-3">
          {hintsRead < 3 && (
            <ActionButton
              variant="secondary"
              onClick={readHint}
              className={isHintOffered ? "motion-safe:animate-pulse ring-2 ring-amber-300/60" : ""}
            >
              Nápoveda
            </ActionButton>
          )}
          {canSkip && (
            <ActionButton variant="secondary" onClick={() => setPhase("confirmSkip")}>
              {`Preskočiť (−${SKIP_PENALTY} bodov)`}
            </ActionButton>
          )}
          {spec.accessibleFreeSkip && (
            <button
              type="button"
              data-free-skip
              className="sr-only"
              onClick={() => finish({ skipped: true, free: true })}
            >
              Preskočiť bez pokuty (pre čítačku obrazovky)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
