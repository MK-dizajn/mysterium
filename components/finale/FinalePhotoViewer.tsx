"use client";

import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { FinalePhoto } from "../../types/game";
import { ActionButton } from "../ui/ActionButton";
import { getPieceViewBox, PHOTO_VIEW, PhotoBackArt, PhotoPieceArt } from "./PhotoPiece";
import { BACK_SLOTS, getBackPlaceBox, getBackSafeBox, PHOTO_PIECE_POINTS } from "./photoPieces";

/** Riadok s miestom na rube (spozná sa podľa začiatku „Miesto:“). */
const PLACE_PREFIX = "Miesto:";

/*
 * ===== Poznámka na rube po kusoch (oprava 1) =====
 * Žiadna trhlina nesmie pretnúť žiadny text: poznámka sa po celých slovách
 * rozloží do bezpečných obdĺžnikov jednotlivých kusov (BACK_SLOTS). Text sa
 * nemení, iba sa inak zalomí; veta pokračuje z kusu na kus. Meria sa
 * skutočným písmom; jednotky: šírka kartónu = 1000, výška = 750 (písmo
 * v cqw – rovnaké rozloženie na každom telefóne aj pri prezretí jedného kusu).
 */
const BACK_FONT = 'Georgia, "Times New Roman", serif';
const CARD_UNITS = { width: 1000, height: 750 };
/** Veľkosti písma, ktoré sa skúšajú (39 = aspoň 11 px aj na 320 px). */
const BACK_FONT_SIZES = [42, 41, 40, 39];
const BACK_LINE_HEIGHT = 1.42;
/** Rezerva šírky voči meraniu (písmo v prehliadači môže byť o kúsok širšie). */
const MEASURE_RESERVE = 1.08;

type BackBox = { left: number; right: number; top: number; bottom: number };
type BackLine = {
  text: string;
  piece: number;
  box: BackBox;
  /** Horný okraj riadku v jednotkách kartónu. */
  y: number;
  align: "left" | "center" | "right";
  bold: boolean;
  place: boolean;
};

type Measure = (text: string, size: number, bold: boolean) => number;

function createMeasure(): Measure | null {
  if (typeof document === "undefined") {
    return null;
  }

  const context = document.createElement("canvas").getContext("2d");

  if (!context) {
    return null;
  }

  return (text, size, bold) => {
    context.font = `italic ${bold ? "bold " : ""}${size}px ${BACK_FONT}`;

    return context.measureText(text).width * MEASURE_RESERVE;
  };
}

type Flow = {
  words: string[];
  slots: { piece: number; box: BackBox }[];
  align: BackLine["align"];
  bold?: boolean;
  /** Každé slovo na vlastnom riadku (miesto). */
  wordPerLine?: boolean;
  place?: boolean;
};

/** Rozloží slová do obdĺžnikov po riadkoch; null, ak sa nezmestia. */
function flowWords(flow: Flow, size: number, measure: Measure): BackLine[] | null {
  const lineHeight = size * BACK_LINE_HEIGHT;
  const lines: BackLine[] = [];
  let slotIndex = 0;
  let y = 0;
  let current = "";

  const slotTop = () => (flow.slots[slotIndex].box.top / 100) * CARD_UNITS.height;
  const slotBottom = () => (flow.slots[slotIndex].box.bottom / 100) * CARD_UNITS.height;
  const slotWidth = () => {
    const { left, right } = flow.slots[slotIndex].box;

    return ((right - left) / 100) * CARD_UNITS.width;
  };

  y = slotTop();

  const pushLine = () => {
    // Nový obdĺžnik, ak sa riadok do tohto nezmestí na výšku.
    while (y + lineHeight > slotBottom()) {
      slotIndex += 1;

      if (slotIndex >= flow.slots.length) {
        return false;
      }

      y = slotTop();
    }

    const slot = flow.slots[slotIndex];
    lines.push({
      text: current,
      piece: slot.piece,
      box: slot.box,
      y,
      align: flow.align,
      bold: Boolean(flow.bold),
      place: Boolean(flow.place),
    });
    y += lineHeight;
    current = "";

    return true;
  };

  for (const word of flow.words) {
    const candidate = current ? `${current} ${word}` : word;

    if (!flow.wordPerLine && measure(candidate, size, Boolean(flow.bold)) <= slotWidth()) {
      current = candidate;
      continue;
    }

    if (current && !pushLine()) {
      return null;
    }

    current = word;

    // Slovo samo širšie ako obdĺžnik: skúsiť ďalší obdĺžnik, inak sa nezmestí.
    while (measure(current, size, Boolean(flow.bold)) > slotWidth()) {
      slotIndex += 1;

      if (slotIndex >= flow.slots.length) {
        return null;
      }

      y = slotTop();
    }
  }

  if (current && !pushLine()) {
    return null;
  }

  return lines;
}

