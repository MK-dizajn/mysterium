import { ChestCornerBrace } from "./ChestCornerBrace";
import { ChestMetalBand } from "./ChestMetalBand";
import { ChestRivet } from "./ChestRivet";

const LID_SHAPE =
  "polygon(4% 0, 96% 0, 100% 92%, 98% 100%, 2% 100%, 0 92%)";

function LidDepth() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-3 h-40 rounded-t-[4.25rem] border border-black/80 bg-gradient-to-b from-[#3a1d0c] via-[#1b0c05] to-[#070302] shadow-[0_26px_34px_rgba(0,0,0,0.82)] sm:h-44"
        style={{
          clipPath: LID_SHAPE,
          transform: "translateZ(-18px) translateY(7px) scaleX(0.985)",
        }}
      >
        <div className="absolute inset-x-2 bottom-0 h-8 bg-gradient-to-b from-[#623416] via-[#271107] to-black" />
        <div className="absolute inset-x-5 bottom-1 h-px bg-amber-300/15" />
      </div>

      <div
        className="pointer-events-none absolute bottom-3 left-0 top-5 z-[1] w-5 border-l border-amber-900/35 bg-gradient-to-r from-[#100603] via-[#51270f] to-[#251006] shadow-[-5px_8px_12px_rgba(0,0,0,0.65)]"
        style={{
          clipPath: "polygon(30% 0, 100% 5%, 100% 94%, 0 100%, 0 16%)",
          transform: "translateZ(-8px) translateX(-2px)",
        }}
      />

      <div
        className="pointer-events-none absolute bottom-3 right-0 top-5 z-[1] w-5 border-r border-amber-900/35 bg-gradient-to-l from-[#100603] via-[#51270f] to-[#251006] shadow-[5px_8px_12px_rgba(0,0,0,0.65)]"
        style={{
          clipPath: "polygon(0 5%, 70% 0, 100% 16%, 100% 100%, 0 94%)",
          transform: "translateZ(-8px) translateX(2px)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-5 top-0 z-[2] h-10 rounded-[50%] border-t border-amber-700/30 bg-gradient-to-b from-[#6a3717] via-[#2a1308] to-transparent shadow-[0_-3px_6px_rgba(255,190,110,0.08),0_8px_14px_rgba(0,0,0,0.72)]"
        style={{
          transform:
            "translateZ(-10px) translateY(5px) rotateX(64deg) scaleX(0.97)",
          transformOrigin: "center top",
        }}
      />
    </>
  );
}

function WoodFace() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg,#241208 0px,#241208 5px,#452410 6px,#2b160a 11px)",
          transform: "scale(1.02)",
          filter: "contrast(1.08) saturate(1.05)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div className="absolute inset-x-3 top-[26%] h-[2px] bg-black/65 shadow-[0_1px_0_rgba(255,190,100,0.08)]" />
        <div className="absolute inset-x-2 top-[51%] h-[2px] bg-black/70 shadow-[0_1px_0_rgba(255,190,100,0.09)]" />
        <div className="absolute inset-x-1 top-[76%] h-[2px] bg-black/75 shadow-[0_1px_0_rgba(255,190,100,0.08)]" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-amber-700/28 via-amber-950/5 to-black/65" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-amber-300/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/45 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/45 to-transparent" />
    </>
  );
}

function TopArch() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-5 top-4 z-[4] h-6 rounded-[50%] border-y border-amber-200/20 bg-gradient-to-b from-[#9a5a20]/65 via-[#42210d] to-[#160904] shadow-[inset_0_2px_2px_rgba(255,220,160,0.16),inset_0_-2px_3px_rgba(0,0,0,0.75),0_5px_10px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-x-5 top-1 h-px rounded-full bg-amber-100/25" />
        <div className="absolute inset-x-4 bottom-1 h-px rounded-full bg-black/70" />
      </div>

      <div className="pointer-events-none absolute inset-x-6 top-2 z-[8] h-14 rounded-[50%] border-t-[7px] border-[#4a260f] shadow-[0_-2px_2px_rgba(255,210,145,0.12),0_5px_8px_rgba(0,0,0,0.62)]">
        <div className="absolute inset-x-1 top-[-6px] h-[3px] rounded-[50%] border-t border-amber-300/25" />
        <ChestRivet className="absolute left-[18%] top-[-6px]" size="small" />
        <ChestRivet
          className="absolute left-1/2 top-[-8px] -translate-x-1/2"
          size="small"
        />
        <ChestRivet className="absolute right-[18%] top-[-6px]" size="small" />
      </div>
    </>
  );
}

