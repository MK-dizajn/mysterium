"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { UnlockCode } from "../../types/game";
import { findUnlockCode } from "../../engine";
import { ActionButton } from "../ui/ActionButton";
import { ConfirmDialog } from "../ui/ConfirmDialog";

type UnlockCodeScreenProps = {
  codes: UnlockCode[];
  hasSavedProgress: boolean;
  /** Názov odomknutej časti pre potvrdenie a oznam (napríklad „Akt II – Moc a poznanie“). */
  getTargetTitle: (code: UnlockCode) => string;
  onUnlock: (code: UnlockCode) => void;
  onBack: () => void;
  /** Texty pri kóde konkrétnej kapitoly (z menu kapitol); inak všeobecné „Mám kód“. */
  context?: { eyebrow: string; title: string; text: string };
};

/** Ako dlho ostane oznam „Odomknuté: …“, kým hra prejde na „Vydaj sa k …“. */
const UNLOCKED_NOTICE_MS = 1600;

/**
 * „Mám kód“: hráč vloží kód, ktorý odomkne časť hry. Kód sa porovná iba
 * s odtlačkami (engine/unlockCodes.ts). Pri uloženej hre sa najprv opýta.
 */
export function UnlockCodeScreen({
  codes,
  hasSavedProgress,
  getTargetTitle,
  onUnlock,
  onBack,
  context,
}: UnlockCodeScreenProps) {
  const inputId = useId();
  const errorId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [pendingCode, setPendingCode] = useState<UnlockCode | null>(null);
  const [unlockedCode, setUnlockedCode] = useState<UnlockCode | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Najnovšia funkcia bez nového odpočítavania pri každom vykreslení.
  const onUnlockRef = useRef(onUnlock);

  useEffect(() => {
    onUnlockRef.current = onUnlock;
  }, [onUnlock]);

  useEffect(() => {
    if (!unlockedCode) {
      return;
    }

    const timer = window.setTimeout(
      () => onUnlockRef.current(unlockedCode),
      UNLOCKED_NOTICE_MS
    );

    return () => window.clearTimeout(timer);
  }, [unlockedCode]);

  function submit(event: FormEvent) {
    event.preventDefault();

    const code = findUnlockCode(value, codes);

    if (!code) {
      setHasError(true);
      inputRef.current?.focus();
      return;
    }

    setHasError(false);

    if (hasSavedProgress) {
      setPendingCode(code);
      return;
    }

    setUnlockedCode(code);
  }

  return (
    <main className="relative min-h-screen bg-[#03050a] px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(217,166,55,0.16),_transparent_45%)]" />

      <section
        aria-labelledby="unlock-code-title"
        className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-sm flex-col justify-center"
      >
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400/80">
          {context?.eyebrow ?? "Odomknúť časť hry"}
        </p>

        <h1
          id="unlock-code-title"
          className="mt-4 text-3xl font-black text-amber-100"
        >
          {context?.title ?? "Máš kód?"}
        </h1>

        <p className="mt-4 text-[15px] leading-normal text-slate-300">
          {context?.text ?? "Kód odomkne časť pátrania, ktorú si už začal inde."}
        </p>

        {unlockedCode ? (
          <p
            role="status"
            className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-4 text-[16px] font-semibold leading-normal text-emerald-100"
          >
            Odomknuté: {getTargetTitle(unlockedCode)}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
            <label
              htmlFor={inputId}
              className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400"
            >
              Kód
            </label>

            <input
              ref={inputRef}
              id={inputId}
              data-unlock-code
              type="text"
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setHasError(false);
              }}
              autoCapitalize="characters"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              className={[
                "min-h-11 w-full rounded-2xl border bg-slate-950 px-4 py-4 text-center text-lg font-bold uppercase tracking-[0.2em] text-white outline-none transition duration-200 motion-reduce:transition-none",
                "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10",
                hasError ? "border-red-400/70" : "border-slate-700",
              ].join(" ")}
            />

            {hasError && (
              <p
                id={errorId}
                role="alert"
                data-unlock-error
                className="text-[15px] leading-normal text-red-200"
              >
                Tento kód nepoznáme. Skontroluj ho a skús znova.
              </p>
            )}

            <ActionButton
              type="submit"
              disabled={!value.trim()}
              className="mt-2 motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              Odomknúť
            </ActionButton>

            <ActionButton
              variant="secondary"
              onClick={onBack}
              className="motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              Späť
            </ActionButton>
          </form>
        )}
      </section>

      {pendingCode && (
        <ConfirmDialog
          title={`Odomknúť ${getTargetTitle(pendingCode)}?`}
          message="Tvoj doterajší postup sa nahradí."
          confirmLabel="Áno, odomknúť"
          onConfirm={() => {
            const code = pendingCode;
            setPendingCode(null);
            setUnlockedCode(code);
          }}
          onCancel={() => setPendingCode(null)}
        />
      )}
    </main>
  );
}
