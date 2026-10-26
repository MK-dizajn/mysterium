import type { ReactNode } from "react";

type ScreenContainerProps = {
  children: ReactNode;
  className?: string;
};

export function ScreenContainer({
  children,
  className = "",
}: ScreenContainerProps) {
  return (
    <main
      className={[
        // dvh: výška podľa skutočne viditeľnej plochy (aj pri otvorenej klávesnici).
        "min-h-dvh bg-[#05070d] px-4 pb-10 pt-10 text-white sm:px-6",
        className,
      ].join(" ")}
    >
      {children}
    </main>
  );
}