import type { ActEnding } from "../../types/game";
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
  ending?: ActEnding;
  onContinue: () => void;
};

const ENDING_ICONS: Record<ActEnding["kind"], string> = {
  guardianVoice: "🔊",
  seal: "🛡️",
  mysteryReveal: "🔍",
};

export function ActTransitionScreen({
  completedActTitle,
  nextActTitle,
  evidenceCount,
  ending,
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

        {ending && (
          <SectionCard
            icon={
              <span className="text-3xl" aria-hidden="true">
                {ENDING_ICONS[ending.kind]}
              </span>
            }
            title={ending.label}
            variant="gold"
          >
            <p className="italic leading-relaxed text-amber-100">
              „{ending.text}“
            </p>
          </SectionCard>
        )}

        {ending?.reward && (
          <SectionCard
            icon={
              <span className="text-3xl" aria-hidden="true">
                {ending.reward.icon}
              </span>
            }
            title={ending.reward.title}
          >
            <p className="text-sm leading-relaxed text-slate-300">
              {ending.reward.description}
            </p>
          </SectionCard>
        )}

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Vyhodnotenie prípadu"
        >
          <p className="text-[15px] leading-8 text-slate-300">
            V tejto etape si získal {evidenceCount} dôkazy. Každý z nich
            ukrýva časť tajnej kombinácie.
          </p>
        </SectionCard>

        {nextActTitle && (
          <MessageBox
            variant="info"
            title="Nasleduje"
          >
            {nextActTitle}
          </MessageBox>
        )}

        <ActionButton onClick={onContinue}>
          {ending?.continueLabel ?? "Pokračovať"}
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}
