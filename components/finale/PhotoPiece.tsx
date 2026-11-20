"use client";

import { useId, useSyncExternalStore } from "react";
import { getPieceBox, PHOTO_CARD, PHOTO_PIECE_POINTS } from "./photoPieces";

/** Kresba celej fotografie s kartónom (jednotky SVG, pomer 4 : 3). */
export const PHOTO_VIEW = { width: 400, height: 300 };

const toView = ([x, y]: [number, number]) =>
  `${((x / 100) * PHOTO_VIEW.width).toFixed(2)},${((y / 100) * PHOTO_VIEW.height).toFixed(2)}`;

/** Obrys útržku ako cesta SVG (v jednotkách kresby). */
export function getPiecePath(index: number) {
  return `M${PHOTO_PIECE_POINTS[index].map(toView).join(" L")} Z`;
}

/** Ohraničenie útržku v jednotkách kresby (na orezanie zmenšeniny). */
export function getPieceViewBox(index: number, padding = 4) {
  const box = getPieceBox(index);
  const x = (box.left / 100) * PHOTO_VIEW.width - padding;
  const y = (box.top / 100) * PHOTO_VIEW.height - padding;
  const width = (box.width / 100) * PHOTO_VIEW.width + padding * 2;
  const height = (box.height / 100) * PHOTO_VIEW.height + padding * 2;

  return { x, y, width, height, text: `${x} ${y} ${width} ${height}` };
}

/**
 * Zrnitosť starej fotografie: malá dlaždica šumu nakreslená raz
 * v prehliadači (nič sa nesťahuje). Na serveri zatiaľ bez zrna.
 */
let grainUrl: string | null = null;

function getGrainUrl() {
  if (grainUrl !== null || typeof document === "undefined") {
    return grainUrl;
  }

  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const image = context.createImageData(size, size);

  for (let index = 0; index < image.data.length; index += 4) {
    const value = Math.random() < 0.5 ? 40 : 245;

    image.data[index] = value;
    image.data[index + 1] = value * 0.92;
    image.data[index + 2] = value * 0.8;
    image.data[index + 3] = 18 + Math.random() * 40;
  }

  context.putImageData(image, 0, 0);
  grainUrl = canvas.toDataURL("image/png");

  return grainUrl;
}

const subscribeNothing = () => () => {};

function useGrainUrl() {
  return useSyncExternalStore(subscribeNothing, getGrainUrl, () => null);
}

/** Škrabance cez obrázok (pevné). */
const SCRATCHES = [
  "M58,30 L66,170 L63,262",
  "M248,16 L256,120",
  "M322,140 L310,276",
];

/** Záhyb cez útržok 2 (strecha): svetlá a tmavá čiara. */
const FOLD = { from: [150, 2], to: [258, 120] } as const;

/** Vlákna roztrhnutého papiera: krátke čiarky pri okraji (každý 3. bod). */
function getFibers(index: number) {
  const points = PHOTO_PIECE_POINTS[index];

  return points
    .filter((_, pointIndex) => pointIndex % 3 === 1)
    .map(([x, y], fiberIndex) => {
      const px = (x / 100) * PHOTO_VIEW.width;
      const py = (y / 100) * PHOTO_VIEW.height;
      const angle = (fiberIndex * 2.4) % (Math.PI * 2);
      const length = 1.6 + (fiberIndex % 3);

      return `M${px.toFixed(1)},${py.toFixed(1)} l${(Math.cos(angle) * length).toFixed(1)},${(Math.sin(angle) * length).toFixed(1)}`;
    })
    .join(" ");
}

type PhotoPieceArtProps = {
  imageSrc: string;
  /** Útržok 0 až 3. */
  index: number;
  /** full = celá fotografia (útržok na svojom mieste), crop = iba útržok. */
  view?: "full" | "crop";
  className?: string;
  /** Obrázok sa nenačítal (prehliadač ukáže náhradu s popisom). */
  onImageError?: () => void;
};

/**
 * Jeden útržok starej fotografie: kartón so zlatou linkou, obrázok,
 * sépiový tón, stmavené rohy, zrnitosť, škrabance, záhyb, svetlý
 * roztrhnutý okraj s vláknami a tieň. Všetko je pevná kresba – pri
 * skladaní sa hýbe iba celý útržok.
 */
