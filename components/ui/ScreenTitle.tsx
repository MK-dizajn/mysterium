type ScreenTitleProps = {
  children: string;
};

export function ScreenTitle({ children }: ScreenTitleProps) {
  return (
    <h1 className="mt-4 text-3xl font-black tracking-tight text-white">
      {children}
    </h1>
  );
}