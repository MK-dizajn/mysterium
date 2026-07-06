import type { Artifact } from "../../types/game";

type ArtifactsScreenProps = {
  artifacts: Artifact[];
  onBack: () => void;
  onOpenArtifact: (artifact: Artifact) => void;
};

export function ArtifactsScreen({
  artifacts,
  onBack,
  onOpenArtifact,
}: ArtifactsScreenProps) {
  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-10 text-white">
      <div className="mx-auto max-w-md">
        <button onClick={onBack} className="mb-6 text-sm text-amber-300">
          ← Späť
        </button>

        <h1 className="mb-6 text-3xl font-bold text-white">
          🏛️ Artefakty
        </h1>

        {artifacts.length === 0 ? (
          <p className="text-slate-500">Zatiaľ nemáš žiadne artefakty.</p>
        ) : (
          <div className="space-y-3">
            {artifacts.map((artifact) => (
              <button
                key={artifact.id}
                onClick={() => onOpenArtifact(artifact)}
                className="w-full rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-left transition hover:bg-amber-400/20"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-2xl">{artifact.icon}</span>
                  <h2 className="font-bold text-amber-100">
                    {artifact.title}
                  </h2>
                </div>

                <p className="text-sm leading-6 text-slate-300">
                  {artifact.shortFact}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}