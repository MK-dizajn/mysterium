"use client";

import type { FinaleGuardian } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { ScreenContainer } from "../ui/ScreenContainer";

type FinaleGuardianScreenProps = {
  guardian: FinaleGuardian;
  onContinue: () => void;
};

/** Pri vypnutých animáciách sa tlačidlá ani pri stlačení nehýbu. */
const STILL_BUTTON = "motion-reduce:transition-none motion-reduce:active:scale-100";

/**
 * Strážca prináša truhlicu – textová záloha, keď video 3 chýba alebo sa
 * nenačíta (samotné video ukazuje hra na celú obrazovku, app/page.tsx).
 */
export function FinaleGuardianScreen({
  guardian,
  onContinue,
}: FinaleGuardianScreenProps) {
  return (
    <ScreenContainer>
      <section
        aria-labelledby="finale-guardian-title"
        className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-amber-300/20 bg-[radial-gradient(circle_at_50%_30%,rgba(180,120,40,0.18),transparent_60%),linear-gradient(to_bottom,#0b0f1c,#050710)] px-5 py-8 text-center shadow-2xl shadow-black/60"
      >
        <h1
          id="finale-guardian-title"
          className="text-3xl font-black text-amber-100"
        >
          {guardian.title}
        </h1>

        <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

        <p className="mt-6 text-left text-[16px] leading-normal text-slate-200">
          {guardian.text}
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <ActionButton onClick={onContinue} className={STILL_BUTTON}>
            {guardian.continueLabel}
          </ActionButton>
        </div>
      </section>
    </ScreenContainer>
  );
}
