/**
 * Zlatý prešporský kľúč: tri časti jeho brady (zuby zo scén 7 až 9)
 * a zložený kľúč. Jeden zdroj pre 2D kresbu aj 3D model.
 *
 * Časť brady je blok s kúskom drieku (valček) nad ním. Prvky na počítanie
 * sú presne podľa zoznamu v data/chapter-one/item-art.ts: bod nižšie ako
 * 0,65 je zárez v spodnej hrane, ostatné body sú okienka v brade.
 * Po bokoch sú spoje, ktorými časti do seba zapadnú: časť 1 má vpravo
 * výstupok, časť 2 vľavo výrez a vpravo výstupok, časť 3 vľavo výrez.
 */

import type { InspectCountPoint } from "../../../types/game";

/** Rozmery časti brady (v jednotkách kresby 320 × 240). */
export const KEY_BIT = {
  width: 320,
  height: 240,
  rodTop: 20,
  rodHeight: 40,
  bitLeft: 24,
  bitRight: 296,
  bitTop: 60,
  bitBottom: 220,
  /**
   * Spoj: ako ďaleko siaha výstupok (a výrez) a ako sa rozširuje.
   * Je nad zárezmi, aby zárezy mohli byť takmer po celej šírke brady.
   */
  jointDepth: 18,
  jointNeckTop: 105,
  jointNeckBottom: 135,
  jointFlare: 12,
  slotDepth: 52,
  wardHalfWidth: 8,
  windowHalfHeight: 18,
};

export const KEY_PART_COUNT = 3;

export function isBottomSlot(point: InspectCountPoint) {
  return point.y > 0.65;
}

type Point = { x: number; y: number };

const toNormalized = (x: number, y: number): Point => ({
  x: x / KEY_BIT.width,
  y: y / KEY_BIT.height,
});

/**
 * Obrys časti brady (0 až 1 v rámci kresby) a otvory okienok.
 * Poradie obrysu: horná hrana, pravý bok, spodná hrana so zárezmi, ľavý bok.
 */
export function getKeyBitOutline(
  notches: InspectCountPoint[],
  part: number
): { outline: Point[]; holes: Point[][] } {
  const bit = KEY_BIT;
  const left = bit.bitLeft;
  const right = bit.bitRight;
  const tipTop = bit.jointNeckTop - bit.jointFlare;
  const tipBottom = bit.jointNeckBottom + bit.jointFlare;
  const outline: Point[] = [
    toNormalized(left, bit.bitTop),
    toNormalized(right, bit.bitTop),
  ];

  if (part < KEY_PART_COUNT) {
    outline.push(
      toNormalized(right, bit.jointNeckTop),
      toNormalized(right + bit.jointDepth, tipTop),
      toNormalized(right + bit.jointDepth, tipBottom),
      toNormalized(right, bit.jointNeckBottom)
    );
  }

  outline.push(toNormalized(right, bit.bitBottom));

  const slotTop = bit.bitBottom - bit.slotDepth;

  notches
    .filter(isBottomSlot)
    .map((notch) => notch.x * bit.width)
    .sort((first, second) => second - first)
    .forEach((centerX) => {
      outline.push(
        toNormalized(centerX + bit.wardHalfWidth, bit.bitBottom),
        toNormalized(centerX + bit.wardHalfWidth, slotTop),
        toNormalized(centerX - bit.wardHalfWidth, slotTop),
        toNormalized(centerX - bit.wardHalfWidth, bit.bitBottom)
      );
    });

  outline.push(toNormalized(left, bit.bitBottom));

  if (part > 1) {
    outline.push(
      toNormalized(left, bit.jointNeckBottom),
      toNormalized(left + bit.jointDepth, tipBottom),
      toNormalized(left + bit.jointDepth, tipTop),
      toNormalized(left, bit.jointNeckTop)
    );
  }

  const holes = notches
    .filter((notch) => !isBottomSlot(notch))
    .map((notch) => {
      const centerX = notch.x * bit.width;
      const centerY = notch.y * bit.height;

      return [
        toNormalized(centerX - bit.wardHalfWidth, centerY - bit.windowHalfHeight),
        toNormalized(centerX + bit.wardHalfWidth, centerY - bit.windowHalfHeight),
        toNormalized(centerX + bit.wardHalfWidth, centerY + bit.windowHalfHeight),
        toNormalized(centerX - bit.wardHalfWidth, centerY + bit.windowHalfHeight),
      ];
    });

  return { outline, holes };
}

function toPathData(points: Point[]) {
  return (
    points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"}${(point.x * KEY_BIT.width).toFixed(1)},${(point.y * KEY_BIT.height).toFixed(1)}`
      )
      .join(" ") + " Z"
  );
}

function getBitPathData(notches: InspectCountPoint[], part: number) {
  const { outline, holes } = getKeyBitOutline(notches, part);

  return [outline, ...holes].map(toPathData).join(" ");
}

