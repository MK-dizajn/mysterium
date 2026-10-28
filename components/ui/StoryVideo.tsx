"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "../items/useReducedMotion";
import { voicePlayer } from "../../lib/voicePlayer";
import { ActionButton } from "./ActionButton";

type StoryVideoProps = {
  title: string;
  src?: string;
  posterSrc?: string;
  captionsSrc?: string;
  /** Krátky popis deja videa pre čítačku obrazovky. */
  description?: string;
  skipLabel: string;
  /**
   * Tlačidlo, ktoré ostane po skončení alebo „Preskočiť“ (napríklad
   * „Spustiť kapitolu“). Bez neho hra pokračuje hneď po videu.
   */
  endLabel?: string;
  /** Video skončilo alebo ho hráč preskočil (pri endLabel až po ťuknutí naň). */
  onDone: () => void;
  /** Súbor chýba alebo sa nedá prehrať: hra ukáže náhradu (text). */
  onUnavailable: () => void;
};

type Phase = "playing" | "paused" | "ended" | "leaving";

/** Dĺžka prelínania do tmy (pri vypnutých animáciách sa neprelína). */
const FADE_OUT_MS = 500;

/**
 * Video v príbehu na celú obrazovku („kino“). Spustí sa hneď so zvukom –
 * ťuknutie, ktoré naň viedlo, je povolenie. Keď prehliadač prehrávanie
 * zablokuje alebo hráč video pozastaví, ukáže sa veľké zlaté „Prehrať“.
 * Titulky kreslí hra sama (písmo s pätkami, dole v tmavom prechode).
 */
