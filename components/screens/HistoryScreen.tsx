import type { CodeItemInfo } from "../../engine";
import type { Scene } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { ScreenContainer } from "../ui/ScreenContainer";
import { MessageBox } from "../ui/MessageBox";
import {
  DetectiveIcon,
  LightbulbIcon,
  SearchIcon,
} from "../ui/MysteriumIcons";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type HistoryScreenProps = {
  scene: Scene;
  /** Nová odmena s ukrytou číslicou (iba predmet s obrazovkou „Prezrieť“). */
  codeItem?: CodeItemInfo | null;
  onInspectItem: (itemId: string) => void;
  onContinue: () => void;
};

export function HistoryScreen({
  scene,
  codeItem,
  onInspectItem,
  onContinue,
}: HistoryScreenProps) {
  return (
    <ScreenContainer>
      <StoryCard
        label="Zápis do denníka pátrača"
        title={scene.history.title}
      >
        <MessageBox
          variant="success"
          title="Tajomstvo odhalené"
        >
          {scene.history.shortText}
        </MessageBox>

        <SectionCard
          icon={<DetectiveIcon className="h-9 w-9" />}
          title="Pátračov zápis"
        >
          <p className="text-[15px] leading-8 text-slate-300">
            {scene.history.fullText}
          </p>
        </SectionCard>

        <SectionCard
          icon={
            <span
              className="text-3xl"
              aria-hidden="true"
            >
              {scene.artifact.icon}
            </span>
          }
          title="Získaný artefakt"
          variant="gold"
        >
          <div>
            <h3 className="font-bold text-white">
              {scene.artifact.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-amber-100">
              {scene.artifact.shortFact}
            </p>
          </div>
        </SectionCard>

        {codeItem?.item.inspect && (
          <SectionCard
            icon={
              <span
                className="text-3xl"
                aria-hidden="true"
              >
                {codeItem.item.icon}
              </span>
            }
            title="Nová odmena"
            variant="gold"
          >
            <h3 className="font-bold text-white">
              {codeItem.item.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-amber-100">
              {codeItem.isFound
                ? `Číslica pre zámok ${codeItem.lockLabel} je zapísaná v zápisníku.`
                : "Preskúmaj predmet zblízka."}
            </p>

            <ActionButton
              variant="secondary"
              className="mt-4"
              onClick={() => onInspectItem(codeItem.item.id)}
            >
              Prezrieť
            </ActionButton>
          </SectionCard>
        )}

        <SectionCard
          icon={<SearchIcon className="h-9 w-9" />}
          title="Ďalšia stopa"
        >
          <p className="text-sm leading-relaxed text-slate-300">
            {scene.nextInstruction}
          </p>
        </SectionCard>

        <ActionButton onClick={onContinue}>
          Pokračovať
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}