function CenterPanel() {
  return (
    <div className="pointer-events-none absolute bottom-16 left-14 right-14 top-16 rounded-[2.2rem] border border-amber-900/45 bg-gradient-to-b from-[#5a3015]/65 via-[#2d160b]/45 to-[#120704]/65 shadow-[inset_0_2px_2px_rgba(255,220,165,0.14),inset_0_-5px_8px_rgba(0,0,0,0.72),0_8px_18px_rgba(0,0,0,0.28)]">
      <div className="absolute inset-x-6 top-2 h-px bg-amber-200/18" />
      <div className="absolute inset-x-8 bottom-2 h-px bg-black/65" />
      <div className="absolute inset-0 rounded-[2.2rem] bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_9px,rgba(120,60,25,0.09)_10px,transparent_12px)]" />
      <div className="absolute bottom-4 left-1/2 top-4 w-px bg-black/40" />

      <div className="absolute bottom-[31%] right-[26%] h-4 w-7 rotate-[-7deg] rounded-[50%] border border-black/35 bg-[radial-gradient(ellipse_at_center,rgba(16,6,3,0.65)_0%,rgba(73,31,12,0.45)_38%,transparent_72%)] shadow-[inset_0_0_3px_rgba(0,0,0,0.55)]">
        <div className="absolute left-1/2 top-1/2 h-1.5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-black/40" />
      </div>
    </div>
  );
}

function MysteriumEmblem() {
  return (
    <div className="absolute bottom-1 left-1/2 z-20 flex h-20 w-20 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-[5px] border-[#6f3d15] bg-gradient-to-br from-[#4b2811] via-[#1c0d06] to-black shadow-[0_0_0_2px_rgba(251,191,36,0.18),0_12px_26px_rgba(0,0,0,0.85)] sm:h-24 sm:w-24">
      <div className="absolute inset-1 rounded-full border border-amber-200/30" />
      <div className="absolute inset-3 rounded-full border border-black/70 shadow-[inset_0_4px_8px_rgba(0,0,0,0.65)]" />
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

      <div
        className="relative h-40 overflow-hidden rounded-t-[4.25rem] border border-amber-500/35 shadow-[0_18px_26px_rgba(0,0,0,0.62)] sm:h-44"
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

        <div className="pointer-events-none absolute inset-x-8 bottom-8 z-[3] h-5 rounded-md border border-amber-950/75 bg-gradient-to-b from-[#71401d] via-[#40200e] to-[#170905] shadow-[inset_0_2px_2px_rgba(255,220,165,0.12),inset_0_-2px_3px_rgba(0,0,0,0.72),0_4px_8px_rgba(0,0,0,0.48)]" />

        <ChestCornerBrace side="left" />
        <ChestCornerBrace side="right" />

        <div className="absolute inset-x-0 bottom-0 h-9 border-y border-amber-300/20 bg-gradient-to-b from-[#281307] via-[#7b4619]/55 to-[#160a05] shadow-[inset_0_2px_2px_rgba(251,191,36,0.1),0_-5px_12px_rgba(0,0,0,0.42)]" />

        <MysteriumEmblem />

        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 top-0 w-8 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
          <div className="absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-black/65 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-[3px] rounded-t-[4rem] border border-amber-200/10 shadow-[inset_0_0_18px_rgba(0,0,0,0.72)]" />
        </div>
      </div>
    </div>
  );
}