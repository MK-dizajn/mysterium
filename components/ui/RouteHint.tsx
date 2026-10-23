"use client";

import { useId, useState } from "react";

type RouteHintProps = {
  route: string;
  showLabel: string;
  hideLabel: string;
};

/**
 * Tlačidlo „Ukáž cestu“: rozbalí cestu na ďalšie miesto priamo pod sebou.
 * Nestojí body, nepočíta sa ako nápoveda a nič sa neukladá.
 */
export function RouteHint({ route, showLabel, hideLabel }: RouteHintProps) {
  const [isOpen, setIsOpen] = useState(false);
  const routeId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={routeId}
        onClick={() => setIsOpen((current) => !current)}
        className="min-h-11 rounded-xl border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-sm font-bold text-sky-100 transition hover:border-sky-300/60 motion-reduce:transition-none"
      >
        {isOpen ? hideLabel : showLabel}
      </button>

      <div id={routeId} aria-live="polite">
        {isOpen && (
          <p className="mt-3 rounded-2xl border border-sky-300/20 bg-slate-950/70 px-4 py-3 text-[15px] leading-7 text-slate-200">
            {route}
          </p>
        )}
      </div>
    </div>
  );
}
