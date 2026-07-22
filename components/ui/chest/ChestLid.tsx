import { ChestLidFront } from "./ChestLidFront";

type ChestLidProps = {
  isLidOpen: boolean;
};

const METAL_GRADIENT =
  "bg-gradient-to-r from-[#160905] via-[#8d521f] to-[#160905]";

function Hinge({ side }: { side: "left" | "right" }) {
  const positionClass = side === "left" ? "left-9" : "right-9";

  return (
    <div
      className={`pointer-events-none absolute bottom-3 z-30 h-10 w-20 ${positionClass}`}
    >
      {/* Rameno pántu */}
      <div
        className={`absolute bottom-5 left-1/2 h-16 w-7 -translate-x-1/2 rounded-t-md border-x border-t border-amber-200/15 ${METAL_GRADIENT} shadow-[inset_1px_0_2px_rgba(255,225,175,0.12),inset_-1px_0_2px_rgba(0,0,0,0.72),0_4px_8px_rgba(0,0,0,0.72)]`}
        style={{
          clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)",
        }}
      >
        <div className="absolute inset-y-2 left-1 w-px bg-amber-100/12" />
        <div className="absolute inset-y-2 right-1 w-px bg-black/60" />

        <div className="absolute left-1/2 top-3 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-black/80 bg-gradient-to-br from-[#bd7a31] via-[#633514] to-[#180904] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_3px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Montážna platňa */}
      <div className="absolute inset-x-0 bottom-0 h-6 rounded-md border border-black/75 bg-gradient-to-b from-[#865020] via-[#3d1e0d] to-[#130704] shadow-[inset_0_1px_2px_rgba(255,225,175,0.12),0_4px_8px_rgba(0,0,0,0.75)]">
        <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-black/75 bg-gradient-to-br from-[#b57431] to-[#241006]" />
        <div className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-black/75 bg-gradient-to-br from-[#b57431] to-[#241006]" />
      </div>

      {/* Valcový čap */}
      <div className="absolute inset-x-2 top-0 h-4 rounded-full border border-black/85 bg-gradient-to-b from-[#a86829] via-[#4a250f] to-[#120704] shadow-[inset_0_2px_2px_rgba(255,220,165,0.18),0_3px_6px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-x-3 top-1 h-px bg-amber-100/18" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/55" />
      </div>

      <div className="absolute left-0 top-1 h-3 w-3 rounded-full border border-black/80 bg-gradient-to-br from-[#84501f] to-[#150804]" />
      <div className="absolute right-0 top-1 h-3 w-3 rounded-full border border-black/80 bg-gradient-to-bl from-[#84501f] to-[#150804]" />
    </div>
  );
}

function InnerMetalBrace({
  side,
}: {
  side: "left" | "right";
}) {
  const positionClass = side === "left" ? "left-[27%]" : "right-[27%]";
  const lightClass =
    side === "left"
      ? "bg-gradient-to-r shadow-[inset_1px_0_1px_rgba(255,220,160,0.12),2px_0_5px_rgba(0,0,0,0.65)]"
      : "bg-gradient-to-l shadow-[inset_-1px_0_1px_rgba(255,220,160,0.12),-2px_0_5px_rgba(0,0,0,0.65)]";

  return (
    <div
      className={`absolute bottom-4 top-6 w-4 rounded-sm border border-amber-700/20 from-[#1a0d08] via-[#70401f] to-[#211008] ${positionClass} ${lightClass}`}
    >
      <div className="absolute left-1/2 top-3 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/80 shadow-[inset_0_1px_1px_rgba(255,220,160,0.16)]" />
      <div className="absolute bottom-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/80 shadow-[inset_0_1px_1px_rgba(255,220,160,0.16)]" />
    </div>
  );
}

export function ChestLid({ isLidOpen }: ChestLidProps) {
  return (
    <div
      className={`pointer-events-none relative z-30 -mx-1 origin-bottom transition-opacity duration-700 sm:-mx-2 ${
        isLidOpen ? "opacity-95" : "opacity-100"
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
      {/* Zadný oblúk vytvárajúci reálnu hrúbku veka */}
      <div
        className="absolute inset-x-6 top-0 z-0 h-20 overflow-hidden rounded-t-[4.25rem] border border-black/80 bg-gradient-to-b from-[#4b250f] via-[#1c0c06] to-[#070302] shadow-[0_-8px_18px_rgba(0,0,0,0.58),0_20px_28px_rgba(0,0,0,0.62),inset_0_3px_3px_rgba(255,210,145,0.08)]"
        style={{
          transform: "translateY(-7px) translateZ(-18px)",
        }}
      >
        <div className="absolute inset-x-5 top-2 h-14 rounded-[50%] border-t border-amber-200/12 bg-gradient-to-b from-[#6c3717]/55 via-[#2b1309]/45 to-transparent" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_9px,rgba(111,53,20,0.13)_10px,transparent_12px)]" />
        <div className="absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-black/80 to-transparent" />
        <div className="absolute inset-x-12 top-2 h-px rounded-full bg-amber-200/14" />
      </div>

      {/* Vonkajšie bočné steny hrubého veka */}
      <div
        className="absolute bottom-2 left-0 top-10 z-[1] w-11 border-y border-l border-amber-950/80 bg-gradient-to-r from-[#050201] via-[#190b05] to-[#552911] shadow-[-10px_12px_20px_rgba(0,0,0,0.72)] sm:w-12"
        style={{
          clipPath: "polygon(0 11%, 100% 0, 100% 100%, 18% 88%)",
          transform: "translateX(-4px) translateZ(-10px)",
        }}
      >
        <div className="absolute inset-y-4 right-1 w-px bg-amber-200/11" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_11px,rgba(112,54,21,0.14)_12px,transparent_14px)]" />
      </div>

      <div
        className="absolute bottom-2 right-0 top-10 z-[1] w-11 border-y border-r border-amber-950/80 bg-gradient-to-l from-[#050201] via-[#190b05] to-[#552911] shadow-[10px_12px_20px_rgba(0,0,0,0.72)] sm:w-12"
        style={{
          clipPath: "polygon(0 0, 100% 11%, 82% 88%, 0 100%)",
          transform: "translateX(4px) translateZ(-10px)",
        }}
      >
        <div className="absolute inset-y-4 left-1 w-px bg-amber-200/11" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_11px,rgba(112,54,21,0.14)_12px,transparent_14px)]" />
      </div>

      {/* Predná hlavná plocha */}
      <ChestLidFront />

      {/* Vnútorná strana sa objaví až po otvorení */}
      <div
        className={`absolute inset-x-5 bottom-5 top-5 z-20 overflow-hidden rounded-t-[3.5rem] rounded-b-xl border border-amber-950/90 bg-gradient-to-b from-[#32190d] via-[#160a06] to-[#060201] shadow-[inset_0_18px_32px_rgba(0,0,0,0.88),inset_0_-6px_12px_rgba(180,110,45,0.12)] transition-opacity duration-700 ${
          isLidOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: "translateZ(-14px) rotateX(180deg)",
          backfaceVisibility: "hidden",
        }}
      >
        {/* Drevený podklad */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_17px,rgba(0,0,0,0.38)_18px,transparent_20px)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_46px,rgba(98,46,18,0.12)_47px,transparent_49px)]" />

        {/* Masívny vnútorný rám */}
        <div className="absolute inset-4 rounded-t-[2.8rem] rounded-b-lg border border-amber-700/20 shadow-[inset_0_0_0_5px_rgba(20,9,4,0.75),inset_0_14px_22px_rgba(0,0,0,0.58)]">
          <div className="absolute inset-x-4 top-2 h-px bg-amber-200/14" />
          <div className="absolute inset-x-5 bottom-2 h-px bg-black/75" />
        </div>

        {/* Zapustený panel */}
        <div className="absolute inset-x-16 bottom-10 top-11 overflow-hidden rounded-t-[2rem] rounded-b-lg border border-amber-950/75 bg-gradient-to-b from-[#3c1d0c] via-[#1b0c06] to-[#080302] shadow-[inset_0_11px_18px_rgba(0,0,0,0.76),inset_0_-3px_5px_rgba(148,78,28,0.12)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_37px,rgba(0,0,0,0.45)_38px,rgba(105,50,18,0.14)_40px,transparent_42px)]" />
          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-black/65 to-transparent" />
          <div className="absolute bottom-2 left-1/2 top-2 w-px bg-black/55 shadow-[1px_0_rgba(176,95,36,0.08)]" />
          <div className="absolute inset-x-8 bottom-2 h-5 rounded-[50%] bg-amber-500/6 blur-md" />
        </div>

        {/* Konštrukčné rebrá */}
        <div className="absolute bottom-8 left-9 top-9 w-5 rounded-sm border-x border-amber-950/60 bg-gradient-to-r from-[#170904] via-[#633016] to-[#241006] shadow-[inset_-2px_0_3px_rgba(0,0,0,0.7),3px_0_7px_rgba(0,0,0,0.48)]">
          <div className="absolute inset-y-2 left-1 w-px bg-amber-200/10" />
        </div>

        <div className="absolute bottom-8 right-9 top-9 w-5 rounded-sm border-x border-amber-950/60 bg-gradient-to-l from-[#170904] via-[#633016] to-[#241006] shadow-[inset_2px_0_3px_rgba(0,0,0,0.7),-3px_0_7px_rgba(0,0,0,0.48)]">
          <div className="absolute inset-y-2 right-1 w-px bg-amber-200/10" />
        </div>

        <InnerMetalBrace side="left" />
        <InnerMetalBrace side="right" />

        {/* Horná priečna kovová výstuha */}
        <div className="absolute inset-x-12 top-6 h-4 rounded-sm border border-amber-700/20 bg-gradient-to-b from-[#77451f] via-[#32180d] to-[#120805] shadow-[inset_0_1px_1px_rgba(255,220,160,0.12),0_3px_6px_rgba(0,0,0,0.7)]">
          <div className="absolute left-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-black/80" />
          <div className="absolute right-5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-black/80" />
        </div>

        <Hinge side="left" />
        <Hinge side="right" />

        {/* Odraz svetla z dutiny truhlice */}
        <div
          className={`absolute inset-x-14 bottom-0 h-16 rounded-[50%] bg-amber-400/12 blur-2xl transition-opacity duration-700 ${
            isLidOpen ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Spodný presah zatvoreného veka */}
      <div
        className={`absolute -inset-x-1 bottom-0 z-20 h-6 rounded-b-xl border-x border-b border-amber-950/80 bg-gradient-to-b from-[#633517] via-[#2c160a] to-[#090302] shadow-[0_8px_14px_rgba(0,0,0,0.78)] transition-opacity duration-500 ${
          isLidOpen ? "opacity-25" : "opacity-100"
        }`}
      />

      {/* Spodná fyzická hrúbka */}
      <div
        className={`absolute inset-x-2 bottom-0 z-[19] h-8 origin-top rounded-b-xl border-x border-b border-black/75 bg-gradient-to-b from-[#542c14] via-[#251208] to-[#080302] shadow-[0_10px_18px_rgba(0,0,0,0.76)] transition-opacity duration-500 ${
          isLidOpen ? "opacity-100" : "opacity-82"
        }`}
        style={{
          transform: "translateY(16px) rotateX(-76deg)",
          transformOrigin: "top",
        }}
      >
        <div className="absolute inset-x-5 top-1 h-px bg-amber-200/11" />
      </div>
    </div>
  );
}