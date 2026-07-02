"use client";

import { useState } from "react";
import type { Scene } from "../../types/game";
import { GameButton } from "../ui/GameButton";
import { StoryCard } from "../ui/StoryCard";

type PuzzleScreenProps = {
  scene: Scene;
  onSolved: (hintsUsed: number) => void;
};

function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function PuzzleScreen({ scene, onSolved }: PuzzleScreenProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [hintIndex, setHintIndex] = useState(0);

  const visibleHints = scene.puzzle.hints.slice(0, hintIndex);
  const hasMoreHints = hintIndex < scene.puzzle.hints.length;

  function checkAnswer() {
    const userAnswer = normalizeAnswer(answer);

    const isCorrect = scene.puzzle.acceptedAnswers.some(
      (correctAnswer) => normalizeAnswer(correctAnswer) === userAnswer
    );

    if (!isCorrect) {
      setError("Zatiaľ nie. Skús sa pozrieť pozornejšie na detail pred sebou.");
      return;
    }

    setError("");
    onSolved(hintIndex);
  }

  function showHint() {
    if (!hasMoreHints) return;
    setHintIndex(hintIndex + 1);
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-10 text-white">
      <StoryCard label={scene.location} title={scene.title}>
        <p className="text-amber-200">{scene.cinematicText}</p>

        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4 text-slate-300">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Hlas pátrača
          </p>
          <p className="mt-2 italic">„{scene.voiceLine}“</p>
        </div>

        <p>{scene.puzzle.question}</p>

        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-center text-white outline-none focus:border-amber-400"
          placeholder="Tvoja odpoveď..."
        />

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-300">
            {error}
          </p>
        )}

        <GameButton onClick={checkAnswer}>Overiť odpoveď</GameButton>

        <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Nápovedy
            </p>

            <button
              onClick={showHint}
              disabled={!hasMoreHints}
              className="rounded-xl border border-amber-400/30 px-3 py-2 text-xs font-bold text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {hasMoreHints ? "Zobraziť nápovedu" : "Všetky zobrazené"}
            </button>
          </div>

          {visibleHints.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              Zatiaľ bez nápovedy. Každá použitá nápoveda neskôr zníži skóre.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {visibleHints.map((hint, index) => (
                <p
                  key={hint}
                  className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-3 text-sm text-amber-100"
                >
                  <strong>Nápoveda {index + 1}:</strong> {hint}
                </p>
              ))}
            </div>
          )}
        </div>
      </StoryCard>
    </main>
  );
}