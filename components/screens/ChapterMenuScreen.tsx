"use client";

import { useState } from "react";
import type { ChapterCatalogEntry, GameState } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { BackBar } from "../ui/BackBar";
import { ConfirmDialog } from "../ui/ConfirmDialog";

type ChapterState = "locked" | "unlocked" | "inProgress" | "finished" | "comingSoon";

type ChapterMenuScreenProps = {
  catalog: ChapterCatalogEntry[];
  unlockedChapterIds: string[];
  /** Uložená hra (ak je) a id jej kapitoly. */
  savedGame: GameState | null;
  savedChapterId: string | null;
  /** Názov aktu uloženej hry (napríklad „Akt II – Moc a poznanie“). */
  savedActTitle?: string;
  onEnterCode: (chapter: ChapterCatalogEntry) => void;
  /** „Mám kód časti“: kód aktu pri odomknutej kapitole. */
  onEnterPartCode: (chapter: ChapterCatalogEntry) => void;
  onStart: (chapter: ChapterCatalogEntry) => void;
  onContinue: () => void;
  onBack: () => void;
};

const STILL_BUTTON = "motion-reduce:transition-none motion-reduce:active:scale-100";

const BADGES: Record<ChapterState, { label: string; className: string }> = {
  locked: { label: "🔒 Uzamknutá", className: "border-slate-500/60 text-slate-300" },
  unlocked: { label: "Odomknutá", className: "border-emerald-400/50 text-emerald-200" },
  inProgress: { label: "Rozohraná", className: "border-amber-300/60 text-amber-200" },
  finished: { label: "Dokončená", className: "border-amber-300/60 text-amber-200" },
  comingSoon: { label: "Čoskoro", className: "border-slate-600 text-slate-400" },
};

/**
 * Menu kapitol: dlaždica pre každú kapitolu z katalógu. Uzamknutá kapitola
 * pýta kód, odomknutá sa dá začať alebo v nej pokračovať, „Čoskoro“ sa
 * nedá ťuknúť.
 */
export function ChapterMenuScreen({
  catalog,
  unlockedChapterIds,
  savedGame,
  savedChapterId,
  savedActTitle,
  onEnterCode,
  onEnterPartCode,
  onStart,
  onContinue,
  onBack,
}: ChapterMenuScreenProps) {
  const [restartChapter, setRestartChapter] = useState<ChapterCatalogEntry | null>(null);

  function getState(chapter: ChapterCatalogEntry): ChapterState {
    if (chapter.status === "comingSoon") return "comingSoon";
    if (!unlockedChapterIds.includes(chapter.id)) return "locked";
    if (savedGame && savedChapterId === chapter.id) {
      return savedGame.screen === "finish" ? "finished" : "inProgress";
    }
    return "unlocked";
  }

  const isFirstLocked = (chapter: ChapterCatalogEntry) =>
    chapter.id === catalog.find((c) => c.status === "available")?.id;

  return (
    <main className="relative min-h-screen bg-[#03050a] px-4 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,_rgba(217,166,55,0.14),_transparent_45%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-amber-400/80">
          Bratislava
        </p>
        <h1 className="mt-2 text-3xl font-black text-amber-100">Kapitoly</h1>

        <ul className="mt-6 space-y-4">
          {catalog.map((chapter) => {
            const state = getState(chapter);
            const badge = BADGES[state];
            const isComingSoon = state === "comingSoon";

            return (
              <li key={chapter.id}>
              <div
                role="group"
                data-chapter-tile={chapter.number}
                data-chapter-state={state}
                aria-disabled={isComingSoon}
                aria-label={
                  isComingSoon
                    ? `${chapter.title}, pripravujeme`
                    : `Kapitola ${chapter.number}: ${chapter.title}`
                }
                className={[
                  "rounded-3xl border p-5",
                  isComingSoon
                    ? "border-slate-800 bg-slate-950/40 opacity-70"
                    : "border-amber-300/25 bg-[linear-gradient(to_bottom,#0f1424,#070a12)] shadow-xl shadow-black/40",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="pt-1 text-xs font-black uppercase tracking-[0.25em] text-amber-300/80">
                    Kapitola {chapter.number}
                  </p>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>

                {!isComingSoon && (
                  <>
                    <h2 className="mt-3 text-xl font-black leading-snug text-amber-50">
                      {chapter.title}
                    </h2>
                    {chapter.subtitle && (
                      <p className="mt-1 text-sm text-slate-300">{chapter.subtitle}</p>
                    )}
                  </>
                )}

                {isComingSoon && (
                  <h2 className="mt-3 text-xl font-black text-slate-300">{chapter.title}</h2>
                )}

                {chapter.route && (
                  <p className="mt-3 text-sm leading-normal text-slate-400">
                    {chapter.route.stops} zastávok · štart: {chapter.route.start} ·{" "}
                    {chapter.route.duration}
                  </p>
                )}

                {state === "inProgress" && savedGame && (
                  <p className="mt-3 text-sm font-semibold text-amber-200">
                    {[savedActTitle, `${savedGame.score} bodov`].filter(Boolean).join(" · ")}
                  </p>
                )}

                {state === "finished" && savedGame && (
                  <p className="mt-3 text-sm font-semibold text-amber-200">
                    Dokončená · {savedGame.score} bodov
                  </p>
                )}

                {state === "locked" && isFirstLocked(chapter) && (
                  <p className="mt-3 text-sm font-semibold text-amber-300">★ Začni tu</p>
                )}

                {!isComingSoon && (
                  <div className="mt-4 flex flex-col gap-3">
                    {state === "locked" && (
                      <ActionButton onClick={() => onEnterCode(chapter)} className={STILL_BUTTON}>
                        Zadať kód
                      </ActionButton>
                    )}

                    {state === "unlocked" && (
                      <ActionButton onClick={() => onStart(chapter)} className={STILL_BUTTON}>
                        Začať kapitolu
                      </ActionButton>
                    )}

                    {(state === "inProgress" || state === "finished") && (
                      <>
                        <ActionButton onClick={onContinue} className={STILL_BUTTON}>
                          Pokračovať
                        </ActionButton>
                        <ActionButton
                          variant="secondary"
                          onClick={() => setRestartChapter(chapter)}
                          className={STILL_BUTTON}
                        >
                          {state === "finished" ? "Hrať znova" : "Začať odznova"}
                        </ActionButton>
                      </>
                    )}

                    {/* Kód časti (akt) pri odomknutej kapitole – nenápadný odkaz. */}
                    {state !== "locked" && (
                      <button
                        type="button"
                        onClick={() => onEnterPartCode(chapter)}
                        className="min-h-11 self-center px-3 text-sm font-semibold text-amber-200 underline decoration-amber-300/40 underline-offset-4 hover:text-amber-100"
                      >
                        Mám kód časti
                      </button>
                    )}
                  </div>
                )}
              </div>
              </li>
            );
          })}
        </ul>

        <BackBar label="Späť" onBack={onBack} variant="secondary" />
      </div>

      {restartChapter && (
        <ConfirmDialog
          title="Začať odznova?"
          message="Tvoj doterajší postup sa vymaže: body, predmety, artefakty aj vyriešené úlohy. Túto akciu nemožno vrátiť."
          confirmLabel="Áno, začať odznova"
          onConfirm={() => {
            const chapter = restartChapter;
            setRestartChapter(null);
            onStart(chapter);
          }}
          onCancel={() => setRestartChapter(null)}
        />
      )}
    </main>
  );
}
