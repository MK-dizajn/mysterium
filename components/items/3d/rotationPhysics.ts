/**
 * Ťahanie, zotrvačnosť a nakláňanie žetónu (bez three.js), aby sa dali
 * testovať. Každá funkcia vracia nový stav a pôvodný nemení.
 */

export type RotationState = {
  /** Otočenie okolo zvislej osi (radiány), bez obmedzenia. */
  yaw: number;
  /** Náklon hore a dole (radiány), najviac ±MAX_TILT. */
  tilt: number;
  /** Rýchlosť otáčania po pustení (radiány za sekundu). */
  velocity: number;
  isDragging: boolean;
  /** Cieľ plynulého natočenia (napríklad „Otočiť na hranu“). */
  targetYaw: number | null;
  /** Ako dlho ešte držať náklon z klávesnice, kým sa vráti. */
  tiltHoldMs: number;
};

export const MAX_TILT = (35 * Math.PI) / 180;

/** Radiány otočenia na jeden pixel ťahania. */
const DRAG_SENSITIVITY = 0.01;
/** Ako rýchlo zotrvačnosť slabne (za sekundu). */
const VELOCITY_DAMPING = 4;
const MIN_VELOCITY = 0.05;
/** Ako rýchlo sa náklon vracia na nulu (za sekundu). */
const TILT_SPRING = 10;
/** Ako rýchlo plynulé natočenie dobieha cieľ (za sekundu). */
const SNAP_SPEED = 8;
const SNAP_EPSILON = 0.002;
const TILT_EPSILON = 0.001;

export const KEYBOARD_YAW_STEP = (15 * Math.PI) / 180;
export const KEYBOARD_TILT_STEP = (15 * Math.PI) / 180;
const KEYBOARD_TILT_HOLD_MS = 900;

function clampTilt(tilt: number) {
  return Math.max(-MAX_TILT, Math.min(MAX_TILT, tilt));
}

export function createRotationState(): RotationState {
  return {
    yaw: 0,
    tilt: 0,
    velocity: 0,
    isDragging: false,
    targetYaw: null,
    tiltHoldMs: 0,
  };
}

/** Ťahanie o dx, dy pixelov za dtSec sekúnd. */
export function applyDrag(
  state: RotationState,
  dxPx: number,
  dyPx: number,
  dtSec: number
): RotationState {
  const deltaYaw = dxPx * DRAG_SENSITIVITY;

  return {
    ...state,
    yaw: state.yaw + deltaYaw,
    tilt: clampTilt(state.tilt + dyPx * DRAG_SENSITIVITY),
    velocity: dtSec > 0 ? deltaYaw / dtSec : 0,
    isDragging: true,
    targetYaw: null,
    tiltHoldMs: 0,
  };
}

/** Pustenie. Pri vypnutých animáciách bez zotrvačnosti. */
export function releaseDrag(
  state: RotationState,
  reducedMotion: boolean
): RotationState {
  return {
    ...state,
    isDragging: false,
    velocity: reducedMotion ? 0 : state.velocity,
  };
}

/** Plynulé natočenie na cieľ; pri vypnutých animáciách okamžité. */
export function snapToYaw(
  state: RotationState,
  targetYaw: number,
  reducedMotion: boolean
): RotationState {
  if (reducedMotion) {
    return { ...state, yaw: targetYaw, velocity: 0, targetYaw: null };
  }

  return { ...state, velocity: 0, targetYaw };
}

/** Šípka hore alebo dole: náklon chvíľu podrží, potom sa vráti. */
export function tiltByStep(
  state: RotationState,
  deltaTilt: number
): RotationState {
  return {
    ...state,
    tilt: clampTilt(state.tilt + deltaTilt),
    tiltHoldMs: KEYBOARD_TILT_HOLD_MS,
  };
}

/** Jeden krok pohybu o dtSec sekúnd. */
export function stepRotation(
  state: RotationState,
  dtSec: number,
  reducedMotion: boolean
): RotationState {
  let { yaw, tilt, velocity, targetYaw, tiltHoldMs } = state;

  if (targetYaw !== null) {
    velocity = 0;

    if (reducedMotion) {
      yaw = targetYaw;
      targetYaw = null;
    } else {
      yaw += (targetYaw - yaw) * (1 - Math.exp(-SNAP_SPEED * dtSec));

      if (Math.abs(targetYaw - yaw) < SNAP_EPSILON) {
        yaw = targetYaw;
        targetYaw = null;
      }
    }
  } else if (!state.isDragging) {
    if (reducedMotion) {
      velocity = 0;
    }

    yaw += velocity * dtSec;
    velocity *= Math.exp(-VELOCITY_DAMPING * dtSec);

    if (Math.abs(velocity) < MIN_VELOCITY) {
      velocity = 0;
    }
  }

  if (!state.isDragging) {
    if (tiltHoldMs > 0) {
      tiltHoldMs = Math.max(0, tiltHoldMs - dtSec * 1000);
    } else if (reducedMotion) {
      tilt = 0;
    } else {
      tilt += (0 - tilt) * (1 - Math.exp(-TILT_SPRING * dtSec));

      if (Math.abs(tilt) < TILT_EPSILON) {
        tilt = 0;
      }
    }
  }

  return { ...state, yaw, tilt, velocity, targetYaw, tiltHoldMs };
}

