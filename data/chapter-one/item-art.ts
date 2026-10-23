import type { InspectCountPoint } from "../../types/game";

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
const WINDOW = 0.49;
const SLOT = 0.81;

export const FIRST_KEY_TOOTH_NOTCHES: InspectCountPoint[] = [
  { x: 0.14, y: SLOT },
  { x: 0.32, y: SLOT },
  { x: 0.5, y: SLOT },
  { x: 0.68, y: SLOT },
  { x: 0.86, y: SLOT },
  { x: 0.2, y: WINDOW },
  { x: 0.4, y: WINDOW },
  { x: 0.6, y: WINDOW },
  { x: 0.8, y: WINDOW },
];

export const SECOND_KEY_TOOTH_NOTCHES: InspectCountPoint[] = [
  { x: 0.32, y: SLOT },
  { x: 0.68, y: WINDOW },
];

export const THIRD_KEY_TOOTH_NOTCHES: InspectCountPoint[] = [
  { x: 0.23, y: SLOT },
  { x: 0.41, y: SLOT },
  { x: 0.59, y: SLOT },
  { x: 0.77, y: SLOT },
  { x: 0.3, y: WINDOW },
  { x: 0.5, y: WINDOW },
  { x: 0.7, y: WINDOW },
];
