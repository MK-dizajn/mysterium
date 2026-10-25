"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  FINALE_CHEST_OPENED_FLAG,
  FINALE_KEY_INSERTED_FLAG,
  getCodeNotebook,
  getFinaleLocks,
  type UnlockFinaleLockResult,
} from "../../engine";
import { soundManager } from "../../lib/soundManager";
import type { ActId, Chapter, GameState } from "../../types/game";
import { getGoldenKeySvg } from "../items/art/keyToothArt";
import { InspectErrorBoundary } from "../items/InspectErrorBoundary";
import { canUse3D } from "../items/supportsWebGL";
import { useReducedMotion } from "../items/useReducedMotion";
import { ActionButton } from "../ui/ActionButton";
import { ChestBody } from "../ui/chest/ChestBody";
import { ChestDial } from "../ui/chest/ChestDial";
import { ChestInnerLight } from "../ui/chest/ChestInnerLight";
import { ChestLid } from "../ui/chest/ChestLid";
import { ChestLightEffects } from "../ui/chest/ChestLightEffects";
import { ChestMist } from "../ui/chest/ChestMist";
import { ChestParticles } from "../ui/chest/ChestParticles";
import { ChestStage } from "../ui/chest/ChestStage";
import { CodeNotebook } from "../ui/CodeNotebook";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";

type FinaleChestScreenProps = {
  chapter: Chapter;
  gameState: GameState;
  /** Skúsi kód zámku; kontrola je iba v engine (engine/finale.ts). */
  onUnlock: (actId: ActId, digits: string[]) => UnlockFinaleLockResult;
  /** Vloží Zlatý kľúč a otvorí veko (štvrtý útržok sa pridá iba raz). */
  onOpenChest: () => void;
  onContinue: () => void;
  onInspectItem: (itemId: string) => void;
};

/** Zasunutie kľúča, potom otvorenie veka a nakoniec útržok (ms). */
const KEY_INSERT_MS = 700;
const LID_OPEN_MS = 1500;

type Sequence = "idle" | "inserting" | "opening" | "done";

/** 3D truhlica sa stiahne až pri vstupe na obrazovku truhlice. */
const Chest3DView = dynamic(() => import("../finale/chest3d/Chest3DView"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full rounded-2xl bg-amber-200/5 motion-safe:animate-pulse"
    />
  ),
});

const STILL_BUTTON = "motion-reduce:transition-none motion-reduce:active:scale-100";