/*
 * Plochý predmet (list, mapa): ťahaním sa iba nakláňa (±30° do strán
 * aj hore a dole) a po pustení sa vráti. „Obrátiť“ ho otočí o 180°.
 */

export type FlatState = {
  /** Základné otočenie: 0 = líce, π = rub (po každom „Obrátiť“ + π). */
  baseYaw: number;
  yaw: number;
  tilt: number;
  isDragging: boolean;
  /** Ako dlho ešte držať náklon z klávesnice, kým sa vráti. */
  holdMs: number;
};

export const FLAT_MAX_TILT = (30 * Math.PI) / 180;

function clampFlat(value: number, center: number) {
  return Math.max(center - FLAT_MAX_TILT, Math.min(center + FLAT_MAX_TILT, value));
}

export function createFlatState(): FlatState {
  return { baseYaw: 0, yaw: 0, tilt: 0, isDragging: false, holdMs: 0 };
}

export function applyFlatDrag(
  state: FlatState,
  dxPx: number,
  dyPx: number
): FlatState {
  return {
    ...state,
    yaw: clampFlat(state.yaw + dxPx * DRAG_SENSITIVITY, state.baseYaw),
    tilt: clampFlat(state.tilt + dyPx * DRAG_SENSITIVITY, 0),
    isDragging: true,
    holdMs: 0,
  };
}

export function releaseFlatDrag(
  state: FlatState,
  reducedMotion: boolean
): FlatState {
  return reducedMotion
    ? { ...state, isDragging: false, yaw: state.baseYaw, tilt: 0 }
    : { ...state, isDragging: false };
}

/** „Obrátiť“: plynulo o 180°, pri vypnutých animáciách okamžite. */
export function flipFlat(state: FlatState, reducedMotion: boolean): FlatState {
  const baseYaw = state.baseYaw + Math.PI;

  return {
    ...state,
    baseYaw,
    yaw: reducedMotion ? baseYaw : state.yaw,
    tilt: reducedMotion ? 0 : state.tilt,
    holdMs: 0,
  };
}

/** Šípky: nakloní o krok, chvíľu podrží, potom sa vráti. */
export function nudgeFlat(
  state: FlatState,
  deltaYaw: number,
  deltaTilt: number
): FlatState {
  return {
    ...state,
    yaw: clampFlat(state.yaw + deltaYaw, state.baseYaw),
    tilt: clampFlat(state.tilt + deltaTilt, 0),
    holdMs: KEYBOARD_TILT_HOLD_MS,
  };
}

export function stepFlat(
  state: FlatState,
  dtSec: number,
  reducedMotion: boolean
): FlatState {
  if (state.isDragging) {
    return state;
  }

  if (state.holdMs > 0) {
    return { ...state, holdMs: Math.max(0, state.holdMs - dtSec * 1000) };
  }

  if (reducedMotion) {
    return { ...state, yaw: state.baseYaw, tilt: 0 };
  }

  let yaw =
    state.yaw + (state.baseYaw - state.yaw) * (1 - Math.exp(-SNAP_SPEED * dtSec));
  let tilt = state.tilt * Math.exp(-TILT_SPRING * dtSec);

  if (Math.abs(state.baseYaw - yaw) < SNAP_EPSILON) {
    yaw = state.baseYaw;
  }

  if (Math.abs(tilt) < TILT_EPSILON) {
    tilt = 0;
  }

  return { ...state, yaw, tilt };
}

export function isFlatAtRest(state: FlatState) {
  return (
    !state.isDragging &&
    state.holdMs <= 0 &&
    state.yaw === state.baseYaw &&
    state.tilt === 0
  );
}

export function isRotationAtRest(state: RotationState) {
  return (
    !state.isDragging &&
    state.velocity === 0 &&
    state.targetYaw === null &&
    state.tilt === 0 &&
    state.tiltHoldMs <= 0
  );
}
