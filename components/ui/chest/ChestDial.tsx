"use client";

type ChestDialProps = {
  value: number;
  /** Popis pre čítačku, napríklad „Zámok I, číslica 1“. */
  label: string;
  disabled?: boolean;
  onChange: (value: number) => void;
};

function normalizeDigit(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return ((Math.round(value) % 10) + 10) % 10;
}

const STEP_BUTTON =
  "relative z-30 flex h-11 w-full touch-manipulation items-center justify-center border-amber-200/30 from-amber-500/55 via-amber-800/70 to-amber-950 text-amber-50 shadow-md transition-[filter,opacity] duration-100 hover:brightness-125 active:brightness-150 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none";

/**
 * Číselník 0 až 9: šípky hore a dole a ťuknutie na číslicu (zvýši ju o 1).
 * Každá dotyková plocha má aspoň 44 × 44 px.
 */
export function ChestDial({
  value,
  label,
  disabled = false,
  onChange,
}: ChestDialProps) {
  const digit = normalizeDigit(value);

  function change(step: 1 | -1) {
    if (!disabled) {
      onChange(normalizeDigit(digit + step));
    }
  }

  return (
    <div className="relative z-20 flex w-11 shrink-0 select-none flex-col items-stretch">
      <button
        type="button"
        disabled={disabled}
        onClick={() => change(1)}
        className={`${STEP_BUTTON} rounded-t-md border border-b-0 bg-gradient-to-b`}
        aria-label={`Zvýšiť: ${label}`}
      >
        <span aria-hidden="true" className="pointer-events-none text-xs leading-none">
          ▲
        </span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => change(1)}
        aria-label={`${label}: ${digit}`}
        className="relative z-20 flex h-12 w-full touch-manipulation items-center justify-center overflow-hidden border-x border-amber-200/30 bg-[#080706] font-mono text-2xl font-black text-amber-50 shadow-[inset_0_7px_12px_rgba(0,0,0,0.9),inset_0_-7px_12px_rgba(0,0,0,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {digit}
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => change(-1)}
        className={`${STEP_BUTTON} rounded-b-md border border-t-0 bg-gradient-to-t`}
        aria-label={`Znížiť: ${label}`}
      >
        <span aria-hidden="true" className="pointer-events-none text-xs leading-none">
          ▼
        </span>
      </button>
    </div>
  );
}
