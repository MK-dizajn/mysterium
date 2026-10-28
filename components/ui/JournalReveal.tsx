"use client";

import { useEffect, useState } from "react";
import type { DetectiveNote as DetectiveNoteData } from "../../types/game";
import { ActionButton } from "./ActionButton";
import { DetectiveNote } from "./DetectiveNote";
import { VoiceButton } from "./VoiceButton";

type JournalRevealProps = {
  note: DetectiveNoteData;
  continueLabel?: string;
  onContinue: () => void;
  /** Nepovinné „Zavrieť“: návrat späť bez označenia zápisu ako prečítaného. */
  closeLabel?: string;
  onClose?: () => void;
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

/**
 * Strážca podáva zápis od pátrača: papier padne na stôl (text v HTML),
 * pod ním tlačidlo na pokračovanie. Dlhší zápis sa dá posúvať.
 */
export function JournalReveal({
  note,
  continueLabel = "Preskúmať nultý bod",
  onContinue,
  closeLabel = "Zavrieť",
  onClose,
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
      aria-label={`Pátračov zápis č. ${note.number}: ${note.title}`}
    >
      {/* Stôl, svetlo a prach: pevná vrstva pod posúvaným obsahom. */}
      <div className="journal-reveal-backdrop" aria-hidden="true">
        <div className="journal-reveal-desk" />
        <div className="journal-reveal-light" />
        <div className="journal-reveal-vignette" />

        <div className="journal-reveal-dust">
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
      </div>

      <div className="journal-reveal-stage">
        {note.introText && (
          <p
            className={[
              "journal-reveal-intro",
              isSceneVisible ? "journal-reveal-intro-visible" : "",
            ].join(" ")}
          >
            {note.introText}
          </p>
        )}

        {/* Hlas pátrača nad papierom (papier sa dá ťahaním nakláňať); spustí sa sám. */}
        {note.audioSrc && (
          <div className="mb-3 flex justify-end">
            <VoiceButton src={note.audioSrc} autoPlay />
          </div>
        )}

        <figure
          className={[
            "journal-reveal-paper",
            isPaperVisible ? "journal-reveal-paper-visible" : "",
          ].join(" ")}
        >
          <DetectiveNote
            number={note.number}
            title={note.title}
            paragraphs={note.paragraphs}
            signature={note.signature}
            imageSrc={note.paperImageSrc}
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

          {onClose && (
            <ActionButton
              variant="secondary"
              onClick={onClose}
              className="mt-3"
            >
              {closeLabel}
            </ActionButton>
          )}
        </div>
      </div>
    </section>
  );
}
