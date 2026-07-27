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
      className={`chest-stage relative isolate mx-auto w-full max-w-md ${
        isUnlocked
          ? "chest-stage-unlocked"
          : ""
      }`}
    >
      <div
        className={`chest-stage-glow ${
          isUnlocked
            ? "chest-stage-glow-visible"
            : ""
        }`}
        aria-hidden="true"
      />

      <div className="chest-stage-content">
        {children}
      </div>
    </div>
  );
}