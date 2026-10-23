"use client";

import { type FormEvent, useRef, useState } from "react";
import type { ChapterFinale } from "../../types/game";
import { FinaleDialog } from "../finale/FinaleDialog";
import { FinalePhotoViewer } from "../finale/FinalePhotoViewer";
import { NextPlaceCard } from "../finale/NextPlaceCard";
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
          <NextPlaceCard
            nextPlace={nextPlace}
            titleRef={cardTitleRef}
            titleId="finale-place-card-title"
            isMainHeading
          >
            <ActionButton variant="secondary" onClick={onFinish} className={STILL_BUTTON}>
              {nextPlace.finishLabel}
            </ActionButton>
          </NextPlaceCard>
        )}
      </div>

      {/* Fotografia nad zadaním – hráč nemusí odchádzať. */}
      {isPhotoOpen && (
        <FinaleDialog
          label={photo.title}
          closeLabel={nextPlace.closePhotoLabel}
          returnFocusId={PHOTO_BUTTON_ID}
          onClose={() => setIsPhotoOpen(false)}
        >
          <FinalePhotoViewer
            photo={photo}
            ownedFragmentIds={ownedFragmentIds}
            isTogether
            isReady
          />
        </FinaleDialog>
      )}
    </ScreenContainer>
  );
}
