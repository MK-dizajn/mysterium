type ChestInnerLightProps = {
  isLightVisible: boolean;
};

export function ChestInnerLight({
  isLightVisible,
}: ChestInnerLightProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-10 z-20 h-80 overflow-visible"
    >
      {/* Hlboká žiara vo vnútri dutiny */}
      <div
        className={`absolute left-1/2 top-24 h-44 w-[82%] -translate-x-1/2 rounded-[50%] bg-gradient-to-b from-amber-100/60 via-amber-300/30 to-orange-950/10 blur-2xl transition-all delay-100 duration-[1500ms] ease-out ${
          isLightVisible
            ? "scale-x-110 scale-y-100 opacity-100"
            : "scale-x-50 scale-y-50 opacity-0"
        }`}
      />

      {/* Široká atmosférická žiara */}
      <div
        className={`absolute left-1/2 top-12 h-64 w-[96%] -translate-x-1/2 rounded-full bg-amber-200/25 blur-3xl transition-all delay-200 duration-[1700ms] ease-out ${
          isLightVisible
            ? "scale-125 opacity-100"
            : "scale-50 opacity-0"
        }`}
      />

      {/* Teplý odraz na spodnej strane otvoreného veka */}
      <div
        className={`absolute left-1/2 top-0 h-28 w-[78%] -translate-x-1/2 rounded-[50%] bg-gradient-to-t from-amber-200/35 via-yellow-100/15 to-transparent blur-2xl transition-all delay-300 duration-[1400ms] ease-out ${
          isLightVisible
            ? "-translate-y-8 scale-x-110 opacity-90"
            : "translate-y-8 scale-x-75 opacity-0"
        }`}
      />

      {/* Ľavý odraz na vnútornom okraji */}
      <div
        className={`absolute left-[8%] top-24 h-36 w-16 -rotate-12 rounded-full bg-gradient-to-r from-amber-100/5 via-amber-200/30 to-transparent blur-xl transition-all delay-300 duration-[1300ms] ease-out ${
          isLightVisible
            ? "-translate-x-2 opacity-80"
            : "translate-x-6 opacity-0"
        }`}
      />

      {/* Pravý odraz na vnútornom okraji */}
      <div
        className={`absolute right-[8%] top-24 h-36 w-16 rotate-12 rounded-full bg-gradient-to-l from-amber-100/5 via-amber-200/30 to-transparent blur-xl transition-all delay-300 duration-[1300ms] ease-out ${
          isLightVisible
            ? "translate-x-2 opacity-80"
            : "-translate-x-6 opacity-0"
        }`}
      />

      {/* Jasné jadro svetla */}
      <div
        className={`absolute left-1/2 top-28 h-24 w-[58%] -translate-x-1/2 rounded-[50%] bg-amber-50/75 blur-xl transition-all delay-400 duration-[1100ms] ease-out ${
          isLightVisible
            ? "scale-110 opacity-100"
            : "scale-50 opacity-0"
        }`}
        style={{
          animation: isLightVisible
            ? "chest-light-pulse 2400ms ease-in-out 1200ms infinite"
            : "none",
        }}
      />

      {/* Úzky jasný stred dutiny */}
      <div
        className={`absolute left-1/2 top-32 h-14 w-[40%] -translate-x-1/2 rounded-full bg-yellow-50/80 blur-lg transition-all delay-500 duration-1000 ease-out ${
          isLightVisible
            ? "scale-110 opacity-90"
            : "scale-50 opacity-0"
        }`}
      />

      {/* Mäkký lúč smerujúci nahor */}
      <div
        className={`absolute left-1/2 top-0 h-64 w-44 -translate-x-1/2 origin-bottom bg-gradient-to-t from-amber-100/45 via-amber-200/15 to-transparent blur-2xl transition-all delay-300 duration-[1600ms] ease-out ${
          isLightVisible
            ? "-translate-y-20 scale-x-125 scale-y-125 opacity-80"
            : "translate-y-12 scale-x-50 scale-y-50 opacity-0"
        }`}
      />

      {/* Druhý lúč pre nepravidelnejší filmový vzhľad */}
      <div
        className={`absolute left-[44%] top-8 h-52 w-24 -rotate-6 origin-bottom bg-gradient-to-t from-yellow-100/25 via-amber-200/10 to-transparent blur-2xl transition-all delay-500 duration-[1800ms] ease-out ${
          isLightVisible
            ? "-translate-y-16 scale-y-110 opacity-60"
            : "translate-y-10 scale-y-50 opacity-0"
        }`}
      />

      {/* Jemný svetelný lem nad otvorom */}
      <div
        className={`absolute left-1/2 top-[7.25rem] h-[2px] w-[72%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-amber-100/80 to-transparent blur-[2px] transition-all delay-400 duration-[1200ms] ease-out ${
          isLightVisible
            ? "scale-x-100 opacity-90"
            : "scale-x-50 opacity-0"
        }`}
      />
    </div>
  );
}