import type { ReactNode } from "react";

type ChestStageProps = {
  isUnlocked: boolean;
  children: ReactNode;
};

export function ChestStage({
  isUnlocked,
  children,
}: ChestStageProps) {
  return (
    <div
      className="relative mx-auto w-full max-w-md"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        animation: isUnlocked
          ? "chest-cinematic-camera 3200ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
          : "none",
      }}
    >
      <div
        className="relative"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}