type ChestMistProps = {
  isLightVisible: boolean;
};

export function ChestMist({
  isLightVisible,
}: ChestMistProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-8 top-20 z-20 h-56 overflow-visible transition-opacity delay-500 duration-[1400ms] ease-out ${
        isLightVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Hmla stúpajúca z ľavej časti dutiny */}
      <span
        className="absolute left-[4%] top-20 h-14 w-[52%] rounded-full bg-gradient-to-r from-transparent via-amber-100/12 to-transparent blur-2xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-left 6200ms ease-in-out 300ms infinite"
            : "none",
        }}
      />

      {/* Hmla stúpajúca z pravej časti dutiny */}
      <span
        className="absolute right-[2%] top-12 h-16 w-[56%] rounded-full bg-gradient-to-l from-transparent via-amber-50/10 to-transparent blur-3xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-right 7400ms ease-in-out 900ms infinite"
            : "none",
        }}
      />

      {/* Nízka vrstva tesne nad otvorom */}
      <span
        className="absolute left-1/2 top-28 h-10 w-[82%] -translate-x-1/2 rounded-full bg-amber-200/10 blur-2xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-center 5600ms ease-in-out 1200ms infinite"
            : "none",
        }}
      />

      {/* Jemný vyšší oblak vľavo */}
      <span
        className="absolute left-[18%] top-4 h-20 w-28 -rotate-6 rounded-full bg-amber-50/7 blur-3xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-left 8200ms ease-in-out 1700ms infinite"
            : "none",
        }}
      />

      {/* Jemný vyšší oblak vpravo */}
      <span
        className="absolute right-[18%] top-0 h-20 w-32 rotate-6 rounded-full bg-yellow-50/6 blur-3xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-right 8800ms ease-in-out 2200ms infinite"
            : "none",
        }}
      />

      {/* Veľmi slabá stredová vrstva */}
      <span
        className="absolute left-1/2 top-16 h-16 w-[46%] -translate-x-1/2 rounded-full bg-amber-100/7 blur-3xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-center 7000ms ease-in-out 2600ms infinite"
            : "none",
        }}
      />

      {/* Mäkké stmavenie spodku hmly, aby nezakrývala odmenu */}
      <span className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-transparent via-transparent to-black/0" />
    </div>
  );
}