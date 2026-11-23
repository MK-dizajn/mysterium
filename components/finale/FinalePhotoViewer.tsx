"use client";

import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useRef,
  useState,
} from "react";
import type { FinalePhoto } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { getPieceViewBox, PHOTO_VIEW, PhotoBackArt, PhotoPieceArt } from "./PhotoPiece";
import { getBackPlaceBox, PHOTO_PIECE_POINTS } from "./photoPieces";

/** Riadok s miestom na rube (spozná sa podľa začiatku „Miesto:“). */
const PLACE_PREFIX = "Miesto:";

/**
 * Pátračova poznámka na rube v súradniciach celej fotografie (písmo
 * v cqw – rovnaká veľkosť voči kartónu aj pri prezretí jedného útržku):
 * prvé riadky hore cez celú šírku (nad švami), „Miesto: …“ po slovách
 * v bezpečnom obdĺžniku rubu útržku z truhlice, podpis dole vpravo.
 */
function PhotoBackNote({ lines }: { lines: string[] }) {
  const placeLine = lines.find((line) => line.startsWith(PLACE_PREFIX));
  const signature = lines.find((line) => line.startsWith("—"));
  const topLines = lines.filter((line) => line !== placeLine && line !== signature);
  const box = getBackPlaceBox();
  const noteClass = "font-serif italic text-[#3b2a12]";

  // Bez riadku „Miesto:“ (iná kapitola) – celá poznámka ako jeden blok.
  if (!placeLine) {
    return (
      <div className={`absolute inset-0 flex flex-col justify-center gap-[2cqw] px-[6cqw] text-[4.2cqw] leading-[6.4cqw] ${noteClass}`}>
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    );
  }

  const placeWords = [
    PLACE_PREFIX,
    ...placeLine.slice(PLACE_PREFIX.length).trim().split(/\s+/),
  ];

  return (
    <>
      <div className={`absolute inset-x-[6%] top-[6%] space-y-[1.5cqw] text-[4.1cqw] leading-[6cqw] ${noteClass}`}>
        {topLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p
        data-back-place
        data-safe-box={`${box.left},${box.right},${box.top},${box.bottom}`}
        className={`absolute text-center text-[4.6cqw] font-bold leading-[6.4cqw] ${noteClass}`}
        style={{
          left: `${box.left}%`,
          width: `${box.right - box.left}%`,
          top: `${box.top}%`,
        }}
      >
        {placeWords.map((word, index) => (
          <span key={`${word}-${index}`} data-back-place-line className="block">
            {word}
          </span>
        ))}
      </p>
      {signature && (
        <p className={`absolute bottom-[7%] right-[7%] text-[4.1cqw] ${noteClass}`}>
          {signature}
        </p>
      )}
    </>
  );
}

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
  /** animated = útržky priletia jeden po druhom, fotografia sa vyvolá. */
  assembly?: "animated" | "none";
  /** Ťuknutie počas skladania (preskočí ho). */
  onSkip?: () => void;
  /** Prezretie jedného útržku (0 až 3): iba on, orezaný a zväčšený. */
  cropPieceIndex?: number;
  /** „Otočiť“ jemne bliká, kým hráč fotografiu prvýkrát neotočí. */
  highlightTurn?: boolean;
};

/** Kedy priletí prvý útržok a odstup medzi útržkami (s). */
export const PHOTO_FLY_START_S = 0.6;
export const PHOTO_FLY_STEP_S = 0.4;
export const PHOTO_FLY_S = 0.5;
/** Celé skladanie: priletenie, vyvolanie a pruh svetla (ms). */
export const PHOTO_ASSEMBLY_MS = 3900;

const ZOOM_STEPS = [1, 1.5, 2, 3];
const MAX_ZOOM = 3;
const TAP_ZOOM = 2;
/** Posun do tejto vzdialenosti (px) sa ešte berie ako ťuknutie. */
const TAP_SLOP = 6;

type Point = [number, number];

/** Kam sú útržky rozhodené pred zložením. */
const SCATTER = [
  "translate(-16%, 6%) rotate(-8deg)",
  "translate(4%, -16%) rotate(6deg)",
  "translate(16%, 4%) rotate(7deg)",
  "translate(-4%, 18%) rotate(-5deg)",
];

/**
 * Rub jedného útržku: na zadnej strane je zrkadlový tvar (útržok vľavo
 * má rub vpravo). Vráti orezanie a posun celej poznámky v percentách.
 */
