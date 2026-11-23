"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FinaleLock } from "../../../engine";
import { HAPTIC, vibrate } from "../../../lib/haptics";
import { soundManager } from "../../../lib/soundManager";
import { getGoldenKeySvg } from "../../items/art/keyToothArt";
import {
  CLOSED_FRAME,
  LOCK_CLOSED_FRAME,
  LOCK_OPEN_FRAME,
  OPEN_FRAME,
  getLockUnlockFrame,
  getOpeningFrame,
  type LockUnlockFrame,
  type OpeningFrame,
} from "../chest3d/chestZoom";
import { isChestDebugOn } from "../chest3d/chestQuality";
import {
  createFrameMeter,
  formatMeterText,
  readJsHeapMB,
  tickFrameMeter,
  type FrameMeter,
} from "../chest3d/frameMeter";
import { PhotoPieceArt } from "../PhotoPiece";
import {
  CHEST_2D_VIEW,
  HASPS_2D,
  HASP_DELAY_SEC,
  HASP_TOTAL_SEC,
  KEYHOLE_2D,
  LID_HINGE_Y,
  LOCK_2D,
  LOCK_HIT_2D,
  LOCK_UNLOCK_SEC,
  OPENING_SEC,
  SHAKE_SEC,
  getHasp2DFrame,
  getShake2DOffset,
} from "./chest2dLayout";

type Chest2DViewProps = {
  locks: FinaleLock[];
  /** Číslice nastavené na kolieskach každého zámku (zobrazia sa v okienkach). */
  lockDigits: number[][];
  stateLabels: { open: string; closed: string; next: string };
  selectedIndex: number | null;
  /** Ťuknutie na zámok: rodič posunie obrazovku k jeho kolieskam. */
  onSelectLock: (index: number) => void;
  /** Zlý kód: zatrasie sa zámok s týmto poradím (count sa zvýši pri každom pokuse). */
  wrongPulse: { lockIndex: number; count: number } | null;
  /** Spony sú povolené – až potom sa ukáže „Vložiť Zlatý kľúč“. */
  onHaspsReleased: () => void;
  /** Kľúč bol vložený a beží otvorenie (4,5 s ako v 3D). */
  isOpening: boolean;
  /** Truhlica je už otvorená (aj po F5). */
  isChestOpened: boolean;
  onOpenSettled: () => void;
  fragmentImageSrc?: string;
  fragmentPieceIndex: number;
  reducedMotion: boolean;
};

const PALETTE = {
  woodTop: "#8a5a32",
  woodLight: "#6e4524",
  woodDark: "#2f1a0a",
  grain: "#1a0d04",
  metalLight: "#f6dc8a",
  metal: "#c9962f",
  metalDark: "#6b4a14",
  patina: "#5d8a6a",
  band: "#4a4642",
  bandDark: "#1f1d1b",
  lining: "#7a1428",
  liningDark: "#24040b",
};

const GRAIN_BODY = [166, 182, 198, 214, 230, 246, 260];
const DUST_2D = [
  [150, 118, 1.6, 0],
  [170, 104, 1.2, 0.2],
  [190, 122, 1.8, 0.1],
  [206, 108, 1.3, 0.35],
  [160, 96, 1.1, 0.5],
  [214, 128, 1.4, 0.25],
] as const;

/**
 * Uplynulý čas (s) animácie, ktorá beží, kým je `running` (od jej začiatku).
 * Kreslí sa iba počas animácie; po skončení sa nič neprekresľuje.
 */
function useElapsed(running: boolean, durationSec: number) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) {
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const seconds = (now - start) / 1000;
      setElapsed(Math.min(seconds, durationSec));

      if (seconds < durationSec) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [running, durationSec]);

  return running ? elapsed : 0;
}

