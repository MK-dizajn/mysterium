import type { Artifact, InventoryItem } from "../../types/game";

type CodexBarProps = {
  artifacts: Artifact[];
  inventory: InventoryItem[];
  score: number;
  onOpenInventory: () => void;
  onOpenArtifacts: () => void;
};

export function CodexBar({
  artifacts,
  inventory,
  score,
  onOpenInventory,
  onOpenArtifacts,
}: CodexBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-amber-300/15 bg-slate-950/95 px-4 py-3 shadow-xl shadow-amber-950/20 backdrop-blur">
      <div className="mx-auto flex max-w-md flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400/70">
              Denník pátrača
            </p>
            <p className="text-xs text-slate-400">Mestská stopa</p>
          </div>

          <div className="rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
            ⭐ {score}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenInventory}
            className="rounded-xl border border-sky-300/15 bg-sky-400/10 px-3 py-2 text-left text-xs text-sky-100 transition hover:border-sky-300/40 hover:bg-sky-400/20"
          >
            <span className="block font-semibold">🎒 Inventár</span>
            <span className="text-slate-400">{inventory.length}/10 predmetov</span>
          </button>

          <button
            onClick={onOpenArtifacts}
            className="rounded-xl border border-amber-300/15 bg-amber-400/10 px-3 py-2 text-left text-xs text-amber-100 transition hover:border-amber-300/40 hover:bg-amber-400/20"
          >
            <span className="block font-semibold">🏛️ Artefakty</span>
            <span className="text-slate-400">{artifacts.length}/12 nájdené</span>
          </button>
        </div>
      </div>
    </header>
  );
}