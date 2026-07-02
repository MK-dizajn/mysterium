"use client";

import { useEffect, useState } from "react";
import { chapterOne } from "../data/chapter-one";
import { IntroScreen } from "../components/screens/IntroScreen";
import { LandingScreen } from "../components/screens/LandingScreen";
import { PuzzleScreen } from "../components/screens/PuzzleScreen";
import { HistoryScreen } from "../components/screens/HistoryScreen";
import { FinishScreen } from "../components/screens/FinishScreen";
import { ArtifactScreen } from "../components/screens/ArtifactScreen";
import { CodexBar } from "../components/ui/CodexBar";
import type { Artifact } from "../types/game";

type Screen = "landing" | "intro" | "puzzle" | "history" | "finish" | "artifact";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>("puzzle");

  useEffect(() => {
    const savedProgress = localStorage.getItem("mysterium-progress");
    if (!savedProgress) return;

    const progress = JSON.parse(savedProgress);

    setScreen(progress.screen ?? "landing");
    setCurrentStepIndex(progress.currentStepIndex ?? 0);
    setScore(progress.score ?? 0);
    setArtifacts(progress.artifacts ?? []);
  }, []);

  useEffect(() => {
    const progress = {
      screen,
      currentStepIndex,
      score,
      artifacts,
    };

    localStorage.setItem("mysterium-progress", JSON.stringify(progress));
  }, [screen, currentStepIndex, score, artifacts]);

  function openArtifact(artifact: Artifact) {
    setPreviousScreen(screen);
    setSelectedArtifact(artifact);
    setScreen("artifact");
  }

  if (screen === "artifact" && selectedArtifact) {
    return (
      <ArtifactScreen
        artifact={selectedArtifact}
        onBack={() => setScreen(previousScreen)}
      />
    );
  }

  if (screen === "intro") {
    return (
      <IntroScreen
        chapter={chapterOne}
        onContinue={() => setScreen("puzzle")}
      />
    );
  }

  if (screen === "puzzle") {
    return (
      <>
        <CodexBar
          artifacts={artifacts}
          score={score}
          onOpenArtifact={openArtifact}
        />
        <PuzzleScreen
          step={chapterOne.steps[currentStepIndex]}
          onSolved={(hintsUsed) => {
            const points = Math.max(20, 100 - hintsUsed * 20);
            setScore((currentScore) => currentScore + points);

            const artifact = chapterOne.steps[currentStepIndex].artifact;

            setArtifacts((currentArtifacts) => {
              const alreadyCollected = currentArtifacts.some(
                (item) => item.id === artifact.id
              );

              if (alreadyCollected) return currentArtifacts;

              return [...currentArtifacts, artifact];
            });

            setScreen("history");
          }}
        />
      </>
    );
  }

  if (screen === "history") {
    return (
      <>
        <CodexBar
          artifacts={artifacts}
          score={score}
          onOpenArtifact={openArtifact}
        />
        <HistoryScreen
          step={chapterOne.steps[currentStepIndex]}
          onContinue={() => {
            const nextIndex = currentStepIndex + 1;

            if (nextIndex >= chapterOne.steps.length) {
              setScreen("finish");
              return;
            }

            setCurrentStepIndex(nextIndex);
            setScreen("puzzle");
          }}
        />
      </>
    );
  }

  if (screen === "finish") {
    return (
      <FinishScreen
        onRestart={() => {
          localStorage.removeItem("mysterium-progress");
          setCurrentStepIndex(0);
          setArtifacts([]);
          setScore(0);
          setScreen("landing");
        }}
      />
    );
  }

  return <LandingScreen onStart={() => setScreen("intro")} />;
}