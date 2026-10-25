/**
 * Čistá matematika priblíženia na zámok a koliesok číselníka (bez three.js),
 * aby sa dala testovať. Každá funkcia vracia novú hodnotu a nič nemení.
 *
 * Kamera stojí (ako pri 3D predmetoch); pri priblížení sa truhlica posunie
 * a zväčší tak, aby tri kolieska zámku vyplnili tretiny šírky obrázka.
 */

/** Kamera spoločného plátna (InspectStage) a pomer strán obrázka (4 : 3). */
export const CAMERA_Z = 3.3;
export const CAMERA_FOV_RAD = (40 * Math.PI) / 180;
export const VIEW_ASPECT = 4 / 3;

/** Kolieska v súradniciach zámku: tri vedľa seba, os vodorovne. */
export const DIAL_SPACING = 0.13;
export const DIAL_RADIUS = 0.1;
export const DIAL_WIDTH = 0.105;
export const DIAL_CENTER_Y = -0.06;
export const DIAL_AXIS_Z = 0.12;
export const DIAL_FRONT_Z = DIAL_AXIS_Z + DIAL_RADIUS;

/** Kde je stred koliesok pri priblížení (podiel výšky zhora, nad tlačidlami). */
export const DIAL_AREA_CENTER = 0.37;
/** Vzdialenosť prednej strany koliesok od kamery pri priblížení. */
const ZOOM_DISTANCE = 0.6;
const ZOOM_SECONDS = 0.7;

/** Ťahanie prstom: o koľko pixelov sa koliesko pootočí o jednu číslicu. */
export const DIAL_DRAG_STEP_PX = 32;

/** Krátke zatrasenie zámku pri zlom kóde. */
export const SHAKE_SEC = 0.45;
const SHAKE_AMPLITUDE = 0.035;
const SHAKE_HZ = 9;

/** Plynulé dobiehanie (koliesko, oblúk zámku). */
const FOLLOW_SPEED = 12;
const FOLLOW_EPSILON = 0.002;

export type ChestTransform = {
  /** Posun truhlice hore a dole a ku kamere. */
  y: number;
  z: number;
  scale: number;
  /** Náklon, aby bolo vidieť aj veko (pri priblížení nula). */
  tilt: number;
};

/** Celý pohľad na truhlicu. */
export const OVERVIEW_TRANSFORM: ChestTransform = {
  y: -0.12,
  z: 0,
  scale: 0.55,
  tilt: 0.32,
};

/**
 * Priblíženie na zámok natočený k hráčovi: zámok je vo výške lockY
 * a vo vzdialenosti lockDepth od stredu truhlice (v súradniciach truhlice).
 */
export function getZoomTransform(lockY: number, lockDepth: number): ChestTransform {
  const visibleHeight = 2 * ZOOM_DISTANCE * Math.tan(CAMERA_FOV_RAD / 2);
  const visibleWidth = visibleHeight * VIEW_ASPECT;
  const scale = visibleWidth / 3 / DIAL_SPACING;

  return {
    y: (0.5 - DIAL_AREA_CENTER) * visibleHeight - scale * (lockY + DIAL_CENTER_Y),
    z: CAMERA_Z - ZOOM_DISTANCE - scale * (lockDepth + DIAL_FRONT_Z),
    scale,
    tilt: 0,
  };
}

export function blendTransform(
  from: ChestTransform,
  to: ChestTransform,
  amount: number
): ChestTransform {
  const mix = (a: number, b: number) => a + (b - a) * amount;

  return {
    y: mix(from.y, to.y),
    z: mix(from.z, to.z),
    scale: mix(from.scale, to.scale),
    tilt: mix(from.tilt, to.tilt),
  };
}

/** Priebeh priblíženia 0 → 1 (alebo späť); pri vypnutých animáciách okamžite. */
export function stepZoom(
  progress: number,
  target: number,
  dtSec: number,
  reducedMotion: boolean
) {
  if (reducedMotion) {
    return target;
  }

  const step = dtSec / ZOOM_SECONDS;

  return progress < target
    ? Math.min(target, progress + step)
    : Math.max(target, progress - step);
}

/** Pomalý rozbeh aj dobeh priblíženia. */
export function easeZoom(progress: number) {
  return progress * progress * (3 - 2 * progress);
}

/** Vychýlenie zámku do strany počas zatrasenia (po jeho konci nula). */
export function getShakeOffset(elapsedSec: number) {
  if (elapsedSec <= 0 || elapsedSec >= SHAKE_SEC) {
    return 0;
  }

  return (
    SHAKE_AMPLITUDE *
    Math.sin(2 * Math.PI * SHAKE_HZ * elapsedSec) *
    (1 - elapsedSec / SHAKE_SEC)
  );
}

/** Plynulé dobiehanie hodnoty k cieľu; pri vypnutých animáciách okamžite. */
export function stepToward(
  current: number,
  target: number,
  dtSec: number,
  reducedMotion: boolean,
  speed = FOLLOW_SPEED
) {
  if (reducedMotion) {
    return target;
  }

  const next = current + (target - current) * (1 - Math.exp(-speed * dtSec));

  return Math.abs(target - next) < FOLLOW_EPSILON ? target : next;
}

/** Číslica 0 až 9 (dokola). */
export function normalizeDigit(value: number) {
  return ((Math.round(value) % 10) + 10) % 10;
}

/** O koľko pootočiť koliesko z jednej číslice na druhú (najkratšou cestou). */
export function getDialStep(fromDigit: number, toDigit: number) {
  const forward = normalizeDigit(toDigit - fromDigit);

  return forward > 5 ? forward - 10 : forward;
}

/** Ťuknutie do hornej polovice kolieska pridá 1, do dolnej uberie 1. */
export function getTapStep(offsetY: number, height: number) {
  return offsetY < height / 2 ? 1 : -1;
}

/** Ťahanie prstom: hore pridáva, dole uberá (o jednu číslicu na DIAL_DRAG_STEP_PX). */
export function getDragSteps(deltaYPx: number) {
  return Math.trunc(-deltaYPx / DIAL_DRAG_STEP_PX) || 0;
}
