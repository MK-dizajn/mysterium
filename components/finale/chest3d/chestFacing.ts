/**
 * Čistá matematika natočenia 3D truhlice (bez three.js), aby sa dala testovať.
 *
 * Truhlica sa otáča okolo zvislej osi (yaw). Zámok je natočený k hráčovi,
 * keď sa yaw rovná jeho natočeniu: zámok I je na ľavom boku (+90°),
 * zámok II vpredu nad kľúčovou dierkou (0°), zámok III na pravom boku (−90°).
 */

export const LOCK_FACE_YAWS = [Math.PI / 2, 0, -Math.PI / 2];

/** Od akej miery natočenia (kosínus uhla) je štítok zámku viditeľný. */
const LOCK_VISIBLE_DOT = 0.35;

/** Uhol prevedený do rozsahu (-π, π]. */
function normalizeAngle(angle: number) {
  const fullTurn = Math.PI * 2;
  let result = (angle + Math.PI) % fullTurn;

  if (result <= 0) {
    result += fullTurn;
  }

  return result - Math.PI;
}

/** Je zámok (0 = I, 1 = II, 2 = III) natočený k hráčovi? */
export function isLockFacing(yaw: number, tilt: number, lockIndex: number) {
  const faceYaw = LOCK_FACE_YAWS[lockIndex] ?? 0;

  return Math.cos(yaw - faceYaw) * Math.cos(tilt) >= LOCK_VISIBLE_DOT;
}

/** Najbližšie natočenie na cieľ bez zbytočnej celej otáčky. */
export function getNearestYaw(currentYaw: number, targetYaw: number) {
  return currentYaw + normalizeAngle(targetYaw - currentYaw);
}

/**
 * Natočenie k zámku, ktorý je na rade; keď sú odomknuté všetky,
 * natočenie dopredu ku kľúčovej dierke.
 */
export function getFacingYawForLocks(
  locks: { isOpen: boolean; isNext: boolean }[]
) {
  const nextIndex = locks.findIndex((lock) => lock.isNext);

  return nextIndex === -1 ? 0 : (LOCK_FACE_YAWS[nextIndex] ?? 0);
}
