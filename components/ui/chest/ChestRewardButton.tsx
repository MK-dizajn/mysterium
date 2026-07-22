type ChestRewardButtonProps = {
  isVisible: boolean;
  onClick?: () => void;
};

export function ChestRewardButton({
  isVisible,
  onClick,
}: ChestRewardButtonProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative z-50 mx-auto mt-6 block rounded-2xl border border-amber-300/30 bg-amber-950/60 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-amber-100 transition hover:border-amber-200/60 hover:bg-amber-900/60"
    >
      Preskúmať útržky
    </button>
  );
}