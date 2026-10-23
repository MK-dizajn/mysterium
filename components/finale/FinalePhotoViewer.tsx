"use client";

import {
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import type { FinalePhoto } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";

type FinalePhotoViewerProps = {
  photo: FinalePhoto;
  /** Útržky, ktoré hráč naozaj má (id z inventára). */
  ownedFragmentIds: string[];
  /** Útržky sú zosunuté do jednej fotografie (inak ležia od seba). */
  isTogether: boolean;
  /** Fotografia je hotová: dá sa približovať a otáčať. */
  isReady: boolean;
  /** Obsah medzi fotografiou a tlačidlami (napríklad popis). */
  caption?: ReactNode;
};

const ZOOM_STEPS = [1, 1.5, 2, 3];
const MAX_ZOOM = 3;
const TAP_ZOOM = 2;
/** Posun do tejto vzdialenosti (px) sa ešte berie ako ťuknutie. */
const TAP_SLOP = 6;

type Point = [number, number];

/**
 * Roztrhnuté hrany: zvislá a vodorovná trhlina cez stred fotografie
 * (v percentách). Susedné útržky zdieľajú tie isté body, takže do seba
 * presne zapadnú.
 */
const VERTICAL_TOP: Point[] = [
  [51.5, 0], [49, 5], [52, 10], [50.5, 15], [48, 20], [51, 25],
  [49.5, 30], [52.5, 35], [49, 40], [51, 45], [50, 50],
];
const VERTICAL_BOTTOM: Point[] = [
  [50, 50], [48.5, 55], [51.5, 60], [49, 65], [52, 70], [50, 75],
  [47.5, 80], [51, 85], [49, 90], [52, 95], [50.5, 100],
];
const HORIZONTAL_LEFT: Point[] = [
  [0, 48.5], [5, 51.5], [10, 49], [15, 52], [20, 50], [25, 47.5],
  [30, 51], [35, 49], [40, 52.5], [45, 49.5], [50, 50],
];
const HORIZONTAL_RIGHT: Point[] = [
  [50, 50], [55, 52], [60, 49], [65, 51.5], [70, 48], [75, 51],
  [80, 49.5], [85, 52], [90, 48.5], [95, 51], [100, 49.5],
];

const reversed = (points: Point[]) => [...points].reverse();

function toClipPath(points: Point[]) {
  return `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(", ")})`;
}

const PIECE_SHAPES = [
  // 1: vľavo hore
  [[0, 0] as Point, ...VERTICAL_TOP, ...reversed(HORIZONTAL_LEFT)],
  // 2: vpravo hore
  [...reversed(VERTICAL_TOP), [100, 0] as Point, ...reversed(HORIZONTAL_RIGHT)],
  // 3: vľavo dole
  [...HORIZONTAL_LEFT, ...VERTICAL_BOTTOM, [0, 100] as Point],
  // 4: vpravo dole
  [...HORIZONTAL_RIGHT, [100, 100] as Point, ...reversed(VERTICAL_BOTTOM)],
].map(toClipPath);

/** Kam sú útržky rozhodené pred zložením. */
const SCATTER = [
  "translate(-14%, -10%) rotate(-6deg)",
  "translate(12%, -12%) rotate(5deg)",
  "translate(-10%, 12%) rotate(4deg)",
  "translate(14%, 10%) rotate(-5deg)",
];

/**
 * Historická fotografia zo štyroch útržkov: priblíženie (tlačidlá, ťuknutie,
 * štipnutie), posúvanie a otočenie na zadnú stranu. Ak sa obrázok nenačíta,
 * ukáže sa náhrada s popisom.
 */
export function FinalePhotoViewer({
  photo,
  ownedFragmentIds,
  isTogether,
  isReady,
  caption,
}: FinalePhotoViewerProps) {
  const [hasImageFailed, setHasImageFailed] = useState(false);
  const [isBackSide, setIsBackSide] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState<Point>([0, 0]);
  const frameRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const gestureRef = useRef<{
    start: Point;
    moved: boolean;
    pinchDistance: number | null;
    pinchZoom: number;
  } | null>(null);

  function clampOffset([x, y]: Point, scale: number): Point {
    const frame = frameRef.current;

    if (!frame || scale <= 1) {
      return [0, 0];
    }

    const maxX = ((scale - 1) * frame.clientWidth) / 2;
    const maxY = ((scale - 1) * frame.clientHeight) / 2;

    return [
      Math.max(-maxX, Math.min(maxX, x)),
      Math.max(-maxY, Math.min(maxY, y)),
    ];
  }

  function applyZoom(nextZoom: number, focus?: Point) {
    const scale = Math.max(1, Math.min(MAX_ZOOM, nextZoom));
    // Bod pod prstom ostane na mieste: posun = bod × (1 − nové / staré priblíženie).
    const [fx, fy] = focus ?? [0, 0];
    const ratio = scale / zoom;
    const next: Point = [
      fx - (fx - offset[0]) * ratio,
      fy - (fy - offset[1]) * ratio,
    ];

    setZoom(scale);
    setOffset(clampOffset(next, scale));
  }

  function stepZoom(direction: 1 | -1) {
    const current = ZOOM_STEPS.findIndex((step) => step >= zoom - 0.01);
    const index = Math.max(
      0,
      Math.min(ZOOM_STEPS.length - 1, (current === -1 ? 0 : current) + direction)
    );

    applyZoom(ZOOM_STEPS[index]);
  }

  /** Poloha ukazovateľa voči stredu fotografie. */
  function fromCenter(event: PointerEvent<HTMLDivElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect();

    return [
      event.clientX - rect.left - rect.width / 2,
      event.clientY - rect.top - rect.height / 2,
    ];
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!isReady || isBackSide) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, [event.clientX, event.clientY]);

    const points = [...pointersRef.current.values()];

    gestureRef.current = {
      start: [event.clientX, event.clientY],
      moved: points.length > 1,
      pinchDistance:
        points.length === 2
          ? Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1])
          : null,
      pinchZoom: zoom,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    const previous = pointersRef.current.get(event.pointerId);

    if (!gesture || !previous) {
      return;
    }

    pointersRef.current.set(event.pointerId, [event.clientX, event.clientY]);
    const points = [...pointersRef.current.values()];

    if (points.length === 2 && gesture.pinchDistance) {
      // Štipnutie dvoma prstami.
      const distance = Math.hypot(
        points[0][0] - points[1][0],
        points[0][1] - points[1][1]
      );
      const scale = Math.max(
        1,
        Math.min(MAX_ZOOM, (gesture.pinchZoom * distance) / gesture.pinchDistance)
      );

      setZoom(scale);
      setOffset((current) => clampOffset(current, scale));
      return;
    }

    if (
      Math.hypot(
        event.clientX - gesture.start[0],
        event.clientY - gesture.start[1]
      ) > TAP_SLOP
    ) {
      gesture.moved = true;
    }

    // Posúvanie priblíženej fotografie.
    if (zoom > 1) {
      const dx = event.clientX - previous[0];
      const dy = event.clientY - previous[1];

      setOffset((current) => clampOffset([current[0] + dx, current[1] + dy], zoom));
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    pointersRef.current.delete(event.pointerId);

    if (pointersRef.current.size > 0) {
      return;
    }

    gestureRef.current = null;

    // Ťuknutie: priblížiť na mieste ťuknutia, ďalšie ťuknutie vráti späť.
    if (gesture && !gesture.moved) {
      if (zoom > 1) {
        setZoom(1);
        setOffset([0, 0]);
      } else {
        applyZoom(TAP_ZOOM, fromCenter(event));
      }
    }
  }

  function turn() {
    setIsBackSide((current) => !current);
    setZoom(1);
    setOffset([0, 0]);
  }

  const owned = photo.fragmentIds.map((id) => ownedFragmentIds.includes(id));

  return (
    <>
      <div className="[perspective:1200px]">
        <div
          className={`relative aspect-[4/3] w-full transition-transform duration-[600ms] ease-in-out [transform-style:preserve-3d] motion-reduce:transition-none ${
            isBackSide ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Predná strana: útržky alebo zložená fotografia */}
          <div
            ref={frameRef}
            role="img"
            aria-label={photo.imageAlt}
            aria-hidden={isBackSide}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute inset-0 overflow-hidden rounded-md bg-[#1a120a] [backface-visibility:hidden] ${
              isReady ? "cursor-zoom-in touch-none" : ""
            }`}
          >
            {hasImageFailed ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#d9c29a] to-[#8f7349] p-6 text-center font-serif text-[16px] italic leading-7 text-[#3b2a12]">
                {photo.imageAlt}
              </div>
            ) : (
              <div
                className="h-full w-full"
                style={{
                  transform: `translate(${offset[0]}px, ${offset[1]}px) scale(${zoom})`,
                }}
              >
                {PIECE_SHAPES.map((clipPath, index) =>
                  owned[index] ? (
                    <div
                      key={clipPath}
                      aria-hidden="true"
                      className="absolute inset-0 transition-transform duration-[1200ms] ease-out [filter:drop-shadow(0_0_1px_#f4e6c8)_drop-shadow(0_4px_6px_rgba(0,0,0,0.5))] motion-reduce:transition-none"
                      style={{
                        transform: isTogether ? "none" : SCATTER[index],
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- obrázok sa reže na útržky, súbor sa dá vymeniť v dátach */}
                      <img
                        src={photo.imageSrc}
                        alt=""
                        draggable={false}
                        onError={() => setHasImageFailed(true)}
                        className="h-full w-full select-none object-cover"
                        style={{ clipPath }}
                      />
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* Zadná strana: poznámka pátrača */}
          <div
            aria-hidden={!isBackSide}
            className="absolute inset-0 flex flex-col justify-center gap-3 rounded-md bg-gradient-to-br from-[#efe2c2] via-[#e2cfa6] to-[#cdb284] px-6 py-5 text-left font-serif text-[16px] italic leading-7 text-[#3b2a12] shadow-inner [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            {photo.backLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {isReady ? (isBackSide ? photo.backSideLabel : photo.frontSideLabel) : ""}
      </p>

      {isReady && (
        <>
          {caption}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => stepZoom(-1)}
              disabled={isBackSide || zoom <= 1}
              aria-label={photo.zoomOutLabel}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-600 bg-slate-900 text-2xl font-black text-slate-100 transition hover:border-amber-300/40 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              −
            </button>

            <button
              type="button"
              onClick={() => stepZoom(1)}
              disabled={isBackSide || zoom >= MAX_ZOOM}
              aria-label={photo.zoomInLabel}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-600 bg-slate-900 text-2xl font-black text-slate-100 transition hover:border-amber-300/40 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
            >
              +
            </button>

            <ActionButton
              variant="secondary"
              onClick={turn}
              className="motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {photo.turnLabel}
            </ActionButton>
          </div>
        </>
      )}
    </>
  );
}