/** Obdĺžnik jedného zárezu alebo okienka (v jednotkách kresby). */
function getWardRect(notch: InspectCountPoint) {
  const bit = KEY_BIT;
  const centerX = notch.x * bit.width;

  if (isBottomSlot(notch)) {
    return {
      x: centerX - bit.wardHalfWidth,
      y: bit.bitBottom - bit.slotDepth,
      width: bit.wardHalfWidth * 2,
      height: bit.slotDepth,
    };
  }

  return {
    x: centerX - bit.wardHalfWidth,
    y: notch.y * bit.height - bit.windowHalfHeight,
    width: bit.wardHalfWidth * 2,
    height: bit.windowHalfHeight * 2,
  };
}

function getWardOutlines(notches: InspectCountPoint[], attribute: string) {
  return notches
    .map((notch) => {
      const rect = getWardRect(notch);

      return `<rect ${attribute} x="${rect.x.toFixed(1)}" y="${rect.y.toFixed(1)}" width="${rect.width}" height="${rect.height}" fill="none" stroke="#5a3d10" stroke-width="2.5"/>`;
    })
    .join("");
}

function getGradients(idPrefix: string) {
  return `<linearGradient id="${idPrefix}-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dc8a"/><stop offset="0.5" stop-color="#d4a23c"/><stop offset="1" stop-color="#8a5f1c"/></linearGradient>`
    + `<linearGradient id="${idPrefix}-rod" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5f1c"/><stop offset="0.35" stop-color="#f9e7a6"/><stop offset="0.7" stop-color="#d4a23c"/><stop offset="1" stop-color="#6b4612"/></linearGradient>`;
}

/** Kúsok drieku nad časťou brady. */
function getRod(idPrefix: string) {
  const bit = KEY_BIT;
  const centerY = bit.rodTop + bit.rodHeight / 2;
  const capRadius = bit.rodHeight * 0.18;

  return `<g data-key-part="rod">`
    + `<rect x="${bit.bitLeft}" y="${bit.rodTop}" width="${bit.bitRight - bit.bitLeft}" height="${bit.rodHeight}" fill="url(#${idPrefix}-rod)" stroke="#5a3d10" stroke-width="2"/>`
    + `<ellipse cx="${bit.bitLeft}" cy="${centerY}" rx="${capRadius}" ry="${bit.rodHeight / 2}" fill="#c99632" stroke="#5a3d10" stroke-width="2"/>`
    + `<ellipse cx="${bit.bitRight}" cy="${centerY}" rx="${capRadius}" ry="${bit.rodHeight / 2}" fill="#c99632" stroke="#5a3d10" stroke-width="2"/>`
    + `</g>`;
}

function getBit(
  notches: InspectCountPoint[],
  part: number,
  fill: string,
  attributes = ""
) {
  const bit = KEY_BIT;

  return `<path data-key-part="bit-${part}" ${attributes} d="${getBitPathData(notches, part)}" fill-rule="evenodd" fill="${fill}" stroke="#5a3d10" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<line x1="${bit.bitLeft + 10}" y1="${bit.bitTop + 10}" x2="${bit.bitRight - 10}" y2="${bit.bitTop + 10}" stroke="#fff3c4" stroke-width="1.5" opacity="0.5"/>`;
}

