"use client";

import { useEffect, useState } from "react";
import { ActionButton } from "../ActionButton";

type RewardRevealProps = {
  isOpen: boolean;
  title: string;
  description: string;
  imageLabel?: string;
  transitionTitle?: string;
  transitionText?: string;
  continueLabel?: string;
  onContinue: () => void;
};

export function RewardReveal({
  isOpen,
  title,
  description,
  imageLabel = "Dôkaz",
  transitionTitle = "Stopa vedie ďalej",
  transitionText = "Nájdený dôkaz zapadol do vyšetrovania. Ďalšia časť prípadu je pripravená.",
  continueLabel = "Pokračovať vo vyšetrovaní",
  onContinue,
}: RewardRevealProps) {
  const [visible, setVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showTransition, setShowTransition] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      setShowText(false);
      setShowButton(false);
      setShowTransition(false);
      return;
    }

    setVisible(true);

    const textTimer = window.setTimeout(() => {
      setShowText(true);
    }, 500);

    const buttonTimer = window.setTimeout(() => {
      setShowButton(true);
    }, 1100);

    return () => {
      window.clearTimeout(textTimer);
      window.clearTimeout(buttonTimer);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  function handlePrimaryAction() {
  if (!showTransition) {
    setShowButton(false);

    window.setTimeout(() => {
      setShowTransition(true);
      setShowButton(true);
    }, 250);

    return;
  }

  onContinue();
}

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-black/92 px-6 py-8 backdrop-blur-md">
      <div className="w-full max-w-md text-center">
        {!showTransition ? (
          <>
            <div
              className={`mx-auto h-56 w-56 rounded-full bg-amber-300/20 blur-3xl transition-all duration-700 ${
                visible
                  ? "scale-125 opacity-100"
                  : "scale-75 opacity-0"
              }`}
              aria-hidden="true"
            />

            <div
              className={`relative -mt-40 mx-auto w-72 rounded-md border-8 border-stone-200 bg-[#d9c8a8] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.65)] transition-all duration-700 ${
                visible
                  ? "translate-y-0 rotate-[-2deg] scale-100 opacity-100"
                  : "translate-y-16 scale-75 opacity-0"
              }`}
            >
              <div className="pointer-events-none absolute inset-1 border border-stone-400/40" />

              <div className="aspect-[4/3] overflow-hidden border border-stone-500 bg-gradient-to-br from-slate-400 via-slate-700 to-black">
                <div className="flex h-full items-center justify-center px-4 text-sm font-bold uppercase tracking-[0.25em] text-white/80">
                  {imageLabel}
                </div>
              </div>

              <div className="mt-3 border-t border-stone-500/30 pt-2">
                <p className="font-serif text-xs italic text-stone-700">
                  Nájdené v uzamknutej truhlici
                </p>
              </div>
            </div>

            <div
              className={`mt-8 transition-all duration-700 ${
                showText
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
                Nový dôkaz
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                {title}
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-300">
                {description}
              </p>

              <div className="mx-auto mt-6 flex max-w-xs items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/35" />

                <span
                  className="text-xs text-amber-400"
                  aria-hidden="true"
                >
                  ◇
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/35" />
              </div>

              <p className="mt-5 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-300/70">
                Dôkaz bol zaistený
              </p>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/30 bg-amber-950/30 shadow-[0_0_50px_rgba(245,158,11,0.18)]">
              <span
                className="text-3xl text-amber-300"
                aria-hidden="true"
              >
                ◇
              </span>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
              Akt uzavretý
            </p>

            <h2 className="mt-3 font-serif text-3xl font-black text-white">
              {transitionTitle}
            </h2>

            <p className="mt-6 text-sm leading-7 text-slate-300">
              {transitionText}
            </p>

            <div className="mx-auto mt-8 max-w-sm rounded-2xl border border-amber-300/15 bg-amber-950/20 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400/70">
                Vyšetrovanie pokračuje
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-100">
                Získaný útržok otvoril ďalšiu časť
                prípadu.
              </p>
            </div>
          </div>
        )}

        <div
          className={`mt-10 transition-all duration-500 ${
            showButton
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-6 opacity-0"
          }`}
        >
          <ActionButton onClick={handlePrimaryAction}>
            {showTransition
              ? continueLabel
              : "Zaistiť dôkaz"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}