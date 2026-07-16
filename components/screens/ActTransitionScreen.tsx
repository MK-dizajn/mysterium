import { ActionButton } from "../ui/ActionButton";
import { DetectiveIcon } from "../ui/MysteriumIcons";
import { MessageBox } from "../ui/MessageBox";
import { ScreenContainer } from "../ui/ScreenContainer";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type ActTransitionScreenProps = {
  completedActTitle: string;
  nextActTitle: string;
  evidenceCount: number;
  onContinue: () => void;
};

export function ActTransitionScreen({
  completedActTitle,
  nextActTitle,
  evidenceCount,
  onContinue,
}: ActTransitionScreenProps) {
  return (
    <ScreenContainer>
      <StoryCard
        label="Etapa vyšetrovania dokončená"
        title={completedActTitle}
      >
        <MessageBox
          variant="success"
          title="Dôkazy zhromaždené"
        >
          Dokončil si ďalšiu časť prípadu. Stopy, ktoré si získal, začínajú
          vytvárať spoločný obraz.
        </MessageBox>

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Vyhodnotenie prípadu"
        >
          <div className="space-y-3">
            <p className="text-[15px] leading-8 text-slate-300">
              V tejto etape si získal {evidenceCount} dôkazy. Každý z nich
              ukrýva časť tajnej kombinácie.
            </p>

            <p className="text-sm leading-6 text-amber-100">
              Pred pokračovaním musíš odhaliť miesto, ku ktorému vedie ďalšia
              stopa starého pátrača.
            </p>
          </div>
        </SectionCard>

        <MessageBox
          variant="info"
          title="Nasleduje"
        >
          {nextActTitle}
        </MessageBox>

        <ActionButton onClick={onContinue}>
          Preskúmať novú stopu
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}