/** Časť brady na obrazovke „Prezrieť“; rub je zrkadlový a bez značiek. */
export function getKeyToothSvg(
  side: "front" | "hidden",
  notches: InspectCountPoint[],
  part: number,
  idPrefix: string
) {
  const bit = KEY_BIT;
  const body = getRod(idPrefix) + getBit(notches, part, `url(#${idPrefix}-gold)`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${bit.width} ${bit.height}" width="${bit.width}" height="${bit.height}">`
    + `<defs>${getGradients(idPrefix)}</defs>`
    + (side === "front"
      ? body + getWardOutlines(notches, 'data-count-element="notch"')
      : `<g transform="translate(${bit.width} 0) scale(-1 1)">${body}</g>`)
    + `</svg>`;
}

/** Rozloženie zloženého kľúča: časti brady visia na drieku v rovnakej mierke. */
export function getGoldenKeyLayout() {
  const pieceScale = 0.5;
  const shankY = 100;
  const firstPieceX = 500;
  const pieceWidth = (KEY_BIT.bitRight - KEY_BIT.bitLeft) * pieceScale;

  return {
    width: 960,
    height: 260,
    pieceScale,
    shankY,
    shankHeight: KEY_BIT.rodHeight * pieceScale,
    shankLeft: 200,
    shankRight: firstPieceX + pieceWidth * KEY_PART_COUNT,
    pieceY: shankY - KEY_BIT.rodTop * pieceScale,
    pieceX: Array.from(
      { length: KEY_PART_COUNT },
      (_, index) => firstPieceX + pieceWidth * index
    ),
    bow: { x: 112, y: 110, radius: 92 },
  };
}

/** Ozdobná hlava kľúča: štvorlístok s otvormi a korunkou v strede. */
function getBow(fill: string, holeFill: string, attributes: string) {
  const { x, y, radius } = getGoldenKeyLayout().bow;
  const angles = [0, 90, 180, 270].map((angle) => (angle * Math.PI) / 180);
  const lobe = (angle: number, size: number, color: string, width: number) =>
    `<circle cx="${(x + Math.cos(angle) * radius * 0.55).toFixed(1)}" cy="${(y + Math.sin(angle) * radius * 0.55).toFixed(1)}" r="${(radius * size).toFixed(1)}" fill="${color}" stroke="#5a3d10" stroke-width="${width}"/>`;

  return `<g data-key-part="bow" ${attributes}>`
    + angles.map((angle) => lobe(angle, 0.5, fill, 3)).join("")
    + `<circle cx="${x}" cy="${y}" r="${(radius * 0.55).toFixed(1)}" fill="${fill}" stroke="#5a3d10" stroke-width="3"/>`
    + angles.map((angle) => lobe(angle, 0.22, holeFill, 2)).join("")
    + `<circle cx="${x}" cy="${y}" r="${(radius * 0.2).toFixed(1)}" fill="${fill}" stroke="#5a3d10" stroke-width="2"/>`
    + `<path d="M${(x - radius * 0.14).toFixed(1)},${(y + radius * 0.06).toFixed(1)} l${(radius * 0.07).toFixed(1)},${(-radius * 0.16).toFixed(1)} l${(radius * 0.07).toFixed(1)},${(radius * 0.1).toFixed(1)} l${(radius * 0.07).toFixed(1)},${(-radius * 0.1).toFixed(1)} l${(radius * 0.07).toFixed(1)},${(radius * 0.16).toFixed(1)} Z" fill="#8a5f1c"/>`
    + `</g>`;
}

type GoldenKeyOptions = {
  idPrefix: string;
  /** Zárezy a okienka každej časti (neznáma časť = plný blok). */
  pieceNotches: (InspectCountPoint[] | undefined)[];
  /** Pri tieňovom obryse: ktorá časť (1 až 3) je zvýraznená. */
  highlightPart?: number;
  variant?: "gold" | "silhouette";
};

/** Zložený Zlatý prešporský kľúč alebo jeho tieňový obrys. */
export function getGoldenKeySvg({
  idPrefix,
  pieceNotches,
  highlightPart,
  variant = "gold",
}: GoldenKeyOptions) {
  const layout = getGoldenKeyLayout();
  const isSilhouette = variant === "silhouette";
  const gold = `url(#${idPrefix}-gold)`;
  const shadow = "#3a2f1c";
  const shadowAttribute = isSilhouette ? 'data-key-shadow opacity="0.85"' : "";
  const shankFill = isSilhouette ? shadow : `url(#${idPrefix}-rod)`;
  const metalFill = isSilhouette ? shadow : gold;
  const { shankY, shankHeight } = layout;

  const pieces = layout.pieceX
    .map((pieceX, index) => {
      const part = index + 1;
      const notches = pieceNotches[index] ?? [];
      const isHighlighted = isSilhouette && part === highlightPart;
      const fill = isSilhouette && !isHighlighted ? shadow : gold;
      const attributes = isHighlighted
        ? `data-key-highlight="${part}"`
        : isSilhouette
          ? shadowAttribute
          : "";

      // Vonkajšia skupina sa dá posúvať animáciou (CSS by prepísalo transform vnútornej).
      return `<g data-key-piece="${part}"><g transform="translate(${pieceX - KEY_BIT.bitLeft * layout.pieceScale} ${layout.pieceY}) scale(${layout.pieceScale})">`
        + getBit(notches, part, fill, attributes)
        + (isSilhouette && !isHighlighted ? "" : getWardOutlines(notches, "data-key-ward"))
        + `</g></g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${layout.width} ${layout.height}" width="${layout.width}" height="${layout.height}">`
    + `<defs>${getGradients(idPrefix)}</defs>`
    + pieces
    + `<rect data-key-part="shank" ${shadowAttribute} x="${layout.shankLeft}" y="${shankY}" width="${layout.shankRight - layout.shankLeft}" height="${shankHeight}" fill="${shankFill}" stroke="#5a3d10" stroke-width="2.5"/>`
    + `<circle ${shadowAttribute} cx="${layout.shankRight + 6}" cy="${shankY + shankHeight / 2}" r="${shankHeight / 2 + 3}" fill="${metalFill}" stroke="#5a3d10" stroke-width="2.5"/>`
    + `<rect ${shadowAttribute} x="${layout.shankLeft - 4}" y="${shankY - 12}" width="22" height="${shankHeight + 24}" rx="5" fill="${metalFill}" stroke="#5a3d10" stroke-width="2.5"/>`
    + `<rect ${shadowAttribute} x="${layout.shankLeft + 26}" y="${shankY - 6}" width="12" height="${shankHeight + 12}" rx="4" fill="${metalFill}" stroke="#5a3d10" stroke-width="2"/>`
    + getBow(metalFill, isSilhouette ? "#0b0f1c" : "#070d22", shadowAttribute)
    + `</svg>`;
}
