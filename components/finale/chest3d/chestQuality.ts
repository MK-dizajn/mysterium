/**
 * Plná alebo ľahká verzia 3D truhlice (úprava 4, krok T1).
 *
 * Ľahká verzia: ostrosť 1×, bez odleskov okolia a bez zadného svetla.
 * Drevo, reliéf a tieň pod truhlicou ostávajú.
 *
 * Voľba:
 * - telefón hlási najviac 4 GB pamäte → ľahká,
 * - telefón hlási pamäť aj najviac 4 jadrá → ľahká (Safari pamäť nehlási
 *   a počet jadier skresľuje, tam rozhodne až meranie),
 * - inak plná, ktorú ešte overí meranie prvých 30 snímok: ak sú pomalšie
 *   ako 30 snímok za sekundu, prepne sa na ľahkú,
 * - na skúšku sa dá vynútiť adresou ?truhlica=lahka alebo ?truhlica=plna.
 */

export type ChestQuality = "full" | "light";

/** Prečo bola zvolená verzia (pre ladiaci text a testy). */
export type ChestQualityReason = "vybava" | "meranie" | "vynutene" | "predvolene";

/** Strop, ktorý stráži test (grafická pamäť textúr, trojuholníky, kreslenia). */
export const CHEST_LIMITS = {
  textureMB: 16,
  triangles: 60000,
  drawCalls: 150,
};

export const CHEST_QUALITY_SETTINGS: Record<
  ChestQuality,
  { dpr: number; environment: boolean; rimLight: boolean }
> = {
  full: { dpr: 1.5, environment: true, rimLight: true },
  light: { dpr: 1, environment: false, rimLight: false },
};

/** Meranie: počet snímok a najpomalšia priemerná snímka (30 snímok za sekundu). */
export const PROBE_FRAMES = 30;
export const PROBE_MAX_FRAME_MS = 1000 / 30;
/**
 * Najdlhšie meranie: ak 30 snímok nestihne za 2 s, telefón je určite
 * pomalší ako 30 snímok za sekundu – meranie hneď skončí (slabý telefón
 * nemá zbytočne dlho kresliť, keď sa nič nehýbe).
 */
export const PROBE_MAX_MS = 2000;

type DeviceInfo = {
  deviceMemory?: number;
  cores?: number;
  /** Hodnota parametra ?truhlica= z adresy. */
  override?: string | null;
};

export function chooseChestQuality({ deviceMemory, cores, override }: DeviceInfo): {
  quality: ChestQuality;
  reason: ChestQualityReason;
  /** Overiť ešte meraním snímok (iba plná verzia, ktorá nebola vynútená). */
  probe: boolean;
} {
  if (override === "lahka") {
    return { quality: "light", reason: "vynutene", probe: false };
  }

  if (override === "plna") {
    return { quality: "full", reason: "vynutene", probe: false };
  }

  const reportsMemory = typeof deviceMemory === "number";

  if (
    (reportsMemory && deviceMemory <= 4) ||
    (reportsMemory && typeof cores === "number" && cores <= 4)
  ) {
    return { quality: "light", reason: "vybava", probe: false };
  }

  return { quality: "full", reason: "predvolene", probe: true };
}

/**
 * Výsledok merania sa pamätá do zatvorenia stránky: truhlica sa na
 * obrazovke môže vytvoriť znova (napríklad po otvorení), meranie však
 * prebehne iba raz.
 */
let measuredQuality: { quality: ChestQuality; reason: ChestQualityReason } | null = null;

export function rememberMeasuredQuality(quality: ChestQuality, reason: ChestQualityReason) {
  measuredQuality = { quality, reason };
}

/** Voľba verzie: zapamätané meranie z tohto sedenia, inak podľa výbavy. */
export function chooseChestQualityForSession(info: DeviceInfo) {
  const choice = chooseChestQuality(info);

  if (choice.probe && measuredQuality) {
    return { ...measuredQuality, probe: false };
  }

  return choice;
}

/** Bolo meranie pomalé? (priemer snímok nad 1/30 s) */
export function isProbeTooSlow(frameMs: number[]) {
  if (frameMs.length === 0) {
    return false;
  }

  const average = frameMs.reduce((sum, ms) => sum + ms, 0) / frameMs.length;

  return average > PROBE_MAX_FRAME_MS;
}

/** Údaje o zariadení z prehliadača (iba v prehliadači). */
export function readDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return {};
  }

  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };

  return {
    deviceMemory: navigatorWithMemory.deviceMemory,
    cores: navigator.hardwareConcurrency,
    override: new URLSearchParams(window.location.search).get("truhlica"),
  };
}

/** Malý ladiaci text pod truhlicou sa ukáže iba s ?ladenie=1 v adrese. */
export function isChestDebugOn() {
  return (
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("ladenie") === "1"
  );
}
