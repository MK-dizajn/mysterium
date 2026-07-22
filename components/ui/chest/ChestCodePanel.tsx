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
};

export function ChestCodePanel({
  codes,
  pairLabels,
  isUnlocked,
  isLockReleased,
  normalizeCode,
  updateDigit,
}: ChestCodePanelProps) {
  return (
    <>
      {/* Mosadzný panel */}
      <div
        className={`relative overflow-hidden rounded-3xl border px-2 py-3 shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_18px_34px_rgba(0,0,0,0.72),0_0_0_3px_rgba(75,45,14,0.55)] transition duration-700 ${
          isLockReleased
            ? "border-emerald-300/40"
            : "border-amber-400/35"
        }`}
        style={{
          transform: "translateZ(18px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#49300f] via-[#211406] to-[#080604]" />

        {/* Horná plastická hrana panelu */}
        <div className="pointer-events-none absolute inset-x-3 top-0 h-3 rounded-b-xl bg-gradient-to-b from-amber-200/20 via-amber-700/10 to-transparent" />

        {/* Spodná hrúbka panelu */}
        <div
          className="pointer-events-none absolute inset-x-3 bottom-0 h-4 rounded-t-xl bg-gradient-to-b from-transparent via-[#2b1908] to-black/80"
          style={{
            transform: "translateY(2px)",
          }}
        />

        {/* Bočné tiene panelu */}
        <div className="pointer-events-none absolute inset-y-3 left-0 w-4 bg-gradient-to-r from-black/65 to-transparent" />

        <div className="pointer-events-none absolute inset-y-3 right-0 w-4 bg-gradient-to-l from-black/65 to-transparent" />

        <div className="pointer-events-none absolute inset-1 rounded-[1.25rem] border border-amber-100/10" />

        {/* Dekoratívne skrutky */}
        {[
          "left-3 top-3",
          "right-3 top-3",
          "bottom-3 left-3",
          "bottom-3 right-3",
        ].map((position) => (
          <div
            key={position}
            className={`pointer-events-none absolute h-2.5 w-2.5 rounded-full border border-amber-200/25 bg-amber-800 shadow-inner ${position}`}
          />
        ))}

        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300/50" />

            <p className="whitespace-nowrap font-serif text-[0.65rem] font-bold uppercase tracking-[0.28em] text-amber-200/75 sm:text-sm">
              Kód truhlice
            </p>

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300/50" />
          </div>

          {/* Tri jasne oddelené dvojice */}
          <div className="relative z-50 flex w-full items-start justify-between gap-1.5 md:justify-center md:gap-3">
            {codes.map((code, codeIndex) => {
              const normalizedCode = normalizeCode(code);

              return (
                <div
                  key={`chest-code-${codeIndex}`}
                  className="relative z-50 flex min-w-0 shrink-0 flex-col items-center rounded-xl border border-amber-300/15 bg-black/20 px-1 py-2 shadow-inner"
                >
                  <div className="flex gap-0.5">
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

                  <p className="mt-2 font-serif text-[0.65rem] font-black tracking-[0.28em] text-amber-200/75 sm:text-sm">
                    {pairLabels[codeIndex] ?? codeIndex + 1}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-3 h-px w-[85%] bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />

          <p className="mt-2 text-center text-[0.5rem] font-bold uppercase tracking-[0.2em] text-amber-100/35 sm:text-[0.65rem]">
            Tri dôkazy. Jedna kombinácia.
          </p>
        </div>
      </div>

      {/* Zámok */}
      <div className="mt-4 flex flex-col items-center">
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition duration-700 ${
            isLockReleased
              ? "rotate-6 border-emerald-300/70 bg-emerald-950 shadow-[0_0_30px_rgba(110,231,183,0.35)]"
              : "border-amber-600/60 bg-gradient-to-br from-amber-700/50 via-amber-950 to-black shadow-[0_12px_20px_rgba(0,0,0,0.5)]"
          }`}
        >
          <div className="absolute inset-1 rounded-xl border border-amber-200/15" />

          <div
            className={`relative h-8 w-5 rounded-t-full border-2 transition ${
              isLockReleased
                ? "translate-y-2 rotate-12 border-emerald-200"
                : "border-amber-300/60"
            }`}
          >
            <div
              className={`absolute bottom-[-0.15rem] left-1/2 h-4 w-1.5 -translate-x-1/2 rounded-full ${
                isLockReleased
                  ? "bg-emerald-200"
                  : "bg-amber-300/60"
              }`}
            />
          </div>
        </div>

        <div
          className={`mt-3 h-2 w-28 rounded-full transition duration-700 ${
            isLockReleased
              ? "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.6)]"
              : "bg-black/70 shadow-inner"
          }`}
        />

        <p
          className={`mt-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.22em] transition sm:text-xs ${
            isLockReleased
              ? "text-emerald-300"
              : "text-slate-500"
          }`}
        >
          {isLockReleased
            ? "Zámok odomknutý"
            : "Zámok čaká na kombináciu"}
        </p>
      </div>
    </>
  );
}