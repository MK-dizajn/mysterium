import type { Scene } from "../../types/game";
import { GameButton } from "../ui/GameButton";
import { StoryCard } from "../ui/StoryCard";

type HistoryScreenProps = {
  scene: Scene;
  onContinue: () => void;
};

export function HistoryScreen({ scene, onContinue }: HistoryScreenProps) {
  return (
    <main className="min-h-screen bg-[#05070d] px-6 pb-10 pt-10 text-white">
      <StoryCard label="Zápis do Codexu" title={scene.history.title}>
        <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-200">
          {scene.history.shortText}
        </p>

        <p>{scene.history.fullText}</p>

        <div className="rounded-2xl border border-amber-400/20 bg-slate-950/70 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Získaný artefakt
          </p>

          <div className="mt-3 flex items-center gap-4">
            <div className="text-4xl">{scene.artifact.icon}</div>
            <div>
              <h3 className="font-bold text-white">{scene.artifact.title}</h3>
              <p className="text-xs text-slate-400">
                {scene.artifact.shortFact}
              </p>
            </div>
          </div>
        </div>

        <p className="rounded-2xl border border-blue-400/20 bg-blue-400/10 p-4 text-blue-200">
          {scene.nextInstruction}
        </p>

        <GameButton onClick={onContinue}>Pokračovať</GameButton>
      </StoryCard>
    </main>
  );
}