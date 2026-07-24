"use client";

import { useEffect, useState } from "react";
import { ActionButton } from "./ActionButton";

type JournalRevealProps = {
  imageSrc: string;
  imageAlt: string;
  introText?: string;
  continueLabel?: string;
  onContinue: () => void;
};

const DUST_PARTICLES = [
  { left: "8%", top: "17%", delay: "0.2s", duration: "7.4s" },
  { left: "17%", top: "69%", delay: "1.8s", duration: "8.1s" },
  { left: "27%", top: "31%", delay: "0.9s", duration: "6.7s" },
  { left: "38%", top: "81%", delay: "2.5s", duration: "9.2s" },
  { left: "48%", top: "12%", delay: "1.1s", duration: "7.8s" },
  { left: "59%", top: "73%", delay: "3.1s", duration: "8.7s" },
  { left: "68%", top: "24%", delay: "0.5s", duration: "7.1s" },
  { left: "78%", top: "62%", delay: "2.2s", duration: "9.5s" },
  { left: "89%", top: "35%", delay: "1.5s", duration: "8.3s" },
  { left: "93%", top: "79%", delay: "3.4s", duration: "7.6s" },
];

export function JournalReveal({
  imageSrc,
  imageAlt,
  introText,
  continueLabel = "Preskúmať nultý bod",
  onContinue,
}: JournalRevealProps) {
  const [isSceneVisible, setIsSceneVisible] = useState(false);
  const [isPaperVisible, setIsPaperVisible] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const sceneTimer = window.setTimeout(() => {
      setIsSceneVisible(true);
    }, 80);

    const paperTimer = window.setTimeout(() => {
      setIsPaperVisible(true);
    }, 620);

    const controlsTimer = window.setTimeout(() => {
      setAreControlsVisible(true);
    }, 2350);

    return () => {
      window.clearTimeout(sceneTimer);
      window.clearTimeout(paperTimer);
      window.clearTimeout(controlsTimer);
    };
  }, []);

  function handleContinue() {
    if (isLeaving) {
      return;
    }

    setIsLeaving(true);

    window.setTimeout(() => {
      onContinue();
    }, 620);
  }

  return (
    <section
      className={[
        "journal-reveal",
        isSceneVisible ? "journal-reveal-visible" : "",
        isLeaving ? "journal-reveal-leaving" : "",
      ].join(" ")}
      aria-label="Odhalenie pátračovho zápisu"
    >
      <div className="journal-reveal-desk" aria-hidden="true" />
      <div className="journal-reveal-light" aria-hidden="true" />
      <div className="journal-reveal-vignette" aria-hidden="true" />

      <div className="journal-reveal-dust" aria-hidden="true">
        {DUST_PARTICLES.map((particle, index) => (
          <span
            key={`journal-dust-${index}`}
            className="journal-reveal-dust-particle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="journal-reveal-stage">
        {introText && (
          <p
            className={[
              "journal-reveal-intro",
              isSceneVisible ? "journal-reveal-intro-visible" : "",
            ].join(" ")}
          >
            {introText}
          </p>
        )}

        <figure
          className={[
            "journal-reveal-paper",
            isPaperVisible ? "journal-reveal-paper-visible" : "",
          ].join(" ")}
        >
          <div className="journal-reveal-paper-shadow" aria-hidden="true" />

          <img
            src={imageSrc}
            alt={imageAlt}
            className="journal-reveal-paper-image"
            draggable={false}
          />
        </figure>

        <div
          className={[
            "journal-reveal-controls",
            areControlsVisible ? "journal-reveal-controls-visible" : "",
          ].join(" ")}
        >
          <ActionButton onClick={handleContinue}>
            {continueLabel}
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
