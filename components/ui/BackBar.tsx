import { ActionButton } from "./ActionButton";

type BackBarProps = {
  label: string;
  onBack: () => void;
  /** V rozhovore nevýrazná, aby nesúperila s voľbami. */
  variant?: "primary" | "secondary";
};

/**
 * Lišta „Späť“ prilepená k spodku obrazovky (sticky, nie fixed), aby sa
 * hráč nemusel posúvať na koniec dlhého zoznamu. Patrí ako posledný prvok
 * do ScreenContainer s triedou „flex flex-col“: pri krátkom obsahu ju mt-auto
 * stlačí k spodku, pri dlhom je prilepená a na konci leží pod obsahom.
 * Výška je obmedzená v dvh.
 */
export function BackBar({ label, onBack, variant = "primary" }: BackBarProps) {
  return (
    <>
      {/* Najmenšia medzera nad lištou (pri mt-auto nemôže byť okraj lišty). */}
      <div aria-hidden="true" className="h-6 shrink-0" />

      <div className="sticky bottom-0 z-30 -mx-4 -mb-10 mt-auto max-h-[30dvh] border-t border-amber-300/20 bg-slate-950/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_rgba(0,0,0,0.6)] backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto w-full max-w-md">
          <ActionButton
            variant={variant}
            onClick={onBack}
            className="min-h-11 motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            {label}
          </ActionButton>
        </div>
      </div>
    </>
  );
}
