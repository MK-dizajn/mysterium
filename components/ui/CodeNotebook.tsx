import type { CodeNotebookLock } from "../../engine";
import { SectionCard } from "./SectionCard";

type CodeNotebookProps = {
  locks: CodeNotebookLock[];
};

export function CodeNotebook({ locks }: CodeNotebookProps) {
  return (
    <SectionCard
      icon={
        <span className="text-3xl" aria-hidden="true">
          🔐
        </span>
      }
      title="Zápisník kódov"
      variant="gold"
    >
      <p className="text-sm leading-6 text-slate-300">
        Číslice z nájdených predmetov sa sem zapíšu samy. Podľa zápisníka
        nastavíš kolieska truhlice.
      </p>

      <div className="mt-4 space-y-3">
        {locks.map((lock) => (
          <div
            key={lock.actId}
            role="group"
            aria-label={`Zámok ${lock.lockLabel}`}
            className="flex items-center gap-2"
          >
            <p
              className="w-16 shrink-0 text-xs font-bold uppercase tracking-[0.15em] text-amber-300/80"
              aria-hidden="true"
            >
              Zámok {lock.lockLabel}
            </p>

            <div className="flex gap-2">
              {lock.slots.map((slot, slotIndex) => (
                <span
                  key={slot.itemId}
                  className={`flex h-12 w-10 items-center justify-center rounded-xl border font-mono text-2xl font-black ${
                    slot.digit === null
                      ? "border-dashed border-slate-600 bg-slate-950/60 text-slate-600"
                      : "border-amber-300/40 bg-amber-400/10 text-amber-100"
                  }`}
                >
                  <span aria-hidden="true">
                    {slot.digit ?? "·"}
                  </span>

                  <span className="sr-only">
                    {`Číslica ${slotIndex + 1}: ${
                      slot.digit ?? "zatiaľ nenájdená"
                    }`}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
