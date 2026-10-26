import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  /** „caps“ = veľké písmená (tlačidlá), „sentence“ = bežné písmená (otázky v rozhovore). */
  textCase?: "caps" | "sentence";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ActionButton({
  children,
  variant = "primary",
  fullWidth = true,
  textCase = "caps",
  className = "",
  type = "button",
  ...props
}: ActionButtonProps) {
  const styles = {
    primary:
      "border-amber-300/40 bg-amber-400 text-slate-950 hover:bg-amber-300",
    secondary:
      "border-slate-600 bg-slate-900 text-slate-100 hover:border-amber-300/40 hover:bg-slate-800",
    danger:
      "border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20",
  };

  const textStyles = {
    caps: "text-sm font-black uppercase tracking-[0.1em]",
    sentence: "text-[15px] font-semibold normal-case leading-snug tracking-normal",
  };

  return (
    <button
      type={type}
      className={[
        "rounded-2xl border px-5 py-4",
        textStyles[textCase],
        "transition duration-200 active:scale-[0.99]",
        // Vypnuté: bez priesvitnosti, tmavosivé so svetlým písmom a viditeľným
        // okrajom (aj na slnku), zjavne iné ako zlaté aktívne tlačidlo.
        "disabled:cursor-not-allowed disabled:border-slate-500 disabled:bg-slate-800 disabled:text-slate-300 disabled:hover:bg-slate-800 disabled:active:scale-100",
        fullWidth ? "w-full" : "",
        styles[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
