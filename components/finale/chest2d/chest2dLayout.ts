/**
 * 2D záloha truhlice vo finále (úprava 4, krok T5a): rozmery kresby a časovanie.
 *
 * Časovanie je spoločné s 3D truhlicou (chestZoom.ts), aby zvuky a vibrácie
 * zazneli v rovnakých chvíľach a jeden zvukový súbor poslúžil obom verziám.
 */
import {
  HASP_RELEASE_SEC,
  LOCK_UNLOCK_SEC,
  OPENING_SEC,
  SHAKE_SEC,
  getHaspFrame,
} from "../chest3d/chestZoom";

/** Kresba truhlice (SVG). */
export const CHEST_2D_VIEW = { width: 360, height: 300 };

/** Pánty veka (zadná hrana) – veko sa okolo nich odklopí nahor. */
export const LID_HINGE_Y = 90;

/** Tri mosadzné zámky na prednej stene (stred, šírka a výška tela zámku). */
export const LOCK_2D = {
  centers: [95, 180, 265] as const,
  bodyTop: 200,
  bodyWidth: 54,
  bodyHeight: 54,
  /** Oblúk (strmeň) nad telom zámku. */
  shackleTop: 176,
};

/** Kľúčová dierka v kovaní na prednej hrane veka (stred). */
export const KEYHOLE_2D = { x: 180, y: 143 };

/** Železné spony z veka na telo (ľavá a pravá). */
export const HASPS_2D = { xs: [52, 308] as const, top: 136, bottom: 192, width: 16 };

/** Ťukacia plocha zámku v SVG jednotkách (aspoň 44 px aj na úzkom telefóne). */
export const LOCK_HIT_2D = { width: 80, height: 104, top: 166 };

/**
 * Spony sa povolia po dokončení otvárania posledného zámku (LOCK_UNLOCK_SEC),
 * rovnako ako v 3D. Celý úsek trvá LOCK_UNLOCK_SEC + HASP_RELEASE_SEC.
 */
export const HASP_DELAY_SEC = LOCK_UNLOCK_SEC;
export const HASP_TOTAL_SEC = HASP_DELAY_SEC + HASP_RELEASE_SEC;

/** Priebeh povolenia spôn 0 → 1 od chvíle, keď sa otvoril posledný zámok. */
export function getHasp2DFrame(elapsedSec: number) {
  return getHaspFrame(elapsedSec - HASP_DELAY_SEC);
}

/** Zatrasenie zámku pri zlom kóde (posun do strany v SVG jednotkách). */
export function getShake2DOffset(elapsedSec: number) {
  if (elapsedSec <= 0 || elapsedSec >= SHAKE_SEC) {
    return 0;
  }

  return 5 * Math.sin(2 * Math.PI * 7 * elapsedSec) * (1 - elapsedSec / SHAKE_SEC);
}

export { LOCK_UNLOCK_SEC, OPENING_SEC, SHAKE_SEC };