/** Celé rozloženie poznámky: najväčšie písmo, pri ktorom sa všetko zmestí. */
function layoutBackNote(lines: string[], measure: Measure) {
  const slot = (role: (typeof BACK_SLOTS)[number]["role"]) => {
    const definition = BACK_SLOTS.find((item) => item.role === role)!;

    return {
      piece: definition.piece,
      box: getBackSafeBox(definition.piece, definition.top, definition.bottom),
    };
  };
  const words = (line: string | undefined) => (line ? line.split(/\s+/).filter(Boolean) : []);
  const placeLine = lines.find((line) => line.startsWith(PLACE_PREFIX));
  const signature = lines.find((line) => line.startsWith("—"));
  const notes = lines.filter((line) => line !== placeLine && line !== signature);
  const flows: Flow[] = [];

  if (placeLine && notes.length === 2) {
    flows.push(
      { words: words(notes[0]), slots: [slot("first")], align: "left" },
      { words: words(notes[1]), slots: [slot("secondStart"), slot("secondRest")], align: "left" },
      { words: words(placeLine), slots: [slot("place")], align: "center", bold: true, wordPerLine: true, place: true }
    );
  } else {
    // Iná poznámka (iná kapitola): všetok text postupne cez všetky kusy.
    flows.push({
      words: words(notes.concat(placeLine ?? []).join(" ")),
      slots: [slot("first"), slot("secondStart"), slot("secondRest"), slot("place")],
      align: "left",
    });
  }

  if (signature) {
    flows.push({ words: words(signature), slots: [slot("signature")], align: "right" });
  }

  for (const size of BACK_FONT_SIZES) {
    const result: BackLine[] = [];
    let fits = true;

    for (const flow of flows) {
      const flowed = flowWords(flow, size, measure);

      if (!flowed) {
        fits = false;
        break;
      }

      result.push(...flowed);
    }

    if (fits || size === BACK_FONT_SIZES[BACK_FONT_SIZES.length - 1]) {
      return { size, lines: result };
    }
  }

  return { size: BACK_FONT_SIZES[BACK_FONT_SIZES.length - 1], lines: [] };
}

const subscribeNothing = () => () => {};

/**
 * Pátračova poznámka na rube v súradniciach celej fotografie: každý riadok
 * leží celý v bezpečnom obdĺžniku jedného kusu (žiadna trhlina ho nepretne).
 */
function PhotoBackNote({ lines }: { lines: string[] }) {
  // Meria sa až v prehliadači (na serveri sa poznámka ešte nekreslí).
  const isClient = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const layout = useMemo(() => {
    const measure = isClient ? createMeasure() : null;

    return measure ? layoutBackNote(lines, measure) : null;
  }, [isClient, lines]);

  if (!layout) {
    return null;
  }

  const fontSize = `${layout.size / 10}cqw`;
  const lineHeight = `${(layout.size * BACK_LINE_HEIGHT) / 10}cqw`;
  const placeBox = getBackPlaceBox();

  const renderLine = (line: BackLine, order: number) => (
    <span
      key={`${order}-${line.text}`}
      data-back-line
      data-back-place-line={line.place ? "" : undefined}
      data-order={order}
      data-piece={line.piece + 1}
      data-safe-box={`${line.box.left},${line.box.right},${line.box.top},${line.box.bottom}`}
      className={`absolute block whitespace-nowrap italic text-[#3b2a12] ${line.bold ? "font-bold" : ""}`}
      style={{
        fontFamily: BACK_FONT,
        fontSize,
        lineHeight,
        left: `${line.box.left}%`,
        width: `${line.box.right - line.box.left}%`,
        top: `${(line.y / CARD_UNITS.height) * 100}%`,
        textAlign: line.align,
      }}
    >
      {line.text}
    </span>
  );

  return (
    <>
      {layout.lines.map((line, order) => (line.place ? null : renderLine(line, order)))}
      <div
        data-back-place
        data-safe-box={`${placeBox.left},${placeBox.right},${placeBox.top},${placeBox.bottom}`}
        className="absolute inset-0"
      >
        {layout.lines.map((line, order) => (line.place ? renderLine(line, order) : null))}
      </div>
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
                <div data-back-card className="absolute [container-type:inline-size]" style={croppedBack.inner}>
                  {backNote}
                </div>
              </div>
            ) : (
              <div data-back-card className="absolute inset-0 [container-type:inline-size]">{backNote}</div>
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
