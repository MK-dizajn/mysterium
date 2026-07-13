"use client";

import { useEffect, useState } from "react";
import type { Artifact } from "../../types/game";

type ArtifactUnlockProps = {
  artifact: Artifact;
  onComplete: () => void;
};

export function ArtifactUnlock({
  artifact,
  onComplete,
}: ArtifactUnlockProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsRevealed(true);
    }, 450);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className={`artifact-unlock-overlay ${
        isRevealed ? "artifact-unlock-overlay-visible" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Objavený artefakt: ${artifact.title}`}
      onClick={() => {
        if (isRevealed) {
          onComplete();
        }
      }}
    >
      <div
        className={`artifact-unlock-content ${
          isRevealed ? "artifact-unlock-content-visible" : ""
        }`}
      >
        <p className="artifact-unlock-label">
          Artefakt objavený
        </p>

        <div className="artifact-unlock-icon">
          <span aria-hidden="true">{artifact.icon}</span>
        </div>

        <h2 className="artifact-unlock-title">
          {artifact.title}
        </h2>

        <p className="artifact-unlock-hint">
          Pokračuj klepnutím
        </p>
      </div>
    </div>
  );
}