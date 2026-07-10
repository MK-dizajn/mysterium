type ScreenTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

export function ScreenTransition({
  children,
  className = "",
}: ScreenTransitionProps) {
  return (
    <div className={`screen-transition ${className}`}>
      {children}
    </div>
  );
}