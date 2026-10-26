import type { CodeItemInfo } from "../../engine";
import type { ChapterGuidance, Scene } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { RouteHint } from "../ui/RouteHint";
import { ScreenContainer } from "../ui/ScreenContainer";
import { MessageBox } from "../ui/MessageBox";
import {
  DetectiveIcon,
  SearchIcon,
} from "../ui/MysteriumIcons";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";

type HistoryScreenProps = {
  scene: Scene;
  /** Nový predmet s ukrytou číslicou (iba predmet s obrazovkou „Prezrieť“). */
  codeItem?: CodeItemInfo | null;
  /** Vodidlo na ďalšie miesto z odmeny scény. */
  clue?: string;
  guidance: ChapterGuidance;
  onInspectItem: (itemId: string) => void;
  onContinue: () => void;
};

export function HistoryScreen({
  scene,
  codeItem,
  clue,
  guidance,
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
          <p className="text-[15px] leading-normal text-slate-300">
            {scene.history.fullText}
          </p>
        </SectionCard>

        {/* Ikony kariet podľa hlavičky: 📖 Artefakty, 🔎 Inventár (predmety); vlastná ikona pri názve. */}
        <SectionCard
          icon={
            <span
              className="text-3xl"
              aria-hidden="true"
            >
              📖
            </span>
          }
          title="Získaný artefakt"
          variant="gold"
        >
          <div>
            <h3 className="font-bold text-white">
              <span aria-hidden="true">{scene.artifact.icon} </span>
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
                🔎
              </span>
            }
            title="Nový predmet"
            variant="gold"
          >
            <h3 className="font-bold text-white">
              <span aria-hidden="true">{codeItem.item.icon} </span>
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
          title={guidance.nextClueTitle}
        >
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
            {scene.nextReflection}
          </p>

          {clue && (
            <p className="mt-4 border-l-2 border-amber-300/50 pl-4 font-serif text-[16px] italic leading-7 text-amber-100">
              {clue}
            </p>
          )}

          {scene.route && (
            <div className="mt-4">
              <RouteHint
                route={scene.route}
                showLabel={guidance.showRouteLabel}
                hideLabel={guidance.hideRouteLabel}
              />
            </div>
          )}
        </SectionCard>

        <ActionButton onClick={onContinue}>
          Pokračovať
        </ActionButton>
      </StoryCard>
    </ScreenContainer>
  );
}