export function PhotoPieceArt({ imageSrc, index, view = "full", className = "", onImageError }: PhotoPieceArtProps) {
  const grain = useGrainUrl();
  const idPrefix = `photo-${useId().replace(/[^a-zA-Z0-9]/g, "")}-${index}`;
  const id = (name: string) => `${idPrefix}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;
  const path = getPiecePath(index);
  const viewBox =
    view === "crop"
      ? getPieceViewBox(index).text
      : `0 0 ${PHOTO_VIEW.width} ${PHOTO_VIEW.height}`;
  const image = {
    x: (PHOTO_CARD.imageX / 100) * PHOTO_VIEW.width,
    y: (PHOTO_CARD.imageY / 100) * PHOTO_VIEW.height,
    width: (PHOTO_CARD.imageWidth / 100) * PHOTO_VIEW.width,
    height: (PHOTO_CARD.imageHeight / 100) * PHOTO_VIEW.height,
  };

  return (
    <svg
      data-photo-piece={index + 1}
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      overflow="visible"
    >
      <defs>
        <clipPath id={id("clip")}>
          <path d={path} />
        </clipPath>
        <linearGradient id={id("card")} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#f1e6ca" />
          <stop offset="1" stopColor="#d6c296" />
        </linearGradient>
        <radialGradient id={id("vignette")} cx="50%" cy="50%" r="72%">
          <stop offset="0.55" stopColor="#2a1806" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1806" stopOpacity="0.6" />
        </radialGradient>
        {grain && (
          <pattern id={id("grain")} patternUnits="userSpaceOnUse" width="32" height="32">
            <image href={grain} width="32" height="32" />
          </pattern>
        )}
      </defs>

      {/* Tieň útržku (pevný, bez filtra). */}
      <path d={path} fill="#000" opacity="0.38" transform="translate(1.6 2.6)" />

      <g clipPath={url("clip")}>
        <rect data-photo-card width={PHOTO_VIEW.width} height={PHOTO_VIEW.height} fill={url("card")} />
        <rect x="8" y="5" width={PHOTO_VIEW.width - 16} height={PHOTO_VIEW.height - 10} fill="none" stroke="#b08d4f" strokeOpacity="0.5" strokeWidth="0.8" />
        <rect x={image.x - 1.5} y={image.y - 1.5} width={image.width + 3} height={image.height + 3} fill="#5b4220" opacity="0.35" />
        <image href={imageSrc} x={image.x} y={image.y} width={image.width} height={image.height} preserveAspectRatio="xMidYMid slice" onError={onImageError} />
        {/* Jednotný sépiový tón aj pri čiernobielom obrázku. */}
        <rect x={image.x} y={image.y} width={image.width} height={image.height} fill="#7a4f1d" opacity="0.14" style={{ mixBlendMode: "multiply" }} />
        <rect data-photo-vignette x={image.x} y={image.y} width={image.width} height={image.height} fill={url("vignette")} />
        {grain && (
          <rect data-photo-grain width={PHOTO_VIEW.width} height={PHOTO_VIEW.height} fill={url("grain")} opacity="0.55" />
        )}
        {SCRATCHES.map((scratch) => (
          <path key={scratch} data-photo-scratch d={scratch} fill="none" stroke="#fff6e0" strokeOpacity="0.35" strokeWidth="0.6" />
        ))}
        {index === 1 && (
          <g data-photo-fold>
            <line x1={FOLD.from[0]} y1={FOLD.from[1]} x2={FOLD.to[0]} y2={FOLD.to[1]} stroke="#fff4dc" strokeOpacity="0.55" strokeWidth="1.3" />
            <line x1={FOLD.from[0] + 1.6} y1={FOLD.from[1]} x2={FOLD.to[0] + 1.6} y2={FOLD.to[1]} stroke="#3b2a12" strokeOpacity="0.28" strokeWidth="1" />
          </g>
        )}
        {/* Roztrhnutý okraj: svetlé jadro papiera a vlákna. */}
        <g data-photo-torn-edge>
          <path d={path} fill="none" stroke="#f6eedb" strokeWidth="3.4" strokeLinejoin="round" />
          <path d={path} fill="none" stroke="#c9b58a" strokeOpacity="0.6" strokeWidth="0.7" transform="translate(0.4 0.4)" />
          <path d={getFibers(index)} fill="none" stroke="#fffaf0" strokeWidth="0.5" strokeOpacity="0.9" />
        </g>
      </g>
    </svg>
  );
}
