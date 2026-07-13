"use client";

import { useEffect, useState } from "react";
import type {
  Artifact,
  InventoryItem,
  QuestProgress,
} from "../../types/game";
import { soundManager } from "../../lib/soundManager";

type CodexBarProps = {
  artifacts: Artifact[];
  inventory: InventoryItem[];
  quests: QuestProgress[];
  score: number;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
};

function getInventoryLabel(count: number) {
  if (count === 1) return "1 predmet";
  if (count > 1 && count < 5) return `${count} predmety`;
  return `${count} predmetov`;
}

export function CodexBar({
  artifacts,
  inventory,
  quests,
  score,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
}: CodexBarProps) {
  const [isMuted, setIsMuted] = useState(false);

  const activeQuests = quests.filter(
    (quest) => quest.status === "active"
  ).length;

  const completedQuests = quests.filter(
    (quest) => quest.status === "completed"
  ).length;

  useEffect(() => {
    setIsMuted(soundManager.isMuted());
  }, []);

  function toggleSound() {
    const nextMutedState = !isMuted;

    soundManager.setMuted(nextMutedState);
    setIsMuted(nextMutedState);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-amber-300/15 bg-slate-950/95 px-4 py-3 shadow-xl shadow-amber-950/20 backdrop-blur">
      <div className="mx-auto flex max-w-md flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400/80">
            Denník pátrača
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              aria-label={
                isMuted
                  ? "Zapnúť zvuk"
                  : "Vypnúť zvuk"
              }
              title={
                isMuted
                  ? "Zapnúť zvuk"
                  : "Vypnúť zvuk"
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600/50 bg-slate-800/70 text-sm transition hover:border-amber-300/40 hover:bg-slate-700"
            >
              <span aria-hidden="true">
                {isMuted ? "🔇" : "🔊"}
              </span>
            </button>

            <div className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
              ⭐ {score}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onOpenInventory}
            className="rounded-xl border border-sky-300/20 bg-sky-400/10 px-3 py-2 text-left shadow-lg shadow-sky-950/10 transition hover:border-sky-300/40 hover:bg-sky-400/20"
          >
            <span className="block text-sm font-bold text-sky-100">
              🎒 Inventár
            </span>

            <span className="mt-0.5 block text-xs text-slate-400">
              {getInventoryLabel(inventory.length)}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenArtifacts}
            className="rounded-xl border border-amber-300/20 bg-amber-400/10 px-3 py-2 text-left shadow-lg shadow-amber-950/10 transition hover:border-amber-300/40 hover:bg-amber-400/20"
          >
            <span className="block text-sm font-bold text-amber-100">
              🏛️ Artefakty
            </span>

            <span className="mt-0.5 block text-xs text-slate-400">
              {artifacts.length}/12
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenQuests}
            className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-left shadow-lg shadow-emerald-950/10 transition hover:border-emerald-300/40 hover:bg-emerald-400/20"
          >
            <span className="block text-sm font-bold text-emerald-100">
              📜 Úlohy
            </span>

            <span className="mt-0.5 block text-xs text-slate-400">
              {activeQuests} akt. / {completedQuests} spl.
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}