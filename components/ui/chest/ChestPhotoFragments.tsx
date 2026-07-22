type ChestPhotoFragmentsProps = {
  areFragmentsVisible: boolean;
  fragmentClasses: string[];
  onRewardClick?: () => void;
};

export function ChestPhotoFragments({
  areFragmentsVisible,
  fragmentClasses,
  onRewardClick,
}: ChestPhotoFragmentsProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-8 z-40 h-64 transition ${
        areFragmentsVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {fragmentClasses.map((position, index) => (
        <button
          key={`photo-fragment-${index}`}
          type="button"
          onClick={onRewardClick}
          className={`absolute w-20 rounded-sm border border-amber-100/50 bg-[#d8c39d] p-1.5 shadow-2xl shadow-black/70 hover:z-50 hover:scale-110 sm:w-28 ${position} ${
            areFragmentsVisible
              ? "pointer-events-auto"
              : "pointer-events-none opacity-0"
          }`}
          style={{
            animation: areFragmentsVisible
              ? `chest-fragment-reveal 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${
                  180 + index * 170
                }ms forwards`
              : "none",
            ["--fragment-start-x" as string]:
              index === 0
                ? "-42px"
                : index === 1
                  ? "-16px"
                  : index === 2
                    ? "18px"
                    : "44px",
            ["--fragment-start-rotate" as string]:
              index === 0
                ? "-22deg"
                : index === 1
                  ? "-8deg"
                  : index === 2
                    ? "10deg"
                    : "24deg",
            ["--fragment-overshoot-rotate" as string]:
              index === 0
                ? "-7deg"
                : index === 1
                  ? "3deg"
                  : index === 2
                    ? "-2deg"
                    : "8deg",
            ["--fragment-end-rotate" as string]:
              index === 0
                ? "-5deg"
                : index === 1
                  ? "2deg"
                  : index === 2
                    ? "-1deg"
                    : "5deg",
          }}
          aria-label={`Preskúmať útržok fotografie ${index + 1}`}
        >
          <div className="relative aspect-square overflow-hidden border border-stone-700/40 bg-stone-800">
            <div
              className={`absolute inset-0 ${
                index === 0
                  ? "bg-gradient-to-br from-stone-300 via-stone-600 to-black"
                  : index === 1
                    ? "bg-gradient-to-bl from-stone-400 via-stone-700 to-black"
                    : index === 2
                      ? "bg-gradient-to-tr from-stone-300 via-stone-600 to-black"
                      : "bg-gradient-to-tl from-stone-400 via-stone-700 to-black"
              }`}
            />

            <div className="absolute bottom-2 left-2 h-12 w-4 bg-black/45" />
            <div className="absolute bottom-2 left-7 h-8 w-9 bg-black/35" />

            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)]" />
          </div>
        </button>
      ))}
    </div>
  );
}