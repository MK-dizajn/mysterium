import type { ReactNode } from "react";

type MessageBoxProps = {
  title: string;
  children: ReactNode;
  variant?: "success" | "danger" | "warning" | "info";
};

export function MessageBox({
  title,
  children,
  variant = "info",
}: MessageBoxProps) {
  const styles = {
    success:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
    danger:
      "border-red-500/30 bg-red-500/10 text-red-100",
    warning:
      "border-amber-400/30 bg-amber-400/10 text-amber-100",
    info:
      "border-slate-700 bg-slate-950/70 text-slate-200",
  };

  const titleStyles = {
    success: "text-emerald-300/70",
    danger: "text-red-300/70",
    warning: "text-amber-300/70",
    info: "text-slate-500",
  };

  return (
    <div className={`rounded-2xl border p-4 text-sm ${styles[variant]}`}>
      <p
        className={`text-xs font-bold uppercase tracking-widest ${titleStyles[variant]}`}
      >
        {title}
      </p>

      <div className="mt-2 leading-relaxed">{children}</div>
    </div>
  );
}