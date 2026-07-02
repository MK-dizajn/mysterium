import { GameButton } from "../ui/GameButton";
import { StoryCard } from "../ui/StoryCard";

type FinishScreenProps = {
  onRestart: () => void;
};

export function FinishScreen({ onRestart }: FinishScreenProps) {
  return (
    <main className="min-h-screen bg-[#05070d] px-6 py-10 text-white">
      <StoryCard label="Kapitola dokončená" title="Zlatý prešporský kľúč">
        <p className="text-amber-200">
          Posledná stopa zapadla na svoje miesto. Starý pátrač mal pravdu —
          Bratislava neukrývala len príbeh, ale mapu.
        </p>

        <p>
          V Codexe sa objavuje nový znak. Nie je to koniec. Je to iba prvá
          stránka väčšieho tajomstva.
        </p>

        <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-200">
          „Ak si sa dostal až sem, už vedia, že existuješ. Čierna vdova je o
          krok bližšie. A druhá kapitola sa začína pod tichými stenami
          Kapitulskej ulice...“
        </p>

        <GameButton onClick={onRestart}>Hrať od začiatku</GameButton>
      </StoryCard>
    </main>
  );
}