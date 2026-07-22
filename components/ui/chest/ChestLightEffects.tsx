type ChestLightEffectsProps = {
  isLightVisible: boolean;
};

export function ChestLightEffects({
  isLightVisible,
}: ChestLightEffectsProps) {
  return (
    <>
      {/* Svetelné lúče */}
      <div
        className={`pointer-events-none absolute left-1/2 top-24 z-10 h-72 w-[75%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_100%,transparent_0deg,rgba(253,230,138,0.18)_15deg,transparent_35deg,rgba(253,230,138,0.12)_55deg,transparent_75deg)] blur-xl transition-all delay-500 duration-1000 ${
          isLightVisible
            ? "scale-110 opacity-100"
            : "scale-75 opacity-0"
        }`}
      />

      {/* Krátky svetelný záblesk pri otvorení */}
      <div
        className="pointer-events-none absolute left-1/2 top-[42%] z-20 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl"
        style={{
          opacity: 0,
          animation: isLightVisible
            ? "chest-light-burst 1300ms ease-out forwards"
            : "none",
        }}
      />
    </>
  );
}