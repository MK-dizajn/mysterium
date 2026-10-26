"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../items/useReducedMotion";

type TypewriterProps = {
  text: string;
  speed?: number;
  onComplete?: () => void;
};

const TAP_HINT = "Ťukni na text a zobrazí sa celý.";

/**
 * Text sa vypisuje postupne; ťuknutie ho ukáže celý. Pri vypnutých
 * animáciách je celý hneď. Čítačka dostane vždy celý text naraz
 * (vypisovaná časť je pre ňu skrytá). Pri zmene textu treba nový key.
 */
export function Typewriter({
  text,
  speed = 22,
  onComplete,
}: TypewriterProps) {
  const reducedMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  const isComplete = reducedMotion || isSkipped || count >= text.length;
  const displayed = isComplete ? text : text.slice(0, count);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const interval = window.setInterval(() => {
      setCount((current) => current + 1);
    }, speed);

    return () => window.clearInterval(interval);
  }, [isComplete, speed]);

  useEffect(() => {
    if (isComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      onCompleteRef.current?.();
    }
  }, [isComplete]);

  return (
    <button
      type="button"
      onClick={() => setIsSkipped(true)}
      className="w-full text-left"
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden="true" className="block whitespace-pre-line leading-normal">
        {displayed}
        {!isComplete && <span className="animate-pulse">|</span>}
      </span>

      {!isComplete && (
        <span aria-hidden="true" className="mt-2 block text-xs leading-normal text-slate-400">
          {TAP_HINT}
        </span>
      )}
    </button>
  );
}
