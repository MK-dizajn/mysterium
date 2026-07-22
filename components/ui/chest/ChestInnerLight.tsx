type ChestInnerLightProps = {
  isLightVisible: boolean;
};

export function ChestInnerLight({
  isLightVisible,
}: ChestInnerLightProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 z-20 h-72 overflow-visible">
      {/* Široká žiara */}
      <div
        className={`absolute left-1/2 top-10 h-64 w-[92%] -translate-x-1/2 rounded-full bg-amber-200/35 blur-3xl transition-all delay-200 duration-[1400ms] ease-out ${
          isLightVisible
            ? "scale-125 opacity-100"
            : "scale-50 opacity-0"
        }`}
      />

      {/* Jasné jadro svetla */}
      <div
        className={`absolute left-1/2 top-20 h-32 w-[62%] rounded-full bg-amber-100/70 blur-2xl transition-opacity delay-300 duration-1000 ease-out ${
          isLightVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: "translateX(-50%)",
          animation: isLightVisible
            ? "chest-light-pulse 2200ms ease-in-out 1200ms infinite"
            : "none",
        }}
      />

      {/* Svetelný lúč smerom nahor */}
      <div
        className={`absolute left-1/2 top-0 h-56 w-40 -translate-x-1/2 origin-bottom bg-gradient-to-t from-amber-100/50 via-amber-200/20 to-transparent blur-2xl transition-all delay-300 duration-[1300ms] ease-out ${
          isLightVisible
            ? "-translate-y-24 scale-x-125 scale-y-125 opacity-90"
            : "translate-y-10 scale-x-50 scale-y-50 opacity-0"
        }`}
      />
    </div>
  );
}