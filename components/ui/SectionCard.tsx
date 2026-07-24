import type { ReactNode } from "react";

type SectionCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  variant?: "default" | "gold" | "success" | "danger";
};

export function SectionCard({
  icon,
  title,
  children,
  variant = "default",
}: SectionCardProps) {
  const styles = {
    default:
      "border-slate-700/80 bg-slate-950/70 text-slate-200 shadow-black/20",
    gold:
      "border-amber-400/25 bg-amber-400/10 text-amber-100 shadow-amber-950/20",
    success:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-100 shadow-emerald-950/20",
    danger:
      "border-red-500/30 bg-red-500/10 text-red-100 shadow-red-950/20",
  };

  const iconStyles = {
    default: "text-amber-300",
    gold: "text-amber-300",
    success: "text-emerald-300",
    danger: "text-red-300",
  };

  const titleStyles = {
    default: "text-slate-500",
    gold: "text-amber-300/70",
    success: "text-emerald-300/70",
    danger: "text-red-300/70",
  };

  return (
    <section
      className={`rounded-3xl border ${styles[variant]} p-5 shadow-xl transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/40`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${iconStyles[variant]}`}
        >
          {icon}
        </div>

        <p
          className={`text-sm font-bold uppercase tracking-[0.25em] ${titleStyles[variant]}`}
        >
          {title}
        </p>
      </div>

      <div className="mt-4 px-1 text-left leading-7">
        {children}
      </div>
    </section>
  );
}