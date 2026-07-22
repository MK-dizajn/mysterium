type ChestRivetProps = {
  className?: string;
  size?: "small" | "medium";
  variant?: "bright" | "dark";
};

export function ChestRivet({
  className = "",
  size = "medium",
  variant = "bright",
}: ChestRivetProps) {
  const sizeClass = size === "small" ? "h-3 w-3" : "h-4 w-4";
  const highlightClass =
    size === "small" ? "left-[2px] top-[2px] h-1 w-1" : "left-[3px] top-[3px] h-1.5 w-1.5";

  const metalClass =
    variant === "bright"
      ? "from-[#d89a43] via-[#8a4b19] to-[#281006]"
      : "from-[#b97831] via-[#633612] to-[#1d0c05]";

  return (
    <div
      className={`pointer-events-none rounded-full border border-amber-100/25 bg-gradient-to-br ${metalClass} shadow-[inset_0_2px_2px_rgba(255,255,255,0.22),inset_0_-2px_3px_rgba(0,0,0,0.6),0_3px_7px_rgba(0,0,0,0.8)] ${sizeClass} ${className}`}
    >
      <div
        className={`absolute rounded-full bg-amber-100/30 blur-[0.5px] ${highlightClass}`}
      />
      <div className="absolute inset-[3px] rounded-full border border-black/30" />
    </div>
  );
}