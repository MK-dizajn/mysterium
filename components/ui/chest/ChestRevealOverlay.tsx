"use client";

import { useEffect, useRef, useState } from "react";

type ChestRevealOverlayProps = {
  isActive: boolean;
  onComplete: () => void;
};

type RevealPhase =
  | "hidden"
  | "revealing"
  | "message"
  | "leaving"
  | "finished";

const REVEAL_START_DELAY = 100;
const MESSAGE_DELAY = 950;
const LEAVING_DELAY = 3400;
const COMPLETE_DELAY = 4200;

const particles = [
  {
    left: "10%",
    top: "72%",
    delay: "0ms",
    duration: "2800ms",
    size: "h-1 w-1",
  },
  {
    left: "21%",
    top: "49%",
    delay: "350ms",
    duration: "3300ms",
    size: "h-1.5 w-1.5",
  },
  {
    left: "34%",
    top: "78%",
    delay: "700ms",
    duration: "2700ms",
    size: "h-1 w-1",
  },
  {
    left: "47%",
    top: "40%",
    delay: "200ms",
    duration: "3500ms",
    size: "h-1 w-1",
  },
  {
    left: "59%",
    top: "69%",
    delay: "850ms",
    duration: "3000ms",
    size: "h-1.5 w-1.5",
  },
  {
    left: "72%",
    top: "44%",
    delay: "500ms",
    duration: "3200ms",
    size: "h-1 w-1",
  },
  {
    left: "84%",
    top: "74%",
    delay: "100ms",
    duration: "2900ms",
    size: "h-1 w-1",
  },
  {
    left: "91%",
    top: "53%",
    delay: "650ms",
    duration: "3400ms",
    size: "h-1.5 w-1.5",
  },
];

export function ChestRevealOverlay({
  isActive,
  onComplete,
}: ChestRevealOverlayProps) {
  const [phase, setPhase] = useState<RevealPhase>("hidden");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) {
      setPhase("finished");
      return;
    }

    setPhase("hidden");

    const revealTimer = window.setTimeout(() => {
      setPhase("revealing");
    }, REVEAL_START_DELAY);

    const messageTimer = window.setTimeout(() => {
      setPhase("message");
    }, MESSAGE_DELAY);

    const leavingTimer = window.setTimeout(() => {
      setPhase("leaving");
    }, LEAVING_DELAY);

    const completeTimer = window.setTimeout(() => {
      setPhase("finished");
      onCompleteRef.current();
    }, COMPLETE_DELAY);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(messageTimer);
      window.clearTimeout(leavingTimer);
      window.clearTimeout(completeTimer);
    };
  }, [isActive]);

  if (!isActive || phase === "finished") {
    return null;
  }

  const isRevealVisible =
    phase === "revealing" || phase === "message";

  const isMessageVisible = phase === "message";
  const isLeaving = phase === "leaving";

  return (
    <div
      className={`pointer-events-auto absolute inset-0 z-[100] overflow-hidden rounded-[inherit] transition-opacity duration-700 ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
      role="presentation"
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 bg-[#010207] transition-opacity duration-1000 ${
          isRevealVisible ? "opacity-80" : "opacity-100"
        }`}
      />

      <div
        className={`absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/15 blur-3xl transition-all duration-[2400ms] ease-out ${
          isRevealVisible
            ? "scale-125 opacity-100"
            : "scale-50 opacity-0"
        }`}
      />

      <div
        className={`absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/25 blur-2xl transition-all duration-[1900ms] ease-out ${
          isRevealVisible
            ? "scale-150 opacity-100"
            : "scale-50 opacity-0"
        }`}
      />

      <div
        className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100/20 blur-xl transition-all duration-[1500ms] ease-out ${
          isRevealVisible
            ? "scale-[2] opacity-100"
            : "scale-50 opacity-0"
        }`}
      />

      <div
        className={`absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-amber-100/80 to-transparent transition-all duration-1000 ${
          phase === "revealing"
            ? "scale-x-100 opacity-100"
            : "scale-x-0 opacity-0"
        }`}
      />

      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className={`absolute ${particle.size} rounded-full bg-amber-100 shadow-[0_0_12px_rgba(253,230,138,0.95)] transition-all ease-out ${
              isRevealVisible
                ? "-translate-y-16 opacity-80"
                : "translate-y-5 opacity-0"
            }`}
            style={{
              left: particle.left,
              top: particle.top,
              transitionDelay: particle.delay,
              transitionDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div
          className={`max-w-sm text-center transition-all duration-1000 ease-out ${
            isMessageVisible
              ? "translate-y-0 scale-100 opacity-100 blur-0"
              : "translate-y-5 scale-95 opacity-0 blur-sm"
          }`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-amber-300/75">
            Zabudnuté tajomstvo
          </p>

          <p className="mt-5 font-serif text-2xl leading-relaxed text-amber-50 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            Pred tebou leží tajomstvo, ktoré malo zostať navždy ukryté.
          </p>

          <div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.32em] text-amber-200/55">
            Odomkni minulosť
          </p>
        </div>
      </div>

      <div
        className={`absolute inset-0 bg-amber-50 transition-opacity duration-300 ${
          phase === "revealing" ? "opacity-10" : "opacity-0"
        }`}
      />

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
    </div>
  );
}