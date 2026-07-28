"use client";

import { ChestScene } from "./ChestScene";
import type { Chest3DProps } from "./chest3DTypes";

export function Chest3D({
  isFocused = false,
  isUnlocked = false,
  onSelect,
  onRewardClick,
  presentation = "default",
}: Chest3DProps) {
  const isCinematic = presentation === "cinematic";
  const isDefault = presentation === "default";

  return (
    <div
      className={
        isDefault
          ? "relative mx-auto h-[400px] w-full max-w-md overflow-hidden rounded-[2rem] border border-amber-300/15 bg-gradient-to-b from-slate-950 via-[#07080d] to-black shadow-2xl shadow-black/60 sm:h-[440px]"
          : presentation === "explore"
            ? "relative mx-auto h-[390px] w-full max-w-2xl overflow-hidden bg-transparent min-[390px]:h-[410px] sm:h-[560px]"
            : "relative mx-auto h-[340px] w-full max-w-lg overflow-hidden bg-transparent min-[390px]:h-[370px] sm:h-[430px]"
      }
    >
      <ChestScene
        isFocused={isFocused}
        isUnlocked={isUnlocked}
        onSelect={onSelect}
        onRewardClick={onRewardClick}
        presentation={presentation}
      />

      {!isCinematic && !isFocused && !isUnlocked && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 px-3 text-center sm:bottom-5">
          <p className="text-[0.56rem] font-bold uppercase tracking-[0.24em] text-amber-400/70 sm:text-[0.6rem] sm:tracking-[0.28em]">
            Potiahni pre otočenie
          </p>
          <p className="mt-1.5 text-[0.72rem] text-slate-400 sm:mt-2 sm:text-xs">
            Klikni na zámok a preskúmaj mechanizmus
          </p>
        </div>
      )}

      {!isCinematic && isFocused && !isUnlocked && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center sm:bottom-5">
          <p className="text-[0.56rem] font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-[0.6rem] sm:tracking-[0.28em]">
            Detail zámku
          </p>
        </div>
      )}

      {!isCinematic && isUnlocked && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 px-3 text-center sm:bottom-5">
          <p className="text-[0.56rem] font-bold uppercase tracking-[0.24em] text-amber-300 sm:text-[0.6rem] sm:tracking-[0.28em]">
            Tajomstvo odhalené
          </p>
          <p className="mt-1.5 text-[0.72rem] text-amber-100/70 sm:mt-2 sm:text-xs">
            Dotkni sa útržkov nad truhlicou
          </p>
        </div>
      )}
    </div>
  );
}
