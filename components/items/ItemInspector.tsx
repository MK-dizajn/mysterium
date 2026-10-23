"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { CodeItemInfo } from "../../engine";
import { soundManager } from "../../lib/soundManager";
import { ActionButton } from "../ui/ActionButton";
import { InspectErrorBoundary } from "./InspectErrorBoundary";
import { GLOW_CLASSES } from "./inspectStyles";
import { canUse3D } from "./supportsWebGL";
import { TokenArt } from "./TokenArt";
import { useReducedMotion } from "./useReducedMotion";

/** 3D žetón sa stiahne až pri prvom otvorení „Prezrieť“. */
const Token3DView = dynamic(() => import("./3d/Token3DView"), {
  ssr: false,
  loading: () => <TokenArt side="front" digit="" isDigitFound={false} />,
});

type ItemInspectorProps = {
  info: CodeItemInfo;
  onFound: () => void;
  onReveal: () => void;
  onClose: () => void;
};

/** Po tejto dobe nečinnosti sa jemne rozžiari miesto, kam sa pozrieť. */
const IDLE_GLOW_MS = 20_000;
/** Po ďalšej dobe nečinnosti sa ukáže „Ukáž číslicu“ ako posledná možnosť. */
const IDLE_REVEAL_MS = 20_000;
const FLIP_MS = 220;
const FOUND_ANIMATION_MS = 1600;

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
  const [snapRequestCount, setSnapRequestCount] = useState(0);
  const [isFacing3D, setIsFacing3D] = useState(false);

  const [side, setSide] = useState<"front" | "edge">("front");
  const [isFlipping, setIsFlipping] = useState(false);
  const [idleStage, setIdleStage] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [isJustFound, setIsJustFound] = useState(false);
  const isFoundRequestedRef = useRef(false);

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
    if (isFound || idleStage >= 2) {
      return;
    }

    const timer = window.setTimeout(
      () => setIdleStage((stage) => stage + 1),
      idleStage === 0 ? IDLE_GLOW_MS : IDLE_REVEAL_MS
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [idleStage, activityCount, isFound]);

  function registerActivity() {
    setActivityCount((count) => count + 1);
    setIdleStage((stage) => (stage >= 2 ? stage : 0));
  }

  function turnToEdge() {
    if (mode === "3d") {
      setSnapRequestCount((count) => count + 1);
      return;
    }

    setIsFlipping(true);

    window.setTimeout(() => {
      setSide((currentSide) =>
        currentSide === "front" ? "edge" : "front"
      );
      setIsFlipping(false);
    }, FLIP_MS);
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
    setSide("edge");
    setIsJustFound(true);

    window.setTimeout(() => setIsJustFound(false), FOUND_ANIMATION_MS);
  }

  if (!inspect || !item.secretCode) {
    return null;
  }

  const isGlowing = idleStage >= 1 && !isFound;
  const canReveal = idleStage >= 2 && !isFound;
  const isDigitInView = mode === "3d" ? isFacing3D : side === "edge";

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 px-4 py-6 backdrop-blur-sm"
      onPointerDown={registerActivity}
      onKeyDown={registerActivity}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-inspector-title"
        aria-describedby="item-inspector-instruction"
        className="mx-auto flex w-full max-w-md flex-col items-center rounded-3xl border border-amber-300/25 bg-slate-950 p-5 text-center shadow-2xl shadow-black/70"
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
          id="item-inspector-instruction"
          className="mt-3 text-sm leading-6 text-slate-300"
        >
          {inspect.instruction}
        </p>

        <div className="relative mt-5 aspect-square w-full max-w-[280px]">
          {mode === "3d" ? (
            <InspectErrorBoundary onError={() => setMode("2d")}>
              <Token3DView
                digit={item.secretCode}
                isFound={isFound}
                hotspotLabel={inspect.hotspotLabel}
                isHotspotGlowing={isGlowing}
                reducedMotion={reducedMotion}
                snapRequestCount={snapRequestCount}
                onFacingChange={setIsFacing3D}
                onFound={() => markFound(false)}
                onFailure={() => setMode("2d")}
              />
            </InspectErrorBoundary>
          ) : (
            <>
              <div
                className={`h-full w-full transition-transform duration-200 ease-in-out ${
                  isFlipping ? "scale-x-0" : "scale-x-100"
                }`}
              >
                <TokenArt
                  side={side}
                  digit={item.secretCode}
                  isDigitFound={isFound}
                />
              </div>

              {side === "edge" && !isFlipping && !isFound && (
                <button
                  type="button"
                  onClick={() => markFound(false)}
                  aria-label={inspect.hotspotLabel}
                  className={`absolute left-[38%] top-[38%] h-[24%] min-h-11 w-[24%] min-w-11 rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                    isGlowing ? GLOW_CLASSES : ""
                  }`}
                />
              )}
            </>
          )}
        </div>

        {mode === "3d" && !isFound && (
          <p className="mt-3 text-xs leading-5 text-slate-400">
            Žetón otáčaj ťahaním prstom alebo myšou, prípadne šípkami na
            klávesnici.
          </p>
        )}

        <div className="mt-5 flex w-full flex-col gap-3">
          {!isFound && (
            <ActionButton
              autoFocus
              variant="secondary"
              onClick={turnToEdge}
              className={isGlowing && !isDigitInView ? GLOW_CLASSES : ""}
            >
              {mode === "2d" && side === "edge"
                ? "Otočiť späť"
                : "Otočiť na hranu"}
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
                {item.secretCode}
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-100">
                Číslica pre zámok {lockLabel} zapísaná do zápisníka
                {` (miesto ${slotNumber}).`}
              </p>
            </div>
          )}

          {!isFound && mode === "3d" && isFacing3D && (
            <p className="sr-only">Vyrytá číslica je natočená k tebe.</p>
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
