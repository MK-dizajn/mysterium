"use client";

import { useEffect, useState } from "react";
import type { Artifact } from "../../types/game";

type ArtifactUnlockProps = {
  artifact: Artifact;
  onComplete: () => void;
};

const particles = Array.from({ length: 12 }, (_, index) => index);

export function ArtifactUnlock({
  artifact,
  onComplete,
}: ArtifactUnlockProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const startTimeout = window.setTimeout(() => {
      setIsStarted(true);
    }, 450);

    const continueTimeout = window.setTimeout(() => {
      setCanContinue(true);
    }, 2700);

    return () => {
      window.clearTimeout(startTimeout);
      window.clearTimeout(continueTimeout);
    };
  }, []);

  function continueToNextScreen() {
    if (canContinue) {
      onComplete();
    }
  }

  return (
    <div
      className={`artifact-unlock-overlay ${
        isStarted ? "artifact-unlock-overlay-visible" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Objavený artefakt: ${artifact.title}`}
      onClick={continueToNextScreen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          continueToNextScreen();
        }
      }}
      tabIndex={0}
    >
      <div
        className={`artifact-particles ${
          isStarted ? "artifact-particles-visible" : ""
        }`}
        aria-hidden="true"
      >
        {particles.map((particle) => (
          <span
            key={particle}
            className={`artifact-particle artifact-particle-${particle + 1}`}
          />
        ))}
      </div>

      <div
        className={`artifact-unlock-stage ${
          isStarted ? "artifact-unlock-stage-active" : ""
        }`}
      >
        <div
          className="artifact-unlock-cinematic-title"
          aria-hidden="true"
        >
          <span className="artifact-unlock-title-line" />

          <p>Tajomstvo odhalené</p>

          <span className="artifact-unlock-title-line" />
        </div>

        <div className="artifact-unlock-content">
          <p className="artifact-unlock-label">
            Artefakt objavený
          </p>

          <div className="artifact-unlock-icon">
            <span aria-hidden="true">{artifact.icon}</span>
          </div>

          <h2 className="artifact-unlock-title">
            {artifact.title}
          </h2>

          <p
            className={`artifact-unlock-hint ${
              canContinue
                ? "artifact-unlock-hint-visible"
                : ""
            }`}
          >
            Pokračuj klepnutím
          </p>
        </div>
      </div>
    </div>
  );
}