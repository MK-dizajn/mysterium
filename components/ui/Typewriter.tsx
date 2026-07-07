"use client";

import { useEffect, useRef, useState } from "react";

type TypewriterProps = {
  text: string;
  speed?: number;
  onComplete?: () => void;
};

export function Typewriter({
  text,
  speed = 22,
  onComplete,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let index = 0;
    let hasCompleted = false;

    setDisplayed("");
    setIsComplete(false);

    const interval = window.setInterval(() => {
      index += 1;

      setDisplayed(text.slice(0, index));

      if (index >= text.length && !hasCompleted) {
        hasCompleted = true;
        window.clearInterval(interval);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [text, speed]);

  function completeImmediately() {
    if (isComplete) return;

    setDisplayed(text);
    setIsComplete(true);
    onCompleteRef.current?.();
  }

  return (
    <button
      type="button"
      onClick={completeImmediately}
      className="w-full text-left"
      aria-label="Zobraziť celý text"
    >
      <p className="whitespace-pre-line leading-relaxed">
        {displayed}
        {!isComplete && <span className="animate-pulse">|</span>}
      </p>
    </button>
  );
}