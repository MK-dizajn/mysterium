import type { Artifact } from "../../types/game";
import { BackBar } from "../ui/BackBar";
import { CodexPageTransition } from "../ui/CodexPageTransition";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { Reveal } from "../ui/Reveal";
import { ScreenContainer } from "../ui/ScreenContainer";
import { ScreenTransition } from "../ui/ScreenTransition";
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
    <ScreenContainer className="flex flex-col">
      <ScreenTransition>
        <CodexPageTransition>
          <StoryCard
            label="Artefakt"
            title={artifact.title}
          >
            <Reveal delay={300}>
              <div className="artifact-reveal mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border border-amber-400/30 bg-amber-400/10 text-6xl shadow-lg shadow-amber-950/30">
                <span aria-hidden="true">
                  {artifact.icon}
                </span>
              </div>
            </Reveal>

            <Reveal delay={700}>
              <SectionCard
                icon={<DetectiveIcon className="h-9 w-9" />}
                title="Zaujímavosť"
                variant="gold"
              >
                <p className="text-sm leading-relaxed text-amber-100">
                  {artifact.shortFact}
                </p>
              </SectionCard>
            </Reveal>

            <Reveal delay={1100}>
              <SectionCard
                icon={<DetectiveIcon className="h-9 w-9" />}
                title="Historický príbeh"
              >
                <p className="text-[15px] leading-normal text-slate-300">
                  {artifact.fullText}
                </p>
              </SectionCard>
            </Reveal>
          </StoryCard>
        </CodexPageTransition>
      </ScreenTransition>

      {/* Mimo prechodov: lišta je tam hneď, nie až po animácii. */}
      <BackBar label="Späť na artefakty" onBack={onBack} />
    </ScreenContainer>
  );
}