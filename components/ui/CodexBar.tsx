import type { Artifact, InventoryItem } from "../../types/game";

type CodexBarProps = {
  artifacts: Artifact[];
  inventory: InventoryItem[];
  score: number;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
};

function getInventoryLabel(count: number) {
  if (count === 1) {
    return "1 predmet";
  }

  if (count > 1 && count < 5) {
    return `${count} predmety`;
  }

  return `${count} predmetov`;
}

export function CodexBar({
  artifacts,
  inventory,
  score,
  onOpenInventory,
  onOpenArtifacts,
}: CodexBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-300/15 bg-slate-950/95 px-4 py-3 shadow-xl shadow-amber-950/20 backdrop-blur">
      <div className="mx-auto flex max-w-md flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-amber-400/80">
              Denník pátrača
            </p>
          </div>

          <div className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
            ⭐ {score}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
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
              {artifacts.length}/12 nájdené
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}