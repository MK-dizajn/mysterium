"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { getFinaleMapsUrl } from "../../engine";
import type { ChapterFinale } from "../../types/game";
import { FinalePhotoViewer } from "../finale/FinalePhotoViewer";
import { ActionButton } from "../ui/ActionButton";
import { ScreenContainer } from "../ui/ScreenContainer";
import { TextInput } from "../ui/TextInput";

type FinalePlaceScreenProps = {
  finale: ChapterFinale;
  /** Útržky, ktoré hráč naozaj má (pre fotografiu v okne). */
  ownedFragmentIds: string[];
  /** Miesto je už zadané – ukáže sa karta „Ďalšie miesto“. */
  isSolved: boolean;
  /** Overí odpoveď v engine; vráti, či bola správna. */
  onSubmit: (answer: string) => boolean;
  onFinish: () => void;
};

const STILL_BUTTON = "motion-reduce:transition-none motion-reduce:active:scale-100";
const PHOTO_BUTTON_ID = "finale-place-photo-button";
const CLOSE_BUTTON_ID = "finale-place-photo-close";

export function FinalePlaceScreen({
  finale,
  ownedFragmentIds,
  isSolved,
  onSubmit,
  onFinish,
}: FinalePlaceScreenProps) {
  const { nextPlace, photo } = finale;
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const cardTitleRef = useRef<HTMLHeadingElement>(null);
  const isEmpty = answer.trim() === "";

  useEffect(() => {
    if (!isPhotoOpen) {
      return;
    }

    // Zameranie na „Zavrieť“ a po zatvorení späť na „Pozrieť fotografiu“.
    document.getElementById(CLOSE_BUTTON_ID)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPhotoOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.getElementById(PHOTO_BUTTON_ID)?.focus();
    };
  }, [isPhotoOpen]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Prázdne pole (aj iba medzery) nič neodošle a nič nehlási.
    if (isEmpty) {
      return;
    }

    const isCorrect = onSubmit(answer);
    setIsWrong(!isCorrect);

    if (isCorrect) {
      window.requestAnimationFrame(() => cardTitleRef.current?.focus());
    }
  }

  return (
    <ScreenContainer>
      <div className="mx-auto w-full max-w-md pb-8">
        {!isSolved ? (
          <form onSubmit={submit} className="space-y-5">
            <label
              htmlFor="finale-place-answer"
              className="block text-center text-xl font-black leading-8 text-amber-100"
            >
              {nextPlace.question}
            </label>

            <TextInput
              id="finale-place-answer"
              value={answer}
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="done"
              onChange={(event) => {
                setAnswer(event.target.value);
                setIsWrong(false);
              }}
            />

            <ActionButton type="submit" disabled={isEmpty} className={STILL_BUTTON}>
              {nextPlace.submitLabel}
            </ActionButton>

            <div aria-live="polite">
              {isWrong && (
                <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-[15px] leading-6 text-red-100">
                  {nextPlace.wrongAnswerText}
                </p>
              )}
            </div>

            <ActionButton
              id={PHOTO_BUTTON_ID}
              variant="secondary"
              onClick={() => setIsPhotoOpen(true)}
              className={STILL_BUTTON}
            >
              {nextPlace.showPhotoLabel}
            </ActionButton>
          </form>
        ) : (
          <section
            aria-labelledby="finale-place-card-title"
            className="rounded-3xl border border-amber-300/30 bg-gradient-to-b from-[#1c1408] to-[#0b0f1c] p-5 shadow-2xl shadow-black/50"
          >
            <h1
              id="finale-place-card-title"
              ref={cardTitleRef}
              tabIndex={-1}
              className="text-center text-xs font-black uppercase tracking-[0.3em] text-amber-300 outline-none"
            >
              {nextPlace.cardTitle}
            </h1>

            <p className="mt-3 text-center text-2xl font-black leading-8 text-amber-50">
              {nextPlace.name}
            </p>

            <h2 className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">
              {nextPlace.addressLabel}
            </h2>
            <p className="mt-1 text-[16px] leading-7 text-slate-100">
              {nextPlace.address}
            </p>

            <a
              href={getFinaleMapsUrl(nextPlace)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-amber-300/40 bg-amber-400 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-300 motion-reduce:transition-none"
            >
              {nextPlace.mapsButtonLabel}
            </a>

            <h2 className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">
              {nextPlace.directionsLabel}
            </h2>
            <p className="mt-1 text-[16px] leading-7 text-slate-100">
              {nextPlace.directions}
            </p>

            <div className="mt-6">
              <ActionButton variant="secondary" onClick={onFinish} className={STILL_BUTTON}>
                {nextPlace.finishLabel}
              </ActionButton>
            </div>
          </section>
        )}
      </div>

      {/* Fotografia nad zadaním – hráč nemusí odchádzať. */}
      {isPhotoOpen && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/90 px-4 py-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsPhotoOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={photo.title}
            className="mx-auto w-full max-w-md rounded-3xl border border-amber-300/25 bg-slate-950 p-5"
          >
            <FinalePhotoViewer
              photo={photo}
              ownedFragmentIds={ownedFragmentIds}
              isTogether
              isReady
            />

            <div className="mt-5">
              <ActionButton
                id={CLOSE_BUTTON_ID}
                onClick={() => setIsPhotoOpen(false)}
                className={STILL_BUTTON}
              >
                {nextPlace.closePhotoLabel}
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </ScreenContainer>
  );
}
