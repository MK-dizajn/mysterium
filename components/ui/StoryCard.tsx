type StoryCardProps = {
  label: string;
  title: string;
  children: React.ReactNode;
};

export function StoryCard({ label, title, children }: StoryCardProps) {
  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-amber-400/20 bg-slate-900/80 p-6 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
        {label}
      </p>

      <h1 className="mt-4 text-3xl font-black text-white">
        {title}
      </h1>

      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
        {children}
      </div>
    </section>
  );
}