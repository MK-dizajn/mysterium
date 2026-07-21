"use client";

import { useEffect, useState } from "react";
import { ActionButton } from "../ActionButton";

type RewardRevealProps = {
  isOpen: boolean;
  title: string;
  description: string;
  imageLabel?: string;
  onContinue: () => void;
};

export function RewardReveal({
  isOpen,
  title,
  description,
  imageLabel = "Dôkaz",
  onContinue,
}: RewardRevealProps) {
  const [visible, setVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);
      setShowText(false);
      setShowButton(false);
      return;
    }

    setVisible(true);

    const textTimer = window.setTimeout(() => {
      setShowText(true);
    }, 500);

    const buttonTimer = window.setTimeout(() => {
      setShowButton(true);
    }, 1000);

    return () => {
      window.clearTimeout(textTimer);
      window.clearTimeout(buttonTimer);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-6 backdrop-blur-md">
      <div className="w-full max-w-md text-center">

        {/* Glow */}
        <div
          className={`mx-auto h-56 w-56 rounded-full bg-amber-300/20 blur-3xl transition-all duration-700 ${
            visible
              ? "scale-125 opacity-100"
              : "scale-75 opacity-0"
          }`}
        />

        {/* Fotografia */}
        <div
          className={`relative -mt-40 mx-auto w-72 rounded-md border-8 border-stone-200 bg-[#d9c8a8] p-3 shadow-2xl transition-all duration-700 ${
            visible
              ? "translate-y-0 rotate-[-2deg] scale-100 opacity-100"
              : "translate-y-16 scale-75 opacity-0"
          }`}
        >
          <div className="aspect-[4/3] overflow-hidden border border-stone-500 bg-gradient-to-br from-slate-400 via-slate-700 to-black">
            <div className="flex h-full items-center justify-center text-sm font-bold uppercase tracking-[0.25em] text-white/80">
              {imageLabel}
            </div>
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
        </div>

        <div
          className={`mt-10 transition-all duration-700 ${
            showButton
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <ActionButton onClick={onContinue}>
            Pokračovať
          </ActionButton>
        </div>
      </div>
    </div>
  );
}