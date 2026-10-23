/**
 * Čistá matematika natočenia žetónu (bez three.js), aby sa dala testovať.
 *
 * Žetón sa otáča ako three.js Euler v poradí "XYZ": [tilt, yaw, 0].
 * Najprv otočenie okolo zvislej osi (yaw), potom náklon (tilt).
 * Číslica je vyrytá na hrane v smere lokálnej osi +X, kamera je na +Z.
 */

export const FACING_TOLERANCE_DEG = 25;

const FACING_MIN_DOT = Math.cos((FACING_TOLERANCE_DEG * Math.PI) / 180);

/** Otočenie, pri ktorom je číslica presne natočená k hráčovi. */
export const DIGIT_FACING_YAW = -Math.PI / 2;

/** Ako veľmi číslica „pozerá“ ku kamere (1 = priamo, 0 = bokom). */
export function getDigitFacingDot(yaw: number, tilt: number) {
  return -Math.sin(yaw) * Math.cos(tilt);
}

export function isDigitFacing(yaw: number, tilt: number) {
  return getDigitFacingDot(yaw, tilt) >= FACING_MIN_DOT;
}

/** Uhol prevedený do rozsahu (-π, π]. */
function normalizeAngle(angle: number) {
  const fullTurn = Math.PI * 2;
  let result = (angle + Math.PI) % fullTurn;

  if (result <= 0) {
    result += fullTurn;
  }

  return result - Math.PI;
}

/** Najbližšie otočenie s číslicou k hráčovi (bez zbytočnej celej otáčky). */
export function getNearestFacingYaw(currentYaw: number) {
  return currentYaw + normalizeAngle(DIGIT_FACING_YAW - currentYaw);
}

/** Ako dlho musí byť číslica natočená k hráčovi, kým sa zapíše sama. */
export const AUTO_RECORD_MS = 1500;

/**
 * Odpočet automatického zápisu. Pri vypnutých animáciách sa
 * nezapisuje sama – iba ťuknutím alebo Enterom.
 */
export function stepDwell(
  dwellMs: number,
  options: {
    isFacing: boolean;
    dtMs: number;
    reducedMotion: boolean;
    isFound: boolean;
  }
): { dwellMs: number; shouldRecord: boolean } {
  if (options.isFound || options.reducedMotion || !options.isFacing) {
    return { dwellMs: 0, shouldRecord: false };
  }

  const nextDwellMs = dwellMs + options.dtMs;

  return {
    dwellMs: nextDwellMs,
    shouldRecord: nextDwellMs >= AUTO_RECORD_MS,
  };
}
