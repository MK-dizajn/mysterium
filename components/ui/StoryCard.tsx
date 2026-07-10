import { LocationBadge } from "./LocationBadge";
import { ScreenTitle } from "./ScreenTitle";
import { StoryDivider } from "./StoryDivider";

type StoryCardProps = {
  label: string;
  title: string;
  children: React.ReactNode;
};

export function StoryCard({
  label,
  title,
  children,
}: StoryCardProps) {
  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-amber-400/20 bg-slate-900/80 p-6 shadow-2xl">
      <LocationBadge>{label}</LocationBadge>

      <ScreenTitle>{title}</ScreenTitle>

      <div className="mt-5">
        <StoryDivider />
      </div>

      <div className="mt-6 space-y-6">
        {children}
      </div>
    </section>
  );
}