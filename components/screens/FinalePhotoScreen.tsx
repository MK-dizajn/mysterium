"use client";

import { useEffect, useState } from "react";
import type { FinalePhoto } from "../../types/game";
import { FinalePhotoViewer } from "../finale/FinalePhotoViewer";
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

/** Útržky chvíľu ležia od seba, potom sa zosunú do jednej fotografie (ms). */
const SCATTER_MS = 900;
const ASSEMBLE_MS = 1200;

type Phase = "scattered" | "assembling" | "assembled";

export function FinalePhotoScreen({
  photo,
  ownedFragmentIds,
  isAssembled,
  onAssembled,
  onContinue,
}: FinalePhotoScreenProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(() =>
    isAssembled ? "assembled" : "scattered"
  );

  // Prvý príchod: zapísať zloženie hneď (F5 už ukáže celú fotografiu)
  // a prehrať skladanie.
  useEffect(() => {
    if (isAssembled) {
      return;
    }

    onAssembled();

    // Pri vypnutých animáciách je fotografia hneď celá (isTogether, isReady).
    if (reducedMotion) {
      return;
    }

    const assembleTimer = window.setTimeout(
      () => setPhase("assembling"),
      SCATTER_MS
    );
    const doneTimer = window.setTimeout(
      () => setPhase("assembled"),
      SCATTER_MS + ASSEMBLE_MS
    );

    return () => {
      window.clearTimeout(assembleTimer);
      window.clearTimeout(doneTimer);
    };
    // Spustí sa iba pri prvom zobrazení obrazovky.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isTogether = phase !== "scattered" || reducedMotion;
  const isReady = phase === "assembled" || reducedMotion;

  return (
    <ScreenContainer>
      <div className="mx-auto w-full max-w-md pb-8">
        <header className="px-1 text-center">
          <h1 className="text-3xl font-black text-amber-100">{photo.title}</h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
        </header>

        <div className="mt-8">
          <FinalePhotoViewer
            photo={photo}
            ownedFragmentIds={ownedFragmentIds}
            isTogether={isTogether}
            isReady={isReady}
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
