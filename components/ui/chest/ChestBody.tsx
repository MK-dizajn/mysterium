import type { ReactNode } from "react";

type ChestBodyProps = {
  isLidOpen: boolean;
  isLightVisible: boolean;
  children: ReactNode;
};

function BodyHinge({ side }: { side: "left" | "right" }) {
  const positionClass = side === "left" ? "left-[23%]" : "right-[23%]";

  return (
    <div
      className={`pointer-events-none absolute top-7 z-40 h-7 w-12 rounded-md border border-amber-950 bg-gradient-to-b from-[#8b531d] via-[#42250e] to-[#130905] shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),0_5px_8px_rgba(0,0,0,0.8)] ${positionClass}`}
    >
      <div className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-amber-100/20 bg-amber-800 shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
      <div className="absolute right-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-amber-100/20 bg-amber-800 shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
      <div className="absolute inset-y-1 left-1/2 w-2 -translate-x-1/2 rounded-sm bg-gradient-to-r from-black/45 via-amber-500/25 to-black/45" />
    </div>
  );
}

function CornerHardware({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div
      className={`pointer-events-none absolute bottom-0 z-30 h-14 w-14 border-t border-amber-200/25 sm:h-16 sm:w-16 ${
        isLeft
          ? "left-0 rounded-tr-2xl border-r bg-gradient-to-br from-[#86521c] via-[#40250e] to-[#080403] shadow-[inset_-5px_-5px_9px_rgba(0,0,0,0.7),5px_-4px_12px_rgba(0,0,0,0.5)]"
          : "right-0 rounded-tl-2xl border-l bg-gradient-to-bl from-[#86521c] via-[#40250e] to-[#080403] shadow-[inset_5px_-5px_9px_rgba(0,0,0,0.7),-5px_-4px_12px_rgba(0,0,0,0.5)]"
      }`}
    >
      <div
        className={`absolute top-2.5 h-2.5 w-2.5 rounded-full border border-amber-100/25 bg-amber-700 shadow-[inset_0_1px_2px_rgba(255,255,255,0.14),0_2px_4px_rgba(0,0,0,0.85)] ${
          isLeft ? "left-2.5" : "right-2.5"
        }`}
      />
      <div
        className={`absolute bottom-2.5 h-2.5 w-2.5 rounded-full border border-amber-100/20 bg-amber-800 shadow-[0_2px_4px_rgba(0,0,0,0.85)] ${
          isLeft ? "left-2.5" : "right-2.5"
        }`}
      />
      <div
        className={`absolute inset-y-2 w-px bg-amber-200/10 ${
          isLeft ? "right-1.5" : "left-1.5"
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
      {/* Otvorená vnútorná dutina */}
      <div
        className={`pointer-events-none absolute inset-x-10 top-28 z-10 h-24 overflow-hidden rounded-b-[2rem] transition-all duration-700 sm:inset-x-12 ${
          isLidOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-3 opacity-0"
        }`}
      >
        <div className="absolute inset-0 rounded-b-[2rem] bg-gradient-to-b from-black via-[#090402] to-[#180a04] shadow-[inset_0_14px_20px_rgba(0,0,0,0.95),inset_10px_0_16px_rgba(0,0,0,0.8),inset_-10px_0_16px_rgba(0,0,0,0.8)]" />

        {/* Zadná stena dutiny */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#090403] via-[#1b0c06] to-black">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_38px,rgba(0,0,0,0.38)_39px,rgba(96,45,18,0.12)_41px,transparent_43px)]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_9px,rgba(103,49,19,0.12)_10px,transparent_12px)]" />
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black via-black/70 to-transparent" />
          <div className="absolute bottom-2 left-1/2 top-5 w-px -translate-x-1/2 bg-black/45 shadow-[1px_0_0_rgba(120,58,22,0.12)]" />
          <div className="absolute bottom-0 left-0 top-2 w-8 bg-gradient-to-r from-black/95 via-black/55 to-transparent" />
          <div className="absolute bottom-0 right-0 top-2 w-8 bg-gradient-to-l from-black/95 via-black/55 to-transparent" />
        </div>

        {/* Perspektívne dno */}
        <div
          className="absolute inset-x-8 bottom-0 z-10 h-16 overflow-hidden bg-gradient-to-b from-[#35190c] via-[#1a0b05] to-[#070201]"
          style={{
            clipPath: "polygon(12% 0, 88% 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_30px,rgba(0,0,0,0.32)_31px,transparent_33px)]" />
          <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-b from-transparent to-black/80" />
          <div
            className={`absolute inset-x-8 top-2 h-6 rounded-[50%] bg-amber-400/12 blur-lg transition-opacity duration-700 ${
              isLightVisible ? "opacity-100" : "opacity-20"
            }`}
          />
        </div>

        {/* Bočné vnútorné steny */}
        <div
          className="absolute bottom-0 left-0 top-0 z-10 w-16 overflow-hidden bg-gradient-to-r from-black via-[#1c0d07] to-[#4a2410]/45 shadow-[inset_-6px_0_10px_rgba(0,0,0,0.75)]"
          style={{
            clipPath: "polygon(0 0, 100% 18%, 72% 100%, 0 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_12px,rgba(105,53,22,0.18)_13px,transparent_15px)]" />
          <div className="absolute bottom-2 right-1 top-4 w-px bg-amber-200/15" />
        </div>

        <div
          className="absolute bottom-0 right-0 top-0 z-10 w-16 overflow-hidden bg-gradient-to-l from-black via-[#1c0d07] to-[#4a2410]/45 shadow-[inset_6px_0_10px_rgba(0,0,0,0.75)]"
          style={{
            clipPath: "polygon(0 18%, 100% 0, 100% 100%, 28% 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_12px,rgba(105,53,22,0.18)_13px,transparent_15px)]" />
          <div className="absolute bottom-2 left-1 top-4 w-px bg-amber-200/15" />
        </div>

        {/* Predná vnútorná hrana */}
        <div
          className="absolute inset-x-2 bottom-0 z-20 h-7 bg-gradient-to-b from-[#2b1308] via-[#120704] to-black shadow-[0_-5px_10px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(251,191,36,0.08)]"
          style={{
            clipPath: "polygon(3% 0, 97% 0, 100% 100%, 0 100%)",
          }}
        >
          <div className="absolute inset-x-5 top-0 h-px bg-amber-200/15" />
        </div>

        <div
          className={`absolute inset-x-12 bottom-4 h-12 rounded-[50%] bg-amber-500/12 blur-xl transition-all duration-700 ${
            isLightVisible
              ? "scale-100 opacity-100"
              : "scale-75 opacity-20"
          }`}
        />
      </div>

      {/* Masívny rám otvoru */}
      <div
        className={`pointer-events-none absolute inset-x-5 top-24 z-[15] h-14 transition-all duration-700 ${
          isLidOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0"
        }`}
      >
        <div
          className="absolute inset-x-5 top-0 h-5 border border-amber-900/70 bg-gradient-to-b from-[#613518] via-[#32180b] to-[#100704] shadow-[inset_0_2px_2px_rgba(251,191,36,0.1),0_6px_10px_rgba(0,0,0,0.75)]"
          style={{
            clipPath: "polygon(7% 0, 93% 0, 100% 100%, 0 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 top-2 w-10 bg-gradient-to-r from-[#160905] via-[#4b2510] to-[#1c0d06] shadow-[inset_-4px_0_6px_rgba(0,0,0,0.55),4px_2px_8px_rgba(0,0,0,0.4)]"
          style={{
            clipPath: "polygon(0 0, 100% 18%, 78% 100%, 16% 88%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 top-2 w-10 bg-gradient-to-l from-[#160905] via-[#4b2510] to-[#1c0d06] shadow-[inset_4px_0_6px_rgba(0,0,0,0.55),-4px_2px_8px_rgba(0,0,0,0.4)]"
          style={{
            clipPath: "polygon(0 18%, 100% 0, 84% 88%, 22% 100%)",
          }}
        />
        <div
          className="absolute inset-x-7 bottom-0 h-5 border-y border-amber-200/10 bg-gradient-to-b from-[#4a2510] via-[#241006] to-[#080301] shadow-[0_-5px_10px_rgba(0,0,0,0.55),inset_0_2px_2px_rgba(251,191,36,0.08)]"
          style={{
            clipPath: "polygon(3% 0, 97% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* Celý korpus */}
      <div className="relative z-20 -mt-1 pb-5">
        <div className="pointer-events-none absolute -bottom-2 left-1/2 h-8 w-[84%] -translate-x-1/2 rounded-full bg-black/80 blur-xl" />

        {/* Vonkajšie bočné steny */}
        <div
          className="pointer-events-none absolute bottom-8 left-0 top-5 z-0 w-10 border-y border-l border-amber-950/80 bg-gradient-to-r from-[#050201] via-[#170a05] to-[#48230f] shadow-[-10px_14px_24px_rgba(0,0,0,0.7)] sm:w-12"
          style={{
            clipPath: "polygon(0 12%, 100% 0, 100% 94%, 30% 100%, 8% 88%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_8px,rgba(92,45,18,0.28)_9px,transparent_11px)]" />
          <div className="absolute inset-y-4 right-1 w-px bg-amber-200/15" />
        </div>

        <div
          className="pointer-events-none absolute bottom-8 right-0 top-5 z-0 w-10 border-y border-r border-amber-950/80 bg-gradient-to-l from-[#050201] via-[#170a05] to-[#48230f] shadow-[10px_14px_24px_rgba(0,0,0,0.7)] sm:w-12"
          style={{
            clipPath: "polygon(0 0, 100% 12%, 92% 88%, 70% 100%, 0 94%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_8px,rgba(92,45,18,0.28)_9px,transparent_11px)]" />
          <div className="absolute inset-y-4 left-1 w-px bg-amber-200/15" />
        </div>

        {/* Predná hlavná časť */}
        <div
          className={`relative z-10 mx-2 overflow-hidden rounded-b-[2.5rem] border border-amber-500/30 transition-shadow duration-700 sm:mx-3 ${
            isLightVisible
              ? "shadow-[0_30px_55px_rgba(0,0,0,0.78),0_0_42px_rgba(251,191,36,0.15)]"
              : "shadow-[0_30px_55px_rgba(0,0,0,0.78)]"
          }`}
          style={{
            clipPath: "polygon(2% 0, 98% 0, 100% 94%, 94% 100%, 6% 100%, 0 94%)",
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#130b07_0px,#130b07_6px,#2c170b_7px,#180d08_13px)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/15 via-black/5 to-slate-950/90" />
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[76%] -translate-x-1/2 bg-gradient-to-r from-black/15 via-amber-900/5 to-black/20" />

          {/* Horná plocha tela */}
          <div
            className="pointer-events-none absolute inset-x-3 top-0 z-20 h-9 border-x border-t border-amber-200/15 bg-gradient-to-b from-[#6a3b1b] via-[#351a0c] to-[#100704] shadow-[inset_0_2px_2px_rgba(251,191,36,0.14),0_7px_12px_rgba(0,0,0,0.8)]"
            style={{
              clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0 100%)",
            }}
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_28px,rgba(18,8,3,0.34)_29px,transparent_31px)]" />
            <div className="absolute inset-x-7 top-1 h-2 rounded-[50%] bg-gradient-to-b from-amber-100/18 to-transparent blur-sm" />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-7 z-20 h-5 border-y border-amber-200/12 bg-gradient-to-b from-[#4f2913] via-[#251108] to-[#090402] shadow-[inset_0_2px_2px_rgba(251,191,36,0.08),0_6px_10px_rgba(0,0,0,0.78)]" />
          <div className="pointer-events-none absolute inset-x-5 top-10 z-20 h-2 rounded-full bg-black/90 shadow-[0_3px_7px_rgba(0,0,0,0.9)]" />

          {/* Zadná lišta a pánty */}
          <div
            className={`pointer-events-none absolute inset-x-12 top-8 z-30 h-4 rounded-md border border-amber-900/80 bg-gradient-to-b from-[#754318] via-[#3b210d] to-[#120804] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_7px_rgba(0,0,0,0.8)] transition-opacity duration-700 ${
              isLidOpen ? "opacity-100" : "opacity-75"
            }`}
          />
          <BodyHinge side="left" />
          <BodyHinge side="right" />

          {/* Masívne bočné stĺpiky */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-9 border-r border-amber-300/15 bg-gradient-to-r from-[#030201] via-[#32190c] to-[#160a05] shadow-[inset_-6px_0_9px_rgba(0,0,0,0.7),6px_0_11px_rgba(0,0,0,0.38)] sm:w-11">
            <div className="absolute inset-y-4 left-1.5 w-px bg-amber-200/10" />
            <div className="absolute inset-y-0 right-1 w-px bg-black/75" />
          </div>

          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-9 border-l border-amber-300/15 bg-gradient-to-l from-[#030201] via-[#32190c] to-[#160a05] shadow-[inset_6px_0_9px_rgba(0,0,0,0.7),-6px_0_11px_rgba(0,0,0,0.38)] sm:w-11">
            <div className="absolute inset-y-4 right-1.5 w-px bg-amber-200/10" />
            <div className="absolute inset-y-0 left-1 w-px bg-black/75" />
          </div>

          <CornerHardware side="left" />
          <CornerHardware side="right" />

          <div className="pointer-events-none absolute inset-x-5 bottom-0 z-20 h-6 rounded-t-lg border-t border-amber-200/15 bg-gradient-to-b from-[#533019] via-[#241208] to-[#070301] shadow-[0_9px_15px_rgba(0,0,0,0.72),inset_0_2px_2px_rgba(251,191,36,0.09)]" />

          {/* Ovládací panel */}
          <div className="relative z-10 px-5 pb-7 pt-11 sm:px-7 sm:pb-8 sm:pt-12">
            <div className="relative translate-y-1 rounded-[2rem] border border-amber-500/20 bg-gradient-to-b from-[#140905] via-[#0d0604] to-black px-3 pb-4 pt-6 shadow-[inset_0_8px_14px_rgba(0,0,0,0.72),inset_0_-8px_12px_rgba(0,0,0,0.65),0_10px_20px_rgba(0,0,0,0.45)] sm:px-4">
              <div className="pointer-events-none absolute inset-2 rounded-[1.6rem] border border-amber-800/20 shadow-[inset_0_0_18px_rgba(0,0,0,0.7)]" />
              <div className="pointer-events-none absolute inset-x-3 top-0 h-3 rounded-[50%] bg-gradient-to-b from-amber-200/12 via-amber-700/5 to-transparent blur-sm" />
              <div className="pointer-events-none absolute bottom-3 left-0 top-4 w-3 rounded-l-xl bg-gradient-to-r from-black/70 via-[#2a150a] to-transparent shadow-[3px_0_6px_rgba(0,0,0,0.45)]" />
              <div className="pointer-events-none absolute bottom-3 right-0 top-4 w-3 rounded-r-xl bg-gradient-to-l from-black/70 via-[#2a150a] to-transparent shadow-[-3px_0_6px_rgba(0,0,0,0.45)]" />

              <div className="relative z-10">{children}</div>
            </div>
          </div>
        </div>

        {/* Nožičky */}
        <div
          className="pointer-events-none absolute bottom-0 left-9 z-0 h-7 w-14 rounded-b-xl border-x border-b border-black/90 bg-gradient-to-b from-[#351a0c] to-[#070301] shadow-[0_9px_14px_rgba(0,0,0,0.7)]"
          style={{
            transform: "skewX(-8deg)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-9 z-0 h-7 w-14 rounded-b-xl border-x border-b border-black/90 bg-gradient-to-b from-[#351a0c] to-[#070301] shadow-[0_9px_14px_rgba(0,0,0,0.7)]"
          style={{
            transform: "skewX(8deg)",
          }}
        />
      </div>
    </>
  );
}