function getCroppedBack(index: number) {
  const box = getPieceViewBox(index);
  const mirroredX = PHOTO_VIEW.width - (box.x + box.width);
  const points = PHOTO_PIECE_POINTS[index].map(([x, y]) => {
    const px = PHOTO_VIEW.width - (x / 100) * PHOTO_VIEW.width;
    const py = (y / 100) * PHOTO_VIEW.height;

    return `${(((px - mirroredX) / box.width) * 100).toFixed(2)}% ${(((py - box.y) / box.height) * 100).toFixed(2)}%`;
  });

  return {
    clipPath: `polygon(${points.join(", ")})`,
    inner: {
      width: `${(PHOTO_VIEW.width / box.width) * 100}%`,
      height: `${(PHOTO_VIEW.height / box.height) * 100}%`,
      left: `${(-mirroredX / box.width) * 100}%`,
      top: `${(-box.y / box.height) * 100}%`,
    },
  };
}

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
  assembly = "none",
  onSkip,
  cropPieceIndex,
  highlightTurn = false,
}: FinalePhotoViewerProps) {
  const [hasImageFailed, setHasImageFailed] = useState(false);
  const [isBackSide, setIsBackSide] = useState(false);
  const [hasTurned, setHasTurned] = useState(false);
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
    if (!isReady) {
      // Ťuknutie počas skladania: hneď celá fotografia.
      onSkip?.();
      return;
    }

    if (isBackSide) {
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
    setHasTurned(true);
    setZoom(1);
    setOffset([0, 0]);
  }

  const isCropped = cropPieceIndex !== undefined;
  const pieceIndexes = isCropped
    ? [cropPieceIndex]
    : photo.fragmentIds
        .map((id, index) => (ownedFragmentIds.includes(id) ? index : -1))
        .filter((index) => index >= 0);
  const cropBox = isCropped ? getPieceViewBox(cropPieceIndex) : null;
  const croppedBack = isCropped ? getCroppedBack(cropPieceIndex) : null;
  const isAnimated = assembly === "animated";
  // Rub: vždy celá fotografia (všetky útržky), pri prezretí jedného útržku iba on.
  const backIndexes = isCropped
    ? [cropPieceIndex]
    : photo.fragmentIds.map((_id, index) => index);
  const backNote = <PhotoBackNote lines={photo.backLines} />;

  return (
    <>
      <div
        className="mx-auto [perspective:1200px]"
        data-photo-viewer
        data-crop={isCropped ? cropPieceIndex + 1 : undefined}
        // Úzky útržok (napríklad celé krídlo) najviac na 60 % výšky obrazovky.
        style={cropBox ? { maxWidth: `calc(60dvh * ${cropBox.width / cropBox.height})` } : undefined}
      >
        <div
          className={`relative w-full transition-transform duration-[600ms] ease-in-out [transform-style:preserve-3d] motion-reduce:transition-none ${
            isBackSide ? "[transform:rotateY(180deg)]" : ""
          }`}
          style={{
            aspectRatio: cropBox
              ? `${cropBox.width} / ${cropBox.height}`
              : `${PHOTO_VIEW.width} / ${PHOTO_VIEW.height}`,
          }}
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
            className={`absolute inset-0 overflow-hidden rounded-md [backface-visibility:hidden] ${
              isCropped ? "" : "bg-[#1a120a]"
            } ${isReady ? "cursor-zoom-in touch-none" : "cursor-pointer"}`}
          >
            {hasImageFailed ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#d9c29a] to-[#8f7349] p-6 text-center font-serif text-[16px] italic leading-7 text-[#3b2a12]">
                {photo.imageAlt}
              </div>
            ) : (
              <div
                data-photo-zoom
                className="h-full w-full"
                style={{
                  transform: `translate(${offset[0]}px, ${offset[1]}px) scale(${zoom})`,
                }}
              >
                {pieceIndexes.map((index, order) => (
                  <div
                    key={index}
                    data-photo-piece-layer={index + 1}
                    aria-hidden="true"
                    className={`absolute inset-0 ${isAnimated ? "photo-piece-fly" : ""}`}
                    style={
                      {
                        "--photo-from": SCATTER[index],
                        transform:
                          isAnimated || isTogether || isCropped ? undefined : SCATTER[index],
                        animationDelay: isAnimated
                          ? `${PHOTO_FLY_START_S + order * PHOTO_FLY_STEP_S}s`
                          : undefined,
                        animationDuration: isAnimated ? `${PHOTO_FLY_S}s` : undefined,
                      } as CSSProperties
                    }
                  >
                    <PhotoPieceArt
                      imageSrc={photo.imageSrc}
                      index={index}
                      view={isCropped ? "crop" : "full"}
                      className="block h-full w-full select-none"
                      onImageError={() => setHasImageFailed(true)}
                    />
                  </div>
                ))}

                {/* Fotografia sa „vyvolá“ a prejde cez ňu pruh svetla. */}
                {isAnimated && (
                  <>
                    <div data-photo-develop aria-hidden="true" className="photo-develop pointer-events-none absolute inset-0 bg-[#efe3c4]" />
                    <div data-photo-sweep aria-hidden="true" className="photo-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#fff6dc]/55 to-transparent" />
                  </>
                )}
              </div>
            )}
          </div>

          {/*
            Zadná strana z útržkov (zrkadlovo k prednej): roztrhnuté okraje,
            odtiene kartónu, tieň v škárach. Poznámka je nad útržkami; riadok
            s miestom leží celý v rube útržku z truhlice (žiadny šev ho nepretne).
          */}
          <div
            data-photo-back
            aria-hidden={!isBackSide}
            className="absolute inset-0 overflow-hidden rounded-md [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <PhotoBackArt
              indexes={backIndexes}
              cropIndex={cropPieceIndex}
              backImageSrc={photo.backImageSrc}
              className="absolute inset-0 block h-full w-full"
            />
            {croppedBack ? (
              <div data-back-clip className="absolute inset-0" style={{ clipPath: croppedBack.clipPath }}>
                <div className="absolute [container-type:inline-size]" style={croppedBack.inner}>
                  {backNote}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 [container-type:inline-size]">{backNote}</div>
            )}
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
              className={`motion-reduce:transition-none motion-reduce:active:scale-100 ${
                highlightTurn && !hasTurned ? "motion-safe:animate-pulse" : ""
              }`}
            >
              {photo.turnLabel}
            </ActionButton>
          </div>
        </>
      )}
    </>
  );
}
