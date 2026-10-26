"use client";

import { type PointerEvent, useRef } from "react";
import { useReducedMotion } from "../items/useReducedMotion";

type DetectiveNoteProps = {
  number: number | string;
  title: string;
  paragraphs: string[];
  signature: string;
  /** Nepovinný obrázok čistého papiera s priehľadným pozadím (nahradí papier v kóde). */
  imageSrc?: string;
  className?: string;
};

/** Najväčší náklon papiera pri ťahaní (stupne). */
const MAX_TILT_DEG = 8;

/**
 * Roztrhaný okraj papiera ako obrys (v percentách). Body sú pevné
 * (rovnaký papier pri každom zobrazení), rohy sú mierne odtrhnuté.
 */
const TORN_EDGE = (() => {
  // jednoduchý pevný generátor, aby bol okraj vždy rovnaký
  let seed = 7;
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const points: string[] = [];
  const steps = 22;

  for (let i = 0; i <= steps; i++) points.push(`${(i / steps) * 100}% ${(next() * 1.6).toFixed(2)}%`);
  for (let i = 1; i <= steps; i++) points.push(`${(100 - next() * 1.8).toFixed(2)}% ${(i / steps) * 100}%`);
  for (let i = steps - 1; i >= 0; i--) points.push(`${(i / steps) * 100}% ${(100 - next() * 1.6).toFixed(2)}%`);
  for (let i = steps - 1; i >= 1; i--) points.push(`${(next() * 1.8).toFixed(2)}% ${(i / steps) * 100}%`);

  return `polygon(${points.join(", ")})`;
})();

/**
 * Zápis od pátrača ako starý papier: skutočný text v rukopisnom písme,
 * papier nakreslený v kóde (alebo obrázok papiera), mäkký tieň a jemný
 * 3D náklon pri ťahaní (iba pri pohybe; pri vypnutých animáciách nehybný).
 */
export function DetectiveNote({
  number,
  title,
  paragraphs,
  signature,
  imageSrc,
  className = "",
}: DetectiveNoteProps) {
  const reducedMotion = useReducedMotion();
  const tiltRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);

  function setTilt(x: number, y: number, isDragging: boolean) {
    const tilt = tiltRef.current;

    if (!tilt) {
      return;
    }

    tilt.style.setProperty("--tilt-x", x.toFixed(2));
    tilt.style.setProperty("--tilt-y", y.toFixed(2));
    tilt.toggleAttribute("data-dragging", isDragging);
    // Tieň (na obale papiera) sa posunie opačne ako náklon.
    tilt.parentElement?.style.setProperty("--shadow-x", (-y * 1.5).toFixed(1));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    // Ťahanie myšou nemá označovať text (dotyk a posúvanie prstom ostávajú).
    if (event.pointerType === "mouse") {
      event.preventDefault();
    }

    if (reducedMotion) {
      return;
    }

    // Ťah ostane papieru aj mimo jeho okraja; zvislé posúvanie prstom rieši prehliadač (pan-y).
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const clamp = (value: number) => Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, value));
    // Ťahanie doprava nakloní papier doprava, ťahanie dole jeho spodok k hráčovi.
    const tiltY = clamp(((event.clientX - drag.x) / (rect.width / 2)) * MAX_TILT_DEG);
    const tiltX = clamp((-(event.clientY - drag.y) / (rect.height / 2)) * MAX_TILT_DEG * 2);

    setTilt(tiltX, tiltY, true);
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    setTilt(0, 0, false);
  }

  return (
    <div data-detective-paper className={`detective-paper ${className}`}>
      <div
        ref={tiltRef}
        data-paper-tilt
        className="detective-paper-tilt"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <article
          className={`detective-paper-sheet ${imageSrc ? "detective-paper-sheet-image" : ""}`}
          style={
            imageSrc
              ? { backgroundImage: `url(${JSON.stringify(imageSrc)})` }
              : { clipPath: TORN_EDGE }
          }
        >
          <div aria-hidden="true" className="detective-paper-gloss" />

          <header className="relative text-center">
            <p className="text-[1.15rem] leading-none text-[#4a3018]">
              Zápis č. {number}
            </p>
            <div aria-hidden="true" className="mx-auto mt-2 flex items-center justify-center gap-2 text-[#5a3a1c]">
              <span className="h-px w-12 bg-[#5a3a1c]/50" />
              <span className="text-sm">✦</span>
              <span className="h-px w-12 bg-[#5a3a1c]/50" />
            </div>
            <h2 className="mt-3 text-[1.6rem] leading-tight underline decoration-[#5a3a1c]/60 decoration-1 underline-offset-[6px]">
              {title}
            </h2>
          </header>

          <div className="relative mt-5 space-y-3">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p className="relative mt-5 text-right text-[1.35rem]">– {signature}</p>
        </article>
      </div>
    </div>
  );
}
