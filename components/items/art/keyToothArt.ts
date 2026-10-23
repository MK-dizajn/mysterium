/**
 * Zub Zlatého kľúča (scény 7 až 9) ako SVG text a ako obrys pre 3D.
 * Zárezy sú presne podľa zoznamu v data/chapter-one/item-art.ts:
 * bod s y nad 0,5 je zárez na dolnej hrane, inak na hornej.
 */

import type { InspectCountPoint } from "../../../types/game";

export const KEY_TOOTH_WIDTH = 360;
export const KEY_TOOTH_HEIGHT = 160;

/** Hrany zubu a tvar zárezu (0 až 1 v rámci kresby). */
export const KEY_TOOTH_SHAPE = {
  left: 14 / KEY_TOOTH_WIDTH,
  right: 346 / KEY_TOOTH_WIDTH,
  top: 24 / KEY_TOOTH_HEIGHT,
  bottom: 136 / KEY_TOOTH_HEIGHT,
  notchDepth: 28 / KEY_TOOTH_HEIGHT,
  notchHalfWidth: 11 / KEY_TOOTH_WIDTH,
};

export function isBottomNotch(point: InspectCountPoint) {
  return point.y > 0.5;
}

/**
 * Obrys zubu v poradí: horná hrana zľava doprava, pravý koniec,
 * dolná hrana sprava doľava. Vracia body (0 až 1) pre 2D aj 3D.
 */
export function getKeyToothOutline(notches: InspectCountPoint[]) {
  const shape = KEY_TOOTH_SHAPE;
  const topNotches = notches
    .filter((notch) => !isBottomNotch(notch))
    .sort((first, second) => first.x - second.x);
  const bottomNotches = notches
    .filter(isBottomNotch)
    .sort((first, second) => second.x - first.x);

  const points: InspectCountPoint[] = [{ x: shape.left, y: shape.top }];

  for (const notch of topNotches) {
    points.push(
      { x: notch.x - shape.notchHalfWidth, y: shape.top },
      { x: notch.x, y: shape.top + shape.notchDepth },
      { x: notch.x + shape.notchHalfWidth, y: shape.top }
    );
  }

  points.push({ x: shape.right, y: shape.top }, { x: shape.right, y: shape.bottom });

  for (const notch of bottomNotches) {
    points.push(
      { x: notch.x + shape.notchHalfWidth, y: shape.bottom },
      { x: notch.x, y: shape.bottom - shape.notchDepth },
      { x: notch.x - shape.notchHalfWidth, y: shape.bottom }
    );
  }

  points.push({ x: shape.left, y: shape.bottom });

  return points;
}

function toSvgPoints(points: InspectCountPoint[]) {
  return points
    .map(
      (point) =>
        `${(point.x * KEY_TOOTH_WIDTH).toFixed(1)},${(point.y * KEY_TOOTH_HEIGHT).toFixed(1)}`
    )
    .join(" ");
}

/** Tmavý obrys jedného zárezu (prvok na počítanie). */
function getNotchMark(notch: InspectCountPoint) {
  const shape = KEY_TOOTH_SHAPE;
  const edge = isBottomNotch(notch) ? shape.bottom : shape.top;
  const apex = isBottomNotch(notch)
    ? shape.bottom - shape.notchDepth
    : shape.top + shape.notchDepth;

  return `<polyline data-count-element="notch" points="${toSvgPoints([
    { x: notch.x - shape.notchHalfWidth, y: edge },
    { x: notch.x, y: apex },
    { x: notch.x + shape.notchHalfWidth, y: edge },
  ])}" fill="none" stroke="#5a3d10" stroke-width="3" stroke-linejoin="round"/>`;
}

export function getKeyToothSvg(
  side: "front" | "hidden",
  notches: InspectCountPoint[],
  idPrefix: string
) {
  const gradientId = `${idPrefix}-tooth-gold-${side}`;
  // Rub je zrkadlový obraz líca.
  const shownNotches =
    side === "front"
      ? notches
      : notches.map((notch) => ({ x: 1 - notch.x, y: notch.y }));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${KEY_TOOTH_WIDTH} ${KEY_TOOTH_HEIGHT}" width="${KEY_TOOTH_WIDTH}" height="${KEY_TOOTH_HEIGHT}">`
    + `<defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dc8a"/><stop offset="0.5" stop-color="#d4a23c"/><stop offset="1" stop-color="#8a5f1c"/></linearGradient></defs>`
    + `<polygon points="${toSvgPoints(getKeyToothOutline(shownNotches))}" fill="url(#${gradientId})" stroke="#5a3d10" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<line x1="40" y1="80" x2="320" y2="80" stroke="#8a5f1c" stroke-width="2" opacity="0.6"/>`
    + `<circle cx="30" cy="80" r="6" fill="none" stroke="#8a5f1c" stroke-width="2" opacity="0.7"/>`
    + (side === "front" ? notches.map(getNotchMark).join("") : "")
    + `</svg>`;
}
