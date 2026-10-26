import type { Chapter } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { DetectiveIcon, SearchIcon } from "../ui/MysteriumIcons";
import { ScreenContainer } from "../ui/ScreenContainer";
import { ScreenTransition } from "../ui/ScreenTransition";
import { SectionCard } from "../ui/SectionCard";
import { StoryCard } from "../ui/StoryCard";
import { Reveal } from "../ui/Reveal";

type IntroScreenProps = {
  chapter: Chapter;
  onContinue: () => void;
};

export function IntroScreen({
   chapter,
   onContinue,
  }: IntroScreenProps) {
   return (
      <ScreenContainer>
    <ScreenTransition>
     <StoryCard
       label="Úvodný prípad"
       title={chapter.title}
     >
       <Reveal delay={300}>
          <SectionCard
            icon={<DetectiveIcon className="h-9 w-9" />}
            title="Pátračov denník"
          >
           {/* Riadkovanie 1,5 a medzi odsekmi asi polovica riadku. */}
           <div className="space-y-3">
              {chapter.introLines.map((line) => (
                <p
                  key={line}
                  className="text-[15px] leading-normal text-slate-300"
               >
                 {line}
               </p>
              ))}
           </div>
         </SectionCard>
        </Reveal>

       <Reveal delay={500}>
         <SectionCard
           icon={<SearchIcon className="h-9 w-9" />}
           title="Prvá stopa"
           variant="gold"
         >
            <p className="text-sm leading-normal text-amber-100">
              Podľa posledných svedkov ho videli tam, kadiaľ do mesta vstupovali
               králi. Presuň sa pod <strong>Michalskú bránu</strong> a začni svoje
              vyšetrovanie.
           </p>
          </SectionCard>
       </Reveal>

        <Reveal delay={700}>
          <ActionButton onClick={onContinue}>
            Som pri Michalskej bráne
          </ActionButton>
        </Reveal>
      </StoryCard>
    </ScreenTransition>
  </ScreenContainer>
  );
}