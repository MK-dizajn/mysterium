import type { Artifact } from "../../types/game";
import { BackBar } from "../ui/BackBar";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

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
    <ScreenContainer className="flex flex-col">
      <StoryCard
        label="Objavené miesta a príbehy"
        title="Artefakty"
      >
        {artifacts.length === 0 ? (
          <SectionCard
            icon={<DetectiveIcon className="h-9 w-9" />}
            title="Zatiaľ si nič neobjavil"
          >
            <p className="text-sm leading-relaxed text-slate-400">
              Pokračuj v pátraní a odhaľuj historické miesta, príbehy a
              detaily ukryté v uliciach mesta. Každý nový objav sa zobrazí
              práve tu.
            </p>
          </SectionCard>
        ) : (
          <div className="space-y-3">
            {artifacts.map((artifact) => (
              <button
                key={artifact.id}
                type="button"
                onClick={() => onOpenArtifact(artifact)}
                className="group w-full rounded-2xl border border-amber-400/20 bg-slate-950/70 p-4 text-left transition hover:border-amber-400/40 hover:bg-amber-400/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-3xl transition group-hover:scale-105">
                    <span aria-hidden="true">
                      {artifact.icon}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-amber-100">
                      {artifact.title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {artifact.shortFact}
                    </p>

                    {/* Bežnými písmenami, aby sa zmestil na jeden riadok. */}
                    <p className="mt-3 text-sm font-bold text-amber-300">
                      Prečítať príbeh miesta
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </StoryCard>

      <BackBar label="Späť k pátraniu" onBack={onBack} />
    </ScreenContainer>
  );
}