"use client";

import { useEffect, useState } from "react";
import { ChestDial } from "./ChestDial";
import { soundManager } from "../../../lib/soundManager";

type ChestProps = {
  codes: string[];
  isUnlocked?: boolean;
  onCodeChange: (index: number, value: string) => void;
  onRewardClick?: () => void;
};

const pairLabels = ["I", "II", "III"];

const fragmentClasses = [
  "left-[10%] top-20 -rotate-6",
  "left-[34%] top-12 rotate-3",
  "right-[34%] top-24 -rotate-2",
  "right-[9%] top-16 rotate-6",
];

function normalizeCode(value: string) {
  return value
    .replace(/\D/g, "")
    .padStart(2, "0")
    .slice(-2);
}

export function Chest({
  codes,
  isUnlocked = false,
  onCodeChange,
  onRewardClick,
}: ChestProps) {

  const [isLockReleased, setIsLockReleased] =
    useState(false);
  const [isLidOpen, setIsLidOpen] =
    useState(false);
  const [isLightVisible, setIsLightVisible] =
    useState(false);
  const [areFragmentsVisible, setAreFragmentsVisible] =
    useState(false);

  useEffect(() => { 
    if (!isUnlocked) {
     setIsLockReleased(false);
      setIsLidOpen(false);
     setIsLightVisible(false);
     setAreFragmentsVisible(false);

     return;
    }

   const lockTimer = window.setTimeout(() => {
     setIsLockReleased(true);

     // Jemné cvaknutie pri odomknutí
     soundManager.play("chest-unlock");
    }, 250);

   const lidTimer = window.setTimeout(() => {
     setIsLidOpen(true);

      // Hlavný zvuk otvorenia truhlice
      soundManager.play("artifact-unlock");
   }, 700);

    const lightTimer = window.setTimeout(() => {
     setIsLightVisible(true);
    }, 1050);

    const fragmentsTimer = window.setTimeout(() => {
     setAreFragmentsVisible(true);
   }, 1450);

   return () => {
      window.clearTimeout(lockTimer);
      window.clearTimeout(lidTimer);
     window.clearTimeout(lightTimer);
      window.clearTimeout(fragmentsTimer);
    };
  }, [isUnlocked]);

  function updateDigit(
    codeIndex: number,
    digitIndex: number,
    digit: number
  ) {
    const normalizedCode = normalizeCode(
      codes[codeIndex] ?? "00"
    );

    const digits = normalizedCode.split("");
    digits[digitIndex] = String(digit);

    onCodeChange(codeIndex, digits.join(""));
  }

  return (
      <div
        className="relative mx-auto w-full max-w-md"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          animation: isUnlocked
            ? "chest-cinematic-camera 3200ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
            : "none",
        }}
      >

      <div
        className="relative"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Veko truhlice */}
        <div
          className={`pointer-events-none relative z-30 mx-4 origin-bottom transition-opacity duration-700 ${
            isLidOpen ? "opacity-95" : "opacity-100"
          }`}
          style={{
            transform: "translateY(0) rotateX(0deg)",
            transformStyle: "preserve-3d",
            animation: isLidOpen
              ? "chest-lid-cinematic-open 1400ms cubic-bezier(0.22, 1, 0.36, 1) forwards"
              : "none",
            }}
        >
          <div className="relative h-36 overflow-hidden rounded-t-[4rem] border border-amber-500/35 shadow-[0_24px_40px_rgba(0,0,0,0.7)] sm:h-40">
            {/* Drevo */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#241208_0px,#241208_5px,#3d2110_6px,#2b160a_11px)]" />

            <div className="absolute inset-0 bg-gradient-to-b from-amber-800/25 via-transparent to-black/55" />

            {/* Kovové pásy */}
            <div className="absolute inset-y-0 left-6 w-6 border-x border-amber-200/20 bg-gradient-to-r from-amber-950 via-amber-600/45 to-amber-950 shadow-lg" />

            <div className="absolute inset-y-0 left-1/2 w-6 -translate-x-1/2 border-x border-amber-200/20 bg-gradient-to-r from-amber-950 via-amber-600/45 to-amber-950 shadow-lg" />

            <div className="absolute inset-y-0 right-6 w-6 border-x border-amber-200/20 bg-gradient-to-r from-amber-950 via-amber-600/45 to-amber-950 shadow-lg" />

            {/* Nity */}
            {[
              "left-[1.85rem]",
              "left-1/2",
              "right-[1.85rem]",
            ].map((position) => (
              <div
                key={position}
                className={`absolute top-5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-amber-100/25 bg-amber-700 shadow-[0_1px_4px_rgba(0,0,0,0.8)] ${position}`}
              />
            ))}

            {/* Spodná kovová hrana */}
            <div className="absolute inset-x-0 bottom-0 h-7 border-y border-amber-300/20 bg-gradient-to-b from-amber-950 via-amber-700/45 to-amber-950" />

            {/* Znak M */}
            <div className="absolute bottom-2 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-4 border-amber-700 bg-gradient-to-br from-[#3d210f] via-[#1d0e07] to-black shadow-[0_0_0_2px_rgba(251,191,36,0.2),0_12px_24px_rgba(0,0,0,0.8)] sm:h-20 sm:w-20">
              <div className="absolute inset-1 rounded-full border border-amber-200/30" />

              <span className="relative font-serif text-3xl font-black text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] sm:text-4xl">
                M
              </span>
            </div>
          </div>
          {/* Vnútorná strana otvoreného veka */}
          <div
            className={`pointer-events-none absolute inset-3 rounded-t-[2.75rem] rounded-b-xl border border-amber-950/80 bg-gradient-to-b from-[#25140c] via-[#160c08] to-[#090504] shadow-[inset_0_14px_28px_rgba(0,0,0,0.85),inset_0_-4px_10px_rgba(180,110,45,0.12)] transition-opacity duration-700 ${
              isLidOpen ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: "translateZ(-10px) rotateX(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="absolute inset-x-7 top-7 h-px bg-amber-300/10" />
            <div className="absolute inset-x-10 bottom-6 h-px bg-black/70" />
          </div>

          {/* Spodná hrana veka – vytvára 3D hrúbku */}
          <div
            className={`pointer-events-none absolute inset-x-2 bottom-0 h-5 origin-top rounded-b-xl border-x border-b border-black/70 bg-gradient-to-b from-[#3b1f11] via-[#241208] to-[#0c0603] shadow-[0_8px_14px_rgba(0,0,0,0.65)] transition-opacity duration-500 ${
              isLidOpen ? "opacity-100" : "opacity-70"
            }`}
            style={{
              transform: "translateY(12px) rotateX(-78deg)",
              transformOrigin: "top",
            }}
          />
        </div>

        {/* Svetlo zvnútra */}
        <div className="pointer-events-none absolute inset-x-0 top-16 z-20 h-72 overflow-visible">
          {/* Široká žiara */}
          <div
            className={`absolute left-1/2 top-10 h-64 w-[92%] -translate-x-1/2 rounded-full bg-amber-200/35 blur-3xl transition-all delay-200 duration-[1400ms] ease-out ${
              isLightVisible
                ? "scale-125 opacity-100"
                : "scale-50 opacity-0"
          }`}
        />

          {/* Jasné jadro svetla */}
          <div
            className={`absolute left-1/2 top-20 h-32 w-[62%] rounded-full bg-amber-100/70 blur-2xl transition-opacity delay-300 duration-1000 ease-out ${
              isLightVisible
                ? "opacity-100"
                : "opacity-0"
            }`}
            style={{
              transform: "translateX(-50%)",
              animation: isLightVisible
              ? "chest-light-pulse 2200ms ease-in-out 1200ms infinite"
              : "none",
            }}
          />

          {/* Svetelný lúč smerom nahor */}
          <div
            className={`absolute left-1/2 top-0 h-56 w-40 -translate-x-1/2 origin-bottom bg-gradient-to-t from-amber-100/50 via-amber-200/20 to-transparent blur-2xl transition-all delay-300 duration-[1300ms] ease-out ${
              isLightVisible
                ? "-translate-y-24 scale-x-125 scale-y-125 opacity-90"
                : "translate-y-10 scale-x-50 scale-y-50 opacity-0"
            }`}
          />
        </div>

        {/* Svetelné lúče */}
        <div
          className={`pointer-events-none absolute left-1/2 top-24 z-10 h-72 w-[75%] -translate-x-1/2 bg-[conic-gradient(from_180deg_at_50%_100%,transparent_0deg,rgba(253,230,138,0.18)_15deg,transparent_35deg,rgba(253,230,138,0.12)_55deg,transparent_75deg)] blur-xl transition-all delay-500 duration-1000 ${
            isLightVisible
              ? "scale-110 opacity-100"
              : "scale-75 opacity-0"
          }`}
        />

        {/* Krátky svetelný záblesk pri otvorení */}
        <div
          className="pointer-events-none absolute left-1/2 top-[42%] z-20 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl"
          style={{
            opacity: 0,
            animation: isLightVisible
              ? "chest-light-burst 1300ms ease-out forwards"
              : "none",
          }}
        />

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
                  { left: "8%", delay: "0ms", duration: "1500ms", size: 4, drift: "-28px" },
                  { left: "17%", delay: "160ms", duration: "1800ms", size: 3, drift: "18px" },
                  { left: "28%", delay: "80ms", duration: "1650ms", size: 5, drift: "-12px" },
                  { left: "39%", delay: "280ms", duration: "1900ms", size: 3, drift: "30px" },
                  { left: "50%", delay: "120ms", duration: "1700ms", size: 4, drift: "-20px" },
                  { left: "61%", delay: "340ms", duration: "1850ms", size: 5, drift: "22px" },
                  { left: "72%", delay: "220ms", duration: "1600ms", size: 3, drift: "-24px" },
                  { left: "82%", delay: "420ms", duration: "1950ms", size: 4, drift: "16px" },
                  { left: "90%", delay: "260ms", duration: "1750ms", size: 3, drift: "-14px" },
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

        {/* Štyri útržky fotografie */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-8 z-40 h-64 transition ${
            areFragmentsVisible
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          {fragmentClasses.map((position, index) => (
            <button
              key={`photo-fragment-${index}`}
              type="button"
              onClick={onRewardClick}
              className={`absolute w-20 rounded-sm border border-amber-100/50 bg-[#d8c39d] p-1.5 shadow-2xl shadow-black/70 hover:z-50 hover:scale-110 sm:w-28 ${position} ${
                areFragmentsVisible
                  ? "pointer-events-auto"
                  : "pointer-events-none opacity-0"
              }`}
              style={{
                animation: areFragmentsVisible
                  ? `chest-fragment-reveal 1100ms cubic-bezier(0.22, 1, 0.36, 1) ${
                      180 + index * 170
                    }ms forwards`
                  : "none",
                ["--fragment-start-x" as string]:
                  index === 0
                    ? "-42px"
                    : index === 1
                      ? "-16px"
                      : index === 2
                        ? "18px"
                        : "44px",
                ["--fragment-start-rotate" as string]:
                  index === 0
                    ? "-22deg"
                    : index === 1
                      ? "-8deg"
                      : index === 2
                        ? "10deg"
                        : "24deg",
                ["--fragment-overshoot-rotate" as string]:
                  index === 0
                    ? "-7deg"
                    : index === 1
                      ? "3deg"
                      : index === 2
                        ? "-2deg"
                        : "8deg",
                ["--fragment-end-rotate" as string]:
                  index === 0
                    ? "-5deg"
                    : index === 1
                      ? "2deg"
                      : index === 2
                        ? "-1deg"
                        : "5deg",
              }}
              aria-label={`Preskúmať útržok fotografie ${
                index + 1
              }`}
            >
              <div className="relative aspect-square overflow-hidden border border-stone-700/40 bg-stone-800">
                <div
                  className={`absolute inset-0 ${
                    index === 0
                      ? "bg-gradient-to-br from-stone-300 via-stone-600 to-black"
                      : index === 1
                        ? "bg-gradient-to-bl from-stone-400 via-stone-700 to-black"
                        : index === 2
                          ? "bg-gradient-to-tr from-stone-300 via-stone-600 to-black"
                          : "bg-gradient-to-tl from-stone-400 via-stone-700 to-black"
                  }`}
                />

                <div className="absolute bottom-2 left-2 h-12 w-4 bg-black/45" />
                <div className="absolute bottom-2 left-7 h-8 w-9 bg-black/35" />

                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.18)_50%,transparent_70%)]" />
              </div>
            </button>
          ))}
        </div>

        {/* Spodná časť truhlice */}
        {/* Vnútorná dutina truhlice */}
        <div
          className={`pointer-events-none absolute inset-x-8 top-28 z-10 h-28 overflow-hidden rounded-b-3xl transition-all duration-700 ${
            isLidOpen
            ? "opacity-100"
            : "opacity-0"
          }`}
        >
        {/* Zadná stena */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0503] via-[#120804] to-black" />

        {/* Ľavá stena */}
        <div
          className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black via-[#1a0d06] to-transparent"
          style={{
            transform: "skewY(-14deg)",
            transformOrigin: "left",
          }}
        />

        {/* Pravá stena */}
        <div
          className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black via-[#1a0d06] to-transparent"
          style={{
            transform: "skewY(14deg)",
            transformOrigin: "right",
          }}
        />

        {/* Dno */}
        <div className="absolute inset-x-4 bottom-0 h-10 rounded-t-xl bg-gradient-to-b from-[#2a140a] to-black" />
        </div>
        <div
          className={`relative z-20 -mt-1 overflow-hidden rounded-b-[2.5rem] border border-amber-500/30 shadow-[0_30px_55px_rgba(0,0,0,0.75)] transition duration-700 ${
            isLightVisible
              ? "shadow-[0_30px_55px_rgba(0,0,0,0.75),0_0_40px_rgba(251,191,36,0.14)]"
              : ""
          }`}
        >
          {/* Drevo tela */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#130b07_0px,#130b07_6px,#28150b_7px,#180d08_13px)]" />

          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-black/10 to-slate-950/85" />

          {/* Bočné stĺpiky */}
          <div className="absolute inset-y-0 left-0 w-7 border-r border-amber-400/15 bg-gradient-to-r from-black/70 via-amber-950/50 to-transparent sm:w-8" />

          <div className="absolute inset-y-0 right-0 w-7 border-l border-amber-400/15 bg-gradient-to-l from-black/70 via-amber-950/50 to-transparent sm:w-8" />

          {/* Rohové kovanie */}
          <div className="absolute bottom-0 left-0 h-10 w-10 rounded-tr-xl border-r border-t border-amber-300/25 bg-gradient-to-br from-amber-700/40 to-black sm:h-12 sm:w-12" />

          <div className="absolute bottom-0 right-0 h-10 w-10 rounded-tl-xl border-l border-t border-amber-300/25 bg-gradient-to-bl from-amber-700/40 to-black sm:h-12 sm:w-12" />

          <div className="relative px-4 pb-5 pt-8 sm:px-6 sm:pb-6 sm:pt-9">
            {/* Mosadzný panel */}
            <div
              className={`relative overflow-hidden rounded-3xl border px-2 py-3 shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_12px_28px_rgba(0,0,0,0.5)] transition duration-700 ${
                isLockReleased
                  ? "border-emerald-300/40"
                  : "border-amber-400/35"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#49300f] via-[#211406] to-[#080604]" />

              <div className="pointer-events-none absolute inset-1 rounded-[1.25rem] border border-amber-100/10" />

              {/* Dekoratívne skrutky */}
              {[
                "left-3 top-3",
                "right-3 top-3",
                "bottom-3 left-3",
                "bottom-3 right-3",
              ].map((position) => (
                <div
                  key={position}
                  className={`pointer-events-none absolute h-2.5 w-2.5 rounded-full border border-amber-200/25 bg-amber-800 shadow-inner ${position}`}
                />
              ))}

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-300/50" />

                  <p className="whitespace-nowrap font-serif text-[0.65rem] font-bold uppercase tracking-[0.28em] text-amber-200/75 sm:text-sm">
                    Kód truhlice
                  </p>

                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-300/50" />
                </div>

                {/* Tri jasne oddelené dvojice */}
                <div className="relative z-50 flex w-full items-start justify-between gap-1.5 md:justify-center md:gap-3">
                  {codes.map((code, codeIndex) => {
                    const normalizedCode =
                      normalizeCode(code);

                    return (
                      <div
                        key={`chest-code-${codeIndex}`}
                        className="relative z-50 flex min-w-0 shrink-0 flex-col items-center rounded-xl border border-amber-300/15 bg-black/20 px-1 py-2 shadow-inner"
                      >
                        <div className="flex gap-0.5">
                          {normalizedCode
                            .split("")
                            .map((digit, digitIndex) => (
                              <ChestDial
                                key={`chest-digit-${codeIndex}-${digitIndex}`}
                                value={Number(digit)}
                                disabled={isUnlocked}
                                onChange={(nextDigit) =>
                                  updateDigit(
                                    codeIndex,
                                    digitIndex,
                                    nextDigit
                                  )
                                }
                              />
                            ))}
                        </div>

                        <p className="mt-2 font-serif text-[0.65rem] font-black tracking-[0.28em] text-amber-200/75 sm:text-sm">
                          {pairLabels[codeIndex] ??
                            codeIndex + 1}
                        </p>
                      </div>
                    );
                  })}
                </div>

              <div className="mx-auto mt-3 h-px w-[85%] bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" />

                <p className="mt-2 text-center text-[0.5rem] font-bold uppercase tracking-[0.2em] text-amber-100/35 sm:text-[0.65rem]">
                  Tri dôkazy. Jedna kombinácia.
                </p>
                </div>
                </div>

                {/* Zámok */}
                <div className="mt-4 flex flex-col items-center">
                  <div
                    className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition duration-700 ${
                      isLockReleased
                        ? "rotate-6 border-emerald-300/70 bg-emerald-950 shadow-[0_0_30px_rgba(110,231,183,0.35)]"
                        : "border-amber-600/60 bg-gradient-to-br from-amber-700/50 via-amber-950 to-black shadow-[0_12px_20px_rgba(0,0,0,0.5)]"
                    }`}
                  >
                    <div className="absolute inset-1 rounded-xl border border-amber-200/15" />

                    <div
                      className={`relative h-8 w-5 rounded-t-full border-2 transition ${
                        isLockReleased
                          ? "translate-y-2 rotate-12 border-emerald-200"
                          : "border-amber-300/60"
                      }`}
                    >
                      <div
                        className={`absolute bottom-[-0.15rem] left-1/2 h-4 w-1.5 -translate-x-1/2 rounded-full ${
                          isLockReleased
                            ? "bg-emerald-200"
                            : "bg-amber-300/60"
                        }`}
                      />
                    </div>
                  </div>

                  <div
                    className={`mt-3 h-2 w-28 rounded-full transition duration-700 ${
                      isLockReleased
                        ? "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.6)]"
                        : "bg-black/70 shadow-inner"
                    }`}
                  />

                  <p
                    className={`mt-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.22em] transition sm:text-xs ${
                      isLockReleased
                        ? "text-emerald-300"
                        : "text-slate-500"
                    }`}
                  >
                    {isLockReleased
                      ? "Zámok odomknutý"
                      : "Zámok čaká na kombináciu"}
                  </p>
                </div>
                </div>
                </div>

                {areFragmentsVisible && (
                  <button
                    type="button"
                    onClick={onRewardClick}
                    className="relative z-50 mx-auto mt-6 block rounded-2xl border border-amber-300/30 bg-amber-950/60 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-amber-100 transition hover:border-amber-200/60 hover:bg-amber-900/60"
          >
            Preskúmať útržky
          </button>
        )}
      </div>
    </div>
  );
}