/** Vlastný znak hry: písmeno M v kruhu s kompasovou ružicou (nie znak mesta). */
function GameEmblem2D({ cx, cy, r, tag }: { cx: number; cy: number; r: number; tag: "lid" | "front" }) {
  const k = r / 12.5;
  const p = (dx: number, dy: number) => `${(cx + dx * k).toFixed(1)},${(cy + dy * k).toFixed(1)}`;

  return (
    <g data-chest-emblem={tag}>
      <circle cx={cx} cy={cy} r={r + 3 * k} fill={PALETTE.metalDark} />
      <circle cx={cx} cy={cy} r={r + 2 * k} fill={PALETTE.metal} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={PALETTE.metalDark} strokeWidth={1.6 * k} />
      <path
        data-compass=""
        d={`M${p(0, -11)} L${p(2.4, -2.4)} L${p(11, 0)} L${p(2.4, 2.4)} L${p(0, 11)} L${p(-2.4, 2.4)} L${p(-11, 0)} L${p(-2.4, -2.4)} Z`}
        fill={PALETTE.metalDark}
        opacity="0.5"
      />
      <text x={cx - 0.5 * k} y={cy + 4.4 * k} textAnchor="middle" fontSize={12 * k} fontWeight="900" fontFamily="Georgia, serif" fill={PALETTE.metalLight} opacity="0.6">
        M
      </text>
      <text x={cx} y={cy + 4 * k} textAnchor="middle" fontSize={12 * k} fontWeight="900" fontFamily="Georgia, serif" fill={PALETTE.metalDark}>
        M
      </text>
    </g>
  );
}

function Rivet({ x, y, url }: { x: number; y: number; url: (name: string) => string }) {
  return <circle data-rivet cx={x} cy={y} r="2.6" fill={url("rivet")} stroke={PALETTE.metalDark} strokeWidth="0.8" />;
}

type LockArtProps = {
  index: number;
  label: string;
  digits: number[];
  isOpen: boolean;
  isNext: boolean;
  isSelected: boolean;
  frame: LockUnlockFrame;
  shake: number;
  url: (name: string) => string;
};

/** Jeden mosadzný zámok: oblúk cez železné uško, telo s tromi okienkami koliesok. */
function LockArt({ index, label, digits, isOpen, isNext, isSelected, frame, shake, url }: LockArtProps) {
  const cx = LOCK_2D.centers[index];
  const { bodyTop, bodyWidth, bodyHeight, shackleTop } = LOCK_2D;
  const left = cx - bodyWidth / 2;
  const shackleLift = frame.shackleLift * 10;
  // Oblúk sa vysunie a vykloní nabok okolo pravej nohy (ostane viditeľný),
  // telo sa mierne nakloní (visí).
  const swing = -frame.shackleSwing * 35;
  const tilt = frame.tilt * 9;
  const jolt = frame.jolt * 3;

  return (
    <g
      data-lock-2d={index}
      data-lock-state={isOpen ? "open" : isNext ? "next" : "closed"}
      transform={`translate(${shake.toFixed(2)} ${jolt.toFixed(2)})`}
    >
      {/* Železné uško na stene truhlice, ktorým prechádza oblúk. */}
      <rect x={cx - 9} y={shackleTop - 8} width="18" height="8" rx="2" fill={url("band")} />
      <g transform={`rotate(${tilt.toFixed(2)} ${cx} ${shackleTop})`}>
        <g transform={`translate(0 ${(-shackleLift).toFixed(2)}) rotate(${swing.toFixed(2)} ${cx + 14} ${bodyTop})`}>
          <path
            data-shackle
            d={`M${cx - 14},${bodyTop + 2} V${shackleTop + 10} A14,14 0 0 1 ${cx + 14},${shackleTop + 10} V${bodyTop + 2}`}
            fill="none"
            stroke={url("metal")}
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
        {/* Telo zámku. */}
        <rect
          x={left}
          y={bodyTop}
          width={bodyWidth}
          height={bodyHeight}
          rx="8"
          fill={url("metal")}
          stroke={isSelected ? "#fde68a" : PALETTE.metalDark}
          strokeWidth={isSelected ? 3 : 1.2}
        />
        <rect x={left + 3} y={bodyTop + 3} width={bodyWidth - 6} height={bodyHeight - 6} rx="6" fill="none" stroke={PALETTE.patina} strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="5 7" />
        {/* Tri okienka koliesok s nastavenými číslicami. */}
        {digits.map((digit, digitIndex) => {
          const x = left + 6 + digitIndex * 15;
          const settle = frame.dialSettle[digitIndex] ?? 0;

          return (
            <g key={digitIndex} transform={`translate(0 ${(settle * 2.5).toFixed(2)})`}>
              <rect x={x} y={bodyTop + 9} width="12" height="18" rx="2" fill="#120a04" stroke={PALETTE.metalDark} strokeWidth="0.8" />
              <text data-dial-digit x={x + 6} y={bodyTop + 22.5} textAnchor="middle" fontSize="12" fontWeight="800" fontFamily="Georgia, serif" fill="#fde68a">
                {digit}
              </text>
            </g>
          );
        })}
        {/* Ryska vedľa koliesok – rozžiari sa pri správnom kóde. */}
        <rect x={left + 6} y={bodyTop + 30} width={bodyWidth - 12} height="2.4" rx="1.2" fill={isOpen || frame.indicator > 0 ? "#fde68a" : PALETTE.metalDark} opacity={0.4 + 0.6 * frame.indicator} />
        <text x={cx} y={bodyTop + 47} textAnchor="middle" fontSize="12" fontWeight="900" fontFamily="Georgia, serif" fill={PALETTE.metalDark}>
          {label}
        </text>
        {/* Zlatý odlesk po otvorení. */}
        {frame.glint > 0 && (
          <rect x={left} y={bodyTop} width={bodyWidth} height={bodyHeight} rx="8" fill="#fffbe6" opacity={(frame.glint * 0.55).toFixed(3)} />
        )}
      </g>
    </g>
  );
}

