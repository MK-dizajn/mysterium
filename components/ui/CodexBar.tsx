"use client";

import { useSyncExternalStore } from "react";
import type {
  Artifact,
  InventoryItem,
  QuestProgress,
} from "../../types/game";
import { formatItemCount } from "../../lib/itemCount";
import { SOUND_SETTING_EVENT, soundManager } from "../../lib/soundManager";

/** Hlavička sa prekreslí, keď sa zmení nastavenie zvuku (aj z iného miesta). */
function subscribeToSoundSetting(onChange: () => void) {
  window.addEventListener(SOUND_SETTING_EVENT, onChange);

  return () => window.removeEventListener(SOUND_SETTING_EVENT, onChange);
}

type CodexBarProps = {
  artifacts: Artifact[];
  inventory: InventoryItem[];
  quests: QuestProgress[];
  score: number;
  totalArtifacts: number;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
  onOpenQuests: () => void;
};

function getActiveQuestsLabel(count: number) {
  if (count === 1) return "1 aktívna";
  if (count > 1 && count < 5) return `${count} aktívne`;
  return `${count} aktívnych`;
}

type NavButtonProps = {
  icon: string;
  label: string;
  /** Malý odznak pri ikone (počet alebo ✓); bez neho sa neukáže. */
  badge?: string;
  /** Celý popis pre čítačku, napríklad „Inventár – 14 predmetov“. */
  ariaLabel: string;
  tone: string;
  onClick: () => void;
};

/** Tlačidlo hlavičky: ikona s odznakom a krátky nápis pod ňou (44 px na výšku). */
function NavButton({ icon, label, badge, ariaLabel, tone, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative flex h-11 min-w-14 flex-col items-center justify-center rounded-xl border px-1.5 transition ${tone}`}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {icon}
      </span>
      <span aria-hidden="true" className="mt-1 text-xs font-bold leading-none">
        {label}
      </span>
      {badge && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1.5 min-w-5 rounded-full border border-slate-950 bg-amber-300 px-1 text-center text-[11px] font-black leading-4 text-slate-950"
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/**
 * Hlavička počas hry v jednom riadku (asi 56 px): Úlohy, Inventár a Artefakty
 * s odznakmi, skóre a zvuk. Názov „Denník pátrača“ má iba čítačka.
 */
export function CodexBar({
  artifacts,
  inventory,
  quests,
  score,
  totalArtifacts,
  onOpenInventory,
  onOpenArtifacts,
  onOpenQuests,
}: CodexBarProps) {
  const isMuted = useSyncExternalStore(
    subscribeToSoundSetting,
    () => soundManager.isMuted(),
    () => false
  );

  const activeQuests = quests.filter(
    (quest) => quest.status === "active"
  ).length;

  const completedQuests = quests.filter(
    (quest) => quest.status === "completed"
  ).length;

  function toggleSound() {
    // setMuted pošle udalosť a hlavička sa prekreslí cez useSyncExternalStore.
    soundManager.setMuted(!isMuted);
  }

  const questState =
    activeQuests > 0
      ? getActiveQuestsLabel(activeQuests)
      : completedQuests > 0
        ? "splnené"
        : "žiadne";

  return (
    <header
      aria-label="Denník pátrača"
      className="sticky top-0 z-50 border-b border-amber-300/15 bg-slate-950/95 px-2 py-1.5 shadow-xl shadow-amber-950/20 backdrop-blur sm:px-4"
    >
      <div className="mx-auto flex max-w-md items-center gap-1">
        <NavButton
          icon="🕵️"
          label="Úlohy"
          badge={
            activeQuests > 0
              ? String(activeQuests)
              : completedQuests > 0
                ? "✓"
                : undefined
          }
          ariaLabel={`Úlohy – ${questState}`}
          tone="border-emerald-300/20 bg-emerald-400/10 text-emerald-100 hover:border-emerald-300/40 hover:bg-emerald-400/20"
          onClick={onOpenQuests}
        />

        <NavButton
          icon="🔎"
          label="Inventár"
          badge={inventory.length > 0 ? String(inventory.length) : undefined}
          ariaLabel={`Inventár – ${formatItemCount(inventory.length)}`}
          tone="border-sky-300/20 bg-sky-400/10 text-sky-100 hover:border-sky-300/40 hover:bg-sky-400/20"
          onClick={onOpenInventory}
        />

        <NavButton
          icon="📖"
          label="Artefakty"
          badge={artifacts.length > 0 ? String(artifacts.length) : undefined}
          ariaLabel={`Artefakty – ${artifacts.length} z ${totalArtifacts} objavených`}
          tone="border-amber-300/20 bg-amber-400/10 text-amber-100 hover:border-amber-300/40 hover:bg-amber-400/20"
          onClick={onOpenArtifacts}
        />

        <div className="ml-auto flex items-center gap-1">
          <p
            aria-label={`Skóre: ${score}`}
            className="flex h-11 items-center rounded-full border border-amber-300/20 bg-amber-400/10 px-1.5 text-xs font-semibold text-amber-200"
          >
            <span aria-hidden="true">⭐ {score}</span>
          </p>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Zapnúť zvuk" : "Vypnúť zvuk"}
            title={isMuted ? "Zapnúť zvuk" : "Vypnúť zvuk"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-600/50 bg-slate-800/70 text-sm transition hover:border-amber-300/40 hover:bg-slate-700"
          >
            <span aria-hidden="true">{isMuted ? "🔇" : "🔊"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
