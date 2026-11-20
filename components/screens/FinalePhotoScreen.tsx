"use client";

import { useEffect, useRef, useState } from "react";
import type { FinalePhoto } from "../../types/game";
import { HAPTIC, vibrate } from "../../lib/haptics";
import { soundManager } from "../../lib/soundManager";
import {
  FinalePhotoViewer,
  PHOTO_ASSEMBLY_MS,
  PHOTO_FLY_S,
  PHOTO_FLY_START_S,
  PHOTO_FLY_STEP_S,
} from "../finale/FinalePhotoViewer";
import { useReducedMotion } from "../items/useReducedMotion";
import { ActionButton } from "../ui/ActionButton";
import { ScreenContainer } from "../ui/ScreenContainer";

type FinalePhotoScreenProps = {
  photo: FinalePhoto;
  /** Útržky, ktoré hráč naozaj má (id z inventára). */
  ownedFragmentIds: string[];
  /** Útržky sa už raz zložili – ukáže sa hneď celá fotografia. */
  isAssembled: boolean;
  onAssembled: () => void;
  onContinue: () => void;
};

/**
 * Historická fotografia: pri prvom príchode útržky chvíľu ležia od seba,
 * potom priletia jeden po druhom (cvaknutie, vibrácia), fotografia sa
 * „vyvolá“ a prejde cez ňu pruh svetla (spolu asi 4 s). Ťuknutie skladanie
 * hneď dokončí. Pri vypnutých animáciách a po F5 je fotografia hneď celá.
 */
export function FinalePhotoScreen({
  photo,
  ownedFragmentIds,
  isAssembled,
  onAssembled,
  onContinue,
}: FinalePhotoScreenProps) {
  const reducedMotion = useReducedMotion();
  // Skladanie sa prehrá iba pri prvom príchode (rozhodne sa raz pri otvorení).
  const [isFirstVisit] = useState(() => !isAssembled);
  const [isDone, setIsDone] = useState(isAssembled);
  const viewerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const isAnimated = isFirstVisit && !reducedMotion;

  function clearTimers() {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }

  // Prvý príchod: zapísať zloženie hneď (F5 už ukáže celú fotografiu)
  // a prehrať skladanie.
  useEffect(() => {
    if (!isFirstVisit) {
      return;
    }

    onAssembled();

    if (reducedMotion) {
      return;
    }

    const pieceCount = photo.fragmentIds.filter((id) =>
      ownedFragmentIds.includes(id)
    ).length;

    // Cvaknutie každého útržku na mieste (zvuk zatiaľ ticho, vibrácia).
    for (let order = 0; order < pieceCount; order += 1) {
      const snapMs = (PHOTO_FLY_START_S + order * PHOTO_FLY_STEP_S + PHOTO_FLY_S) * 1000;

      timersRef.current.push(
        window.setTimeout(() => {
          soundManager.play("photo-piece-snap");
          vibrate(HAPTIC.step);
        }, snapMs)
      );
    }

    timersRef.current.push(window.setTimeout(() => setIsDone(true), PHOTO_ASSEMBLY_MS));

    return clearTimers;
    // Spustí sa iba pri prvom zobrazení obrazovky.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Ťuknutie počas skladania: animácie skočia na koniec. */
  function skip() {
    if (isDone) {
      return;
    }

    clearTimers();
    viewerRef.current
      ?.getAnimations({ subtree: true })
      .forEach((animation) => animation.finish());
    setIsDone(true);
  }

  const isReady = isDone || reducedMotion;

  return (
    <ScreenContainer>
      <div className="mx-auto w-full max-w-md pb-8">
        <header className="px-1 text-center">
          <h1 className="text-3xl font-black text-amber-100">{photo.title}</h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        </header>

        <div ref={viewerRef} className="mt-8">
          <FinalePhotoViewer
            photo={photo}
            ownedFragmentIds={ownedFragmentIds}
            isTogether
            isReady={isReady}
            assembly={isAnimated ? "animated" : "none"}
            onSkip={skip}
            highlightTurn={isFirstVisit}
            caption={
              <p className="mt-6 text-[16px] leading-normal text-slate-300">
                {photo.frontDescription}
              </p>
            }
          />
        </div>

        {isReady && (
          <div className="mt-6">
            <ActionButton
              onClick={onContinue}
              className="motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {photo.continueLabel}
            </ActionButton>
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
