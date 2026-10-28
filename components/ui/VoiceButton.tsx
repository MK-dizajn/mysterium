"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getServerVoiceState, voicePlayer } from "../../lib/voicePlayer";

type VoiceButtonProps = {
  /** Nahratý hlas (cesta z dát); bez neho sa tlačidlo neukáže. */
  src?: string;
  /** Spustiť samo po zobrazení (iba keď na obrazovku viedlo ťuknutie). */
  autoPlay?: boolean;
  className?: string;
};

const RING_RADIUS = 20;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/**
 * „Prečítať nahlas“: okrúhle tlačidlo 44 px s reproduktorom. Počas prehrávania
 * ukazuje zastavenie a zlatý krúžok priebehu. Pri odchode z obrazovky hlas
 * zastaví; keď súbor chýba, tlačidlo zmizne (text ostáva).
 */
export function VoiceButton({ src, autoPlay = false, className = "" }: VoiceButtonProps) {
  const state = useSyncExternalStore(
    voicePlayer.subscribe,
    voicePlayer.getSnapshot,
    getServerVoiceState
  );

  useEffect(() => {
    if (!src) {
      return;
    }

    if (autoPlay) {
      voicePlayer.autoPlay(src);
    }

    return () => voicePlayer.stop(src);
  }, [src, autoPlay]);

  if (!src || state.failed.has(src)) {
    return null;
  }

  const isPlaying = state.src === src;
  const progress = isPlaying ? state.progress : 0;

  return (
    <button
      type="button"
      data-voice-src={src}
      data-voice-state={isPlaying ? "playing" : "idle"}
      data-voice-progress={progress.toFixed(3)}
      onClick={() => (isPlaying ? voicePlayer.stop(src) : voicePlayer.play(src))}
      aria-label={isPlaying ? "Zastaviť čítanie" : "Prečítať nahlas"}
      aria-pressed={isPlaying}
      title={isPlaying ? "Zastaviť čítanie" : "Prečítať nahlas"}
      className={[
        "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-amber-200 transition-colors duration-200 motion-reduce:transition-none",
        isPlaying
          ? "border-amber-300/70 bg-amber-400/15"
          : "border-amber-300/35 bg-slate-950/60 hover:border-amber-300/70",
        className,
      ].join(" ")}
    >
      <svg viewBox="0 0 44 44" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle
          data-voice-ring
          cx="22"
          cy="22"
          r={RING_RADIUS}
          fill="none"
          stroke="#fcd34d"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - progress)}
          opacity={isPlaying ? 1 : 0}
          className="transition-[stroke-dashoffset] duration-300 ease-linear motion-reduce:transition-none"
        />
      </svg>

      <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isPlaying ? (
          <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none" />
        ) : (
          <>
            <path d="M4 10v4h4l5 4V6L8 10H4z" fill="currentColor" stroke="none" />
            <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
          </>
        )}
      </svg>
    </button>
  );
}
