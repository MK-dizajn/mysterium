type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  className = "",
}: RevealProps) {
  return (
    <div
      className={className}
      style={{
        opacity: 0,
        animation: `reveal-enter 1.2s ease-out ${delay}ms forwards`,
      }}
    >
      {children}
    </div>
  );
}