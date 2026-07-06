import type { Artifact } from "../../types/game";
import { GameButton } from "../ui/GameButton";
import { StoryCard } from "../ui/StoryCard";

type ArtifactScreenProps = {
  artifact: Artifact;
  onBack: () => void;
};

export function ArtifactScreen({ artifact, onBack }: ArtifactScreenProps) {
  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-10 text-white">
      <StoryCard label="Stránka Codexu" title={artifact.title}>
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-6xl">
          {artifact.icon}
        </div>

        <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200">
          {artifact.shortFact}
        </p>

        <p>{artifact.fullText}</p>

        <GameButton onClick={onBack}>Späť</GameButton>
      </StoryCard>
    </main>
  );
}