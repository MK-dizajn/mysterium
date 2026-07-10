import type { Artifact } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type ArtifactScreenProps = {
  artifact: Artifact;
  onBack: () => void;
};

export function ArtifactScreen({
  artifact,
  onBack,
}: ArtifactScreenProps) {
  return (
    <ScreenContainer>
      <StoryCard
        label="Stránka Codexu"
        title={artifact.title}
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/10 text-6xl shadow-lg shadow-amber-950/20">
          <span aria-hidden="true">{artifact.icon}</span>
        </div>

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Záznam artefaktu"
          variant="gold"
        >
          <p className="text-sm leading-relaxed text-amber-100">
            {artifact.shortFact}
          </p>
        </SectionCard>

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Historický záznam"
        >
          <p className="text-[15px] leading-8 text-slate-300">
            {artifact.fullText}
          </p>
        </SectionCard>

        <ActionButton onClick={onBack}>
          Späť
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}