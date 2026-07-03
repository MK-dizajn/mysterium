import type { Artifact, InventoryItem } from "../../types/game";

type CodexBarProps = {
  artifacts: Artifact[];
  inventory: InventoryItem[];
  score: number;
  onOpenArtifact: (artifact: Artifact) => void;
};

export function CodexBar({
  artifacts,
  inventory,
  score,
  onOpenArtifact,
}: CodexBarProps) {
return (
  <div className="fixed left-0 right-0 top-0 z-50 border-b border-amber-400/10 bg-slate-950/90 px-4 py-2 backdrop-blur">
    <div className="mx-auto flex max-w-md items-center justify-between gap-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
          Denník pátrača
        </p>

        <p className="text-xs text-amber-300">Skóre: {score}</p>
      </div>

      <div className="flex items-center gap-2">
        {inventory.map((item) => (
          <div
            key={item.id}
            title={item.description}
            className="flex h-9 items-center gap-1 rounded-xl border border-sky-400/20 bg-sky-400/10 px-2 text-xs text-sky-100"
          >
            <span>{item.icon}</span>
            <span className="max-w-24 truncate">{item.title}</span>
          </div>
        ))}

        {artifacts.map((artifact) => (
          <button
            key={artifact.id}
            title={artifact.title}
            onClick={() => onOpenArtifact(artifact)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-xl transition hover:bg-amber-400/20"
          >
            {artifact.icon}
          </button>
        ))}
      </div>
    </div>
  </div>
);
}