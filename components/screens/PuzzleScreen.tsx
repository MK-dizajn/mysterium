"use client";

import { useId, useState } from "react";
import type { ChapterGuidance, Scene } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { RouteHint } from "../ui/RouteHint";
import { TextInput } from "../ui/TextInput";
import { ScreenContainer } from "../ui/ScreenContainer";
import { LightbulbIcon, SearchIcon } from "../ui/MysteriumIcons";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type PuzzleScreenProps = {
  scene: Scene;
  hintsUsed: number;
  /** Cesta, ktorá hráča mala doviesť sem (z predchádzajúcej scény). */
  arrivalRoute?: string;
  guidance: ChapterGuidance;
  onRevealHint: () => void;
  onSolved: () => void;
};

function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function PuzzleScreen({
  scene,
  hintsUsed,
  arrivalRoute,
  guidance,
  onRevealHint,
  onSolved,
}: PuzzleScreenProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const answerLabelId = useId();
  const feedbackId = useId();

  const visibleHints = scene.puzzle.hints.slice(0, hintsUsed);
  const hasMoreHints = hintsUsed < scene.puzzle.hints.length;

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
      onSolved();
    }, 700);
  }

  function showHint() {
    if (!hasMoreHints) {
      return;
    }

    onRevealHint();
  }

  return (
    <ScreenContainer>
      <StoryCard label={scene.location} title={scene.title}>
        {/* Ak sa hráč cestou stratil: bez straty bodov. */}
        {arrivalRoute && (
          <RouteHint
            route={arrivalRoute}
            showLabel={guidance.showRouteLabel}
            hideLabel={guidance.hideRouteLabel}
          />
        )}

        <p className="text-amber-200">{scene.cinematicText}</p>

        {/* Hlas pátrača ako krátky citát (bez veľkej karty), aby bola úloha bližšie. */}
        <figure className="border-l-2 border-amber-300/50 pl-4">
          <figcaption className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300/80">
            Hlas pátrača
          </figcaption>
          <blockquote className="mt-2 italic leading-normal text-slate-300">
            „{scene.voiceLine}“
          </blockquote>
        </figure>

        <SectionCard
          icon={<SearchIcon className="h-9 w-9" />}
          title="Tvoja úloha"
          variant="gold"
        >
          {/* Odseky zadania s polriadkovou medzerou (nie prázdny riadok). */}
          <div className="space-y-3 text-left text-sm leading-normal text-amber-100">
            {investigationObjective.split(/\n\s*\n/).map((paragraph) => (
              <p key={paragraph} className="whitespace-pre-line">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={<LightbulbIcon className="h-9 w-9" />}
          title="Pátračove poznámky"
        >
          <div className="space-y-3">
            <p className="text-center text-sm text-slate-400">
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
                <p className="mt-3 text-center text-sm leading-relaxed text-slate-400">
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

        {/*
          Lišta s odpoveďou: prilepená k spodku obrazovky (sticky, nie fixed),
          kým hráč číta obsah nad ňou; na konci obsahu leží pod ním. Výška je
          obmedzená v dvh, aby sa pri otvorenej klávesnici zmestila.
        */}
        <div className="sticky bottom-0 z-20 -mx-6 max-h-[60dvh] overflow-y-auto rounded-t-3xl border-t border-amber-300/25 bg-slate-950/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_rgba(0,0,0,0.6)] backdrop-blur">
          <p id={answerLabelId} className="text-center text-sm leading-normal text-slate-300">
            {answerLabel}
          </p>

          <div aria-live="polite">
            {error && (
              <p
                id={feedbackId}
                className="mt-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm leading-normal text-red-100"
              >
                {error}
              </p>
            )}

            {successMessage && (
              <p className="mt-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm leading-normal text-emerald-100">
                {successMessage}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-stretch gap-2">
            <div className="min-w-0 flex-1">
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
                className="h-[52px] py-0!"
                placeholder="Tvoja odpoveď"
                aria-labelledby={answerLabelId}
                aria-describedby={error ? feedbackId : undefined}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="done"
              />
            </div>

            <ActionButton
              onClick={checkAnswer}
              disabled={!answer.trim() || Boolean(successMessage)}
              fullWidth={false}
              className="h-[52px] shrink-0 px-4 py-0 tracking-[0.12em]!"
            >
              Overiť
            </ActionButton>
          </div>
        </div>
      </StoryCard>
    </ScreenContainer>
  );
}