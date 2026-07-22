import { ChestRivet } from "./ChestRivet";

type ChestMetalBandProps = {
  position: "left" | "center" | "right";
};

export function ChestMetalBand({ position }: ChestMetalBandProps) {
  const positionClass =
    position === "left"
      ? "left-7"
      : position === "right"
        ? "right-7"
        : "left-1/2 -translate-x-1/2";

  const shadowClass =
    position === "left"
      ? "shadow-[5px_0_10px_rgba(0,0,0,0.45)]"
      : position === "right"
        ? "shadow-[-5px_0_10px_rgba(0,0,0,0.45)]"
        : "shadow-[0_0_12px_rgba(0,0,0,0.55)]";

  return (
    <div
      className={`absolute inset-y-0 z-[7] w-7 border-x border-amber-200/20 bg-gradient-to-r from-[#1a0d05] via-[#9a5a20]/55 to-[#1a0d05] ${positionClass} ${shadowClass}`}
    >
      <div className="absolute inset-y-0 left-1 w-px bg-amber-100/15" />
      <div className="absolute inset-y-0 right-1 w-px bg-black/65" />
      <div className="absolute inset-x-0 top-0 h-px bg-amber-200/30" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/70" />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-amber-100/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-white/10" />

      <ChestRivet
        className="absolute left-1/2 top-6 z-[12] -translate-x-1/2"
        variant="bright"
      />
      <ChestRivet
        className="absolute bottom-10 left-1/2 z-[12] -translate-x-1/2"
        variant="dark"
      />
    </div>
  );
}