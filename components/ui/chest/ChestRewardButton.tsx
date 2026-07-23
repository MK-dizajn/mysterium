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
    <div
      className="
        relative
        z-50
        mt-8
        flex
        justify-center
        animate-in
        fade-in
        slide-in-from-bottom-4
        duration-700
      "
    >
      <button
        type="button"
        onClick={onClick}
        className="
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          border-amber-300/40
          bg-gradient-to-b
          from-amber-900/80
          via-amber-950/80
          to-slate-950/90
          px-8
          py-3
          text-xs
          font-black
          uppercase
          tracking-[0.22em]
          text-amber-100
          shadow-[0_0_30px_rgba(251,191,36,0.15)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-amber-200/70
          hover:shadow-[0_0_40px_rgba(251,191,36,0.35)]
          active:translate-y-0
        "
      >
        <span
          className="
            absolute
            inset-0
            -translate-x-full
            bg-gradient-to-r
            from-transparent
            via-white/20
            to-transparent
            transition-transform
            duration-700
            group-hover:translate-x-full
          "
        />

        <span className="relative flex items-center gap-2">
          🔎
          Preskúmať útržky
        </span>
      </button>
    </div>
  );
}