export function FinaleChestScreen({
  chapter,
  gameState,
  onUnlock,
  onOpenChest,
  onContinue,
  onInspectItem,
}: FinaleChestScreenProps) {
  const chest = chapter.finale?.chest;
  const reducedMotion = useReducedMotion();
  const isChestOpened = Boolean(gameState.flags[FINALE_CHEST_OPENED_FLAG]);
  const isKeyInserted = Boolean(gameState.flags[FINALE_KEY_INSERTED_FLAG]);
  const [sequence, setSequence] = useState<Sequence>(
    isChestOpened ? "done" : "idle"
  );
  const [digits, setDigits] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<"wrong" | "opened" | null>(null);
  // 3D, ak to prehliadač zvládne a nie je ?bez3d; pri chybe WebGL 2D záloha.
  const [mode, setMode] = useState<"3d" | "2d">(() =>
    canUse3D() ? "3d" : "2d"
  );
  const [selectedLockIndex, setSelectedLockIndex] = useState<number | null>(null);
  // Priblížený zámok v 3D – pod obrázkom je vtedy pokyn ku kolieskam.
  const [isZoomed, setIsZoomed] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(
    () => () => timersRef.current.forEach((timer) => window.clearTimeout(timer)),
    []
  );

  if (!chest) {
    return null;
  }

  const locks = getFinaleLocks(chapter, gameState);
  const areAllLocksOpen = locks.length > 0 && locks.every((lock) => lock.isOpen);
  const isKeyVisible = sequence !== "idle" || isKeyInserted;
  const isLidOpen = sequence === "opening" || sequence === "done";
  const isRewardVisible = sequence === "done" && isChestOpened;

  function getDigits(actId: ActId, length: number) {
    return digits[actId] ?? Array.from({ length }, () => "0");
  }

  function changeDigit(actId: ActId, length: number, index: number, value: number) {
    const next = [...getDigits(actId, length)];
    next[index] = String(value);
    setDigits((current) => ({ ...current, [actId]: next }));
    setMessage(null);
  }

  /** Koliesko v 3D: o delta ďalej (z aktuálneho stavu, aj pri rýchlom ťahaní). */
  function stepDigit(actId: ActId, length: number, index: number, delta: number) {
    setDigits((current) => {
      const next = [...(current[actId] ?? Array.from({ length }, () => "0"))];
      next[index] = String((((Number(next[index]) + delta) % 10) + 10) % 10);

      return { ...current, [actId]: next };
    });
    setMessage(null);
  }

  /**
   * Skúsi kód. Pri 3D sa hláška o otvorení ukáže až po oddialení pohľadu
   * (showOpenedMessage = false), zlý kód hneď.
   */
  function tryUnlock(actId: ActId, length: number, showOpenedMessage = true) {
    const result = onUnlock(actId, getDigits(actId, length));

    if (result === "opened") {
      soundManager.play("chest-unlock");
      setMessage(showOpenedMessage ? "opened" : null);
    } else if (result === "wrong") {
      setMessage("wrong");
    }

    return result;
  }

  function insertKey() {
    setMessage(null);
    onOpenChest();

    if (reducedMotion) {
      setSequence("done");
      return;
    }

    setSequence("inserting");
    timersRef.current.push(
      window.setTimeout(() => {
        setSequence("opening");
        soundManager.play("artifact-unlock");
      }, KEY_INSERT_MS),
      window.setTimeout(() => setSequence("done"), KEY_INSERT_MS + LID_OPEN_MS)
    );
  }

  /* Zámky v poradí I, II, III (2D ovládanie, pri 3D v rozbaľovacom bloku). */
  const lockRows = locks.map((lock, lockIndex) => {
    const lockDigits = getDigits(lock.actId, lock.code.length);

    return (
      <div
        key={lock.actId}
        role="group"
        aria-label={`Zámok ${lock.lockLabel} – ${
          lock.isOpen
            ? chest.lockOpenLabel
            : lock.isNext
              ? chest.lockNextLabel
              : chest.lockClosedLabel
        }`}
        className={`rounded-2xl border p-4 ${
          lock.isOpen
            ? "border-emerald-300/40 bg-emerald-400/5"
            : lock.isNext
              ? "border-amber-300/40 bg-amber-400/5"
              : "border-slate-700 bg-slate-950/60 opacity-60"
        } ${
          // Zámok vybraný ťuknutím v 3D truhlici.
          selectedLockIndex === lockIndex ? "ring-4 ring-amber-200/70" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-[0.15em] text-amber-200">
            Zámok {lock.lockLabel}
          </p>

          <div className="flex gap-1.5">
            {lock.isOpen
              ? lock.code.map((_, index) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    className="flex h-[136px] w-11 items-center justify-center rounded-md border border-emerald-300/40 bg-emerald-400/10 text-xl text-emerald-200"
                  >
                    ✓
                  </span>
                ))
              : lockDigits.map((digit, index) => (
                  <ChestDial
                    key={index}
                    value={Number(digit)}
                    label={`Zámok ${lock.lockLabel}, číslica ${index + 1}`}
                    disabled={!lock.isNext}
                    onChange={(value) =>
                      changeDigit(lock.actId, lock.code.length, index, value)
                    }
                  />
                ))}
          </div>
        </div>

        {lock.isNext && (
          <div className="mt-4">
            <ActionButton
              onClick={() => tryUnlock(lock.actId, lock.code.length)}
              className={STILL_BUTTON}
            >
              {chest.unlockLabel}
            </ActionButton>
          </div>
        )}
      </div>
    );
  });

  const messages = (
    <div aria-live="polite" className="mt-4">
      {message === "wrong" && (
        <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[15px] leading-6 text-red-100">
          {chest.wrongCodeText}
        </p>
      )}

      {message === "opened" && (
        <p className="rounded-2xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-[15px] leading-6 text-emerald-100">
          {areAllLocksOpen ? chest.lastLockOpenedText : chest.lockOpenedText}
        </p>
      )}

      {isRewardVisible && (
        <p className="rounded-2xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-[15px] leading-6 text-amber-100">
          {chest.openedText}
        </p>
      )}
    </div>
  );

  return (
    <ScreenContainer>
      <div className="mx-auto w-full max-w-md pb-8">
        <header className="px-1 text-center">
          <h1 className="text-3xl font-black text-amber-100">{chest.title}</h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
          <p className="mt-4 text-[16px] leading-7 text-slate-300">{chest.intro}</p>
        </header>

        {mode === "3d" ? (
          <div className="mt-8">
            <div className="aspect-[4/3] w-full">
              <InspectErrorBoundary onError={() => setMode("2d")}>
                <Chest3DView
                  locks={locks}
                  lockDigits={locks.map((lock) =>
                    getDigits(lock.actId, lock.code.length).map(Number)
                  )}
                  stateLabels={{
                    open: chest.lockOpenLabel,
                    closed: chest.lockClosedLabel,
                    next: chest.lockNextLabel,
                  }}
                  texts={{
                    backLabel: chest.backLabel,
                    unlockLabel: chest.unlockLabel,
                    dialWheelLabel: chest.dialWheelLabel,
                  }}
                  selectedIndex={selectedLockIndex}
                  onSelectLock={setSelectedLockIndex}
                  onStepDigit={(lockIndex, digitIndex, delta) => {
                    const lock = locks[lockIndex];
                    stepDigit(lock.actId, lock.code.length, digitIndex, delta);
                  }}
                  onUnlockLock={(lockIndex) => {
                    const lock = locks[lockIndex];
                    return tryUnlock(lock.actId, lock.code.length, false);
                  }}
                  onUnlockSettled={() => setMessage("opened")}
                  onZoomChange={setIsZoomed}
                  isKeyInserted={isKeyVisible}
                  isLidOpen={isLidOpen}
                  reducedMotion={reducedMotion}
                  onFailure={() => setMode("2d")}
                />
              </InspectErrorBoundary>
            </div>
            <p className="mt-3 text-center text-[15px] leading-6 text-slate-400">
              {isZoomed ? chest.dialHint : chest.rotateHint}
            </p>

            {messages}

            {/* 2D ovládanie pre klávesnicu a čítačku – zbalené, vždy po ruke. */}
            {!isChestOpened && (
              <details className="group mt-6 rounded-2xl border border-slate-700 bg-slate-950/60">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold text-slate-200 outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 [&::-webkit-details-marker]:hidden">
                  {chest.accessibleControlsTitle}
                  <span
                    aria-hidden="true"
                    className="text-amber-200 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  >
                    ▾
                  </span>
                </summary>
                <div className="space-y-4 px-3 pb-4">{lockRows}</div>
              </details>
            )}
          </div>
        ) : (
        /* Truhlica (2D záloha) – pri vypnutých animáciách sa nič nehýbe (globals.css). */
        <div className="finale-chest relative mt-8">
          <ChestStage isUnlocked={isLidOpen}>
            <ChestLid isLidOpen={isLidOpen} />

            {!reducedMotion && (
              <>
                <ChestMist isLightVisible={isLidOpen} />
                <ChestInnerLight isLightVisible={isLidOpen} />
                <ChestLightEffects isLightVisible={isLidOpen} />
                <ChestParticles isLightVisible={isLidOpen} />
              </>
            )}

            <ChestBody isLidOpen={isLidOpen} isLightVisible={isLidOpen}>
              <div className="flex items-end justify-center gap-3" aria-hidden="true">
                {locks.map((lock) => (
                  <div
                    key={lock.actId}
                    className={`flex h-16 w-14 flex-col items-center justify-center rounded-lg border font-serif text-xs font-black ${
                      lock.isOpen
                        ? "border-emerald-300/50 bg-emerald-400/10 text-emerald-200"
                        : "border-amber-300/30 bg-black/40 text-amber-200/80"
                    }`}
                  >
                    <span className="text-lg">{lock.isOpen ? "🔓" : "🔒"}</span>
                    <span>{lock.lockLabel}</span>
                  </div>
                ))}
              </div>

              {/* Kľúčová dierka v strede; Zlatý kľúč sa do nej zasunie. */}
              <div className="relative mx-auto mt-3 h-10 w-full overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-1/2 h-6 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_0_3px_rgba(180,120,40,0.6)]" />
                <div
                  className={`absolute right-[calc(50%-4px)] top-1/2 w-32 -translate-y-1/2 transition-[transform,opacity] duration-700 ease-out [&_svg]:h-auto [&_svg]:w-full ${
                    isKeyVisible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-24 opacity-0"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: getGoldenKeySvg({
                      idPrefix: "chest-key",
                      pieceNotches: [],
                    }),
                  }}
                />
              </div>
            </ChestBody>
          </ChestStage>
        </div>
        )}

        {/* Pri 2D zálohe sú zámky a hlášky stále viditeľné pod truhlicou. */}
        {mode === "2d" && (
          <>
            {!isChestOpened && <div className="mt-8 space-y-4">{lockRows}</div>}
            {messages}
          </>
        )}

        {areAllLocksOpen && !isKeyInserted && sequence === "idle" && (
          <div className="mt-6">
            <ActionButton onClick={insertKey} className={STILL_BUTTON}>
              {chest.insertKeyLabel}
            </ActionButton>
          </div>
        )}

        {isRewardVisible && (
          <div className="mt-6 space-y-5">
            <SectionCard
              icon={
                <span className="text-3xl" aria-hidden="true">
                  {chest.reward.icon}
                </span>
              }
              title={chest.reward.title}
            >
              <p className="text-sm leading-relaxed text-slate-300">
                {chest.reward.description}
              </p>
            </SectionCard>

            <ActionButton onClick={onContinue} className={STILL_BUTTON}>
              {chest.continueLabel}
            </ActionButton>
          </div>
        )}

        {/* Zápisník kódov priamo pri truhlici – hráč nemusí odchádzať. */}
        {!isChestOpened && (
          <div className="mt-8">
            <CodeNotebook
              locks={getCodeNotebook(chapter, gameState)}
              onInspectItem={onInspectItem}
            />
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
