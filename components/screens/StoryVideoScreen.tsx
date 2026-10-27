"use client";

import type { StoryVideoContent } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { ScreenContainer } from "../ui/ScreenContainer";
import { StoryVideo } from "../ui/StoryVideo";

type StoryVideoScreenProps = {
  video: StoryVideoContent;
  /** Video skončilo alebo ho hráč preskočil. */
  onDone: () => void;
  /** Súbor chýba alebo sa nenačíta. */
  onUnavailable: () => void;
};

/** Pri vypnutých animáciách sa tlačidlá ani pri stlačení nehýbu. */
const STILL_BUTTON = "motion-reduce:transition-none motion-reduce:active:scale-100";

/**
 * Video v príbehu (úvod kapitoly, Strážca pri bráne). Nikdy sa nespustí samo;
 * po skončení alebo „Preskočiť“ hra pokračuje ďalej.
 */
export function StoryVideoScreen({
  video,
  onDone,
  onUnavailable,
}: StoryVideoScreenProps) {
  return (
    <ScreenContainer>
      <section
        aria-labelledby="story-video-title"
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-amber-300/20 bg-[radial-gradient(circle_at_50%_30%,rgba(180,120,40,0.18),transparent_60%),linear-gradient(to_bottom,#0b0f1c,#050710)] px-5 py-8 text-center shadow-2xl shadow-black/60"
      >
        <h1
          id="story-video-title"
          className="text-3xl font-black text-amber-100"
        >
          {video.title}
        </h1>

        <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

        <StoryVideo
          src={video.videoSrc}
          posterSrc={video.posterSrc}
          captionsSrc={video.captionsSrc}
          description={video.videoDescription}
          onUnavailable={onUnavailable}
          onEnded={onDone}
          // Video je na výšku: na telefóne má byť „Preskočiť“ vidno bez posúvania
          // (aj pod lištou hry pri videu Strážcu).
          className="mt-6 max-h-[52svh]"
        />

        <div className="mt-8 flex flex-col gap-3">
          <ActionButton
            variant="secondary"
            onClick={onDone}
            className={STILL_BUTTON}
          >
            {video.skipLabel}
          </ActionButton>
        </div>
      </section>
    </ScreenContainer>
  );
}
