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
  /** Posun truhlice do strán, hore a dole a ku kamere. */
  x: number;
  y: number;
  z: number;
  scale: number;
  /** Náklon, aby bolo vidieť aj veko (pri priblížení na zámok nula). */
  tilt: number;
  /** Pootočenie navyše (pri kľúčovej dierke trochu zboku). */
  yaw: number;
};

/** Celý pohľad na truhlicu. */
export const OVERVIEW_TRANSFORM: ChestTransform = {
  x: 0,
  y: -0.12,
  z: 0,
  scale: 0.55,
  tilt: 0.32,
  yaw: 0,
};

/** Otvorená truhlica: trochu menšia a nižšie, aby sa nad ňu zmestil útržok. */
export const OPEN_TRANSFORM: ChestTransform = {
  x: 0,
  y: -0.42,
  z: 0,
  scale: 0.46,
  tilt: 0.32,
  yaw: 0,
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
    x: 0,
    y: (0.5 - DIAL_AREA_CENTER) * visibleHeight - scale * (lockY + DIAL_CENTER_Y),
    z: CAMERA_Z - ZOOM_DISTANCE - scale * (lockDepth + DIAL_FRONT_Z),
    scale,
    tilt: 0,
    yaw: 0,
  };
}

/** Kľúčová dierka (vstup kľúča) v súradniciach truhlice. */
export const KEYHOLE_POSITION: [number, number, number] = [0, -0.55, 1.11];
/** Na ktorý bod sa pri vkladaní kľúča pozerá (kúsok pred dierkou, aby bol vidieť aj kľúč). */
export const KEYHOLE_VIEW_POINT: [number, number, number] = [0, -0.58, 1.3];
const KEYHOLE_YAW = 0.55;
const KEYHOLE_TILT = 0.3;
const KEYHOLE_SCALE = 1.05;
const KEYHOLE_DISTANCE = 1.45;

/** Priblíženie ku kľúčovej dierke: trochu zboku a zhora, dierka v strede obrázka. */
export function getKeyholeTransform(): ChestTransform {
  const [px, py, pz] = KEYHOLE_VIEW_POINT;
  // Otočenie okolo zvislej osi, potom náklon (rovnako ako skupina truhlice).
  const turnedX = pz * Math.sin(KEYHOLE_YAW) + px * Math.cos(KEYHOLE_YAW);
  const turnedZ = pz * Math.cos(KEYHOLE_YAW) - px * Math.sin(KEYHOLE_YAW);
  const tiltedY = py * Math.cos(KEYHOLE_TILT) - turnedZ * Math.sin(KEYHOLE_TILT);
  const tiltedZ = py * Math.sin(KEYHOLE_TILT) + turnedZ * Math.cos(KEYHOLE_TILT);

  return {
    x: -KEYHOLE_SCALE * turnedX,
    y: -KEYHOLE_SCALE * tiltedY,
    z: CAMERA_Z - KEYHOLE_DISTANCE - KEYHOLE_SCALE * tiltedZ,
    scale: KEYHOLE_SCALE,
    tilt: KEYHOLE_TILT,
    yaw: KEYHOLE_YAW,
  };
}

/** Okamih otvárania: všetko od 0 do 1 (okrem keyVisible). */
export type OpeningFrame = {
  /** Priblíženie ku kľúčovej dierke. */
  zoomIn: number;
  /** Oddialenie na otvorenú truhlicu. */
  zoomOut: number;
  keyVisible: boolean;
  /** 1 = kľúč pred dierkou, 0 = zasunutý. */
  keyDepth: number;
  /** Otočenie kľúča o štvrť otáčky. */
  keyTurn: number;
  lid: number;
  light: number;
  /** Vystúpenie útržku nad truhlicu. */
  fragment: number;
};

/** Časy jednotlivých častí otvárania (v sekundách od ťuknutia). */
const OPENING_TIMES = {
  zoomIn: [0, 0.7],
  keyIn: [0.7, 1.4],
  keyTurn: [1.4, 2.0],
  zoomOut: [2.0, 2.8],
  lid: [2.0, 3.4],
  light: [2.3, 3.2],
  fragment: [2.6, 3.6],
} as const;

export const OPENING_SEC = 3.6;
/** Kedy sa začne dvíhať veko (zvuk). */
export const OPENING_LID_START_SEC = OPENING_TIMES.lid[0];

export const CLOSED_FRAME: OpeningFrame = {
  zoomIn: 0,
  zoomOut: 0,
  keyVisible: false,
  keyDepth: 1,
  keyTurn: 0,
  lid: 0,
  light: 0,
  fragment: 0,
};

export const OPEN_FRAME: OpeningFrame = {
  zoomIn: 1,
  zoomOut: 1,
  keyVisible: true,
  keyDepth: 0,
  keyTurn: 1,
  lid: 1,
  light: 1,
  fragment: 1,
};

function phase(elapsedSec: number, [start, end]: readonly [number, number]) {
  return Math.max(0, Math.min(1, (elapsedSec - start) / (end - start)));
}

/** Stav otvárania v danom okamihu (po OPENING_SEC presne konečný stav). */
export function getOpeningFrame(elapsedSec: number): OpeningFrame {
  if (elapsedSec >= OPENING_SEC) {
    return OPEN_FRAME;
  }

  return {
    zoomIn: phase(elapsedSec, OPENING_TIMES.zoomIn),
    zoomOut: phase(elapsedSec, OPENING_TIMES.zoomOut),
    keyVisible: elapsedSec >= OPENING_TIMES.keyIn[0],
    keyDepth: 1 - easeZoom(phase(elapsedSec, OPENING_TIMES.keyIn)),
    keyTurn: easeZoom(phase(elapsedSec, OPENING_TIMES.keyTurn)),
    lid: easeZoom(phase(elapsedSec, OPENING_TIMES.lid)),
    light: phase(elapsedSec, OPENING_TIMES.light),
    fragment: easeZoom(phase(elapsedSec, OPENING_TIMES.fragment)),
  };
}

/** Pohľad počas otvárania: celá truhlica → kľúčová dierka → otvorená truhlica. */
export function getOpeningTransform(frame: OpeningFrame): ChestTransform {
  return frame.zoomOut > 0
    ? blendTransform(getKeyholeTransform(), OPEN_TRANSFORM, easeZoom(frame.zoomOut))
    : blendTransform(OVERVIEW_TRANSFORM, getKeyholeTransform(), easeZoom(frame.zoomIn));
}

export function blendTransform(
  from: ChestTransform,
  to: ChestTransform,
  amount: number
): ChestTransform {
  const mix = (a: number, b: number) => a + (b - a) * amount;

  return {
    x: mix(from.x, to.x),
    y: mix(from.y, to.y),
    z: mix(from.z, to.z),
    scale: mix(from.scale, to.scale),
    tilt: mix(from.tilt, to.tilt),
    yaw: mix(from.yaw, to.yaw),
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
