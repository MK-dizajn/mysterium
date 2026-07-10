"use client";

import { useState } from "react";
import type { Scene } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { TextInput } from "../ui/TextInput";
import { ScreenContainer } from "../ui/ScreenContainer";
import { MessageBox } from "../ui/MessageBox";
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
    <ScreenContainer>
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

        <TextInput
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Tvoja odpoveď..."
          aria-label="Tvoja odpoveď"
        />

        {error && (
          <MessageBox
            variant="danger"
            title="Nesprávna stopa"
          >
            {error}
          </MessageBox>
        )}

        {successMessage && (
          <MessageBox
            variant="success"
            title="Stopa potvrdená"
          >
            {successMessage}
          </MessageBox>
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

          <ActionButton
            onClick={showHint}
            disabled={!hasMoreHints}
            variant="secondary"
            className="py-3 text-xs"
          >
            {hasMoreHints ? "Odhaliť stopu" : "Všetky odhalené"}
          </ActionButton>
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

        <ActionButton onClick={checkAnswer}>
          Overiť odpoveď
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}