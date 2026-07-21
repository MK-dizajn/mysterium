"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
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
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 px-4 py-5 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chest-evidence-title"
      onClick={onClose}
    >
      <section
        className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-[2rem] border border-amber-300/25 bg-slate-950 shadow-2xl shadow-black"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/50 via-slate-950 to-slate-950" />

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
                  Dôkazy aktu
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Prezri si nájdené stopy a nastav
                  číselníky v poradí, v akom si ich
                  získal.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-300/20 bg-black/30 text-xl text-amber-100 transition hover:border-amber-300/40 hover:bg-amber-950/50"
                aria-label="Zavrieť dôkazy"
              >
                ×
              </button>
            </div>
          </header>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-5">
            {sortedEvidence.length > 0 ? (
              sortedEvidence.map(
                (evidenceItem, index) => (
                  <article
                    key={evidenceItem.id}
                    className="relative overflow-hidden rounded-2xl border border-amber-300/15 bg-black/30 p-4 shadow-inner"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-300/60 to-amber-900/20" />

                    <div className="pl-2">
                      <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-amber-500/70">
                        Dôkaz {index + 1}
                      </p>

                      <h3 className="mt-2 text-base font-bold text-amber-100">
                        {evidenceItem.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {evidenceItem.description}
                      </p>

                      {evidenceItem.secretCode && (
                        <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-950/30 px-4 py-3 text-center">
                          <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-amber-500/70">
                            Objavená dvojica
                          </p>

                          <p className="mt-1 font-mono text-3xl font-black tracking-[0.18em] text-amber-100">
                            {evidenceItem.secretCode}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                )
              )
            ) : (
              <div className="rounded-2xl border border-slate-700/50 bg-black/20 p-5 text-center">
                <p className="text-sm leading-6 text-slate-400">
                  V tejto etape zatiaľ nemáš žiadne
                  dostupné dôkazy.
                </p>
              </div>
            )}
          </div>

          <footer className="border-t border-amber-300/15 bg-black/20 p-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-amber-300/30 bg-gradient-to-b from-amber-700/40 to-amber-950/80 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-amber-100 shadow-lg transition hover:brightness-110 active:translate-y-0.5"
            >
              Vrátiť sa k truhlici
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}