export function StoryVideo({
  title,
  src,
  posterSrc,
  captionsSrc,
  description,
  skipLabel,
  endLabel,
  onDone,
  onUnavailable,
}: StoryVideoProps) {
  const titleId = useId();
  const descriptionId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLTrackElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const endButtonRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("playing");
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  // Bez súboru v dátach hneď náhrada.
  useEffect(() => {
    if (!src) {
      onUnavailable();
    }
    // onUnavailable sa pri každom vykreslení mení; rozhoduje iba súbor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Pod videom sa stránka neposúva.
  useEffect(() => {
    if (!src) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [src]);

  // Spustenie hneď po zobrazení; zablokované prehrávanie ukáže „Prehrať“.
  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    // Video a hlas nikdy naraz.
    voicePlayer.stop();
    toggleRef.current?.focus();
    video.play().catch(() => setPhase("paused"));
  }, [src]);

  // Titulky: prehliadač ich nekreslí (skryté), text berieme z aktívnej časti.
  useEffect(() => {
    const track = trackRef.current?.track;

    if (!track) {
      return;
    }

    track.mode = "hidden";

    function showActiveCue() {
      const cues = track?.activeCues;
      const texts = cues
        ? Array.from(cues).map((cue) => (cue as VTTCue).text)
        : [];
      setCaption(texts.join("\n"));
    }

    track.addEventListener("cuechange", showActiveCue);

    return () => track.removeEventListener("cuechange", showActiveCue);
  }, [captionsSrc]);

  useEffect(() => {
    if (phase === "ended") {
      endButtonRef.current?.querySelector("button")?.focus();
    }
  }, [phase]);

  if (!src) {
    return null;
  }

  function finish() {
    videoRef.current?.pause();
    setCaption("");

    if (endLabel) {
      setPhase("ended");
      return;
    }

    leave();
  }

  function leave() {
    setPhase("leaving");

    if (isReducedMotion) {
      onDone();
      return;
    }

    window.setTimeout(onDone, FADE_OUT_MS);
  }

  function togglePlay() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      video.play().catch(() => setPhase("paused"));
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  const isActive = phase === "playing" || phase === "paused";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      data-story-video
      className={[
        "story-cinema fixed inset-0 z-[70] overflow-hidden bg-[#0b0805] text-amber-50",
        phase === "leaving" ? "story-cinema-leaving" : "",
      ].join(" ")}
    >
      {/* Na širokej obrazovke sú po bokoch rozmazaný plagát a tma. */}
      {posterSrc && (
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-2xl"
          style={{ backgroundImage: `url(${posterSrc})` }}
        />
      )}

      <div className="relative mx-auto h-full w-full max-w-[calc(100dvh*9/16)]">
        <video
          ref={videoRef}
          playsInline
          preload="auto"
          poster={posterSrc}
          src={src}
          onPlay={() => setPhase("playing")}
          onPause={() =>
            setPhase((current) => (current === "playing" ? "paused" : current))
          }
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            setProgress(video.duration ? video.currentTime / video.duration : 0);
          }}
          onEnded={finish}
          onError={onUnavailable}
          className={[
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 motion-reduce:transition-none",
            phase === "ended" ? "opacity-30" : "opacity-100",
          ].join(" ")}
        >
          {captionsSrc && (
            <track
              ref={trackRef}
              kind="captions"
              src={captionsSrc}
              srcLang="sk"
              label="Slovenčina"
            />
          )}
        </video>

        {/* Ťuknutie kamkoľvek na obraz pozastaví alebo spustí video. */}
        {isActive && (
          <button
            ref={toggleRef}
            type="button"
            onClick={togglePlay}
            aria-label={phase === "paused" ? "Prehrať video" : "Pozastaviť video"}
            className="absolute inset-0 flex items-center justify-center focus-visible:outline-none"
          >
            {phase === "paused" && (
              <span data-story-play-seal className="story-play-seal">
                <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
                  <circle cx="48" cy="48" r="45" fill="rgba(11,8,5,0.55)" stroke="currentColor" strokeWidth="2" />
                  <circle cx="48" cy="48" r="38" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
                  <path d="M40 31 L67 48 L40 65 Z" fill="currentColor" />
                </svg>
              </span>
            )}
          </button>
        )}

        {/* Hore: priebeh, nadpis, zvuk a „Preskočiť“. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-[#0b0805]/80 via-[#0b0805]/30 to-transparent pb-10">
          <div aria-hidden="true" className="h-[3px] w-full bg-amber-100/15">
            <div
              data-story-progress
              className="h-full bg-amber-300 transition-[width] duration-300 ease-linear motion-reduce:transition-none"
              style={{ width: `${Math.round(progress * 1000) / 10}%` }}
            />
          </div>

          <div className="flex min-h-11 items-center justify-end gap-2 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
            {isActive && (
              <>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Zapnúť zvuk" : "Vypnúť zvuk"}
                  aria-pressed={isMuted}
                  className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-200/30 bg-black/40 text-amber-100 backdrop-blur-sm"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 10v4h4l5 4V6L8 10H4z" fill="currentColor" stroke="none" />
                    {isMuted ? (
                      <path d="M17 9l5 6M22 9l-5 6" />
                    ) : (
                      <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
                    )}
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={finish}
                  aria-label={`${skipLabel} video`}
                  className="pointer-events-auto min-h-11 shrink-0 rounded-full border border-amber-300/50 bg-black/40 px-4 text-xs font-black uppercase tracking-[0.14em] text-amber-100 backdrop-blur-sm"
                >
                  {skipLabel}
                </button>
              </>
            )}
          </div>

          {/* Nadpis na vlastnom riadku, aby sa na úzkom telefóne neskracoval. */}
          <h1
            id={titleId}
            className="mt-2 px-4 text-xs font-bold uppercase leading-snug tracking-[0.22em] text-amber-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
          >
            {title}
          </h1>
        </div>

        {/* Dole: titulky v tmavom prechode (mimo tvárí v strede obrazu). */}
        {isActive && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex min-h-[38%] items-end bg-gradient-to-t from-[#0b0805]/95 via-[#0b0805]/60 to-transparent px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <p
              data-story-captions
              aria-hidden="true"
              className="story-captions mx-auto w-full max-w-md whitespace-pre-line text-center"
            >
              {caption}
            </p>
          </div>
        )}

        {/* Po konci namiesto (často čierneho) posledného záberu stlmený plagát. */}
        {phase === "ended" && posterSrc && (
          <div
            aria-hidden="true"
            data-story-end-poster
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${posterSrc})` }}
          />
        )}

        {phase === "ended" && endLabel && (
          <div
            ref={endButtonRef}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b0805] via-[#0b0805]/80 to-transparent px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-24"
          >
            <ActionButton
              onClick={leave}
              className="mx-auto block max-w-sm motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {endLabel}
            </ActionButton>
          </div>
        )}
      </div>

      {description && (
        <p id={descriptionId} className="sr-only">
          {description}
        </p>
      )}
    </div>
  );
}
