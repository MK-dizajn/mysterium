import { soundManager } from "./soundManager";

/** Vzory vibrácie (ms): krátke ťuknutie, chyba, otvorenie tajnej schránky. */
export const HAPTIC = {
  step: 12,
  wrong: [40, 60, 40],
  open: [30, 70, 30, 70, 160],
  /** Cvak pružiny zámku truhlice. */
  lock: 45,
} as const;

/**
 * Vibrácia, ak ju prehliadač vie (Android áno, Safari na iPhone nie – vtedy
 * sa ticho vynechá). Riadi sa prepínačom zvuku: vypnutý zvuk = bez vibrácie.
 */
export function vibrate(pattern: number | readonly number[]) {
  if (
    typeof navigator === "undefined" ||
    typeof navigator.vibrate !== "function" ||
    soundManager.isMuted()
  ) {
    return;
  }

  try {
    navigator.vibrate(pattern as number | number[]);
  } catch {
    // Niektoré prehliadače vibráciu blokujú – nevadí.
  }
}
