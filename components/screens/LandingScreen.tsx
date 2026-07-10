import { ActionButton } from "../ui/ActionButton";

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
    <main className="relative min-h-screen overflow-hidden bg-[#03050a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,_rgba(217,166,55,0.22),_transparent_28%,_transparent_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_rgba(90,55,15,0.12),_transparent_45%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(3,5,10,0.15),_rgba(3,5,10,0.82)_60%,_#03050a_100%)]" />

      <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full border border-amber-300/10 bg-amber-300/5 blur-3xl" />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
        <div className="w-full max-w-lg">
          <p className="text-xs font-black uppercase tracking-[0.45em] text-amber-400/80">
            Kapitola I
          </p>

          <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/20 bg-black/40 shadow-2xl shadow-amber-950/40">
            <svg
              viewBox="0 0 64 64"
              className="h-10 w-10 text-amber-300"
              aria-hidden="true"
            >
              <circle
                cx="32"
                cy="32"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M32 15v34M15 32h34M21 21l22 22M43 21 21 43"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="32" cy="32" r="4" fill="currentColor" />
            </svg>
          </div>

          <h1 className="mt-7 text-5xl font-black tracking-[0.08em] text-amber-300 drop-shadow-[0_0_28px_rgba(252,211,77,0.18)] sm:text-7xl">
            MYSTERIUM
          </h1>

          <p className="mt-4 text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
            Bratislava
          </p>

          <div className="mx-auto mt-7 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
            Mestské dobrodružstvo ukryté v histórii. Objav stopy, ktoré starý
            Prešporok skrýval celé stáročia.
          </p>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500">
            Nájsť miesto má byť jednoduché. Objaviť odpoveď má byť zaujímavé.
          </p>

          <div className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-3">
            {hasSavedProgress && (
              <ActionButton onClick={onContinueGame}>
                Pokračovať v pátraní
              </ActionButton>
            )}

            <ActionButton
              onClick={onStartNewGame}
              variant={hasSavedProgress ? "secondary" : "primary"}
            >
              {hasSavedProgress ? "Začať odznova" : "Začať pátranie"}
            </ActionButton>
          </div>

          <div className="mt-8 rounded-2xl border border-white/5 bg-black/20 px-4 py-3 backdrop-blur-sm">
            <p className="text-xs leading-5 text-slate-500">
              Najlepší zážitok dosiahneš so zapnutým zvukom.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}