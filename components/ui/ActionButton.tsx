import type { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ActionButton({
  children,
  variant = "primary",
  fullWidth = true,
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

  return (
    <button
      type={type}
      className={[
        "rounded-2xl border px-5 py-4 text-sm font-black uppercase tracking-[0.18em]",
        "transition duration-200 active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-40",
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