type LockTimelineProps = Omit<LockArtProps, "frame" | "shake"> & {
  animateOpen: boolean;
  shakeCount: number;
};

/** Zámok s vlastnou časovou osou otvorenia (1,1 s) a zatrasenia. */
function AnimatedLock({ animateOpen, shakeCount, ...props }: LockTimelineProps) {
  const openElapsed = useElapsed(animateOpen, LOCK_UNLOCK_SEC);
  const frame = !props.isOpen
    ? LOCK_CLOSED_FRAME
    : animateOpen
      ? getLockUnlockFrame(openElapsed)
      : LOCK_OPEN_FRAME;

  return <ShakingLock key={shakeCount} shakeCount={shakeCount} frame={frame} {...props} />;
}

/** Zatrasenie pri zlom kóde: nová časová os pri každom pokuse (key). */
function ShakingLock({ shakeCount, ...props }: Omit<LockArtProps, "shake"> & { shakeCount: number }) {
  const elapsed = useElapsed(shakeCount > 0, SHAKE_SEC);

  return <LockArt {...props} shake={getShake2DOffset(elapsed)} />;
}

/**
 * 2D truhlica (SVG) pre telefóny bez 3D: dubové drevo, mosadzné kovanie,
 * znak hry na veku aj vpredu, tri zámky s okienkami koliesok, železné spony,
 * Zlatý kľúč, otvorenie veka so svetlom nad zamatom a štvrtý útržok.
 * Časovanie, zvuky a vibrácie sú rovnaké ako v 3D. Pri vypnutých
 * animáciách sa stavy iba okamžite prepnú (zvuk a vibrácia ostávajú).
 */
