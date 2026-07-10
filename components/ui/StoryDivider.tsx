export function StoryDivider() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 py-1"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/40" />

      <span className="h-1.5 w-1.5 rotate-45 border border-amber-300/60 bg-amber-300/10" />

      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/40" />
    </div>
  );
}