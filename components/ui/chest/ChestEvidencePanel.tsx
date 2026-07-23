"use client";

import { useEffect, useRef } from "react";

export type ChestEvidence = {
  id: string;
  title: string;
  description: string;
  secretCode?: string;
  order?: number;
};

type ChestEvidencePanelProps = {
  evidence: ChestEvidence[];
  isOpen: boolean;
  onClose: () => void;
};

export function ChestEvidencePanel({
  evidence,
  isOpen,
  onClose,
}: ChestEvidencePanelProps) {
  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sortedEvidence = [...evidence].sort(
    (firstEvidence, secondEvidence) =>
      (firstEvidence.order ?? 0) -
      (secondEvidence.order ?? 0)
  );

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/85
        px-4
        py-5
        backdrop-blur-md
        animate-in
        fade-in
        duration-300
        sm:items-center
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="chest-evidence-title"
      aria-describedby="chest-evidence-description"
      onClick={onClose}
    >
      <section
        className="
          relative
          max-h-[88vh]
          w-full
          max-w-md
          overflow-hidden
          rounded-[2rem]
          border
          border-amber-300/25
          bg-slate-950
          shadow-[0_30px_100px_rgba(0,0,0,0.85)]
          animate-in
          slide-in-from-bottom-8
          zoom-in-95
          duration-500
          sm:max-h-[85vh]
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* Atmosférické pozadie */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/55 via-slate-950 to-black" />

          <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-amber-900/10 blur-3xl" />

          <div
            className="
              absolute
              inset-0
              opacity-[0.035]
              [background-image:repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.35)_4px)]
            "
          />
        </div>

        <div className="relative">
          <header className="border-b border-amber-300/15 px-5 pb-5 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.32em] text-amber-400/70">
                  Denník vyšetrovania
                </p>

                <h2
                  id="chest-evidence-title"
                  className="mt-2 font-serif text-2xl font-black text-amber-100"
                >
                  Dôkazy prípadu
                </h2>

                <p
                  id="chest-evidence-description"
                  className="mt-2 text-sm leading-6 text-slate-400"
                >
                  Preskúmaj nájdené stopy a zachovaj
                  poradie, v akom si ich získal.
                </p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-amber-300/20
                  bg-black/35
                  text-xl
                  text-amber-100
                  transition
                  duration-200
                  hover:rotate-90
                  hover:border-amber-300/50
                  hover:bg-amber-950/60
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-amber-300/70
                "
                aria-label="Zavrieť dôkazy"
              >
                ×
              </button>
            </div>

            {sortedEvidence.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent" />

                <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-amber-500/60">
                  Nájdené stopy: {sortedEvidence.length}
                </p>
              </div>
            )}
          </header>

          <div className="max-h-[60vh] space-y-5 overflow-y-auto px-5 py-5">
            {sortedEvidence.length > 0 ? (
              sortedEvidence.map(
                (evidenceItem, index) => (
                  <article
                    key={evidenceItem.id}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      border
                      border-amber-300/15
                      bg-gradient-to-br
                      from-amber-950/25
                      via-black/35
                      to-black/55
                      p-4
                      shadow-[0_14px_35px_rgba(0,0,0,0.3)]
                      transition
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-amber-300/30
                    "
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Papierový okraj dôkazu */}
                    <div className="pointer-events-none absolute inset-1 rounded-[0.8rem] border border-dashed border-amber-200/10" />

                    <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-300/70 via-amber-600/35 to-transparent" />

                    <div className="pointer-events-none absolute right-3 top-3 h-10 w-10 rounded-full border border-amber-300/10 bg-amber-300/5 blur-sm" />

                    <div className="relative pl-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-amber-500/70">
                          Dôkaz {index + 1}
                        </p>

                        <span className="font-mono text-[0.58rem] tracking-[0.18em] text-slate-600">
                          #{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="mt-2 font-serif text-lg font-bold text-amber-100">
                        {evidenceItem.title}
                      </h3>

                      <div className="mt-3 h-px bg-gradient-to-r from-amber-300/20 via-amber-300/5 to-transparent" />

                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {evidenceItem.description}
                      </p>

                      {evidenceItem.secretCode && (
                        <div
                          className="
                            relative
                            mt-4
                            overflow-hidden
                            rounded-xl
                            border
                            border-amber-300/25
                            bg-gradient-to-b
                            from-amber-900/30
                            to-black/45
                            px-4
                            py-3
                            text-center
                            shadow-inner
                          "
                        >
                          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

                          <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-amber-500/70">
                            Objavená dvojica
                          </p>

                          <p className="mt-2 font-mono text-3xl font-black tracking-[0.2em] text-amber-100 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                            {evidenceItem.secretCode}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                )
              )
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700/60 bg-black/20 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/70 text-xl">
                  ?
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-400">
                  V tejto etape zatiaľ nemáš žiadne
                  dostupné dôkazy.
                </p>
              </div>
            )}
          </div>

          <footer className="border-t border-amber-300/15 bg-black/30 p-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={onClose}
              className="
                group
                relative
                w-full
                overflow-hidden
                rounded-2xl
                border
                border-amber-300/30
                bg-gradient-to-b
                from-amber-700/40
                via-amber-900/40
                to-amber-950/80
                px-5
                py-3
                text-sm
                font-black
                uppercase
                tracking-[0.16em]
                text-amber-100
                shadow-lg
                transition
                duration-300
                hover:border-amber-200/55
                hover:brightness-110
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-amber-300/70
                active:translate-y-0.5
              "
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative">
                Vrátiť sa k truhlici
              </span>
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}