export function Chest2DView({
  locks,
  lockDigits,
  stateLabels,
  selectedIndex,
  onSelectLock,
  wrongPulse,
  onHaspsReleased,
  isOpening,
  isChestOpened,
  onOpenSettled,
  fragmentImageSrc,
  fragmentPieceIndex,
  reducedMotion,
}: Chest2DViewProps) {
  const idPrefix = `chest2d-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const id = (name: string) => `${idPrefix}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  // Zámky otvorené už pri vstupe (napríklad po F5) sa neanimujú.
  const [initiallyOpen] = useState(() => locks.map((lock) => lock.isOpen));
  const areAllLocksOpen = locks.length > 0 && locks.every((lock) => lock.isOpen);
  const [wereAllOpenAtStart] = useState(() => areAllLocksOpen);
  const [wasOpenedAtStart] = useState(() => isChestOpened);

  // Spony: po poslednom zámku (1,1 s) sa povolia (0,8 s); pri F5 alebo bez animácií hneď.
  const animateHasps = areAllLocksOpen && !wereAllOpenAtStart && !reducedMotion;
  const haspElapsed = useElapsed(animateHasps, HASP_TOTAL_SEC);
  const haspFrame = !areAllLocksOpen
    ? 0
    : animateHasps
      ? getHasp2DFrame(haspElapsed)
      : 1;
  const areHaspsReleased = areAllLocksOpen && (!animateHasps || haspElapsed >= HASP_TOTAL_SEC);

  // Otvorenie (4,5 s): rovnaká časová os ako v 3D.
  const animateOpening = isOpening && !reducedMotion && !wasOpenedAtStart;
  const openingElapsed = useElapsed(animateOpening, OPENING_SEC);
  const opening: OpeningFrame = animateOpening
    ? getOpeningFrame(openingElapsed)
    : isChestOpened || isOpening
      ? OPEN_FRAME
      : CLOSED_FRAME;
  const isOpeningDone = animateOpening ? openingElapsed >= OPENING_SEC : isOpening;

  const reportedHaspsRef = useRef(false);
  const reportedOpenRef = useRef(false);
  // Meranie (krok T5b): každé vykreslenie je jedna snímka; kreslí sa iba pri pohybe.
  const rootRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLParagraphElement>(null);
  const meterRef = useRef<FrameMeter | null>(null);
  const [isDebug] = useState(isChestDebugOn);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const now = performance.now();
    meterRef.current ??= createFrameMeter(now);
    const meter = meterRef.current;
    tickFrameMeter(meter, now);
    const heapMB = readJsHeapMB();
    root.dataset.frames = String(meter.frames);
    root.dataset.fps = String(meter.fps);
    root.dataset.heapMb = heapMB === null ? "" : heapMB.toFixed(0);

    if (debugRef.current) {
      debugRef.current.textContent = `Truhlica: 2D verzia · ${formatMeterText({ fps: meter.fps, heapMB })}`;
    }
  });
  // Posledné spätné volania rodiča (časovače sa kvôli nim nespúšťajú odznova).
  const callbacksRef = useRef({ onHaspsReleased, onOpenSettled });

  useEffect(() => {
    callbacksRef.current = { onHaspsReleased, onOpenSettled };
  });

  // Zvuk a vibrácia povolenia spôn (pri F5 bez zvuku, iba oznámenie).
  useEffect(() => {
    if (!areAllLocksOpen || reportedHaspsRef.current) {
      return;
    }

    const release = () => {
      soundManager.play("chest-hasp-release");
      vibrate(HAPTIC.lock);
    };

    if (wereAllOpenAtStart) {
      reportedHaspsRef.current = true;
      callbacksRef.current.onHaspsReleased();
      return;
    }

    if (!animateHasps) {
      reportedHaspsRef.current = true;
      release();
      callbacksRef.current.onHaspsReleased();
      return;
    }

    const timer = window.setTimeout(release, HASP_DELAY_SEC * 1000);

    return () => window.clearTimeout(timer);
  }, [areAllLocksOpen, animateHasps, wereAllOpenAtStart]);

  useEffect(() => {
    if (animateHasps && areHaspsReleased && !reportedHaspsRef.current) {
      reportedHaspsRef.current = true;
      callbacksRef.current.onHaspsReleased();
    }
  }, [animateHasps, areHaspsReleased]);

  useEffect(() => {
    if (isOpening && isOpeningDone && !reportedOpenRef.current) {
      reportedOpenRef.current = true;
      callbacksRef.current.onOpenSettled();
    }
  }, [isOpening, isOpeningDone]);

  const isAnimating =
    (animateHasps && haspElapsed < HASP_TOTAL_SEC) ||
    (animateOpening && openingElapsed < OPENING_SEC);

  // Veko: zatvorené sa pri otváraní zbalí k pántom, vnútorná strana sa rozloží nahor.
  const lid = opening.lid;
  const hinge = LID_HINGE_Y;
  const lidOutTransform = `translate(0 ${hinge}) scale(1 ${(1 - lid).toFixed(3)}) translate(0 ${-hinge})`;
  const lidInTransform = `translate(0 ${hinge}) scale(1 ${lid.toFixed(3)}) translate(0 ${-hinge})`;
  const keyTurnScale = Math.max(0.25, Math.cos((opening.keyTurn * Math.PI) / 2));
  const keyDepthPercent = opening.keyDepth * 36;
  const fragmentRise = opening.fragment * 26;
  const view = CHEST_2D_VIEW;
  const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(3)}%`;

  return (
    <div
      ref={rootRef}
      data-chest-2d=""
      data-hasps={areHaspsReleased ? "released" : haspFrame > 0 ? "releasing" : "closed"}
      data-opening={isOpeningDone || (isChestOpened && !isOpening) ? "open" : animateOpening ? "opening" : "closed"}
      data-animating={isAnimating ? "1" : "0"}
      className="relative mx-auto w-full max-w-[360px]"
      style={{ aspectRatio: `${view.width} / ${view.height}` }}
    >
      <svg viewBox={`0 0 ${view.width} ${view.height}`} className="absolute inset-0 h-full w-full" aria-hidden="true" overflow="visible">
        <defs>
          <linearGradient id={id("wood")} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={PALETTE.woodLight} />
            <stop offset="1" stopColor={PALETTE.woodDark} />
          </linearGradient>
          <linearGradient id={id("wood-top")} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={PALETTE.woodLight} />
            <stop offset="1" stopColor={PALETTE.woodTop} />
          </linearGradient>
          <linearGradient id={id("metal")} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={PALETTE.metalLight} />
            <stop offset="0.5" stopColor={PALETTE.metal} />
            <stop offset="1" stopColor={PALETTE.metalDark} />
          </linearGradient>
          <radialGradient id={id("rivet")} cx="35%" cy="30%" r="70%">
            <stop offset="0" stopColor={PALETTE.metalLight} />
            <stop offset="1" stopColor={PALETTE.metalDark} />
          </radialGradient>
          <linearGradient id={id("band")} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={PALETTE.bandDark} />
            <stop offset="0.45" stopColor={PALETTE.band} />
            <stop offset="1" stopColor={PALETTE.bandDark} />
          </linearGradient>
          <linearGradient id={id("lining")} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={PALETTE.liningDark} />
            <stop offset="0.55" stopColor={PALETTE.lining} />
            <stop offset="1" stopColor={PALETTE.liningDark} />
          </linearGradient>
          <radialGradient id={id("glow")} cx="50%" cy="60%" r="50%">
            <stop offset="0" stopColor="#ffe2a8" stopOpacity="0.85" />
            <stop offset="0.5" stopColor="#ffb347" stopOpacity="0.3" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id("ray")} x1="0" x2="0" y1="1" y2="0">
            <stop offset="0" stopColor="#ffd58a" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ffd58a" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={id("shadow")} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#000" stopOpacity="0.75" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Tieň pod truhlicou. */}
        <ellipse cx="180" cy="284" rx="160" ry="13" fill={url("shadow")} />

        {/* Vnútorná strana veka: zamat v mosadznom ráme, rozloží sa nad pántmi. */}
        <g data-chest-lid="inside" transform={lidInTransform}>
          <path d="M62,90 L298,90 L286,18 L74,18 Z" fill={url("wood")} stroke={PALETTE.grain} strokeWidth="1.2" />
          <path d="M80,84 L280,84 L270,26 L90,26 Z" fill={url("lining")} />
          <path d="M80,84 L280,84 L270,26 L90,26 Z" fill="none" stroke={url("metal")} strokeWidth="2.2" />
        </g>

        {/* Otvor truhlice: drevený okraj a zamatové vnútro s lôžkom pre útržok. */}
        <path d="M70,90 L290,90 L330,152 L30,152 Z" fill={PALETTE.woodTop} />
        <path data-chest-velvet d="M80,96 L280,96 L318,148 L42,148 Z" fill={url("lining")} />
        <path d="M80,96 L280,96 L288,108 L72,108 Z" fill={PALETTE.liningDark} opacity="0.85" />
        <ellipse cx="180" cy="128" rx="58" ry="10" fill={PALETTE.liningDark} opacity="0.7" />

        {/* Svetlo zvnútra a lúč (teplé zlaté, zamat ostáva bordový). */}
        <g data-chest-light opacity={opening.light.toFixed(3)}>
          <g opacity={opening.beam.toFixed(3)}>
            <path d="M140,130 L220,130 L262,0 L98,0 Z" fill={url("ray")} />
            <path d="M118,134 L138,134 L76,14 L54,26 Z" fill={url("ray")} opacity="0.55" />
            <path d="M222,134 L242,134 L306,26 L284,14 Z" fill={url("ray")} opacity="0.55" />
          </g>
          <ellipse cx="180" cy="116" rx="150" ry="96" fill={url("glow")} />
        </g>

        {/* Prach v lúči (iba počas otvárania a nie pri vypnutých animáciách). */}
        {opening.dust > 0 &&
          DUST_2D.map(([x, y, r, delay]) => {
            const t = Math.max(0, Math.min(1, (opening.dust - delay * 0.3) / 0.7));

            return (
              <circle
                key={`${x}-${y}`}
                data-dust
                cx={x}
                cy={(y - t * 34).toFixed(1)}
                r={r}
                fill="#fff3c4"
                opacity={(Math.sin(t * Math.PI) * 0.8).toFixed(3)}
              />
            );
          })}

        {/* Predná stena: drevo, letokruhy, železné pásy, mosadzné rohy a nity. */}
        <rect x="30" y="152" width="300" height="120" rx="3" fill={url("wood")} />
        {GRAIN_BODY.map((y, index) => (
          <path key={y} d={`M34,${y} C110,${y - 3 + (index % 2) * 4} 230,${y + 3} 326,${y - 1}`} fill="none" stroke={PALETTE.grain} strokeOpacity="0.4" strokeWidth="1" />
        ))}
        <line x1="32" y1="153.5" x2="328" y2="153.5" stroke={PALETTE.woodTop} strokeWidth="1.5" opacity="0.8" />
        <rect x="134" y="152" width="10" height="120" fill={url("band")} />
        <rect x="216" y="152" width="10" height="120" fill={url("band")} />
        <path d="M30,246 L36,246 L36,266 L56,266 L56,272 L30,272 Z" fill={url("metal")} stroke={PALETTE.patina} strokeOpacity="0.6" strokeWidth="0.8" />
        <path d="M330,246 L324,246 L324,266 L304,266 L304,272 L330,272 Z" fill={url("metal")} stroke={PALETTE.patina} strokeOpacity="0.6" strokeWidth="0.8" />
        <Rivet x={33} y={258} url={url} />
        <Rivet x={48} y={269} url={url} />
        <Rivet x={327} y={258} url={url} />
        <Rivet x={312} y={269} url={url} />
        <Rivet x={139} y={262} url={url} />
        <Rivet x={221} y={262} url={url} />

        {/* Malý znak hry vpredu, nad stredným zámkom. */}
        <GameEmblem2D cx={180} cy={164} r={7} tag="front" />

        {/* Tri zámky I, II, III. */}
        {locks.map((lock, index) => (
          <AnimatedLock
            key={lock.actId}
            index={index}
            label={lock.lockLabel}
            digits={lockDigits[index] ?? []}
            isOpen={lock.isOpen}
            isNext={lock.isNext}
            isSelected={selectedIndex === index}
            animateOpen={lock.isOpen && !initiallyOpen[index] && !reducedMotion}
            shakeCount={wrongPulse && wrongPulse.lockIndex === index && !reducedMotion ? wrongPulse.count : 0}
            url={url}
          />
        ))}

        {/* Veko zvonka: vrch so znakom hry, predná hrana s kovaním kľúčovej dierky. */}
        <g data-chest-lid="outside" transform={lidOutTransform}>
          <path d="M70,90 L290,90 L330,134 L30,134 Z" fill={url("wood-top")} />
          {[100, 110, 120, 128].map((y, index) => (
            <path key={y} d={`M${60 - index * 8},${y} C140,${y - 2 - index} 220,${y + 3} ${300 + index * 8},${y}`} fill="none" stroke={PALETTE.grain} strokeOpacity="0.35" strokeWidth="1" />
          ))}
          <path d="M134,134 L144,134 L152,90 L144,90 Z" fill={url("band")} />
          <path d="M216,134 L226,134 L216,90 L208,90 Z" fill={url("band")} />
          {/* Veľký znak hry na veku. */}
          <GameEmblem2D cx={180} cy={112} r={14} tag="lid" />
          <rect x="30" y="134" width="300" height="18" fill={url("wood")} />
          <line x1="30" y1="134.5" x2="330" y2="134.5" stroke={PALETTE.metalLight} strokeOpacity="0.35" strokeWidth="1" />
          <path d="M30,134 L56,134 L56,139 L36,139 L36,152 L30,152 Z" fill={url("metal")} />
          <path d="M330,134 L304,134 L304,139 L324,139 L324,152 L330,152 Z" fill={url("metal")} />
          {/* Kovanie s kľúčovou dierkou. */}
          <g data-keyhole>
            <rect x={KEYHOLE_2D.x - 13} y="135" width="26" height="17" rx="3" fill={url("metal")} stroke={PALETTE.metalDark} strokeWidth="0.8" />
            <circle cx={KEYHOLE_2D.x} cy={KEYHOLE_2D.y - 1.5} r="2.6" fill="#120a04" />
            <path d={`M${KEYHOLE_2D.x - 1.6},${KEYHOLE_2D.y - 1} L${KEYHOLE_2D.x - 2.6},${KEYHOLE_2D.y + 6} H${KEYHOLE_2D.x + 2.6} L${KEYHOLE_2D.x + 1.6},${KEYHOLE_2D.y - 1} Z`} fill="#120a04" />
          </g>
          {/* Prúžok svetla zo škáry, keď sa veko prvýkrát pohne. */}
          <rect x="40" y="149" width="280" height="3" fill="#ffd58a" opacity={(opening.crack * (1 - lid) * 0.9).toFixed(3)} />
        </g>

        {/* Železné spony z veka na telo: po treťom zámku sa odklopia nahor. */}
        {HASPS_2D.xs.map((x, index) => {
          const direction = index === 0 ? -1 : 1;

          return (
            <g
              key={x}
              data-hasp-2d={index}
              transform={`rotate(${(direction * haspFrame * 100).toFixed(2)} ${x} ${HASPS_2D.top + 4})`}
              opacity={(1 - lid).toFixed(3)}
            >
              <rect x={x - HASPS_2D.width / 2} y={HASPS_2D.top} width={HASPS_2D.width} height={HASPS_2D.bottom - HASPS_2D.top} rx="3" fill={url("band")} stroke={PALETTE.bandDark} strokeWidth="1" />
              <circle cx={x} cy={HASPS_2D.top + 5} r="2.6" fill={url("rivet")} />
              <rect x={x - 5} y={HASPS_2D.bottom - 14} width="10" height="8" rx="2" fill="#120a04" opacity="0.7" />
            </g>
          );
        })}
      </svg>

      {/* Zlatý kľúč pri kľúčovej dierke: zasunie sa a otočí. */}
      {opening.keyVisible && lid < 0.5 && (
        <div
          data-chest-key=""
          aria-hidden="true"
          className="pointer-events-none absolute [&_svg]:h-auto [&_svg]:w-full"
          style={{
            left: pct(KEYHOLE_2D.x - 86, view.width),
            top: pct(KEYHOLE_2D.y - 22, view.height),
            width: pct(88, view.width),
            transform: `translateX(${(-keyDepthPercent).toFixed(2)}%) scaleY(${keyTurnScale.toFixed(3)})`,
            filter: opening.keyGlint > 0 ? `brightness(${(1 + opening.keyGlint * 0.6).toFixed(2)})` : undefined,
          }}
          dangerouslySetInnerHTML={{
            __html: getGoldenKeySvg({ idPrefix: `${idPrefix}-key`, pieceNotches: [] }),
          }}
        />
      )}

      {/* Štvrtý útržok fotografie: leží na zamate a po otvorení sa vznesie. */}
      {fragmentImageSrc && opening.fragment > 0 && (
        <div
          data-chest-fragment=""
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: pct(130, view.width),
            top: pct(70, view.height),
            width: pct(100, view.width),
            transform: `translateY(${(-fragmentRise).toFixed(2)}%) rotate(-4deg)`,
            opacity: Math.min(1, opening.fragment * 2).toFixed(3),
            filter: opening.fragmentGlint > 0 ? `brightness(${(1 + opening.fragmentGlint * 0.5).toFixed(2)})` : undefined,
          }}
        >
          <PhotoPieceArt imageSrc={fragmentImageSrc} index={fragmentPieceIndex} view="crop" className="block h-auto w-full" />
        </div>
      )}

      {/* Ťukacie plochy zámkov (posunú obrazovku ku kolieskam pod truhlicou). */}
      {!isChestOpened &&
        !isOpening &&
        locks.map((lock, index) => (
          <button
            key={lock.actId}
            type="button"
            data-lock-button={index}
            aria-label={`Zámok ${lock.lockLabel} – ${
              lock.isOpen ? stateLabels.open : lock.isNext ? stateLabels.next : stateLabels.closed
            }`}
            onClick={() => onSelectLock(index)}
            className="absolute rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
            style={{
              left: pct(LOCK_2D.centers[index] - LOCK_HIT_2D.width / 2, view.width),
              top: pct(LOCK_HIT_2D.top, view.height),
              width: pct(LOCK_HIT_2D.width, view.width),
              height: pct(LOCK_HIT_2D.height, view.height),
            }}
          />
        ))}

      {/* Ladiaci text pre skúšku na mobile: iba s ?ladenie=1 v adrese. */}
      {isDebug && (
        <p
          ref={debugRef}
          data-chest-debug=""
          className="absolute inset-x-0 -bottom-6 text-center text-[11px] leading-4 text-slate-500"
        />
      )}
    </div>
  );
}
