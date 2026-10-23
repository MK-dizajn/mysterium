"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { CodeItemInfo } from "../../engine";
import type { InspectTiming, ItemInspectTranscript } from "../../types/game";
import { soundManager } from "../../lib/soundManager";
import { ActionButton } from "../ui/ActionButton";
import { type ItemArtSide, ITEM_ARTS } from "./art/itemArtRegistry";
import { getGoldenKeySvg } from "./art/keyToothArt";
import { InspectErrorBoundary } from "./InspectErrorBoundary";
import { GLOW_CLASSES, TAP_FEEDBACK_CLASSES } from "./inspectStyles";
import { ItemArtImage } from "./ItemArtImage";
import { canUse3D } from "./supportsWebGL";
import { useReducedMotion } from "./useReducedMotion";

function Loading3D() {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full rounded-2xl bg-amber-200/5 motion-safe:animate-pulse"
    />
  );
}

/** 3D časti sa stiahnu až pri prvom otvorení „Prezrieť“. */
const Token3DView = dynamic(() => import("./3d/Token3DView"), {
  ssr: false,
  loading: Loading3D,
});

const Item3DView = dynamic(() => import("./3d/Item3DView"), {
  ssr: false,
  loading: Loading3D,
});

type ItemInspectorProps = {
  info: CodeItemInfo;
  onFound: () => void;
  onReveal: () => void;
  onClose: () => void;
};

/**
 * Časy bez vlastných údajov predmetu: po 20 s nečinnosti sa rozžiari miesto
 * a ukáže sa nápoveda, po 40 s „Ukáž číslicu“ ako posledná možnosť.
 */
const DEFAULT_TIMING: InspectTiming = { hintMs: 20_000, revealMs: 40_000 };
/** Ako dlho svieti riadok po prvom ťuknutí na prvok. */
const FIRST_TAP_NOTE_MS = 5000;
const FLIP_MS = 220;
const FOUND_ANIMATION_MS = 1600;

type TranscriptViewProps = {
  transcript: ItemInspectTranscript;
  digit: string;
  hotspotLabel: string;
  isFound: boolean;
  isGlowing: boolean;
  onFound: () => void;
};

/** Prepis nahrávky – zvýraznené slovo skrýva číslicu. */
function TranscriptView({
  transcript,
  digit,
  hotspotLabel,
  isFound,
  isGlowing,
  onFound,
}: TranscriptViewProps) {
  return (
    <div className="w-full rounded-2xl border border-amber-200/20 bg-[#f1e4c3] p-5 text-left font-serif text-[15px] leading-8 text-[#3b2a12] shadow-inner">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#7a5418]">
        Prepis nahrávky
      </p>

      <p className="mt-3">
        {transcript.before}{" "}
        <button
          type="button"
          onClick={onFound}
          disabled={isFound}
          aria-label={isFound ? `${transcript.highlight} (${digit})` : hotspotLabel}
          className={`inline-flex min-h-11 items-center rounded-lg px-1.5 align-middle font-bold underline decoration-2 underline-offset-4 outline-none focus-visible:ring-4 focus-visible:ring-amber-500 ${
            isFound
              ? "bg-emerald-300/50 text-[#1f3d1a] decoration-emerald-700"
              : "bg-amber-300/40 decoration-[#7a5418]"
          } ${isGlowing ? GLOW_CLASSES : ""}`}
        >
          {isFound ? `${transcript.highlight} (${digit})` : transcript.highlight}
        </button>{" "}
        {transcript.after}
      </p>
    </div>
  );
}

