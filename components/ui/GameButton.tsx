type GameButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function GameButton({ children, onClick }: GameButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl bg-amber-400 px-6 py-4 text-sm font-black uppercase tracking-widest text-black shadow-[0_0_40px_rgba(251,191,36,0.25)] transition hover:bg-amber-300"
    >
      {children}
    </button>
  );
}