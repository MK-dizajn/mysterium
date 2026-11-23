"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FINALE_CHEST_OPENED_FLAG,
  FINALE_KEY_INSERTED_FLAG,
  formatSceneList,
  getCodeNotebook,
  getFinaleLockHint,
  getFinaleLocks,
  type UnlockFinaleLockResult,
} from "../../engine";
import { HAPTIC, vibrate } from "../../lib/haptics";
import { soundManager } from "../../lib/soundManager";
import type { ActId, Chapter, GameState } from "../../types/game";
import { Chest2DView } from "../finale/chest2d/Chest2DView";
import {
  LOCK_DIAL_CLICK_SEC,
  LOCK_GLINT_SEC,
  LOCK_SPRING_SEC,
  OPENING_SOUND_SEC,
} from "../finale/chest3d/chestZoom";
import { InspectErrorBoundary } from "../items/InspectErrorBoundary";
import { canUse3D } from "../items/supportsWebGL";
import { useReducedMotion } from "../items/useReducedMotion";
import { ActionButton } from "../ui/ActionButton";
import { ChestDial } from "../ui/chest/ChestDial";
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

type Sequence = "idle" | "inserting" | "done";

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
  // Zlé pokusy pri každom zámku (nápoveda po 2 a 4 pokusoch, bez straty bodov).
  const [wrongAttempts, setWrongAttempts] = useState<Partial<Record<ActId, number>>>({});
  // 3D, ak to prehliadač zvládne a nie je ?bez3d; pri chybe WebGL 2D záloha.
  const [mode, setMode] = useState<"3d" | "2d">(() =>
    canUse3D() ? "3d" : "2d"
  );
  const [selectedLockIndex, setSelectedLockIndex] = useState<number | null>(null);
  // Priblížený zámok v 3D – pod obrázkom je vtedy pokyn ku kolieskam.
  const [isZoomed, setIsZoomed] = useState(false);
  // 2D: zlý kód zatrasie zámok; „Vložiť Zlatý kľúč“ až po povolení spôn.
  const [wrongPulse, setWrongPulse] = useState<{ lockIndex: number; count: number } | null>(null);
  const [haspsReleased, setHaspsReleased] = useState(false);
  const handleHaspsReleased = useCallback(() => setHaspsReleased(true), []);
  const handleOpenSettled = useCallback(() => setSequence("done"), []);
  const timersRef = useRef<number[]>([]);
  const hasInsertedKeyRef = useRef(false);

  useEffect(
    () => () => timersRef.current.forEach((timer) => window.clearTimeout(timer)),
    []
  );

  if (!chest) {
    return null;
  }

  const locks = getFinaleLocks(chapter, gameState);
  const areAllLocksOpen = locks.length > 0 && locks.every((lock) => lock.isOpen);
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
      playUnlockFeedback();
      setMessage(showOpenedMessage ? "opened" : null);
    } else if (result === "wrong") {
      soundManager.play("chest-lock-wrong");
      vibrate(HAPTIC.wrong);
      setWrongAttempts((current) => ({ ...current, [actId]: (current[actId] ?? 0) + 1 }));
      setWrongPulse((current) => ({
        lockIndex: locks.findIndex((lock) => lock.actId === actId),
        count: (current?.count ?? 0) + 1,
      }));
      setMessage("wrong");
    }

    return result;
  }

  /**
   * Zvuk a vibrácia otvorenia zámku podľa časovej osi (kolieska zapadnú,
   * pružina cvakne, zlatý odlesk). Pri vypnutých animáciách iba cvak zámku.
   */
  function playUnlockFeedback() {
    if (reducedMotion) {
      soundManager.play("chest-lock-open");
      vibrate(HAPTIC.lock);
      return;
    }

    const schedule = (sec: number, action: () => void) =>
      timersRef.current.push(window.setTimeout(action, sec * 1000));

    LOCK_DIAL_CLICK_SEC.forEach((sec) =>
      schedule(sec, () => {
        soundManager.play("chest-dial-click");
        vibrate(HAPTIC.step);
      })
    );
    schedule(LOCK_SPRING_SEC, () => {
      soundManager.play("chest-lock-open");
      vibrate(HAPTIC.lock);
    });
    schedule(LOCK_GLINT_SEC, () => soundManager.play("chest-shine"));
  }

  function insertKey() {
    // Opakované ťuknutie nič nepridá (engine je tiež bezpečný proti opakovaniu).
    if (hasInsertedKeyRef.current) {
      return;
    }

    hasInsertedKeyRef.current = true;
    setMessage(null);
    onOpenChest();

    // Animáciu vedie truhlica (3D aj 2D) a na konci ohlási onOpenSettled.
    if (reducedMotion) {
      // Vypnuté animácie: truhlica je hneď otvorená, raz vŕzganie a vibrácia.
      soundManager.play("chest-lid-creak");
      vibrate(HAPTIC.open);
      setSequence("done");
      return;
    }

    setSequence("inserting");
    // Zvuky a vibrácie podľa časov otvárania (krok T4, OPENING_SOUND_SEC), rovnaké v 2D aj 3D.
    const schedule = (sec: number, action: () => void) =>
      timersRef.current.push(window.setTimeout(action, sec * 1000));

    schedule(OPENING_SOUND_SEC.keyInsert, () => soundManager.play("chest-key-insert"));
    schedule(OPENING_SOUND_SEC.keyTurn, () => {
      soundManager.play("chest-key-turn");
      vibrate(HAPTIC.lock);
    });
    schedule(OPENING_SOUND_SEC.lidCreak, () => {
      soundManager.play("chest-lid-creak");
      vibrate(HAPTIC.open);
    });
    schedule(OPENING_SOUND_SEC.shine, () => soundManager.play("chest-shine"));
  }

  /** 2D: ťuknutie na zámok posunie obrazovku k jeho kolieskam a zvýrazní ich. */
  function selectLock2D(index: number) {
    setSelectedLockIndex(index);
    document
      .querySelector(`[data-lock-row="${index}"]`)
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  }

  /* Zámky v poradí I, II, III (2D ovládanie, pri 3D v rozbaľovacom bloku). */
  const lockRows = locks.map((lock, lockIndex) => {
    const lockDigits = getDigits(lock.actId, lock.code.length);

    return (
      <div
        key={lock.actId}
        data-lock-row={lockIndex}
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
            ? "border-amber-200/50 bg-amber-300/5"
            : lock.isNext
              ? "border-amber-300/40 bg-amber-400/5"
              : "border-slate-700 bg-slate-950/60 opacity-60"
        } ${
          // Zámok vybraný ťuknutím na truhlicu (3D aj 2D).
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
                    className="flex h-[136px] w-11 items-center justify-center rounded-md border border-amber-200/50 bg-amber-300/10 text-xl text-amber-100"
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

  // V 2D až po povolení spôn (v 3D to stráži truhlica sama).
  const insertKeyButton = areAllLocksOpen && !isKeyInserted && sequence === "idle" &&
    (mode === "3d" || haspsReleased) && (
    <ActionButton onClick={insertKey} className={STILL_BUTTON}>
      {chest.insertKeyLabel}
    </ActionButton>
  );

  // Ktorý zo štyroch útržkov fotografie leží v truhlici (pre 3D útržok).
  const fragmentIndex = chapter.finale?.photo.fragmentIds.indexOf(chest.reward.id) ?? -1;
  const fragmentPieceIndex = fragmentIndex === -1 ? 3 : fragmentIndex;

  // Nápoveda pri zámku na rade (ostáva, kým sa zámok neotvorí): po 2 zlých
  // pokusoch scény, po 4 číslice priamo zo zápisníka v hre.
  const nextLock = locks.find((lock) => lock.isNext);
  const lockHint = nextLock
    ? getFinaleLockHint(chapter, gameState, nextLock.actId, wrongAttempts[nextLock.actId] ?? 0)
    : null;
  const lockHintText =
    nextLock && lockHint
      ? lockHint.stage === "scenes"
        ? (chest.lockHintScenesText ?? "")
            .replace("{lock}", nextLock.lockLabel)
            .replace("{scenes}", formatSceneList(lockHint.scenes))
        : (chest.lockHintDigitsText ?? "")
            .replace("{lock}", nextLock.lockLabel)
            .replace("{digits}", lockHint.digits.join(" "))
      : null;

  const messages = (
    <div aria-live="polite" className="mt-4 space-y-3">
      {message === "wrong" && (
        <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[15px] leading-6 text-red-100">
          {chest.wrongCodeText}
        </p>
      )}

      {lockHintText && (
        <p
          data-lock-hint={lockHint?.stage}
          className="rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-[15px] font-bold leading-6 text-amber-100"
        >
          {lockHintText}
        </p>
      )}

      {message === "opened" && (
        <p className="rounded-2xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-[15px] leading-6 text-amber-100">
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
          {/* Úvod podľa stavu: zámky na rade, všetky otvorené, otvorené veko. */}
          <p className="mt-4 text-[16px] leading-normal text-slate-300">
            {isChestOpened
              ? chest.introOpened
              : areAllLocksOpen
                ? chest.introAllOpen
                : chest.intro}
          </p>
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
                    insertKeyLabel: chest.insertKeyLabel,
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
                  isChestOpened={isChestOpened}
                  onInsertKey={insertKey}
                  onOpenSettled={() => setSequence("done")}
                  fragmentImageSrc={chapter.finale?.photo.imageSrc}
                  fragmentPieceIndex={fragmentPieceIndex}
                  reducedMotion={reducedMotion}
                  onFailure={() => setMode("2d")}
                />
              </InspectErrorBoundary>
            </div>
            <p
              aria-live="polite"
              className="mt-3 text-center text-[15px] leading-6 text-slate-400"
            >
              {sequence === "inserting"
                ? chest.keyTurningText
                : isRewardVisible
                  ? chest.openedHint
                  : isZoomed
                    ? chest.dialHint
                    : areAllLocksOpen
                      ? chest.rotateHintAllOpen
                      : chest.rotateHint}
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
                <div className="space-y-4 px-3 pb-4">
                  {lockRows}
                  {insertKeyButton}
                </div>
              </details>
            )}
          </div>
        ) : (
        /* Truhlica (2D záloha, krok T5a) – rovnaké časovanie, zvuky a vibrácie ako v 3D. */
        <div className="finale-chest mt-8">
          <Chest2DView
            locks={locks}
            lockDigits={locks.map((lock) =>
              getDigits(lock.actId, lock.code.length).map(Number)
            )}
            stateLabels={{
              open: chest.lockOpenLabel,
              closed: chest.lockClosedLabel,
              next: chest.lockNextLabel,
            }}
            selectedIndex={selectedLockIndex}
            onSelectLock={selectLock2D}
            wrongPulse={wrongPulse}
            onHaspsReleased={handleHaspsReleased}
            isOpening={sequence === "inserting"}
            isChestOpened={isChestOpened}
            onOpenSettled={handleOpenSettled}
            fragmentImageSrc={chapter.finale?.photo.imageSrc}
            fragmentPieceIndex={fragmentPieceIndex}
            reducedMotion={reducedMotion}
          />
          <p
            aria-live="polite"
            className="mt-3 text-center text-[15px] leading-6 text-slate-400"
          >
            {sequence === "inserting"
              ? chest.keyTurningText
              : isRewardVisible
                ? chest.openedHint
                : null}
          </p>
        </div>
        )}

        {/* Pri 2D zálohe sú zámky a hlášky stále viditeľné pod truhlicou. */}
        {mode === "2d" && (
          <>
            {!isChestOpened && <div className="mt-8 space-y-4">{lockRows}</div>}
            {messages}
          </>
        )}

        {/* Pri 2D zálohe tlačidlo kľúča pod zámkami (pri 3D je nad scénou a v bloku). */}
        {mode === "2d" && insertKeyButton && <div className="mt-6">{insertKeyButton}</div>}

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