export function ItemInspector({
  info,
  onFound,
  onReveal,
  onClose,
}: ItemInspectorProps) {
  const { item, lockLabel, slotNumber, isFound } = info;
  const inspect = item.inspect;
  const reducedMotion = useReducedMotion();

  // 3D, ak ho prehliadač zvládne a nie je zapnutý prepínač ?bez3d.
  const [mode, setMode] = useState<"3d" | "2d">(() =>
    canUse3D() ? "3d" : "2d"
  );
  const [turnRequestCount, setTurnRequestCount] = useState(0);
  const [isHiddenSideFacing3D, setIsHiddenSideFacing3D] = useState(false);
  const [side2D, setSide2D] = useState<ItemArtSide>("front");
  const [isFlipping, setIsFlipping] = useState(false);
  const [idleStage, setIdleStage] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [isJustFound, setIsJustFound] = useState(false);
  const [markedIndexes, setMarkedIndexes] = useState<number[]>([]);
  const [isFirstTapNoteVisible, setIsFirstTapNoteVisible] = useState(false);
  const hasShownFirstTapNoteRef = useRef(false);
  const firstTapNoteTimerRef = useRef<number | null>(null);
  const isFoundRequestedRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const isTranscript = inspect?.kind === "transcript";
  const isCount = inspect?.kind === "count";
  // Zameranie na slovo prepisu alebo na prvý prvok na počítanie by
  // prezradilo, kde hľadať – vtedy sa zameria celé okno.
  const shouldFocusDialog = isTranscript || (isCount && mode === "2d");

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (shouldFocusDialog) {
      dialogRef.current?.focus({ preventScroll: true });
    }
  }, [shouldFocusDialog]);

  // Stupne nápovedy podľa dát predmetu: nápoveda, prípadne 2. nápoveda,
  // nakoniec „Ukáž číslicu“. Časy sú od otvorenia alebo poslednej aktivity.
  const timing = inspect?.timing ?? DEFAULT_TIMING;
  const hasSecondHint = Boolean(
    inspect?.secondHint && timing.secondHintMs !== undefined
  );
  const stageTimes = hasSecondHint
    ? [timing.hintMs, timing.secondHintMs ?? timing.hintMs, timing.revealMs]
    : [timing.hintMs, timing.revealMs];
  const revealStage = stageTimes.length;
  const nextStageDelay =
    idleStage < revealStage
      ? stageTimes[idleStage] - (idleStage > 0 ? stageTimes[idleStage - 1] : 0)
      : null;

  useEffect(() => {
    if (isFound || nextStageDelay === null) {
      return;
    }

    const timer = window.setTimeout(
      () => setIdleStage((stage) => stage + 1),
      nextStageDelay
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [idleStage, nextStageDelay, activityCount, isFound]);

  useEffect(
    () => () => {
      if (firstTapNoteTimerRef.current !== null) {
        window.clearTimeout(firstTapNoteTimerRef.current);
      }
    },
    []
  );

  function registerActivity() {
    setActivityCount((count) => count + 1);
    setIdleStage((stage) => (stage >= 1 ? stage : 0));
  }

  function flip2D() {
    setIsFlipping(true);

    window.setTimeout(() => {
      setSide2D((currentSide) =>
        currentSide === "front" ? "hidden" : "front"
      );
      setIsFlipping(false);
    }, FLIP_MS);
  }

  function turn() {
    if (mode === "3d") {
      setTurnRequestCount((count) => count + 1);
      return;
    }

    flip2D();
  }

  function markFound(revealed: boolean) {
    // Ťuknutie a automatický zápis môžu prísť naraz – zapíšeme raz.
    if (isFound || isFoundRequestedRef.current) {
      return;
    }

    isFoundRequestedRef.current = true;

    if (revealed) {
      onReveal();
    } else {
      onFound();
    }

    soundManager.play("digit-found");

    // Pri počítaní zostáva líce s označenými prvkami.
    if (!isCount) {
      setSide2D("hidden");
    }

    setIsJustFound(true);

    window.setTimeout(() => setIsJustFound(false), FOUND_ANIMATION_MS);
  }

  /** Označí prvok na počítanie; keď sú označené všetky, číslica sa objaví. */
  function markCountElement(index: number, total: number) {
    if (isFound || markedIndexes.includes(index)) {
      return;
    }

    const nextMarkedIndexes = [...markedIndexes, index];
    const isComplete = nextMarkedIndexes.length === total;
    setMarkedIndexes(nextMarkedIndexes);

    // Po prvom ťuknutí sa raz ukáže povzbudenie (bez počtu), potom už nie.
    if (!hasShownFirstTapNoteRef.current) {
      hasShownFirstTapNoteRef.current = true;

      if (inspect?.firstTapText && !isComplete) {
        setIsFirstTapNoteVisible(true);
        firstTapNoteTimerRef.current = window.setTimeout(
          () => setIsFirstTapNoteVisible(false),
          FIRST_TAP_NOTE_MS
        );
      }
    } else {
      setIsFirstTapNoteVisible(false);
    }

    if (isComplete) {
      markFound(false);
    }
  }

  if (!inspect || !item.secretCode) {
    return null;
  }

  const digit = item.secretCode;
  const definition =
    (inspect.kind === "hotspot" || inspect.kind === "count") && inspect.art
      ? ITEM_ARTS[inspect.art]
      : null;
  const countPoints =
    inspect.kind === "count" ? (inspect.countPoints ?? []) : undefined;
  const isCountMode = countPoints !== undefined;

  const isHintVisible = idleStage >= 1 && !isFound;
  const isSecondHintVisible = hasSecondHint && idleStage >= 2 && !isFound;
  const canReveal = idleStage >= revealStage && !isFound;
  const isHiddenSideInView =
    mode === "3d" ? isHiddenSideFacing3D : side2D === "hidden";

  const isTurnVisible =
    definition !== null &&
    !isFound &&
    (definition.isTurnButtonAlwaysVisible || isHintVisible);

  const turnLabel =
    definition &&
    isHiddenSideInView &&
    (mode === "2d" || definition.shape === "flat")
      ? definition.turnBackLabel
      : (definition?.turnLabel ?? "");

  const artFrameClass =
    definition?.shape === "flat"
      ? definition.width > definition.height
        ? "w-full max-w-[320px]"
        : definition.width === definition.height
          ? "w-full max-w-[280px]"
          : "w-full max-w-[240px]"
      : "aspect-square w-full max-w-[280px]";

  const hotspotSizeClass =
    definition?.shape === "coin" ? "h-16 w-16" : "h-12 w-12";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 px-4 py-6 backdrop-blur-sm"
      onPointerDown={registerActivity}
      onKeyDown={registerActivity}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-inspector-title"
        aria-describedby="item-inspector-intro"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-md flex-col items-center rounded-3xl border border-amber-300/25 bg-slate-950 p-5 text-center shadow-2xl shadow-black/70 outline-none"
      >
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.35em] text-amber-400/80">
          Prezrieť predmet
        </p>

        <h2
          id="item-inspector-title"
          className="mt-2 text-xl font-black text-amber-100"
        >
          {item.icon} {item.title}
        </h2>

        <p
          id="item-inspector-intro"
          className="mt-3 text-sm leading-6 text-slate-300"
        >
          {inspect.intro}
        </p>

        {inspect.kind === "transcript" && inspect.transcript && (
          <div className="mt-5 w-full">
            <TranscriptView
              transcript={inspect.transcript}
              digit={digit}
              hotspotLabel={inspect.hotspotLabel}
              isFound={isFound}
              isGlowing={isHintVisible}
              onFound={() => markFound(false)}
            />
          </div>
        )}

        {definition && inspect.art && (
          <div
            className={`relative mt-5 ${artFrameClass}`}
            style={
              definition.shape === "flat"
                ? { aspectRatio: `${definition.width} / ${definition.height}` }
                : undefined
            }
          >
            {mode === "3d" ? (
              <InspectErrorBoundary onError={() => setMode("2d")}>
                {definition.shape === "coin" ? (
                  <Token3DView
                    digit={digit}
                    isFound={isFound}
                    hotspotLabel={inspect.hotspotLabel}
                    isHotspotGlowing={isHintVisible}
                    reducedMotion={reducedMotion}
                    snapRequestCount={turnRequestCount}
                    focusOnMount
                    onFacingChange={setIsHiddenSideFacing3D}
                    onFound={() => markFound(false)}
                    onFailure={() => setMode("2d")}
                  />
                ) : (
                  <Item3DView
                    art={inspect.art}
                    digit={digit}
                    isFound={isFound}
                    hotspotLabel={inspect.hotspotLabel}
                    isHotspotGlowing={isHintVisible}
                    reducedMotion={reducedMotion}
                    turnRequestCount={turnRequestCount}
                    focusOnMount
                    onFacingChange={setIsHiddenSideFacing3D}
                    onFound={() => markFound(false)}
                    onFailure={() => setMode("2d")}
                    countPoints={countPoints}
                    countLabel={inspect.countLabel}
                    artPart={inspect.artPart}
                    markedIndexes={markedIndexes}
                    onMark={(index) =>
                      markCountElement(index, countPoints?.length ?? 0)
                    }
                  />
                )}
              </InspectErrorBoundary>
            ) : (
              <>
                {isCountMode ? (
                  // Pri počítaní sa predmet otáča iba tlačidlom, aby ťuknutie
                  // vedľa prvku omylom neotočilo predmet.
                  <div
                    className={`h-full w-full transition-transform duration-200 ease-in-out ${
                      isFlipping ? "scale-x-0" : "scale-x-100"
                    }`}
                  >
                    <ItemArtImage
                      art={inspect.art}
                      side={side2D}
                      digit={digit}
                      isDigitFound={isFound}
                      countPoints={countPoints}
                      artPart={inspect.artPart}
                    />
                  </div>
                ) : (
                  /* Ťuknutie na predmet ho otočí (aj bez tlačidla). */
                  <button
                    type="button"
                    autoFocus
                    onClick={flip2D}
                    aria-label={`Otočiť predmet: ${item.title}`}
                    className={`block h-full w-full rounded-2xl outline-none transition-transform duration-200 ease-in-out focus-visible:ring-4 focus-visible:ring-amber-300/60 ${
                      isFlipping ? "scale-x-0" : "scale-x-100"
                    }`}
                  >
                    <ItemArtImage
                      art={inspect.art}
                      side={side2D}
                      digit={digit}
                      isDigitFound={isFound}
                    />
                  </button>
                )}

                {isCountMode &&
                  side2D === "front" &&
                  !isFlipping &&
                  !isFound &&
                  countPoints.map((point, index) => {
                    const isMarked = markedIndexes.includes(index);

                    return (
                      <button
                        key={`${point.x}-${point.y}`}
                        type="button"
                        onClick={() =>
                          markCountElement(index, countPoints.length)
                        }
                        aria-label={point.label ?? inspect.countLabel}
                        aria-pressed={isMarked}
                        style={{
                          left: `${point.x * 100}%`,
                          top: `${point.y * 100}%`,
                        }}
                        className={`absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${TAP_FEEDBACK_CLASSES} ${
                          isMarked
                            ? "border-2 border-amber-200 bg-amber-300/35 shadow-[0_0_12px_rgba(252,211,77,0.6)]"
                            : isHintVisible
                              ? GLOW_CLASSES
                              : ""
                        }`}
                      />
                    );
                  })}

                {!isCountMode && side2D === "hidden" && !isFlipping && !isFound && (
                  <button
                    type="button"
                    onClick={() => markFound(false)}
                    aria-label={inspect.hotspotLabel}
                    style={{
                      left: `${definition.hotspotCenter.x * 100}%`,
                      top: `${definition.hotspotCenter.y * 100}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${hotspotSizeClass} ${
                      isHintVisible ? GLOW_CLASSES : ""
                    }`}
                  />
                )}
              </>
            )}
          </div>
        )}

        {definition && !isFound && (mode === "3d" || isCountMode) && (
          <p className="mt-3 text-xs leading-5 text-slate-400">
            {mode === "2d"
              ? "Ťukaj na detaily."
              : isCountMode
                ? "Ťahaj, nakláňaj a ťukaj na detaily."
                : "Ťahaj a nakláňaj predmet."}
          </p>
        )}

        <div aria-live="polite" className="w-full">
          {isFirstTapNoteVisible && !isFound && (
            <p className="mt-3 text-sm italic leading-6 text-amber-100/80">
              {inspect.firstTapText}
            </p>
          )}

          {isHintVisible && (
            <p className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
              {inspect.hint}
            </p>
          )}

          {isSecondHintVisible && (
            <p className="mt-3 rounded-2xl border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
              {inspect.secondHint}
            </p>
          )}

          {!isFound && definition && isHiddenSideInView && (
            <p className="sr-only">{definition.facingAnnouncement}</p>
          )}
        </div>

        <div className="mt-5 flex w-full flex-col gap-3">
          {isTurnVisible && (
            <ActionButton
              variant="secondary"
              onClick={turn}
              className={
                isHintVisible && !isCountMode && !isHiddenSideInView
                  ? GLOW_CLASSES
                  : ""
              }
            >
              {turnLabel}
            </ActionButton>
          )}

          {canReveal && (
            <ActionButton
              variant="secondary"
              onClick={() => markFound(true)}
            >
              Ukáž číslicu
            </ActionButton>
          )}
        </div>

        <div aria-live="polite" className="w-full">
          {isFound && (
            <div
              className={`mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 ${
                isJustFound ? "motion-safe:animate-pulse" : ""
              }`}
            >
              <p className="font-mono text-4xl font-black text-emerald-100">
                {digit}
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-100">
                {inspect.foundText}
              </p>
              <p className="mt-1 text-xs leading-5 text-emerald-200/70">
                {`Zapísané do zápisníka kódov (zámok ${lockLabel}, miesto ${slotNumber}).`}
              </p>

              {/* Tieňový obrys celého kľúča ukáže, kam táto časť patrí. */}
              {inspect.art === "keyTooth" && inspect.artPart && (
                <div
                  aria-hidden="true"
                  className="mx-auto mt-3 w-full max-w-[260px] [&>svg]:h-auto [&>svg]:w-full"
                  dangerouslySetInnerHTML={{
                    __html: getGoldenKeySvg({
                      idPrefix: `key-outline-${inspect.artPart}`,
                      pieceNotches: [1, 2, 3].map((part) =>
                        part === inspect.artPart ? countPoints : undefined
                      ),
                      highlightPart: inspect.artPart,
                      variant: "silhouette",
                    }),
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className="mt-5 w-full">
          {/* Nový key po nájdení: tlačidlo sa vytvorí znova a prevezme zameranie. */}
          <ActionButton
            key={isFound ? "done" : "close"}
            autoFocus={isFound}
            onClick={onClose}
          >
            {isFound ? "Hotovo" : "Zavrieť"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
