"use client";

import type { StoryVideoContent } from "../../types/game";
import { StoryVideo } from "../ui/StoryVideo";

type StoryVideoScreenProps = {
  video: StoryVideoContent;
  /** Video skončilo alebo ho hráč preskočil (pri endLabel až po ťuknutí naň). */
  onDone: () => void;
  /** Súbor chýba alebo sa nenačíta. */
  onUnavailable: () => void;
};

/** Video v príbehu (úvod kapitoly, Strážca pri bráne) na celú obrazovku. */
export function StoryVideoScreen({
  video,
  onDone,
  onUnavailable,
}: StoryVideoScreenProps) {
  return (
    <StoryVideo
      title={video.title}
      src={video.videoSrc}
      posterSrc={video.posterSrc}
      captionsSrc={video.captionsSrc}
      description={video.videoDescription}
      skipLabel={video.skipLabel}
      endLabel={video.endLabel}
      onDone={onDone}
      onUnavailable={onUnavailable}
    />
  );
}
