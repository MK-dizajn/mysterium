import type { ReactNode } from "react";

type ChestBodyProps = {
  isLidOpen: boolean;
  isLightVisible: boolean;
  children: ReactNode;
};

export function ChestBody({
  isLidOpen,
  isLightVisible,
  children,
}: ChestBodyProps) {
  return (
    <>
      {/* Vnútorná dutina truhlice */}
      <div
        className={`pointer-events-none absolute inset-x-8 top-28 z-10 h-28 overflow-hidden rounded-b-3xl transition-all duration-700 ${
          isLidOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Zadná stena */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0503] via-[#120804] to-black" />

        {/* Ľavá stena */}
        <div
          className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black via-[#1a0d06] to-transparent"
          style={{
            transform: "skewY(-14deg)",
            transformOrigin: "left",
          }}
        />

        {/* Pravá stena */}
        <div
          className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black via-[#1a0d06] to-transparent"
          style={{
            transform: "skewY(14deg)",
            transformOrigin: "right",
          }}
        />

        {/* Dno */}
        <div className="absolute inset-x-4 bottom-0 h-10 rounded-t-xl bg-gradient-to-b from-[#2a140a] to-black" />
      </div>

      {/* Spodná časť truhlice */}
      <div
        className={`relative z-20 -mt-1 overflow-hidden rounded-b-[2.5rem] border border-amber-500/30 shadow-[0_30px_55px_rgba(0,0,0,0.75)] transition duration-700 ${
          isLightVisible
            ? "shadow-[0_30px_55px_rgba(0,0,0,0.75),0_0_40px_rgba(251,191,36,0.14)]"
            : ""
        }`}
      >
        {/* Drevo tela */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#130b07_0px,#130b07_6px,#28150b_7px,#180d08_13px)]" />

        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-black/10 to-slate-950/85" />

        {/* Horná 3D hrana tela truhlice */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-5 border-b border-amber-200/15 bg-gradient-to-b from-[#4a2813] via-[#261208] to-[#0b0503] shadow-[inset_0_2px_2px_rgba(251,191,36,0.12),0_5px_10px_rgba(0,0,0,0.75)]" />

        <div className="pointer-events-none absolute inset-x-8 top-1 z-10 h-3 rounded-[50%] bg-gradient-to-b from-amber-200/10 to-transparent blur-sm" />

        {/* Ľavý masívny bočný stĺpik */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 border-r border-amber-300/15 bg-gradient-to-r from-[#050302] via-[#32190c] to-[#160b06] shadow-[inset_-5px_0_8px_rgba(0,0,0,0.65),5px_0_10px_rgba(0,0,0,0.35)] sm:w-10">
          <div className="absolute inset-y-3 left-1 w-px bg-amber-200/10" />
          <div className="absolute inset-y-0 right-1 w-px bg-black/70" />
        </div>

        {/* Pravý masívny bočný stĺpik */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 border-l border-amber-300/15 bg-gradient-to-l from-[#050302] via-[#32190c] to-[#160b06] shadow-[inset_5px_0_8px_rgba(0,0,0,0.65),-5px_0_10px_rgba(0,0,0,0.35)] sm:w-10">
          <div className="absolute inset-y-3 right-1 w-px bg-amber-200/10" />
          <div className="absolute inset-y-0 left-1 w-px bg-black/70" />
        </div>

        {/* Vnútorné perspektívne tiene */}
        <div className="pointer-events-none absolute bottom-0 left-8 top-5 z-[5] w-8 bg-gradient-to-r from-black/45 to-transparent sm:left-10" />

        <div className="pointer-events-none absolute bottom-0 right-8 top-5 z-[5] w-8 bg-gradient-to-l from-black/45 to-transparent sm:right-10" />

        {/* Ľavé rohové kovanie */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-12 w-12 rounded-tr-2xl border-r border-t border-amber-200/25 bg-gradient-to-br from-[#7a4a18] via-[#3d240d] to-[#090504] shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.65),4px_-3px_10px_rgba(0,0,0,0.45)] sm:h-14 sm:w-14">
          <div className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full border border-amber-100/25 bg-amber-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.8)]" />

          <div className="absolute bottom-2 left-2 h-2.5 w-2.5 rounded-full border border-amber-100/20 bg-amber-800 shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

          <div className="absolute inset-y-2 right-1 w-px bg-amber-200/10" />
        </div>

        {/* Pravé rohové kovanie */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-20 h-12 w-12 rounded-tl-2xl border-l border-t border-amber-200/25 bg-gradient-to-bl from-[#7a4a18] via-[#3d240d] to-[#090504] shadow-[inset_4px_-4px_8px_rgba(0,0,0,0.65),-4px_-3px_10px_rgba(0,0,0,0.45)] sm:h-14 sm:w-14">
          <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-amber-100/25 bg-amber-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.8)]" />

          <div className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full border border-amber-100/20 bg-amber-800 shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

          <div className="absolute inset-y-2 left-1 w-px bg-amber-200/10" />
        </div>

        {/* Spodná masívna základňa truhlice */}
        <div className="pointer-events-none absolute inset-x-5 bottom-0 z-10 h-5 rounded-t-lg border-t border-amber-200/15 bg-gradient-to-b from-[#4a2813] via-[#211108] to-[#080402] shadow-[0_8px_14px_rgba(0,0,0,0.7),inset_0_2px_2px_rgba(251,191,36,0.08)]" />

        {/* Ľavá nožička */}
        <div
          className="pointer-events-none absolute -bottom-3 left-8 z-0 h-5 w-12 rounded-b-xl border-x border-b border-black/80 bg-gradient-to-b from-[#2e170b] to-[#080402] shadow-[0_8px_12px_rgba(0,0,0,0.65)]"
          style={{
            transform: "skewX(-8deg)",
          }}
        />

        {/* Pravá nožička */}
        <div
          className="pointer-events-none absolute -bottom-3 right-8 z-0 h-5 w-12 rounded-b-xl border-x border-b border-black/80 bg-gradient-to-b from-[#2e170b] to-[#080402] shadow-[0_8px_12px_rgba(0,0,0,0.65)]"
          style={{
            transform: "skewX(8deg)",
          }}
        />

        {/* Tieň pod truhlicou */}
        <div className="pointer-events-none absolute -bottom-6 left-1/2 z-[-1] h-6 w-[82%] -translate-x-1/2 rounded-full bg-black/75 blur-xl" />

        <div className="relative px-4 pb-5 pt-8 sm:px-6 sm:pb-6 sm:pt-9">
          {children}
        </div>
      </div>
    </>
  );
}