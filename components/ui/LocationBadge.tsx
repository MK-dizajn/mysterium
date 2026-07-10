type LocationBadgeProps = {
  children: string;
};

export function LocationBadge({ children }: LocationBadgeProps) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.32em] text-amber-300">
      {children}
    </p>
  );
}