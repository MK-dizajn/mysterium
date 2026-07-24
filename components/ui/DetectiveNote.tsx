"use client";

type DetectiveNoteProps = {
  number: number;
  title: string;
  children: React.ReactNode;
  signature?: string;
  symbol?: string;
  className?: string;
};

export function DetectiveNote({
  number,
  title,
  children,
  signature = "Starý pátrač",
  symbol = "✦",
  className = "",
}: DetectiveNoteProps) {
  return (
    <article
      className={[
        "relative mx-auto w-full max-w-xl overflow-hidden",
        "rounded-[28px] border border-amber-900/35",
        "bg-[#d8bc82] px-6 py-8 text-[#352313]",
        "shadow-[0_28px_70px_rgba(0,0,0,0.45)]",
        "sm:px-9 sm:py-10",
        className,
      ].join(" ")}
    >
      {/* Starý papier – jemné svetlo v strede */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,245,200,0.35),transparent_68%)]"
      />

      {/* Tmavšie a opotrebované okraje */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_55px_rgba(72,38,10,0.4)]"
      />

      {/* Jemná papierová štruktúra */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(75,43,15,0.35)_4px)]"
      />

      {/* Rohové škvrny */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-amber-950/15 blur-xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-amber-950/20 blur-2xl"
      />

      <div className="relative z-10">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-amber-950/65">
            Zápis č. {number}
          </p>

          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-amber-950/35" />
            <span className="text-lg text-amber-950/70">{symbol}</span>
            <span className="h-px w-12 bg-amber-950/35" />
          </div>

          <h2 className="mt-4 font-serif text-2xl font-bold tracking-wide text-[#2b1b0d] sm:text-3xl">
            {title}
          </h2>
        </header>

        <div className="mt-7 space-y-4 whitespace-pre-line text-center font-serif text-lg leading-8 text-[#3d2917]">
          {children}
        </div>

        <footer className="mt-9 border-t border-amber-950/25 pt-5">
          <p className="text-right font-serif text-sm italic text-amber-950/65">
            — {signature}
          </p>
        </footer>
      </div>
    </article>
  );
}