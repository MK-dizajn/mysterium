type ChestMistProps = {
  isLightVisible: boolean;
};

export function ChestMist({
  isLightVisible,
}: ChestMistProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-10 top-24 z-20 h-48 overflow-visible transition-opacity delay-500 duration-1000 ${
        isLightVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span
        className="absolute left-[8%] top-16 h-16 w-[58%] rounded-full bg-amber-100/10 blur-2xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-left 5200ms ease-in-out 400ms infinite"
            : "none",
        }}
      />

      <span
        className="absolute right-[5%] top-10 h-20 w-[62%] rounded-full bg-amber-50/10 blur-3xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-right 6100ms ease-in-out 900ms infinite"
            : "none",
        }}
      />

      <span
        className="absolute left-1/2 top-24 h-14 w-[75%] -translate-x-1/2 rounded-full bg-amber-200/10 blur-2xl"
        style={{
          animation: isLightVisible
            ? "chest-mist-center 4600ms ease-in-out 1400ms infinite"
            : "none",
        }}
      />
    </div>
  );
}