"use client";

import { useState } from "react";
import type { NoteHandover } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { ScreenContainer } from "../ui/ScreenContainer";
import { StoryVideo } from "../ui/StoryVideo";

type NoteHandoverScreenProps = {
  handover: NoteHandover;
  continueLabel: string;
  /** Hráč už video videl alebo preskočil (po F5 sa neopakuje). */
  isVideoSeen: boolean;
  onVideoSeen: () => void;
  onViewNote: () => void;
  onContinue: () => void;
};

/** Pri vypnutých animáciách sa tlačidlá ani pri stlačení nehýbu. */
const STILL_BUTTON = "motion-reduce:transition-none motion-reduce:active:scale-100";

/**
 * Strážca odovzdá zápis. Video (ak je v dátach) sa nikdy nespustí samo
 * a dá sa preskočiť; bez videa alebo keď sa nenačíta, ostane text.
 * Potom si hráč zápis prezrie alebo ide rovno k nultému bodu.
 */
export function NoteHandoverScreen({
  handover,
  continueLabel,
  isVideoSeen,
  onVideoSeen,
  onViewNote,
  onContinue,
}: NoteHandoverScreenProps) {
  const [isVideoDone, setIsVideoDone] = useState(
    isVideoSeen || !handover.videoSrc
  );

  function finishVideo() {
    setIsVideoDone(true);
    onVideoSeen();
  }

  return (
    <ScreenContainer>
      <section
        aria-labelledby="note-handover-title"
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-amber-300/20 bg-[radial-gradient(circle_at_50%_30%,rgba(180,120,40,0.18),transparent_60%),linear-gradient(to_bottom,#0b0f1c,#050710)] px-5 py-8 text-center shadow-2xl shadow-black/60"
      >
        <h1
          id="note-handover-title"
          className="text-3xl font-black text-amber-100"
        >
          {handover.title}
        </h1>

        <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

        {isVideoDone ? (
          <>
            <p className="mt-6 text-left text-[16px] leading-normal text-slate-200">
              {handover.text}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <ActionButton onClick={onViewNote} className={STILL_BUTTON}>
                {handover.viewNoteLabel}
              </ActionButton>

              <ActionButton
                variant="secondary"
                onClick={onContinue}
                className={STILL_BUTTON}
              >
                {continueLabel}
              </ActionButton>
            </div>
          </>
        ) : (
          <>
            <StoryVideo
              src={handover.videoSrc}
              posterSrc={handover.posterSrc}
              captionsSrc={handover.captionsSrc}
              description={handover.videoDescription}
              onUnavailable={() => setIsVideoDone(true)}
              onEnded={finishVideo}
              className="mt-6"
            />

            <div className="mt-8 flex flex-col gap-3">
              <ActionButton
                variant="secondary"
                onClick={finishVideo}
                className={STILL_BUTTON}
              >
                {handover.skipLabel}
              </ActionButton>
            </div>
          </>
        )}
      </section>
    </ScreenContainer>
  );
}
