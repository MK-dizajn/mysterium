import type { InputHTMLAttributes } from "react";

type TextInputProps = {
  label?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextInput({
  label,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <label className="block w-full">
      {label && (
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
          {label}
        </span>
      )}

      <input
        className={[
          "w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4",
          "text-center text-white outline-none transition duration-200",
          "placeholder:text-slate-600",
          "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}