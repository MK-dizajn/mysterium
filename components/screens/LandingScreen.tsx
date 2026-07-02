import { GameButton } from "../ui/GameButton";

type LandingScreenProps = {
  hasSavedProgress: boolean;
  onStartNewGame: () => void;
  onContinueGame: () => void;
};

export function LandingScreen({
  hasSavedProgress,
  onStartNewGame,
  onContinueGame,
}: LandingScreenProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.18),_transparent_35%,_transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(0,0,0,0.1),_rgba(0,0,0,0.85))]" />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-amber-400">
          Kapitola I
        </p>

        <h1 className="animate-fade-in text-5xl font-black tracking-tight text-amber-300 sm:text-7xl">
          MYSTERIUM
        </h1>

        <p className="mt-3 text-lg font-medium text-slate-300">Bratislava</p>

        <p className="mt-8 max-w-md text-sm leading-7 text-slate-300">
          Každé mesto má svoje tajomstvá. Niektoré čakajú celé stáročia.
          Starý Prešporok ukryl stopu, ktorú dokáže nájsť len ten, kto sa naučí
          pozerať.
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
          {hasSavedProgress && (
            <GameButton onClick={onContinueGame}>Pokračovať</GameButton>
          )}

          <GameButton onClick={onStartNewGame}>
            {hasSavedProgress ? "Začať odznova" : "Začať pátranie"}
          </GameButton>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Odporúčané hrať so zapnutou polohou a zvukom.
        </p>
      </section>
    </main>
  );
}