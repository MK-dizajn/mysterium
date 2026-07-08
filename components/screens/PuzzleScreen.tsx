"use client";

import { useState } from "react";
import type { Scene } from "../../types/game";
import { GameButton } from "../ui/GameButton";
import {
  DetectiveIcon,
  LightbulbIcon,
  QuestionIcon,
  SearchIcon,
} from "../ui/MysteriumIcons";
import { SectionCard } from "../ui/SectionCard";
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
  const [successMessage, setSuccessMessage] = useState("");

  const visibleHints = scene.puzzle.hints.slice(0, hintIndex);
  const hasMoreHints = hintIndex < scene.puzzle.hints.length;

  function checkAnswer() {
    const userAnswer = normalizeAnswer(answer);

    const isCorrect = scene.puzzle.acceptedAnswers.some(
      (correctAnswer) => normalizeAnswer(correctAnswer) === userAnswer
    );

    if (!isCorrect) {
      setSuccessMessage("");
      setError(
        "Táto stopa zatiaľ nesedí. Vráť sa pohľadom k detailu pred sebou a skús nájsť niečo, čo si si predtým nevšimol."
      );
      return;
    }

    setError("");
    setSuccessMessage("Stopa potvrdená. Pátračov záznam sa otvára...");

    window.setTimeout(() => {
      onSolved(hintIndex);
    }, 700);
  }

  function showHint() {
    if (!hasMoreHints) return;
    setHintIndex(hintIndex + 1);
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-6 pb-10 pt-10 text-white">
      <StoryCard label={scene.location} title={scene.title}>
        <p className="text-amber-200">{scene.cinematicText}</p>

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Hlas pátrača"
        >
          <p className="italic leading-relaxed text-slate-300">
            „{scene.voiceLine}“
          </p>
        </SectionCard>

        <SectionCard
          icon={<SearchIcon className="h-9 w-9" />}
          title="Vyšetrovanie miesta"
          variant="gold"
        >
          <p className="text-sm leading-relaxed text-amber-100">
            Rozhliadni sa okolo seba. Odpoveď nie je ukrytá v texte, ale v
            detaile, ktorý máš priamo pred očami.
          </p>
        </SectionCard>

        <SectionCard
          icon={<QuestionIcon className="h-9 w-9" />}
          title="Otázka"
        >
          <p className="mt-2 text-[15px] leading-8 text-white">
            {scene.puzzle.question}
          </p>
        </SectionCard>

        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-center text-white outline-none transition focus:border-amber-400"
          placeholder="Tvoja odpoveď..."
        />

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            <p className="text-xs font-bold uppercase tracking-widest text-red-300/70">
              Nesprávna stopa
            </p>

            <p className="mt-2 leading-relaxed">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300/70">
              Stopa potvrdená
            </p>

            <p className="mt-2 leading-relaxed">{successMessage}</p>
          </div>
        )}

        <SectionCard
          icon={<LightbulbIcon className="h-9 w-9" />}
          title="Stopy"
        >
          <div className="space-y-3">
            <p className="text-sm text-slate-500">
            {visibleHints.length === 0
            ? "Zatiaľ si neobjavil žiadnu stopu."
            : `Odhalené stopy: ${visibleHints.length}`}
          </p>

          <button
            type="button"
            onClick={showHint}
            disabled={!hasMoreHints}
            className="w-full rounded-xl border border-amber-400/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-amber-300 transition hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
            {hasMoreHints ? "Odhaliť stopu" : "Všetky odhalené"}
          </button>
          </div>

          {visibleHints.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              Každá odhalená stopa zníži výsledné skóre.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {visibleHints.map((hint, index) => (
                <p
                  key={hint}
                  className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-3 text-sm text-amber-100"
                >
                  <strong>Stopa {index + 1}:</strong> {hint}
                </p>
              ))}
            </div>
          )}
        </SectionCard>

        <GameButton onClick={checkAnswer}>Overiť odpoveď</GameButton>
      </StoryCard>
    </main>
  );
}