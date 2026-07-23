import { ChestLidFront } from "./ChestLidFront";

type ChestLidProps = {
  isLidOpen: boolean;
};

const METAL_GRADIENT =
  "bg-gradient-to-r from-[#120603] via-[#9a622a] to-[#120603]";

function Hinge({ side }: { side: "left" | "right" }) {
  const positionClass = side === "left" ? "left-9" : "right-9";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-3 z-30 h-10 w-20 ${positionClass}`}
    >
      {/* Rameno pántu */}
      <div
        className={`absolute bottom-5 left-1/2 h-16 w-7 -translate-x-1/2 rounded-t-md border-x border-t border-amber-200/15 ${METAL_GRADIENT} shadow-[inset_1px_0_2px_rgba(255,225,175,0.14),inset_-1px_0_3px_rgba(0,0,0,0.78),0_5px_9px_rgba(0,0,0,0.78)]`}
        style={{
          clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)",
        }}
      >
        <div className="absolute inset-y-2 left-1 w-px bg-amber-100/14" />
        <div className="absolute inset-y-2 right-1 w-px bg-black/65" />

        <div className="absolute inset-x-1 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />

        <div className="absolute left-1/2 top-3 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-black/80 bg-gradient-to-br from-[#d0903d] via-[#6d3a16] to-[#160703] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_2px_3px_rgba(0,0,0,0.85)]" />
      </div>

      {/* Montážna platňa */}
      <div className="absolute inset-x-0 bottom-0 h-6 rounded-md border border-black/80 bg-gradient-to-b from-[#93602a] via-[#48240e] to-[#100603] shadow-[inset_0_1px_2px_rgba(255,225,175,0.14),inset_0_-2px_2px_rgba(0,0,0,0.72),0_4px_8px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-x-2 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />

        <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-black/75 bg-gradient-to-br from-[#c27e34] to-[#211006] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14)]" />

        <div className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-black/75 bg-gradient-to-br from-[#c27e34] to-[#211006] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14)]" />
      </div>

      {/* Valcový čap */}
      <div className="absolute inset-x-2 top-0 h-4 rounded-full border border-black/85 bg-gradient-to-b from-[#bd7a31] via-[#50270f] to-[#0f0502] shadow-[inset_0_2px_2px_rgba(255,220,165,0.2),0_3px_7px_rgba(0,0,0,0.85)]">
        <div className="absolute inset-x-3 top-1 h-px bg-amber-100/20" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/6" />
      </div>

      <div className="absolute left-0 top-1 h-3 w-3 rounded-full border border-black/80 bg-gradient-to-br from-[#945c25] to-[#120603] shadow-[0_2px_3px_rgba(0,0,0,0.8)]" />

      <div className="absolute right-0 top-1 h-3 w-3 rounded-full border border-black/80 bg-gradient-to-bl from-[#945c25] to-[#120603] shadow-[0_2px_3px_rgba(0,0,0,0.8)]" />
    </div>
  );
}

function InnerMetalBrace({
  side,
}: {
  side: "left" | "right";
}) {
  const positionClass =
    side === "left" ? "left-[27%]" : "right-[27%]";

  const lightClass =
    side === "left"
      ? "bg-gradient-to-r shadow-[inset_1px_0_1px_rgba(255,220,160,0.14),2px_0_6px_rgba(0,0,0,0.7)]"
      : "bg-gradient-to-l shadow-[inset_-1px_0_1px_rgba(255,220,160,0.14),-2px_0_6px_rgba(0,0,0,0.7)]";

  return (
    <div
      aria-hidden="true"
      className={`absolute bottom-4 top-6 w-4 rounded-sm border border-amber-700/20 from-[#140806] via-[#7e4821] to-[#190b06] ${positionClass} ${lightClass}`}
    >
      <div className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-amber-100/15 via-black/35 to-amber-100/8" />

      <div className="absolute left-1/2 top-3 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/85 shadow-[inset_0_1px_1px_rgba(255,220,160,0.18)]" />

      <div className="absolute bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/85 shadow-[inset_0_1px_1px_rgba(255,220,160,0.18)]" />
    </div>
  );
}

