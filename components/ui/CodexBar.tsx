import type { Artifact } from "../../types/game";

type CodexBarProps = {
  artifacts: Artifact[];
  score: number;
  onOpenArtifact: (artifact: Artifact) => void;
};

export function CodexBar({ artifacts, score, onOpenArtifact }: CodexBarProps) {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 border-b border-amber-400/10 bg-slate-950/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
            Codex
          </p>
          <p className="text-xs text-amber-300">
            Získané artefakty: {artifacts.length}
            <p className="text-xs text-slate-400">Skóre: {score}</p>
          </p>
        </div>

        <div className="flex gap-2">
          {artifacts.length === 0 ? (
            <span className="text-xs text-slate-600">Zatiaľ prázdny</span>
          ) : (
            artifacts.map((artifact) => (
              <button
                key={artifact.id}
                title={artifact.title}
                onClick={() => onOpenArtifact(artifact)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-xl transition hover:bg-amber-400/20"
              >
                {artifact.icon}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}