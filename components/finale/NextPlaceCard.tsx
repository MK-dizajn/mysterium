import type { ReactNode, Ref } from "react";
import { getFinaleMapsUrl } from "../../engine";
import type { FinaleNextPlace } from "../../types/game";

type NextPlaceCardProps = {
  nextPlace: FinaleNextPlace;
  /** Nadpis karty – po správnej odpovedi naň prejde zameranie. */
  titleRef?: Ref<HTMLHeadingElement>;
  titleId: string;
  /** Na samostatnej obrazovke je nadpis karty hlavným nadpisom (h1). */
  isMainHeading?: boolean;
  /** Tlačidlá pod kartou (napríklad „Dokončiť kapitolu“ alebo „Zavrieť“). */
  children?: ReactNode;
};

/**
 * Karta „Ďalšie miesto“: názov, celá adresa, odkaz do Google Máp a popis
 * cesty – všetko vždy viditeľné, aby sa tam dostal aj človek, ktorý mesto
 * nepozná. Dočasnosť údajov (isPlaceholder) sa hráčovi nezobrazuje.
 */
export function NextPlaceCard({
  nextPlace,
  titleRef,
  titleId,
  isMainHeading = false,
  children,
}: NextPlaceCardProps) {
  const Title = isMainHeading ? "h1" : "h2";

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-3xl border border-amber-300/30 bg-gradient-to-b from-[#1c1408] to-[#0b0f1c] p-5 shadow-2xl shadow-black/50"
    >
      <Title
        id={titleId}
        ref={titleRef}
        tabIndex={-1}
        className="text-center text-xs font-black uppercase tracking-[0.3em] text-amber-300 outline-none"
      >
        {nextPlace.cardTitle}
      </Title>

      <p className="mt-3 text-center text-2xl font-black leading-8 text-amber-50">
        {nextPlace.name}
      </p>

      <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">
        {nextPlace.addressLabel}
      </h3>
      <p className="mt-1 text-[16px] leading-normal text-slate-100">
        {nextPlace.address}
      </p>

      <a
        href={getFinaleMapsUrl(nextPlace)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex min-h-[54px] w-full items-center justify-center rounded-2xl border border-amber-300/40 bg-amber-400 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-300 motion-reduce:transition-none"
      >
        {nextPlace.mapsButtonLabel}
      </a>

      <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-300/80">
        {nextPlace.directionsLabel}
      </h3>
      <p className="mt-1 text-[16px] leading-normal text-slate-100">
        {nextPlace.directions}
      </p>

      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
