type ChestParticlesProps = {
  isLightVisible: boolean;
};

export function ChestParticles({
  isLightVisible,
}: ChestParticlesProps) {
  return (
    <>
      {/* Pomalé častice nad otvorenou truhlicou */}
      <div
        className={`pointer-events-none absolute inset-x-10 top-14 z-30 h-64 overflow-visible transition-opacity duration-1000 ${
          isLightVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {[
          {
            left: "12%",
            delay: "0ms",
            duration: "3600ms",
            size: 2,
            drift: "-18px",
          },
          {
            left: "26%",
            delay: "900ms",
            duration: "4200ms",
            size: 3,
            drift: "14px",
          },
          {
            left: "41%",
            delay: "1700ms",
            duration: "3900ms",
            size: 2,
            drift: "-10px",
          },
          {
            left: "57%",
            delay: "500ms",
            duration: "4500ms",
            size: 3,
            drift: "20px",
          },
          {
            left: "73%",
            delay: "2200ms",
            duration: "4100ms",
            size: 2,
            drift: "-16px",
          },
          {
            left: "88%",
            delay: "1300ms",
            duration: "3700ms",
            size: 2,
            drift: "12px",
          },
        ].map((particle, index) => (
          <span
            key={`chest-ambient-particle-${index}`}
            className="absolute bottom-0 rounded-full bg-amber-100 shadow-[0_0_8px_rgba(253,230,138,0.75)]"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0,
              animation: isLightVisible
                ? `chest-ambient-particle ${particle.duration} ease-in-out ${particle.delay} infinite`
                : "none",
              ["--ambient-drift" as string]: particle.drift,
            }}
          />
        ))}
      </div>

      {/* Zlaté prachové častice */}
      <div
        className={`pointer-events-none absolute inset-x-8 top-20 z-30 h-52 overflow-visible transition-opacity duration-500 ${
          isLightVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {[
          {
            left: "8%",
            delay: "0ms",
            duration: "1500ms",
            size: 4,
            drift: "-28px",
          },
          {
            left: "17%",
            delay: "160ms",
            duration: "1800ms",
            size: 3,
            drift: "18px",
          },
          {
            left: "28%",
            delay: "80ms",
            duration: "1650ms",
            size: 5,
            drift: "-12px",
          },
          {
            left: "39%",
            delay: "280ms",
            duration: "1900ms",
            size: 3,
            drift: "30px",
          },
          {
            left: "50%",
            delay: "120ms",
            duration: "1700ms",
            size: 4,
            drift: "-20px",
          },
          {
            left: "61%",
            delay: "340ms",
            duration: "1850ms",
            size: 5,
            drift: "22px",
          },
          {
            left: "72%",
            delay: "220ms",
            duration: "1600ms",
            size: 3,
            drift: "-24px",
          },
          {
            left: "82%",
            delay: "420ms",
            duration: "1950ms",
            size: 4,
            drift: "16px",
          },
          {
            left: "90%",
            delay: "260ms",
            duration: "1750ms",
            size: 3,
            drift: "-14px",
          },
        ].map((particle, index) => (
          <span
            key={`chest-dust-${index}`}
            className="absolute bottom-0 rounded-full bg-amber-100 shadow-[0_0_10px_rgba(253,230,138,0.85)]"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0,
              animation: isLightVisible
                ? `chest-dust-rise ${particle.duration} ease-out ${particle.delay} forwards`
                : "none",
              ["--dust-x" as string]: particle.drift,
            }}
          />
        ))}
      </div>
    </>
  );
}