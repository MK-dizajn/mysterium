import { ChestRivet } from "./ChestRivet";

type ChestCornerBraceProps = {
  side: "left" | "right";
};

export function ChestCornerBrace({ side }: ChestCornerBraceProps) {
  const isLeft = side === "left";

  return (
    <div
      className={`pointer-events-none absolute bottom-5 z-[8] h-20 w-16 border-t border-amber-200/15 ${
        isLeft
          ? "left-0 border-r bg-gradient-to-br from-[#8a501f]/75 via-[#35190b] to-[#100704] shadow-[inset_-3px_2px_4px_rgba(255,210,145,0.08),4px_-2px_8px_rgba(0,0,0,0.48)]"
          : "right-0 border-l bg-gradient-to-bl from-[#8a501f]/75 via-[#35190b] to-[#100704] shadow-[inset_3px_2px_4px_rgba(255,210,145,0.08),-4px_-2px_8px_rgba(0,0,0,0.48)]"
      }`}
      style={{
        clipPath: isLeft
          ? "polygon(0 0, 58% 0, 100% 100%, 0 100%)"
          : "polygon(42% 0, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      <div
        className={`absolute inset-1 border-t border-black/55 opacity-70 ${
          isLeft ? "border-r" : "border-l"
        }`}
      />

      <ChestRivet
        className={`absolute top-3 ${isLeft ? "left-3" : "right-3"}`}
        size="small"
        variant="bright"
      />
      <ChestRivet
        className={`absolute bottom-3 ${isLeft ? "left-3" : "right-3"}`}
        size="small"
        variant="dark"
      />
    </div>
  );
}