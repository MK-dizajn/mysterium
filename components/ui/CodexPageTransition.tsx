type CodexPageTransitionProps = {
  children: React.ReactNode;
};

export function CodexPageTransition({
  children,
}: CodexPageTransitionProps) {
  return (
    <div className="codex-page-perspective">
      <div className="codex-page-transition">
        {children}
      </div>
    </div>
  );
}