export function ChestLid({ isLidOpen }: ChestLidProps) {
  return (
    <div
      className={`pointer-events-none relative z-30 -mx-1 origin-bottom transition-opacity duration-700 sm:-mx-2 ${
        isLidOpen ? "opacity-[0.98]" : "opacity-100"
      }`}
      style={{
        transform: "translateY(0) rotateX(0deg)",
        transformOrigin: "center bottom",
        transformStyle: "preserve-3d",
        animation: isLidOpen
          ? "chest-lid-cinematic-open 1400ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
          : "none",
        willChange: isLidOpen ? "transform" : "auto",
      }}
    >
      {/* Zadný oblúk a objem veka */}
      <div
        aria-hidden="true"
        className="absolute inset-x-5 top-0 z-0 h-24 overflow-hidden rounded-t-[4.5rem] border border-black/85 bg-gradient-to-b from-[#5c2c11] via-[#241006] to-[#050201] shadow-[0_-10px_20px_rgba(0,0,0,0.62),0_22px_32px_rgba(0,0,0,0.68),inset_0_3px_3px_rgba(255,210,145,0.1)]"
        style={{
          transform: "translateY(-9px) translateZ(-20px)",
        }}
      >
        <div className="absolute inset-x-5 top-2 h-16 rounded-[50%] border-t border-amber-200/14 bg-gradient-to-b from-[#81461f]/55 via-[#35170a]/50 to-transparent" />

        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_9px,rgba(126,59,20,0.16)_10px,transparent_12px)]" />

        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_58px,rgba(0,0,0,0.22)_59px,rgba(112,50,18,0.08)_61px,transparent_63px)]" />

        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/88 via-black/45 to-transparent" />

        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/88 via-black/45 to-transparent" />

        <div className="absolute inset-x-12 top-2 h-px rounded-full bg-gradient-to-r from-transparent via-amber-100/20 to-transparent" />

        <div className="absolute inset-x-8 bottom-1 h-5 rounded-[50%] bg-black/65 blur-md" />
      </div>

      {/* Ľavá bočná stena veka */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-0 top-10 z-[1] w-12 border-y border-l border-amber-950/85 bg-gradient-to-r from-[#030100] via-[#190a04] to-[#652f12] shadow-[-12px_14px_24px_rgba(0,0,0,0.76)] sm:w-14"
        style={{
          clipPath:
            "polygon(0 11%, 100% 0, 100% 100%, 18% 88%)",
          transform: "translateX(-5px) translateZ(-12px)",
        }}
      >
        <div className="absolute inset-y-4 right-1 w-px bg-amber-200/13" />

        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_11px,rgba(122,56,19,0.17)_12px,transparent_14px)]" />

        <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/85 to-transparent" />
      </div>

      {/* Pravá bočná stena veka */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 right-0 top-10 z-[1] w-12 border-y border-r border-amber-950/85 bg-gradient-to-l from-[#030100] via-[#190a04] to-[#652f12] shadow-[12px_14px_24px_rgba(0,0,0,0.76)] sm:w-14"
        style={{
          clipPath:
            "polygon(0 0, 100% 11%, 82% 88%, 0 100%)",
          transform: "translateX(5px) translateZ(-12px)",
        }}
      >
        <div className="absolute inset-y-4 left-1 w-px bg-amber-200/13" />

        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_11px,rgba(122,56,19,0.17)_12px,transparent_14px)]" />

        <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/85 to-transparent" />
      </div>

      {/* Tieň medzi prednou plochou a hrúbkou veka */}
      <div
        aria-hidden="true"
        className="absolute inset-x-5 bottom-2 top-10 z-[2] rounded-t-[4rem] rounded-b-xl shadow-[0_18px_26px_rgba(0,0,0,0.7)]"
        style={{
          transform: "translateZ(-8px)",
        }}
      />

      {/* Predná hlavná plocha */}
      <ChestLidFront />

      {/* Vnútorná strana veka */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-5 bottom-5 top-5 z-20 overflow-hidden rounded-t-[3.6rem] rounded-b-xl border border-amber-950/90 bg-gradient-to-b from-[#3c1d0d] via-[#170a05] to-[#040100] shadow-[inset_0_20px_36px_rgba(0,0,0,0.92),inset_0_-7px_14px_rgba(180,110,45,0.14),0_8px_18px_rgba(0,0,0,0.72)] transition-opacity duration-700 ${
          isLidOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: "translateZ(-15px) rotateX(180deg)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Drevený podklad */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_17px,rgba(0,0,0,0.44)_18px,rgba(104,49,18,0.08)_19px,transparent_21px)]" />

        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_46px,rgba(105,48,17,0.14)_47px,rgba(0,0,0,0.2)_48px,transparent_50px)]" />

        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/75 to-transparent" />

        <div className="absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-black/75 to-transparent" />

        <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-black/75 to-transparent" />

        {/* Masívny vnútorný rám */}
        <div className="absolute inset-4 rounded-t-[2.9rem] rounded-b-lg border border-amber-700/20 shadow-[inset_0_0_0_5px_rgba(16,7,3,0.82),inset_0_15px_24px_rgba(0,0,0,0.62),0_2px_6px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-x-4 top-2 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />

          <div className="absolute inset-x-5 bottom-2 h-px bg-black/80" />
        </div>

        {/* Zapustený centrálny panel */}
        <div className="absolute inset-x-16 bottom-10 top-11 overflow-hidden rounded-t-[2rem] rounded-b-lg border border-amber-950/80 bg-gradient-to-b from-[#48220e] via-[#1b0b05] to-[#050201] shadow-[inset_0_12px_20px_rgba(0,0,0,0.82),inset_0_-4px_6px_rgba(148,78,28,0.14),0_4px_10px_rgba(0,0,0,0.52)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_37px,rgba(0,0,0,0.5)_38px,rgba(110,49,17,0.15)_40px,transparent_42px)]" />

          <div className="absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-black/72 to-transparent" />

          <div className="absolute bottom-2 left-1/2 top-2 w-px bg-black/6 shadow-[1px_0_0_rgba(176,95,36,0.08)]" />

          <div className="absolute inset-x-8 bottom-2 h-6 rounded-[50%] bg-amber-500/8 blur-md" />
        </div>

        {/* Ľavé drevené rebro */}
        <div className="absolute bottom-8 left-9 top-9 w-5 rounded-sm border-x border-amber-950/65 bg-gradient-to-r from-[#120603] via-[#703517] to-[#1d0d05] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.74),3px_0_8px_rgba(0,0,0,0.52)]">
          <div className="absolute inset-y-2 left-1 w-px bg-amber-200/12" />
          <div className="absolute inset-y-1 right-0 w-px bg-black/65" />
        </div>

        {/* Pravé drevené rebro */}
        <div className="absolute bottom-8 right-9 top-9 w-5 rounded-sm border-x border-amber-950/65 bg-gradient-to-l from-[#120603] via-[#703517] to-[#1d0d05] shadow-[inset_2px_0_4px_rgba(0,0,0,0.74),-3px_0_8px_rgba(0,0,0,0.52)]">
          <div className="absolute inset-y-2 right-1 w-px bg-amber-200/12" />
          <div className="absolute inset-y-1 left-0 w-px bg-black/65" />
        </div>

        <InnerMetalBrace side="left" />
        <InnerMetalBrace side="right" />

        {/* Horná priečna kovová výstuha */}
        <div className="absolute inset-x-12 top-6 h-4 rounded-sm border border-amber-700/20 bg-gradient-to-b from-[#8c5527] via-[#3a1c0d] to-[#0e0503] shadow-[inset_0_1px_1px_rgba(255,220,160,0.14),0_3px_7px_rgba(0,0,0,0.75)]">
          <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />

          <div className="absolute left-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-black/85 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />

          <div className="absolute right-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-black/85 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />
        </div>

        <Hinge side="left" />
        <Hinge side="right" />

        {/* Odraz svetla z otvorenej dutiny */}
        <div
          className={`absolute inset-x-12 bottom-0 h-20 rounded-[50%] bg-amber-300/14 blur-2xl transition-all delay-200 duration-1000 ${
            isLidOpen
              ? "scale-110 opacity-100"
              : "scale-75 opacity-0"
          }`}
        />

        <div
          className={`absolute inset-x-20 bottom-1 h-6 rounded-[50%] bg-amber-100/12 blur-lg transition-opacity delay-300 duration-1000 ${
            isLidOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-100/25 to-transparent transition-opacity duration-1000 ${
            isLidOpen ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Predný presah zatvoreného veka */}
      <div
        aria-hidden="true"
        className={`absolute -inset-x-1 bottom-0 z-20 h-7 rounded-b-xl border-x border-b border-amber-950/85 bg-gradient-to-b from-[#75411d] via-[#31170a] to-[#070201] shadow-[0_9px_16px_rgba(0,0,0,0.82),inset_0_1px_1px_rgba(255,215,150,0.08)] transition-opacity duration-500 ${
          isLidOpen ? "opacity-20" : "opacity-100"
        }`}
      >
        <div className="absolute inset-x-6 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />
      </div>

      {/* Spodná fyzická hrúbka veka */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-2 bottom-0 z-[19] h-9 origin-top rounded-b-xl border-x border-b border-black/80 bg-gradient-to-b from-[#65361a] via-[#2a1308] to-[#050201] shadow-[0_12px_20px_rgba(0,0,0,0.8),inset_0_2px_2px_rgba(255,215,150,0.07)] transition-opacity duration-500 ${
          isLidOpen ? "opacity-100" : "opacity-[0.86]"
        }`}
        style={{
          transform: "translateY(17px) rotateX(-76deg)",
          transformOrigin: "top",
        }}
      >
        <div className="absolute inset-x-5 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/14 to-transparent" />

        <div className="absolute inset-x-8 bottom-1 h-2 rounded-[50%] bg-black/65 blur-sm" />
      </div>

      {/* Kontaktný tieň zatvoreného veka */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-8 -bottom-2 z-[18] h-5 rounded-[50%] bg-black/80 blur-md transition-opacity duration-500 ${
          isLidOpen ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}