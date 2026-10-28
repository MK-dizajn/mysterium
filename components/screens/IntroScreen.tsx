import type { ChapterArrival } from "../../types/game";
import { getMapsSearchUrl } from "../../engine";
import { ActionButton } from "../ui/ActionButton";
import { DetectiveIcon, SearchIcon } from "../ui/MysteriumIcons";
import { ScreenContainer } from "../ui/ScreenContainer";
import { ScreenTransition } from "../ui/ScreenTransition";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";
import { Reveal } from "../ui/Reveal";

type IntroScreenProps = {
  arrival: ChapterArrival;
  /** Úvodné video sa nedalo prehrať: ukáže sa aspoň jeho príbeh v skratke. */
  showFallbackText: boolean;
  onContinue: () => void;
};

/**
 * „Vydaj sa k …“: hráč ide na prvé miesto a potvrdí, že tam je.
 * Polohu hra nezisťuje; dôkazom je až prvá úloha na mieste.
 */
export function IntroScreen({
  arrival,
  showFallbackText,
  onContinue,
}: IntroScreenProps) {
  return (
    <ScreenContainer>
      <ScreenTransition>
        {/* Hore „Úvodný prípad“ (po kóde „Odomknuté kódom“), štítok časti je nad pokynom. */}
        <StoryCard label={arrival.eyebrow ?? "Úvodný prípad"} title={arrival.title}>
          {showFallbackText && arrival.fallbackTitle && arrival.fallbackText && (
            <Reveal delay={300}>
              <SectionCard
                icon={<DetectiveIcon className="h-9 w-9" />}
                title={arrival.fallbackTitle}
              >
                <p className="text-[15px] leading-normal text-slate-300">
                  {arrival.fallbackText}
                </p>
              </SectionCard>
            </Reveal>
          )}

          <Reveal delay={500}>
            <SectionCard
              icon={<SearchIcon className="h-9 w-9" />}
              title={arrival.label}
              variant="gold"
            >
              <p className="text-[15px] leading-normal text-amber-100">
                {arrival.text}
              </p>
            </SectionCard>
          </Reveal>

          <Reveal delay={700}>
            <div className="flex flex-col gap-3">
              <a
                href={getMapsSearchUrl(arrival.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-slate-600 bg-slate-900 px-5 py-4 text-sm font-black uppercase tracking-[0.1em] text-slate-100 transition hover:border-amber-300/40 hover:bg-slate-800 motion-reduce:transition-none"
              >
                {arrival.mapsLabel}
              </a>

              <ActionButton onClick={onContinue}>
                {arrival.confirmLabel}
              </ActionButton>
            </div>
          </Reveal>
        </StoryCard>
      </ScreenTransition>
    </ScreenContainer>
  );
}
