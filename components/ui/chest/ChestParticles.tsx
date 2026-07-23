type ChestParticlesProps = {
  isLightVisible: boolean;
};

const ambientParticles = [
  { left: "10%", delay: "0ms", duration: "5600ms", size: 2, drift: "-18px", opacity: 0.55 },
  { left: "20%", delay: "1400ms", duration: "7200ms", size: 3, drift: "16px", opacity: 0.75 },
  { left: "31%", delay: "700ms", duration: "6100ms", size: 2, drift: "-12px", opacity: 0.6 },
  { left: "43%", delay: "2500ms", duration: "6800ms", size: 4, drift: "24px", opacity: 0.85 },
  { left: "50%", delay: "900ms", duration: "5900ms", size: 2, drift: "-8px", opacity: 0.7 },
  { left: "58%", delay: "1800ms", duration: "7600ms", size: 3, drift: "18px", opacity: 0.8 },
  { left: "69%", delay: "1200ms", duration: "6400ms", size: 2, drift: "-20px", opacity: 0.6 },
  { left: "79%", delay: "3000ms", duration: "7100ms", size: 3, drift: "15px", opacity: 0.75 },
  { left: "90%", delay: "2100ms", duration: "6200ms", size: 2, drift: "-14px", opacity: 0.55 },
];

const dustParticles = [
  { left: "18%", delay: "0ms", duration: "1700ms", size: 3, drift: "-18px" },
  { left: "28%", delay: "120ms", duration: "1900ms", size: 4, drift: "20px" },
  { left: "37%", delay: "260ms", duration: "1800ms", size: 5, drift: "-14px" },
  { left: "46%", delay: "180ms", duration: "2100ms", size: 3, drift: "24px" },
  { left: "54%", delay: "320ms", duration: "1750ms", size: 4, drift: "-20px" },
  { left: "63%", delay: "140ms", duration: "1950ms", size: 5, drift: "16px" },
  { left: "73%", delay: "400ms", duration: "1850ms", size: 3, drift: "-22px" },
  { left: "82%", delay: "260ms", duration: "2050ms", size: 4, drift: "18px" },
];

export function ChestParticles({
  isLightVisible,
}: ChestParticlesProps) {
  return (
    <>
      {/* Atmosférické častice */}
      <div
        className={`pointer-events-none absolute inset-x-8 top-12 z-30 h-72 overflow-visible transition-opacity duration-[1400ms] ${
          isLightVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {ambientParticles.map((particle, index) => (
          <span
            key={`ambient-${index}`}
            className="absolute bottom-0 rounded-full bg-amber-100"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              filter: "blur(0.4px)",
              boxShadow:
                "0 0 10px rgba(253,230,138,.75),0 0 18px rgba(253,230,138,.35)",
              animation: isLightVisible
                ? `chest-ambient-particle ${particle.duration} ease-in-out ${particle.delay} infinite`
                : "none",
              ["--ambient-drift" as string]: particle.drift,
            }}
          />
        ))}
      </div>

      {/* Zlatý prach po otvorení */}
      <div
        className={`pointer-events-none absolute inset-x-10 top-20 z-30 h-56 overflow-visible transition-opacity duration-700 ${
          isLightVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {dustParticles.map((particle, index) => (
          <span
            key={`dust-${index}`}
            className="absolute bottom-0 rounded-full bg-amber-100"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0,
              filter: "blur(.3px)",
              boxShadow:
                "0 0 12px rgba(253,230,138,.9),0 0 24px rgba(253,230,138,.4)",
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