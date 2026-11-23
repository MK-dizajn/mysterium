/**
 * Meranie truhlice (úprava 4, krok T5b): počet nakreslených snímok,
 * snímky za sekundu počas pohybu a pamäť JavaScriptu. Slúži testom
 * a ladiacemu textu na mobile (?ladenie=1). Truhlica sa kreslí iba pri
 * pohybe, preto sa pauza do snímok za sekundu nezapočítava.
 */

export type FrameMeter = {
  /** Všetky nakreslené snímky od začiatku. */
  frames: number;
  /** Snímky za sekundu za posledné meracie okno (0 = zatiaľ bez pohybu). */
  fps: number;
  windowStart: number;
  windowFrames: number;
  lastFrame: number;
};

/** Medzera dlhšia ako toto (ms) je pauza – nové okno začne od ďalšej snímky. */
const PAUSE_MS = 500;
const WINDOW_MS = 1000;

export function createFrameMeter(now: number): FrameMeter {
  return { frames: 0, fps: 0, windowStart: now, windowFrames: 0, lastFrame: now };
}

/** Jedna nakreslená snímka. Vráti true, keď sa zmenili snímky za sekundu. */
export function tickFrameMeter(meter: FrameMeter, now: number) {
  meter.frames += 1;

  if (now - meter.lastFrame > PAUSE_MS) {
    meter.windowStart = now;
    meter.windowFrames = 0;
  }

  meter.lastFrame = now;
  meter.windowFrames += 1;
  const elapsed = now - meter.windowStart;

  if (elapsed < WINDOW_MS) {
    return false;
  }

  const fps = Math.round((meter.windowFrames * 1000) / elapsed);
  const changed = fps !== meter.fps;
  meter.fps = fps;
  meter.windowStart = now;
  meter.windowFrames = 0;

  return changed;
}

/** Pamäť JavaScriptu v MB (Chrome a Android); Safari ju nehlási – null. */
export function readJsHeapMB(): number | null {
  if (typeof performance === "undefined") {
    return null;
  }

  const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;

  return memory ? memory.usedJSHeapSize / (1024 * 1024) : null;
}

/** Ladiaci riadok: „58 snímok/s · pamäť JS 42 MB“. */
export function formatMeterText({ fps, heapMB }: { fps: number; heapMB: number | null }) {
  const frames = fps > 0 ? `${fps} snímok/s` : "snímky: zatiaľ bez pohybu";
  const memory = heapMB === null ? "" : ` · pamäť JS ${Math.round(heapMB)} MB`;

  return frames + memory;
}
