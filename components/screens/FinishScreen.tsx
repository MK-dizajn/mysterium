"use client";

import { useState } from "react";
import type { ChapterFinale } from "../../types/game";
import { FinaleDialog } from "../finale/FinaleDialog";
import { FinalePhotoViewer } from "../finale/FinalePhotoViewer";
import { NextPlaceCard } from "../finale/NextPlaceCard";
import { ActionButton } from "../ui/ActionButton";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { MessageBox } from "../ui/MessageBox";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type FinishScreenProps = {
  finale: ChapterFinale;
  score: number;
  /** Útržky, ktoré hráč naozaj má (pre fotografiu v okne). */
  ownedFragmentIds: string[];
  /** Hráč videl fotografiu a zadal ďalšie miesto (inak sa tlačidlá neukážu). */
  hasSeenPhoto: boolean;
  isPlaceSolved: boolean;
  onRestart: () => void;
};

const STILL_BUTTON = "motion-reduce:transition-none motion-reduce:active:scale-100";
const PLACE_BUTTON_ID = "finish-show-place";
const PHOTO_BUTTON_ID = "finish-show-photo";

/** Záver kapitoly – všetky texty sú v dátach (data/chapter-one/finale.ts). */
export function FinishScreen({
  finale,
  score,
  ownedFragmentIds,
  hasSeenPhoto,
  isPlaceSolved,
  onRestart,
}: FinishScreenProps) {
  const { ending, nextPlace, photo } = finale;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<"place" | "photo" | null>(null);

  return (
    <ScreenContainer>
      <StoryCard label={ending.label} title={ending.title}>
        {/* Riadkovanie 1,5 a medzi odsekmi asi polovica riadku. */}
        <div className="space-y-3 text-[16px] leading-normal text-slate-300">
          {ending.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <SectionCard
          icon={
            <span className="text-3xl" aria-hidden="true">
              ⭐
            </span>
          }
          title={ending.scoreLabel}
        >
          <p className="font-mono text-4xl font-black text-amber-100">{score}</p>
        </SectionCard>

        <MessageBox variant="info" title={ending.quoteTitle}>
          {`„${ending.journalQuote}“`}
        </MessageBox>

        <SectionCard
          icon={
            <span className="text-3xl" aria-hidden="true">
              🖼️
            </span>
          }
          title={ending.continuationTitle}
        >
          <p className="text-[16px] leading-normal text-slate-300">
            {ending.continuationText}
          </p>
        </SectionCard>

        <div className="flex flex-col gap-3">
          {isPlaceSolved && (
            <ActionButton
              id={PLACE_BUTTON_ID}
              onClick={() => setOpenDialog("place")}
              className={STILL_BUTTON}
            >
              {ending.showPlaceLabel}
            </ActionButton>
          )}

          {hasSeenPhoto && (
            <ActionButton
              id={PHOTO_BUTTON_ID}
              variant="secondary"
              onClick={() => setOpenDialog("photo")}
              className={STILL_BUTTON}
            >
              {nextPlace.showPhotoLabel}
            </ActionButton>
          )}

          <ActionButton
            variant="secondary"
            onClick={() => setIsConfirmOpen(true)}
            className={STILL_BUTTON}
          >
            {ending.restartLabel}
          </ActionButton>
        </div>
      </StoryCard>

      {openDialog === "place" && (
        <FinaleDialog
          label={nextPlace.cardTitle}
          closeLabel={nextPlace.closePhotoLabel}
          returnFocusId={PLACE_BUTTON_ID}
          onClose={() => setOpenDialog(null)}
        >
          <NextPlaceCard nextPlace={nextPlace} titleId="finish-place-card-title" />
        </FinaleDialog>
      )}

      {openDialog === "photo" && (
        <FinaleDialog
          label={photo.title}
          closeLabel={nextPlace.closePhotoLabel}
          returnFocusId={PHOTO_BUTTON_ID}
          onClose={() => setOpenDialog(null)}
        >
          <FinalePhotoViewer
            photo={photo}
            ownedFragmentIds={ownedFragmentIds}
            isTogether
            isReady
          />
        </FinaleDialog>
      )}

      {isConfirmOpen && (
        <ConfirmDialog
          title={ending.restartConfirmTitle}
          message={ending.restartConfirmMessage}
          confirmLabel={ending.restartConfirmLabel}
          onConfirm={() => {
            setIsConfirmOpen(false);
            onRestart();
          }}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </ScreenContainer>
  );
}
