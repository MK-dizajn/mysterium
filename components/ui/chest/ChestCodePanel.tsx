import { ChestDial } from "./ChestDial";

type ChestCodePanelProps = {
  codes: string[];
  pairLabels: Array<string | number>;
  isUnlocked: boolean;
  isLockReleased: boolean;
  normalizeCode: (code: string) => string;
  updateDigit: (
    codeIndex: number,
    digitIndex: number,
    nextDigit: number
  ) => void;
  onConfirm?: () => void;
};

export function ChestCodePanel({
  codes,
  pairLabels,
  isUnlocked,
  isLockReleased,
  normalizeCode,
  updateDigit,
  onConfirm,
}: ChestCodePanelProps) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden rounded-[1.35rem] border px-3 pb-3 pt-3 shadow-[inset_0_0_26px_rgba(0,0,0,0.85),0_14px_28px_rgba(0,0,0,0.65),0_0_0_2px_rgba(75,45,14,0.5)] transition duration-700 ${
        isLockReleased
          ? "border-emerald-300/40"
          : "border-amber-400/40"
      }`}
      style={{
        transform: "translateZ(18px)",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#49300f] via-[#211406] to-[#080604]" />

      <div className="pointer-events-none absolute inset-x-3 top-0 h-2.5 rounded-b-xl bg-gradient-to-b from-amber-200/20 via-amber-700/10 to-transparent" />

      <div className="pointer-events-none absolute inset-x-3 bottom-0 h-3 rounded-t-xl bg-gradient-to-b from-transparent via-[#2b1908] to-black/80" />

      <div className="pointer-events-none absolute inset-y-3 left-0 w-3 bg-gradient-to-r from-black/65 to-transparent" />

      <div className="pointer-events-none absolute inset-y-3 right-0 w-3 bg-gradient-to-l from-black/65 to-transparent" />

      <div className="pointer-events-none absolute inset-1 rounded-[1.1rem] border border-amber-100/10" />

      {[
        "left-2.5 top-2.5",
        "right-2.5 top-2.5",
        "bottom-2.5 left-2.5",
        "bottom-2.5 right-2.5",
      ].map((position) => (
        <div
          key={position}
          className={`pointer-events-none absolute h-2 w-2 rounded-full border border-amber-200/25 bg-amber-800 shadow-inner ${position}`}
        />
      ))}

      <div className="relative flex flex-col items-center">
        <div className="mb-3 flex w-full items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300/45" />

          <p className="whitespace-nowrap font-serif text-[0.62rem] font-bold uppercase tracking-[0.24em] text-amber-200/80 sm:text-xs">
            Kód truhlice
          </p>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300/45" />
        </div>

        <div className="relative z-50 flex w-full items-start justify-center gap-2 sm:gap-3">
          {codes.map((code, codeIndex) => {
            const normalizedCode =
              normalizeCode(code);

            return (
              <div
                key={`chest-code-${codeIndex}`}
                className="relative z-50 flex shrink-0 flex-col items-center rounded-lg border border-amber-300/15 bg-black/20 px-1 py-1.5 shadow-inner"
              >
                <div className="flex gap-px">
                  {normalizedCode
                    .split("")
                    .map((digit, digitIndex) => (
                      <ChestDial
                        key={`chest-digit-${codeIndex}-${digitIndex}`}
                        value={Number(digit)}
                        disabled={isUnlocked}
                        onChange={(nextDigit) =>
                          updateDigit(
                            codeIndex,
                            digitIndex,
                            nextDigit
                          )
                        }
                      />
                    ))}
                </div>

                <p className="mt-1.5 font-serif text-[0.6rem] font-black tracking-[0.2em] text-amber-200/80 sm:text-xs">
                  {pairLabels[codeIndex] ??
                    codeIndex + 1}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex w-full items-center gap-2 px-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300/25" />

          <p className="whitespace-nowrap text-center text-[0.47rem] font-bold uppercase tracking-[0.15em] text-amber-100/35 sm:text-[0.55rem]">
            Tri dôkazy. Jedna kombinácia.
          </p>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300/25" />
        </div>

        {onConfirm && (
          <button
            type="button"
            onClick={onConfirm}
            disabled={isUnlocked}
            className="relative mt-3 flex min-h-10 w-[88%] items-center justify-center overflow-hidden rounded-lg border border-amber-200/45 bg-gradient-to-b from-[#c98a32] via-[#8b4c12] to-[#482306] px-4 py-2.5 font-serif text-[0.62rem] font-black uppercase tracking-[0.16em] text-amber-50 shadow-[inset_0_1px_0_rgba(255,235,180,0.38),inset_0_-4px_8px_rgba(44,20,3,0.65),0_6px_12px_rgba(0,0,0,0.55),0_0_12px_rgba(245,158,11,0.12)] transition duration-150 hover:brightness-115 active:translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
          >
            <span className="pointer-events-none absolute inset-1 rounded-md border border-amber-100/15" />

            <span className="pointer-events-none absolute left-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-amber-100/30 bg-amber-900 shadow-inner" />

            <span className="pointer-events-none absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border border-amber-100/30 bg-amber-900 shadow-inner" />

            <span className="relative">
              Potvrdiť kombináciu
            </span>
          </button>
        )}
      </div>
    </div>
  );
}