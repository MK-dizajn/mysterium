"use client";

import { useEffect, useState } from "react";
import { Chest3D } from "../ui/chest-3d/Chest3D";

type ChestIntroScreenProps = {
  title: string;
  onExplore: () => void;
};

const particles = [
  { left: "8%", top: "82%", delay: "0ms", duration: "4200ms", size: 2 },
  { left: "17%", top: "68%", delay: "500ms", duration: "4800ms", size: 3 },
  { left: "28%", top: "88%", delay: "900ms", duration: "3900ms", size: 2 },
  { left: "39%", top: "74%", delay: "250ms", duration: "5100ms", size: 2 },
  { left: "52%", top: "86%", delay: "720ms", duration: "4400ms", size: 3 },
  { left: "64%", top: "70%", delay: "140ms", duration: "4900ms", size: 2 },
  { left: "76%", top: "89%", delay: "650ms", duration: "4100ms", size: 2 },
  { left: "89%", top: "76%", delay: "350ms", duration: "5000ms", size: 3 },
];

export function ChestIntroScreen({
  title,
  onExplore,
}: ChestIntroScreenProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isTextVisible, setIsTextVisible] = useState(false);
  const [isChestVisible, setIsChestVisible] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setIsStarted(true), 150);
    const textTimer = window.setTimeout(() => setIsTextVisible(true), 700);
    const chestTimer = window.setTimeout(() => setIsChestVisible(true), 1700);
    const buttonTimer = window.setTimeout(() => setIsButtonVisible(true), 3600);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(textTimer);
      window.clearTimeout(chestTimer);
      window.clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#010207] px-4 py-10 text-white"
      aria-label="Odhalenie truhlice"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_62%,rgba(120,53,15,0.11),transparent_42%),linear-gradient(to_bottom,#010207,#030205_65%,#000)]" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_130px_55px_rgba(0,0,0,0.94)]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((particle, index) => (
          <span
            key={`chest-intro-particle-${index}`}
            className={`absolute rounded-full bg-amber-100 shadow-[0_0_10px_rgba(253,230,138,0.75)] transition-all ease-out ${
              isStarted
                ? "-translate-y-40 opacity-55"
                : "translate-y-10 opacity-0"
            }`}
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              transitionDelay: particle.delay,
              transitionDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-lg flex-col justify-center">
        <header
          className={`px-4 text-center transition-all duration-[1400ms] ease-out ${
            isTextVisible
              ? "translate-y-0 opacity-100 blur-0"
              : "translate-y-6 opacity-0 blur-md"
          }`}
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.42em] text-amber-300/70">
            Zámok aktu
          </p>

          <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

          <h1 className="mt-5 font-serif text-2xl leading-tight text-amber-50 drop-shadow-[0_0_24px_rgba(251,191,36,0.3)] sm:text-3xl">
            Všetky stopy smerovali k jedinému tajomstvu.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-300">
            Mechanizmus celé desaťročia čakal na niekoho, kto dokáže
            spojiť všetky získané dôkazy.
          </p>

          <p className="mt-4 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-amber-300/55">
            {title}
          </p>
        </header>

        <div
          className={`relative mx-auto mt-2 w-full transition-opacity duration-[1400ms] ease-out ${
            isChestVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="pointer-events-none select-none">
            <Chest3D
              isFocused={false}
              isUnlocked={false}
              presentation="cinematic"
            />
          </div>
        </div>

        <div
          className={`mx-auto mt-6 w-full max-w-sm px-3 transition-all duration-1000 ${
            isButtonVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={onExplore}
            disabled={!isButtonVisible}
            className="group relative w-full overflow-hidden rounded-2xl border border-amber-300/45 bg-amber-400 px-6 py-4 font-black uppercase tracking-[0.16em] text-slate-950 shadow-[0_16px_45px_rgba(245,158,11,0.22)] transition hover:bg-amber-300 active:translate-y-0.5 disabled:cursor-default"
          >
            <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
            <span className="relative">Preskúmať truhlicu</span>
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-slate-400">
            Po otvorení pohľadu môžeš truhlicu otáčať a preskúmať jej
            mechanizmus.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-black sm:h-12" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-black sm:h-12" />
    </main>
  );
}
