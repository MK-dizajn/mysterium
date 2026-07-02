import type { Chapter } from "../../types/game";
import { GameButton } from "../ui/GameButton";
import { StoryCard } from "../ui/StoryCard";

type IntroScreenProps = {
  chapter: Chapter;
  onContinue: () => void;
};

export function IntroScreen({ chapter, onContinue }: IntroScreenProps) {
  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-10 text-white">
      <StoryCard label="Úvodný prípad" title={chapter.title}>
        {chapter.introLines.map((line) => (
          <p key={line}>{line}</p>
        ))}

        <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200">
          Podľa posledných svedkov ho videli tam, kadiaľ do mesta vstupovali
          králi. Presuň sa pod Michalskú bránu.
        </p>

        <div className="mt-8">
          <GameButton onClick={onContinue}>Som pri Michalskej bráne</GameButton>
        </div>
      </StoryCard>
    </main>
  );
}