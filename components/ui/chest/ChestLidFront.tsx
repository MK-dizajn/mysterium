import { ChestCornerBrace } from "./ChestCornerBrace";
import { ChestMetalBand } from "./ChestMetalBand";
import { ChestRivet } from "./ChestRivet";

const LID_SHAPE =
  "polygon(4% 0, 96% 0, 100% 92%, 98% 100%, 2% 100%, 0 92%)";

function LidDepth() {
  return (
    <>
      {/* Zadná fyzická vrstva veka */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-3 h-40 overflow-hidden rounded-t-[4.25rem] border border-black/85 bg-gradient-to-b from-[#48230e] via-[#1c0b05] to-[#050201] shadow-[0_28px_38px_rgba(0,0,0,0.86),inset_0_3px_3px_rgba(255,210,145,0.07)] sm:h-44"
        style={{
          clipPath: LID_SHAPE,
          transform:
            "translateZ(-20px) translateY(8px) scaleX(0.985)",
        }}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_8px,rgba(113,50,17,0.14)_9px,transparent_11px)]" />

        <div className="absolute inset-x-2 bottom-0 h-9 bg-gradient-to-b from-[#703d1a] via-[#2c1308] to-black shadow-[inset_0_2px_2px_rgba(255,210,145,0.08)]" />

        <div className="absolute inset-x-5 bottom-1 h-px bg-gradient-to-r from-transparent via-amber-200/18 to-transparent" />

        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/80 to-transparent" />

        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/80 to-transparent" />
      </div>

      {/* Ľavá bočná hrúbka */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-0 top-5 z-[1] w-6 border-l border-amber-900/40 bg-gradient-to-r from-[#080301] via-[#5f2d10] to-[#261006] shadow-[-7px_9px_15px_rgba(0,0,0,0.72)]"
        style={{
          clipPath:
            "polygon(30% 0, 100% 5%, 100% 94%, 0 100%, 0 16%)",
          transform: "translateZ(-10px) translateX(-3px)",
        }}
      >
        <div className="absolute inset-y-3 right-1 w-px bg-amber-100/12" />
      </div>

      {/* Pravá bočná hrúbka */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-0 top-5 z-[1] w-6 border-r border-amber-900/40 bg-gradient-to-l from-[#080301] via-[#5f2d10] to-[#261006] shadow-[7px_9px_15px_rgba(0,0,0,0.72)]"
        style={{
          clipPath:
            "polygon(0 5%, 70% 0, 100% 16%, 100% 100%, 0 94%)",
          transform: "translateZ(-10px) translateX(3px)",
        }}
      >
        <div className="absolute inset-y-3 left-1 w-px bg-amber-100/12" />
      </div>

      {/* Horný oblúk hrúbky */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-0 z-[2] h-11 rounded-[50%] border-t border-amber-700/30 bg-gradient-to-b from-[#7a421c] via-[#321608] to-transparent shadow-[0_-4px_7px_rgba(255,190,110,0.09),0_9px_16px_rgba(0,0,0,0.76)]"
        style={{
          transform:
            "translateZ(-12px) translateY(5px) rotateX(64deg) scaleX(0.97)",
          transformOrigin: "center top",
        }}
      />
    </>
  );
}

function WoodFace() {
  return (
    <>
      {/* Základná kresba dreva */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg,#1e0e06 0px,#1e0e06 4px,#4b250f 5px,#2a1308 10px,#160905 13px)",
          transform: "scale(1.02)",
          filter: "contrast(1.12) saturate(1.08)",
        }}
      />

      {/* Jemné vertikálne členenie dosiek */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_72px,rgba(0,0,0,0.18)_73px,rgba(121,55,19,0.09)_75px,transparent_77px)]" />

      {/* Škáry medzi doskami */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute inset-x-3 top-[26%] h-[2px] bg-black/70 shadow-[0_1px_0_rgba(255,190,100,0.09)]" />

        <div className="absolute inset-x-2 top-[51%] h-[2px] bg-black/75 shadow-[0_1px_0_rgba(255,190,100,0.1)]" />

        <div className="absolute inset-x-1 top-[76%] h-[2px] bg-black/80 shadow-[0_1px_0_rgba(255,190,100,0.08)]" />
      </div>

      {/* Jemné praskliny a nerovnosti */}
      <div className="pointer-events-none absolute inset-0 z-[3]">
        <div className="absolute left-[13%] top-[36%] h-px w-20 rotate-2 bg-gradient-to-r from-transparent via-black/65 to-transparent" />

        <div className="absolute right-[14%] top-[61%] h-px w-24 -rotate-1 bg-gradient-to-r from-transparent via-amber-950/70 to-transparent" />

        <div className="absolute left-[30%] top-[72%] h-px w-14 rotate-1 bg-gradient-to-r from-transparent via-black/55 to-transparent" />

        <div className="absolute right-[29%] top-[31%] h-3 w-7 rotate-[-8deg] rounded-[50%] border border-black/30 bg-[radial-gradient(ellipse_at_center,rgba(12,4,2,0.72)_0%,rgba(83,35,12,0.38)_42%,transparent_72%)]" />
      </div>

      {/* Farebné modelovanie dreva */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-600/24 via-amber-950/5 to-black/72" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-200/11 via-transparent to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/52 via-black/16 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/52 via-black/16 to-transparent" />

      <div className="pointer-events-none absolute inset-x-10 top-2 h-10 rounded-[50%] bg-amber-100/6 blur-xl" />
    </>
  );
}

function TopArch() {
  return (
    <>
      {/* Spodná kovová vrstva oblúka */}
      <div className="pointer-events-none absolute inset-x-5 top-4 z-[4] h-6 rounded-[50%] border-y border-amber-200/20 bg-gradient-to-b from-[#ae702e]/70 via-[#4c250e] to-[#120603] shadow-[inset_0_2px_2px_rgba(255,220,160,0.18),inset_0_-2px_3px_rgba(0,0,0,0.8),0_6px_11px_rgba(0,0,0,0.58)]">
        <div className="absolute inset-x-5 top-1 h-px rounded-full bg-gradient-to-r from-transparent via-amber-100/30 to-transparent" />

        <div className="absolute inset-x-4 bottom-1 h-px rounded-full bg-black/75" />
      </div>

      {/* Hlavný horný kovový oblúk */}
      <div className="pointer-events-none absolute inset-x-6 top-2 z-[8] h-14 rounded-[50%] border-t-[7px] border-[#552a0f] shadow-[0_-2px_2px_rgba(255,210,145,0.14),0_6px_9px_rgba(0,0,0,0.68)]">
        <div className="absolute inset-x-1 top-[-6px] h-[3px] rounded-[50%] border-t border-amber-300/30" />

        <div className="absolute inset-x-7 top-[-3px] h-px rounded-full bg-gradient-to-r from-transparent via-amber-100/24 to-transparent" />

        <ChestRivet
          className="absolute left-[18%] top-[-6px]"
          size="small"
        />

        <ChestRivet
          className="absolute left-1/2 top-[-8px] -translate-x-1/2"
          size="small"
        />

        <ChestRivet
          className="absolute right-[18%] top-[-6px]"
          size="small"
        />
      </div>
    </>
  );
}

function CenterPanel() {
  return (
    <div className="pointer-events-none absolute bottom-16 left-14 right-14 top-16 overflow-hidden rounded-[2.2rem] border border-amber-900/50 bg-gradient-to-b from-[#683819]/70 via-[#2d150a]/55 to-[#0e0502]/75 shadow-[inset_0_3px_3px_rgba(255,220,165,0.15),inset_0_-6px_10px_rgba(0,0,0,0.78),0_9px_20px_rgba(0,0,0,0.34)]">
      <div className="absolute inset-x-6 top-2 h-px bg-gradient-to-r from-transparent via-amber-100/22 to-transparent" />

      <div className="absolute inset-x-8 bottom-2 h-px bg-black/70" />

      <div className="absolute inset-0 rounded-[2.2rem] bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_9px,rgba(128,61,22,0.1)_10px,transparent_12px)]" />

      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_48px,rgba(0,0,0,0.22)_49px,transparent_51px)]" />

      <div className="absolute bottom-4 left-1/2 top-4 w-px bg-black/45 shadow-[1px_0_0_rgba(170,85,29,0.07)]" />

      <div className="absolute inset-x-8 top-2 h-5 rounded-[50%] bg-amber-100/5 blur-md" />

      {/* Suk v dreve */}
      <div className="absolute bottom-[31%] right-[26%] h-4 w-7 rotate-[-7deg] rounded-[50%] border border-black/40 bg-[radial-gradient(ellipse_at_center,rgba(10,3,2,0.78)_0%,rgba(78,31,10,0.48)_38%,transparent_72%)] shadow-[inset_0_0_4px_rgba(0,0,0,0.65)]">
        <div className="absolute left-1/2 top-1/2 h-1.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/50" />
      </div>
    </div>
  );
}

function MysteriumEmblem() {
  return (
    <div className="absolute bottom-1 left-1/2 z-20 flex h-20 w-20 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-[5px] border-[#81501d] bg-gradient-to-br from-[#724119] via-[#241006] to-black shadow-[0_0_0_2px_rgba(251,191,36,0.2),0_13px_28px_rgba(0,0,0,0.9),inset_0_2px_3px_rgba(255,220,155,0.12)] sm:h-24 sm:w-24">
      {/* Vonkajší kovový odlesk */}
      <div className="absolute inset-[1px] rounded-full border border-amber-100/20" />

      {/* Patina */}
      <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(251,191,36,0.16),transparent_30%),radial-gradient(circle_at_72%_74%,rgba(60,90,68,0.18),transparent_32%)]" />

      {/* Zapustená vnútorná časť */}
      <div className="absolute inset-3 rounded-full border border-black/75 bg-gradient-to-br from-[#3b1d0c] via-[#120603] to-black shadow-[inset_0_5px_10px_rgba(0,0,0,0.78),inset_0_-2px_3px_rgba(168,95,34,0.1)]" />

      <div className="absolute inset-4 rounded-full border border-amber-200/12" />

      <div className="absolute left-[24%] top-[18%] h-2 w-5 -rotate-[24deg] rounded-full bg-amber-100/14 blur-[1px]" />

      <span className="relative font-serif text-4xl font-black text-amber-300 drop-shadow-[0_3px_3px_rgba(0,0,0,0.95)] sm:text-5xl">
        M
      </span>
    </div>
  );
}

export function ChestLidFront() {
  return (
    <div
      className="relative z-10 mx-1 h-[11.25rem] sm:h-[12.25rem]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <LidDepth />

      {/* Hlavná predná plocha veka */}
      <div
        className="relative h-40 overflow-hidden rounded-t-[4.25rem] border border-amber-500/35 shadow-[0_20px_30px_rgba(0,0,0,0.68),inset_0_1px_1px_rgba(255,220,155,0.06)] sm:h-44"
        style={{
          clipPath: LID_SHAPE,
          transform: "translateZ(6px) rotateX(-2deg)",
          transformOrigin: "center bottom",
        }}
      >
        <WoodFace />
        <CenterPanel />

        <ChestMetalBand position="left" />
        <ChestMetalBand position="center" />
        <ChestMetalBand position="right" />

        <TopArch />

        {/* Spodná priečna kovová výstuha */}
        <div className="pointer-events-none absolute inset-x-8 bottom-8 z-[3] h-5 rounded-md border border-amber-950/80 bg-gradient-to-b from-[#875127] via-[#48230e] to-[#120603] shadow-[inset_0_2px_2px_rgba(255,220,165,0.14),inset_0_-2px_3px_rgba(0,0,0,0.78),0_5px_9px_rgba(0,0,0,0.55)]">
          <div className="absolute inset-x-5 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />

          <div className="absolute inset-x-4 bottom-1 h-px bg-black/70" />
        </div>

        <ChestCornerBrace side="left" />
        <ChestCornerBrace side="right" />

        {/* Spodná masívna lišta */}
        <div className="absolute inset-x-0 bottom-0 h-9 border-y border-amber-300/20 bg-gradient-to-b from-[#321608] via-[#8b531e]/60 to-[#100603] shadow-[inset_0_2px_2px_rgba(251,191,36,0.12),0_-6px_13px_rgba(0,0,0,0.48)]">
          <div className="absolute inset-x-8 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/16 to-transparent" />

          <div className="absolute inset-x-5 bottom-1 h-px bg-black/65" />
        </div>

        <MysteriumEmblem />

        {/* Finálne svetlo, tiene a lemovanie */}
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="absolute inset-x-0 top-0 h-11 bg-gradient-to-b from-black/58 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 top-0 w-9 bg-gradient-to-r from-black/72 via-black/22 to-transparent" />

          <div className="absolute bottom-0 right-0 top-0 w-9 bg-gradient-to-l from-black/72 via-black/22 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-black/80 via-black/28 to-transparent" />

          <div className="absolute inset-[3px] rounded-t-[4rem] border border-amber-200/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.76)]" />

          <div className="absolute inset-x-14 top-1 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />

          <div className="absolute left-[16%] top-[15%] h-14 w-20 -rotate-[18deg] rounded-[50%] bg-amber-100/5 blur-xl" />
        </div>
      </div>
    </div>
  );
}