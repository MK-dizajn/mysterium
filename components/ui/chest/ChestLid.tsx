type ChestLidProps = {
  isLidOpen: boolean;
};

export function ChestLid({ isLidOpen }: ChestLidProps) {
  return (
    <div
      className={`pointer-events-none relative z-30 mx-4 origin-bottom transition-opacity duration-700 ${
        isLidOpen ? "opacity-95" : "opacity-100"
      }`}
      style={{
        transform: "translateY(0) rotateX(0deg)",
        transformStyle: "preserve-3d",
        animation: isLidOpen
          ? "chest-lid-cinematic-open 1400ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
          : "none",
      }}
    >
      {/* Vonkajšia predná strana veka */}
      <div className="relative h-36 overflow-hidden rounded-t-[4rem] border border-amber-500/35 shadow-[0_24px_40px_rgba(0,0,0,0.7)] sm:h-40">
        {/* Drevo */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#241208_0px,#241208_5px,#3d2110_6px,#2b160a_11px)]" />

        <div className="absolute inset-0 bg-gradient-to-b from-amber-800/25 via-transparent to-black/55" />

        {/* Kovové pásy */}
        <div className="absolute inset-y-0 left-6 w-6 border-x border-amber-200/20 bg-gradient-to-r from-amber-950 via-amber-600/45 to-amber-950 shadow-lg" />

        <div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 border-x border-amber-200/20 bg-gradient-to-r from-amber-950 via-amber-600/45 to-amber-950 shadow-lg" />

        <div className="absolute inset-y-0 right-6 w-6 border-x border-amber-200/20 bg-gradient-to-r from-amber-950 via-amber-600/45 to-amber-950 shadow-lg" />

        {/* Nity */}
        {["left-[1.85rem]", "left-1/2", "right-[1.85rem]"].map(
          (position) => (
            <div
              key={position}
              className={`absolute top-5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-amber-100/25 bg-amber-700 shadow-[0_1px_4px_rgba(0,0,0,0.8)] ${position}`}
            />
          )
        )}

        {/* Spodná kovová hrana */}
        <div className="absolute inset-x-0 bottom-0 h-7 border-y border-amber-300/20 bg-gradient-to-b from-amber-950 via-amber-700/45 to-amber-950" />

        {/* Znak M */}
        <div className="absolute bottom-2 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-4 border-amber-700 bg-gradient-to-br from-[#3d210f] via-[#1d0e07] to-black shadow-[0_0_0_2px_rgba(251,191,36,0.2),0_12px_24px_rgba(0,0,0,0.8)] sm:h-20 sm:w-20">
          <div className="absolute inset-1 rounded-full border border-amber-200/30" />

          <span className="relative font-serif text-3xl font-black text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] sm:text-4xl">
            M
          </span>
        </div>
      </div>

      {/* Vnútorná strana otvoreného veka */}
      <div
        className={`pointer-events-none absolute inset-3 rounded-t-[2.75rem] rounded-b-xl border border-amber-950/80 bg-gradient-to-b from-[#25140c] via-[#160c08] to-[#090504] shadow-[inset_0_14px_28px_rgba(0,0,0,0.85),inset_0_-4px_10px_rgba(180,110,45,0.12)] transition-opacity duration-700 ${
          isLidOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: "translateZ(-10px) rotateX(180deg)",
          backfaceVisibility: "hidden",
        }}
      >
        <div className="absolute inset-x-7 top-7 h-px bg-amber-300/10" />
        <div className="absolute inset-x-10 bottom-6 h-px bg-black/70" />
      </div>

      {/* 3D hrúbka veka – ľavý bok */}
      <div
        className="pointer-events-none absolute bottom-2 left-0 top-12 w-4 rounded-l-2xl border-l border-amber-700/30 bg-gradient-to-r from-[#090402] via-[#241108] to-[#3b1d0d] shadow-[-8px_8px_14px_rgba(0,0,0,0.55)]"
        style={{
          transform: "translateX(-5px) translateZ(-6px) rotateY(-58deg)",
          transformOrigin: "right center",
        }}
      />

      {/* 3D hrúbka veka – pravý bok */}
      <div
        className="pointer-events-none absolute bottom-2 right-0 top-12 w-4 rounded-r-2xl border-r border-amber-700/30 bg-gradient-to-l from-[#090402] via-[#241108] to-[#3b1d0d] shadow-[8px_8px_14px_rgba(0,0,0,0.55)]"
        style={{
          transform: "translateX(5px) translateZ(-6px) rotateY(58deg)",
          transformOrigin: "left center",
        }}
      />

      {/* Horná zaoblená hrana veka */}
      <div
        className="pointer-events-none absolute inset-x-8 top-0 h-5 rounded-[50%] border-t border-amber-300/25 bg-gradient-to-b from-amber-700/35 via-[#35190c]/80 to-transparent blur-[0.3px]"
        style={{
          transform: "translateY(-3px) translateZ(5px) rotateX(58deg)",
          transformOrigin: "bottom center",
        }}
      />

      {/* Jemný plastický odlesk na oblúku */}
      <div className="pointer-events-none absolute inset-x-14 top-4 h-10 rounded-[50%] bg-gradient-to-b from-amber-200/10 via-amber-500/5 to-transparent blur-md" />

      {/* Spodná hrana veka – vytvára 3D hrúbku */}
      <div
        className={`pointer-events-none absolute inset-x-2 bottom-0 h-5 origin-top rounded-b-xl border-x border-b border-black/70 bg-gradient-to-b from-[#3b1f11] via-[#241208] to-[#0c0603] shadow-[0_8px_14px_rgba(0,0,0,0.65)] transition-opacity duration-500 ${
          isLidOpen ? "opacity-100" : "opacity-70"
        }`}
        style={{
          transform: "translateY(12px) rotateX(-78deg)",
          transformOrigin: "top",
        }}
      />
    </div>
  );
}