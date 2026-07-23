import type { ReactNode } from "react";

type ChestBodyProps = {
  isLidOpen: boolean;
  isLightVisible: boolean;
  children: ReactNode;
};

function BodyHinge({ side }: { side: "left" | "right" }) {
  const positionClass =
    side === "left" ? "left-[23%]" : "right-[23%]";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute top-7 z-40 h-7 w-12 rounded-md border border-amber-950 bg-gradient-to-b from-[#9b652b] via-[#4a290f] to-[#120704] shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),inset_0_-2px_3px_rgba(0,0,0,0.75),0_5px_8px_rgba(0,0,0,0.85)] ${positionClass}`}
    >
      <div className="absolute inset-x-1 top-[3px] h-px bg-gradient-to-r from-transparent via-amber-100/25 to-transparent" />

      <div className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-amber-100/25 bg-gradient-to-b from-[#b67a32] to-[#4a250d] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),0_1px_3px_rgba(0,0,0,0.95)]" />

      <div className="absolute right-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-amber-100/25 bg-gradient-to-b from-[#b67a32] to-[#4a250d] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16),0_1px_3px_rgba(0,0,0,0.95)]" />

      <div className="absolute inset-y-1 left-1/2 w-2 -translate-x-1/2 rounded-sm bg-gradient-to-r from-black/55 via-amber-500/30 to-black/55 shadow-[inset_0_0_3px_rgba(0,0,0,0.75)]" />

      <div className="absolute bottom-1 left-2 right-2 h-px bg-black/70" />
    </div>
  );
}

function CornerHardware({
  side,
}: {
  side: "left" | "right";
}) {
  const isLeft = side === "left";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 z-30 h-14 w-14 border-t border-amber-200/25 sm:h-16 sm:w-16 ${
        isLeft
          ? "left-0 rounded-tr-2xl border-r bg-gradient-to-br from-[#9a672b] via-[#4d2b10] to-[#080301] shadow-[inset_-5px_-5px_9px_rgba(0,0,0,0.75),inset_2px_2px_3px_rgba(255,255,255,0.08),5px_-4px_12px_rgba(0,0,0,0.55)]"
          : "right-0 rounded-tl-2xl border-l bg-gradient-to-bl from-[#9a672b] via-[#4d2b10] to-[#080301] shadow-[inset_5px_-5px_9px_rgba(0,0,0,0.75),inset_-2px_2px_3px_rgba(255,255,255,0.08),-5px_-4px_12px_rgba(0,0,0,0.55)]"
      }`}
    >
      <div
        className={`absolute top-2.5 h-2.5 w-2.5 rounded-full border border-amber-100/30 bg-gradient-to-b from-[#c08338] to-[#4b260e] shadow-[inset_0_1px_2px_rgba(255,255,255,0.16),0_2px_4px_rgba(0,0,0,0.9)] ${
          isLeft ? "left-2.5" : "right-2.5"
        }`}
      />

      <div
        className={`absolute bottom-2.5 h-2.5 w-2.5 rounded-full border border-amber-100/20 bg-gradient-to-b from-[#9d6328] to-[#381a09] shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
          isLeft ? "left-2.5" : "right-2.5"
        }`}
      />

      <div
        className={`absolute inset-y-2 w-px bg-gradient-to-b from-amber-100/20 via-amber-700/15 to-black/55 ${
          isLeft ? "right-1.5" : "left-1.5"
        }`}
      />

      <div
        className={`absolute top-1 h-px w-7 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent ${
          isLeft ? "left-1 rotate-12" : "right-1 -rotate-12"
        }`}
      />
    </div>
  );
}

export function ChestBody({
  isLidOpen,
  isLightVisible,
  children,
}: ChestBodyProps) {
  return (
    <>
      {/* Vnútorná dutina truhlice */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-9 top-27 z-10 h-28 overflow-hidden rounded-b-[2rem] transition-all duration-700 ease-out sm:inset-x-11 ${
          isLidOpen
            ? "translate-y-0 scale-y-100 opacity-100"
            : "-translate-y-3 scale-y-75 opacity-0"
        }`}
      >
        {/* Základná hĺbka dutiny */}
        <div className="absolute inset-0 rounded-b-[2rem] bg-gradient-to-b from-black via-[#080301] to-[#1b0b04] shadow-[inset_0_16px_22px_rgba(0,0,0,0.98),inset_12px_0_18px_rgba(0,0,0,0.88),inset_-12px_0_18px_rgba(0,0,0,0.88)]" />

        {/* Zadná drevená stena */}
        <div className="absolute inset-x-3 bottom-5 top-0 overflow-hidden bg-gradient-to-b from-[#060201] via-[#1c0c05] to-[#090301]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_37px,rgba(0,0,0,0.5)_38px,rgba(112,53,19,0.13)_40px,transparent_42px)]" />

          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_8px,rgba(124,61,23,0.1)_9px,transparent_11px)]" />

          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black via-black/80 to-transparent" />

          <div className="absolute bottom-0 left-1/2 top-4 w-px -translate-x-1/2 bg-black/55 shadow-[1px_0_0_rgba(139,70,28,0.12)]" />

          <div className="absolute bottom-0 left-0 top-1 w-10 bg-gradient-to-r from-black via-black/65 to-transparent" />

          <div className="absolute bottom-0 right-0 top-1 w-10 bg-gradient-to-l from-black via-black/65 to-transparent" />

          <div
            className={`absolute inset-x-10 bottom-0 h-14 rounded-[50%] bg-amber-400/10 blur-xl transition-all duration-1000 ${
              isLightVisible
                ? "scale-110 opacity-100"
                : "scale-75 opacity-0"
            }`}
          />
        </div>

        {/* Perspektívne dno */}
        <div
          className="absolute inset-x-7 bottom-0 z-10 h-[4.5rem] overflow-hidden bg-gradient-to-b from-[#3d1d0d] via-[#180904] to-[#040100] shadow-[inset_0_8px_10px_rgba(0,0,0,0.8)]"
          style={{
            clipPath:
              "polygon(12% 0, 88% 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_30px,rgba(0,0,0,0.4)_31px,rgba(98,45,17,0.1)_32px,transparent_34px)]" />

          <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-b from-transparent to-black/90" />

          <div
            className={`absolute inset-x-7 top-1 h-8 rounded-[50%] bg-gradient-to-b from-amber-100/20 via-amber-400/10 to-transparent blur-lg transition-all duration-1000 ${
              isLightVisible
                ? "scale-110 opacity-100"
                : "scale-75 opacity-10"
            }`}
          />
        </div>

        {/* Ľavá vnútorná stena */}
        <div
          className="absolute bottom-0 left-0 top-0 z-10 w-16 overflow-hidden bg-gradient-to-r from-black via-[#170904] to-[#542713]/55 shadow-[inset_-7px_0_12px_rgba(0,0,0,0.82)]"
          style={{
            clipPath:
              "polygon(0 0, 100% 18%, 72% 100%, 0 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_11px,rgba(116,55,20,0.18)_12px,transparent_14px)]" />

          <div className="absolute bottom-2 right-1 top-4 w-px bg-amber-100/15" />

          <div
            className={`absolute bottom-0 right-0 top-4 w-8 bg-gradient-to-l from-amber-300/10 to-transparent transition-opacity duration-1000 ${
              isLightVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Pravá vnútorná stena */}
        <div
          className="absolute bottom-0 right-0 top-0 z-10 w-16 overflow-hidden bg-gradient-to-l from-black via-[#170904] to-[#542713]/55 shadow-[inset_7px_0_12px_rgba(0,0,0,0.82)]"
          style={{
            clipPath:
              "polygon(0 18%, 100% 0, 100% 100%, 28% 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_11px,rgba(116,55,20,0.18)_12px,transparent_14px)]" />

          <div className="absolute bottom-2 left-1 top-4 w-px bg-amber-100/15" />

          <div
            className={`absolute bottom-0 left-0 top-4 w-8 bg-gradient-to-r from-amber-300/10 to-transparent transition-opacity duration-1000 ${
              isLightVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Predná vnútorná hrana */}
        <div
          className="absolute inset-x-1 bottom-0 z-20 h-8 bg-gradient-to-b from-[#3b190a] via-[#140704] to-black shadow-[0_-6px_12px_rgba(0,0,0,0.72),inset_0_1px_1px_rgba(251,191,36,0.12)]"
          style={{
            clipPath:
              "polygon(3% 0, 97% 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/25 to-transparent" />
        </div>
      </div>

      {/* Masívny rám otvoru */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-5 top-24 z-[15] h-14 transition-all duration-700 ease-out ${
          isLidOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0"
        }`}
      >
        <div
          className="absolute inset-x-5 top-0 h-5 border border-amber-900/75 bg-gradient-to-b from-[#75431d] via-[#3b1d0d] to-[#0d0502] shadow-[inset_0_2px_2px_rgba(251,191,36,0.13),0_7px_12px_rgba(0,0,0,0.82)]"
          style={{
            clipPath:
              "polygon(7% 0, 93% 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="absolute inset-x-6 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/25 to-transparent" />
        </div>

        <div
          className="absolute bottom-0 left-0 top-2 w-10 bg-gradient-to-r from-[#0c0402] via-[#51250f] to-[#180904] shadow-[inset_-4px_0_7px_rgba(0,0,0,0.62),4px_2px_8px_rgba(0,0,0,0.45)]"
          style={{
            clipPath:
              "polygon(0 0, 100% 18%, 78% 100%, 16% 88%)",
          }}
        />

        <div
          className="absolute bottom-0 right-0 top-2 w-10 bg-gradient-to-l from-[#0c0402] via-[#51250f] to-[#180904] shadow-[inset_4px_0_7px_rgba(0,0,0,0.62),-4px_2px_8px_rgba(0,0,0,0.45)]"
          style={{
            clipPath:
              "polygon(0 18%, 100% 0, 84% 88%, 22% 100%)",
          }}
        />

        <div
          className="absolute inset-x-7 bottom-0 h-5 border-y border-amber-200/10 bg-gradient-to-b from-[#5b2c12] via-[#241006] to-[#060201] shadow-[0_-5px_10px_rgba(0,0,0,0.62),inset_0_2px_2px_rgba(251,191,36,0.1)]"
          style={{
            clipPath:
              "polygon(3% 0, 97% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* Celý vonkajší korpus */}
      <div className="relative z-20 -mt-1 pb-5">
        {/* Tieň pod truhlicou */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3 left-1/2 h-10 w-[88%] -translate-x-1/2 rounded-full bg-black/85 blur-xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1 left-1/2 h-3 w-[72%] -translate-x-1/2 rounded-full bg-black"
        />

        {/* Ľavá vonkajšia stena */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-0 top-5 z-0 w-10 border-y border-l border-amber-950/80 bg-gradient-to-r from-[#030100] via-[#150804] to-[#542610] shadow-[-11px_15px_25px_rgba(0,0,0,0.75)] sm:w-12"
          style={{
            clipPath:
              "polygon(0 12%, 100% 0, 100% 94%, 30% 100%, 8% 88%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_8px,rgba(104,46,17,0.3)_9px,transparent_11px)]" />

          <div className="absolute inset-y-4 right-1 w-px bg-amber-100/15" />

          <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/80 to-transparent" />
        </div>

        {/* Pravá vonkajšia stena */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 right-0 top-5 z-0 w-10 border-y border-r border-amber-950/80 bg-gradient-to-l from-[#030100] via-[#150804] to-[#542610] shadow-[11px_15px_25px_rgba(0,0,0,0.75)] sm:w-12"
          style={{
            clipPath:
              "polygon(0 0, 100% 12%, 92% 88%, 70% 100%, 0 94%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_8px,rgba(104,46,17,0.3)_9px,transparent_11px)]" />

          <div className="absolute inset-y-4 left-1 w-px bg-amber-100/15" />

          <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/80 to-transparent" />
        </div>

        {/* Hlavná predná časť */}
        <div
          className={`relative z-10 mx-2 overflow-hidden rounded-b-[2.5rem] border border-amber-500/30 transition-shadow duration-1000 sm:mx-3 ${
            isLightVisible
              ? "shadow-[0_32px_58px_rgba(0,0,0,0.82),0_0_44px_rgba(251,191,36,0.14)]"
              : "shadow-[0_32px_58px_rgba(0,0,0,0.82)]"
          }`}
          style={{
            clipPath:
              "polygon(2% 0, 98% 0, 100% 94%, 94% 100%, 6% 100%, 0 94%)",
          }}
        >
          {/* Základná kresba dreva */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#100805_0px,#100805_5px,#2d160a_6px,#1a0c06_12px,#0d0503_14px)]" />

          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_72px,rgba(0,0,0,0.16)_73px,rgba(112,50,17,0.08)_75px,transparent_77px)]" />

          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/10 via-black/5 to-slate-950/95" />

          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[78%] -translate-x-1/2 bg-gradient-to-r from-black/22 via-amber-900/5 to-black/24" />

          {/* Jemné nerovnosti dreva */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[18%] top-[28%] h-px w-24 rotate-1 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[15%] top-[58%] h-px w-28 -rotate-1 bg-gradient-to-r from-transparent via-black/70 to-transparent"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[28%] top-[72%] h-px w-16 rotate-2 bg-gradient-to-r from-transparent via-amber-950/60 to-transparent"
          />

          {/* Horná plocha tela */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-3 top-0 z-20 h-9 border-x border-t border-amber-200/15 bg-gradient-to-b from-[#75431e] via-[#391b0c] to-[#0d0502] shadow-[inset_0_2px_2px_rgba(251,191,36,0.16),0_8px_13px_rgba(0,0,0,0.85)]"
            style={{
              clipPath:
                "polygon(5% 0, 95% 0, 100% 100%, 0 100%)",
            }}
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_28px,rgba(18,8,3,0.4)_29px,transparent_31px)]" />

            <div className="absolute inset-x-7 top-1 h-2 rounded-[50%] bg-gradient-to-b from-amber-100/20 to-transparent blur-sm" />

            <div className="absolute inset-x-10 bottom-1 h-px bg-black/65" />
          </div>

          {/* Predná horná lišta */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-7 z-20 h-5 border-y border-amber-200/12 bg-gradient-to-b from-[#5f3217] via-[#281208] to-[#070301] shadow-[inset_0_2px_2px_rgba(251,191,36,0.1),0_7px_11px_rgba(0,0,0,0.82)]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-10 z-20 h-2 rounded-full bg-black/95 shadow-[0_3px_8px_rgba(0,0,0,0.95)]"
          />

          {/* Zadná kovová lišta */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-12 top-8 z-30 h-4 rounded-md border border-amber-900/80 bg-gradient-to-b from-[#895226] via-[#42230e] to-[#100603] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_4px_7px_rgba(0,0,0,0.85)] transition-opacity duration-700 ${
              isLidOpen ? "opacity-100" : "opacity-75"
            }`}
          >
            <div className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/20 to-transparent" />
          </div>

          <BodyHinge side="left" />
          <BodyHinge side="right" />

          {/* Ľavý masívny stĺpik */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-9 border-r border-amber-300/15 bg-gradient-to-r from-[#020100] via-[#381a0b] to-[#150804] shadow-[inset_-7px_0_10px_rgba(0,0,0,0.75),6px_0_12px_rgba(0,0,0,0.42)] sm:w-11"
          >
            <div className="absolute inset-y-4 left-1.5 w-px bg-gradient-to-b from-transparent via-amber-100/15 to-transparent" />

            <div className="absolute inset-y-0 right-1 w-px bg-black/80" />

            <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-black/70 to-transparent" />
          </div>

          {/* Pravý masívny stĺpik */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-9 border-l border-amber-300/15 bg-gradient-to-l from-[#020100] via-[#381a0b] to-[#150804] shadow-[inset_7px_0_10px_rgba(0,0,0,0.75),-6px_0_12px_rgba(0,0,0,0.42)] sm:w-11"
          >
            <div className="absolute inset-y-4 right-1.5 w-px bg-gradient-to-b from-transparent via-amber-100/15 to-transparent" />

            <div className="absolute inset-y-0 left-1 w-px bg-black/80" />

            <div className="absolute right-0 top-0 h-full w-3 bg-gradient-to-l from-black/70 to-transparent" />
          </div>

          <CornerHardware side="left" />
          <CornerHardware side="right" />

          {/* Spodná masívna lišta */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 bottom-0 z-20 h-7 rounded-t-lg border-t border-amber-200/15 bg-gradient-to-b from-[#61361b] via-[#291307] to-[#050201] shadow-[0_10px_16px_rgba(0,0,0,0.78),inset_0_2px_2px_rgba(251,191,36,0.1)]"
          >
            <div className="absolute inset-x-8 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />
          </div>

          {/* Ovládací panel */}
          <div className="relative z-10 px-5 pb-7 pt-11 sm:px-7 sm:pb-8 sm:pt-12">
            <div className="relative translate-y-1 overflow-hidden rounded-[2rem] border border-amber-500/20 bg-gradient-to-b from-[#160a05] via-[#0c0503] to-black px-3 pb-4 pt-6 shadow-[inset_0_9px_16px_rgba(0,0,0,0.78),inset_0_-9px_14px_rgba(0,0,0,0.7),0_11px_22px_rgba(0,0,0,0.5)] sm:px-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 rounded-[1.6rem] border border-amber-800/20 shadow-[inset_0_0_20px_rgba(0,0,0,0.78)]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-3 top-0 h-3 rounded-[50%] bg-gradient-to-b from-amber-200/14 via-amber-700/5 to-transparent blur-sm"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 left-0 top-4 w-3 rounded-l-xl bg-gradient-to-r from-black/75 via-[#2d1509] to-transparent shadow-[3px_0_7px_rgba(0,0,0,0.5)]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 right-0 top-4 w-3 rounded-r-xl bg-gradient-to-l from-black/75 via-[#2d1509] to-transparent shadow-[-3px_0_7px_rgba(0,0,0,0.5)]"
              />

              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-10 -top-2 h-8 rounded-[50%] bg-amber-200/8 blur-xl transition-opacity duration-1000 ${
                  isLightVisible ? "opacity-100" : "opacity-0"
                }`}
              />

              <div className="relative z-10">{children}</div>
            </div>
          </div>
        </div>

        {/* Ľavá nožička */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-9 z-0 h-7 w-14 rounded-b-xl border-x border-b border-black/90 bg-gradient-to-b from-[#3e1d0c] via-[#180904] to-[#040100] shadow-[0_9px_15px_rgba(0,0,0,0.75)]"
          style={{
            transform: "skewX(-8deg)",
          }}
        >
          <div className="absolute inset-x-2 top-0 h-px bg-amber-100/10" />
        </div>

        {/* Pravá nožička */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-9 z-0 h-7 w-14 rounded-b-xl border-x border-b border-black/90 bg-gradient-to-b from-[#3e1d0c] via-[#180904] to-[#040100] shadow-[0_9px_15px_rgba(0,0,0,0.75)]"
          style={{
            transform: "skewX(8deg)",
          }}
        >
          <div className="absolute inset-x-2 top-0 h-px bg-amber-100/10" />
        </div>
      </div>
    </>
  );
}