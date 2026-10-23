import type { InspectCountPoint, InspectTiming } from "../../types/game";

/**
 * Časy nápovedí pri počítacích predmetoch: 1. nápoveda po 20 s,
 * 2. nápoveda po 40 s a „Ukáž číslicu“ po 60 s (od otvorenia alebo
 * poslednej aktivity). Predmet môže mať aj vlastné časy.
 */
export const COUNT_INSPECT_TIMING: InspectTiming = {
  hintMs: 20_000,
  secondHintMs: 40_000,
  revealMs: 60_000,
};

/*
 * Poloha prvkov na počítanie na líci predmetov kapitoly I
 * (0 až 1 zľava a zhora). Kresba predmetu vykreslí presne tieto prvky
 * a ich počet sa musí rovnať číslici predmetu (overuje automatický test).
 * Stredy prvkov sú od seba aspoň 44 px aj na úzkom mobile.
 */

/** Kus mapy: staré mesto (scéna 2) – 8 veží. */
export const OLD_TOWN_TOWERS: InspectCountPoint[] = [
  { x: 0.12, y: 0.32 },
  { x: 0.28, y: 0.2 },
  { x: 0.42, y: 0.36 },
  { x: 0.55, y: 0.18 },
  { x: 0.66, y: 0.4 },
  { x: 0.79, y: 0.22 },
  { x: 0.9, y: 0.42 },
  { x: 0.48, y: 0.62 },
];

/** Lúč pečate vychádza zo stredu pod týmto uhlom (stupne) a vzdialenosťou. */
function sealRay(angleDeg: number): InspectCountPoint {
  const angle = (angleDeg * Math.PI) / 180;
  const radius = 0.3;

  return {
    x: Math.round((0.5 + radius * Math.cos(angle)) * 1000) / 1000,
    y: Math.round((0.5 + radius * Math.sin(angle)) * 1000) / 1000,
  };
}

/** Pečať vzdelanosti (scéna 4) – 6 lúčov nad korunou. */
export const EDUCATION_SEAL_RAYS: InspectCountPoint[] = [
  -170, -138, -106, -74, -42, -10,
].map(sealRay);

/*
 * Zuby Zlatého kľúča (scény 7 až 9) – tri časti brady. Zárezy sú
 * v spodnej hrane brady (y 0,81), okienka v jej strede (y 0,49).
 * Zárezy sú od seba 0,18 šírky kresby, okienka 0,2 (aj v 3D aspoň 44 px).
 */
const slot = (x: number): InspectCountPoint => ({ x, y: 0.81, label: "Zárez" });
const keyWindow = (x: number): InspectCountPoint => ({
  x,
  y: 0.49,
  label: "Okienko",
});

export const FIRST_KEY_TOOTH_NOTCHES: InspectCountPoint[] = [
  slot(0.14),
  slot(0.32),
  slot(0.5),
  slot(0.68),
  slot(0.86),
  keyWindow(0.2),
  keyWindow(0.4),
  keyWindow(0.6),
  keyWindow(0.8),
];

export const SECOND_KEY_TOOTH_NOTCHES: InspectCountPoint[] = [
  slot(0.32),
  keyWindow(0.68),
];

export const THIRD_KEY_TOOTH_NOTCHES: InspectCountPoint[] = [
  slot(0.23),
  slot(0.41),
  slot(0.59),
  slot(0.77),
  keyWindow(0.3),
  keyWindow(0.5),
  keyWindow(0.7),
];
