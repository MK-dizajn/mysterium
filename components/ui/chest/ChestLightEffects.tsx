type ChestLightEffectsProps = {
  isLightVisible: boolean;
};

export function ChestLightEffects({
  isLightVisible,
}: ChestLightEffectsProps) {
  return (
    <>
      {/* Hlavný smerový lúč */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-16 z-10 h-80 w-[68%] -translate-x-1/2 origin-bottom bg-[conic-gradient(from_180deg_at_50%_100%,transparent_0deg,rgba(254,243,199,0.16)_10deg,transparent_23deg,rgba(253,230,138,0.1)_37deg,transparent_52deg,rgba(251,191,36,0.08)_66deg,transparent_82deg)] blur-2xl transition-all delay-500 duration-[1500ms] ease-out ${
          isLightVisible
            ? "-translate-y-10 scale-x-105 scale-y-110 opacity-90"
            : "translate-y-8 scale-x-75 scale-y-75 opacity-0"
        }`}
      />

      {/* Jemný ľavý lúč */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-[27%] top-24 z-10 h-64 w-20 -rotate-12 origin-bottom bg-gradient-to-t from-amber-100/20 via-amber-200/8 to-transparent blur-2xl transition-all delay-600 duration-[1700ms] ease-out ${
          isLightVisible
            ? "-translate-y-12 scale-y-110 opacity-55"
            : "translate-y-6 scale-y-75 opacity-0"
        }`}
      />

      {/* Jemný pravý lúč */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-[25%] top-28 z-10 h-60 w-16 rotate-10 origin-bottom bg-gradient-to-t from-yellow-100/15 via-amber-200/7 to-transparent blur-2xl transition-all delay-700 duration-[1800ms] ease-out ${
          isLightVisible
            ? "-translate-y-10 scale-y-110 opacity-45"
            : "translate-y-8 scale-y-75 opacity-0"
        }`}
      />

      {/* Svetelný lem tesne nad otvorom truhlice */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-[8.25rem] z-20 h-[3px] w-[64%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-amber-50/70 to-transparent blur-[3px] transition-all delay-400 duration-[1100ms] ease-out ${
          isLightVisible
            ? "scale-x-100 opacity-80"
            : "scale-x-50 opacity-0"
        }`}
      />

      {/* Krátky filmový záblesk pri otvorení */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[38%] z-20 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-50/35 blur-3xl"
        style={{
          opacity: 0,
          animation: isLightVisible
            ? "chest-light-burst 1250ms ease-out forwards"
            : "none",
        }}
      />

      {/* Jemný horizontálny odlesk */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-[43%] z-20 h-px w-[46%] -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-50/70 to-transparent blur-[1px] transition-all delay-500 duration-1000 ${
          isLightVisible
            ? "scale-x-100 opacity-70"
            : "scale-x-0 opacity-0"
        }`}
      />
    </>
  );
}