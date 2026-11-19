"use client";

import { useEffect, useRef } from "react";
import { vibrate, HAPTIC } from "../../lib/haptics";
import { soundManager } from "../../lib/soundManager";
import { useReducedMotion } from "../items/useReducedMotion";

type SecretCompartmentProps = {
  digit: string;
  text: string;
  onDone: () => void;
};

/** Ako dlho trvá otvorenie (pri vypnutých animáciách iba krátke zastavenie). */
const OPEN_MS = 1900;
const OPEN_MS_REDUCED = 900;

/**
 * Tajná schránka: kryt sa odklopí, zvnútra vyjde svetlo a vynorí sa číslica.
 * Potom sa číslica zapíše do zápisníka (onDone). Zvuk a vibrácia pri otvorení.
 */
export function SecretCompartment({ digit, text, onDone }: SecretCompartmentProps) {
  const reducedMotion = useReducedMotion();
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    soundManager.play("compartment-open");
    vibrate(HAPTIC.open);

    const timer = window.setTimeout(() => {
      soundManager.play("digit-reveal");
      onDoneRef.current();
    }, reducedMotion ? OPEN_MS_REDUCED : OPEN_MS);

    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <div data-secret-compartment className="mt-5 flex w-full flex-col items-center">
      <svg viewBox="0 0 200 150" className="compartment w-full max-w-[240px]" aria-hidden="true">
        <defs>
          <radialGradient id="compartment-glow" cx="50%" cy="60%" r="55%">
            <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="compartment-wood" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7a4a22" />
            <stop offset="100%" stopColor="#3f2410" />
          </linearGradient>
        </defs>
        <circle className="compartment-glow" cx="100" cy="88" r="70" fill="url(#compartment-glow)" />
        <rect x="35" y="70" width="130" height="62" rx="6" fill="url(#compartment-wood)" stroke="#d4a64a" strokeWidth="2" />
        <rect x="45" y="78" width="110" height="20" rx="3" fill="#1d1208" />
        <text className="compartment-digit" x="100" y="96" textAnchor="middle" fontSize="40" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
          {digit}
        </text>
        <g data-compartment-lid className="compartment-lid">
          <rect x="31" y="58" width="138" height="18" rx="5" fill="#8b5a2b" stroke="#d4a64a" strokeWidth="2" />
          <circle cx="100" cy="67" r="5" fill="#d4a64a" />
        </g>
      </svg>
      <p role="status" className="mt-3 text-sm leading-6 text-amber-100">
        {text}
      </p>
    </div>
  );
}
