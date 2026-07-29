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

  const investigationObjective =
    scene.investigation?.objective ??
    scene.puzzle.question ??
    "Rozhliadni sa okolo seba. Odpoveď nie je ukrytá v texte, ale v detaile, ktorý máš priamo pred očami.";

  const answerLabel =
    scene.puzzle.answerLabel ?? "Zapíš výsledok svojho pátrania.";

  function checkAnswer() {
    if (
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
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
    setSuccessMessage("Stopa potvrdená. Pátračov záznam sa otvára.");

    window.setTimeout(() => {
      onSolved(hintIndex);
    }, 700);
  }

  function showHint() {
    if (!hasMoreHints) {
      return;
    }

    setHintIndex((currentIndex) => currentIndex + 1);
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
          title="Tvoja úloha"
          variant="gold"
        >
          <div className="space-y-5">
            <p className="whitespace-pre-line text-left text-sm leading-relaxed text-amber-100">
              {investigationObjective}
            </p>

            <div className="border-t border-amber-300/15 pt-5">
              <p className="text-center text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
                Výsledok pátrania
              </p>

              <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-slate-300">
                {answerLabel}
              </p>

              <div className="mt-5">
                <TextInput
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);

                    if (error) {
                      setError("");
                    }
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key !== "Enter" ||
                      event.nativeEvent.isComposing ||
                      !answer.trim() ||
                      successMessage
                    ) {
                      return;
                    }

                    event.preventDefault();
                    checkAnswer();
                  }}
                  placeholder="Tvoja odpoveď"
                  aria-label={answerLabel}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="done"
                />
              </div>

              <div className="mt-4">
                <ActionButton
                  onClick={checkAnswer}
                  disabled={!answer.trim() || Boolean(successMessage)}
                >
                  {successMessage ? "Stopa potvrdená" : "Overiť odpoveď"}
                </ActionButton>
              </div>
            </div>
          </div>
        </SectionCard>

        {error && (
          <MessageBox variant="danger" title="Nesprávna stopa">
            {error}
          </MessageBox>
        )}

        {successMessage && (
          <MessageBox variant="success" title="Stopa potvrdená">
            {successMessage}
          </MessageBox>
        )}

        <SectionCard
          icon={<LightbulbIcon className="h-9 w-9" />}
          title="Pátračove poznámky"
        >
          <div className="space-y-3">
            <p className="text-center text-sm text-slate-500">
              {visibleHints.length === 0
                ? "Zatiaľ si neprečítal žiadnu poznámku."
                : `Prečítané poznámky: ${visibleHints.length}`}
            </p>

            <div className="mx-auto w-full max-w-sm">
              <ActionButton
                onClick={showHint}
                disabled={!hasMoreHints}
                variant="secondary"
                className="w-full py-3 text-xs"
              >
                {hasMoreHints
                  ? "Prečítať ďalšiu poznámku"
                  : "Všetky poznámky prečítané"}
              </ActionButton>

              {visibleHints.length === 0 && (
                <p className="mt-3 text-center text-sm leading-relaxed text-slate-500">
                  Každá prečítaná poznámka zníži výsledné skóre.
                </p>
              )}
            </div>

            {visibleHints.length > 0 && (
              <div className="space-y-2">
                {visibleHints.map((hint, index) => (
                  <p
                    key={`${scene.puzzle.id}-hint-${index}`}
                    className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-3 text-left text-sm leading-relaxed text-amber-100"
                  >
                    <strong>Poznámka {index + 1}:</strong> {hint}
                  </p>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      </StoryCard>
    </ScreenContainer>
  );
}