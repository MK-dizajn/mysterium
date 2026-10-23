/**
 * Kus mapy: námestie (scéna 5) ako SVG text – jediný zdroj kresby
 * pre 2D aj 3D. Líce: pôdorys Františkánskeho námestia s malým kompasom
 * v rohu. Rub: pátračov náčrt kompasu s číslicou pri severe.
 */

import { getHandwrittenDigit, getPaperBackground } from "./paper";

export const SQUARE_MAP_WIDTH = 400;
export const SQUARE_MAP_HEIGHT = 300;

/** Stred číslice pri kompase na rube (v jednotkách kresby). */
export const SQUARE_MAP_DIGIT_X = 300;
export const SQUARE_MAP_DIGIT_Y = 70;

const INK = "#3b2a12";
const LINE = "#5c4626";

function getCompassStar(cx: number, cy: number, radius: number) {
  const r = radius;
  const s = radius * 0.22;

  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LINE}" stroke-width="1.5"/>`
    + `<polygon points="${cx},${cy - r} ${cx + s},${cy - s} ${cx + r},${cy} ${cx + s},${cy + s} ${cx},${cy + r} ${cx - s},${cy + s} ${cx - r},${cy} ${cx - s},${cy - s}" fill="${LINE}" opacity="0.75"/>`
    + `<polygon points="${cx},${cy - r} ${cx + s},${cy - s} ${cx},${cy} ${cx - s},${cy - s}" fill="#8a2d1f" opacity="0.85"/>`;
}

function getFrontContent() {
  return `<text x="200" y="34" text-anchor="middle" font-family="Georgia, serif" font-size="14" letter-spacing="2" fill="${INK}">FRANTIŠKÁNSKE NÁMESTIE</text>`
    // Ulice
    + `<path d="M20 120 L380 104 M20 228 L380 236 M118 46 L130 284 M300 46 L290 284" stroke="#b9a06a" stroke-width="10" opacity="0.55" fill="none"/>`
    // Námestie
    + `<polygon points="140,118 282,112 286,226 138,232" fill="#e8d9ae" stroke="${LINE}" stroke-width="2"/>`
    + `<text x="212" y="176" text-anchor="middle" font-family="Georgia, serif" font-size="12" font-style="italic" fill="${INK}">námestie</text>`
    // Domy okolo námestia
    + `<rect x="34" y="50" width="70" height="56" fill="#c8a96d" stroke="${LINE}" stroke-width="1.5"/>`
    + `<rect x="148" y="52" width="124" height="46" fill="#c8a96d" stroke="${LINE}" stroke-width="1.5"/>`
    + `<rect x="312" y="52" width="60" height="40" fill="#c8a96d" stroke="${LINE}" stroke-width="1.5"/>`
    + `<rect x="34" y="132" width="70" height="80" fill="#c8a96d" stroke="${LINE}" stroke-width="1.5"/>`
    + `<rect x="306" y="124" width="70" height="96" fill="#b8955a" stroke="${LINE}" stroke-width="2"/>`
    + `<text x="341" y="176" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="${INK}">palác</text>`
    // Kostol s vežou
    + `<rect x="150" y="246" width="118" height="36" fill="#c8a96d" stroke="${LINE}" stroke-width="1.5"/>`
    + `<polygon points="150,246 209,232 268,246" fill="#b8955a" stroke="${LINE}" stroke-width="1.5"/>`
    + `<text x="209" y="270" text-anchor="middle" font-family="Georgia, serif" font-size="10" fill="${INK}">kostol</text>`
    // Malý kompas v rohu (bez číslice)
    + getCompassStar(356, 264, 18)
    + `<text x="356" y="241" text-anchor="middle" font-family="Georgia, serif" font-size="10" font-weight="700" fill="${INK}">S</text>`
    // Mierka
    + `<line x1="30" y1="280" x2="100" y2="280" stroke="${INK}" stroke-width="2"/>`
    + `<line x1="30" y1="275" x2="30" y2="285" stroke="${INK}" stroke-width="2"/>`
    + `<line x1="100" y1="275" x2="100" y2="285" stroke="${INK}" stroke-width="2"/>`;
}

function getBackContent(digit: string, isDigitFound: boolean) {
  return `<text x="36" y="62" font-family="Georgia, serif" font-size="16" font-style="italic" fill="${INK}">Sever ukazuje cestu.</text>`
    + `<text x="36" y="88" font-family="Georgia, serif" font-size="13" font-style="italic" fill="${INK}">Kto sa stratí, nech hľadá sever.</text>`
    + `<text x="36" y="236" font-family="Georgia, serif" font-size="12" font-style="italic" fill="${INK}" opacity="0.8">— náčrt pri Mirbachovom paláci</text>`
    // Veľký náčrt kompasu
    + getCompassStar(260, 170, 64)
    + `<text x="260" y="96" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-weight="700" fill="${INK}">S</text>`
    + `<text x="260" y="254" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="${INK}">J</text>`
    + `<text x="334" y="175" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="${INK}">V</text>`
    + `<text x="186" y="175" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="${INK}">Z</text>`
    // Číslica pri severe
    + getHandwrittenDigit(digit, SQUARE_MAP_DIGIT_X, SQUARE_MAP_DIGIT_Y + 10, isDigitFound)
    + `<path d="M${SQUARE_MAP_DIGIT_X - 14} ${SQUARE_MAP_DIGIT_Y + 18} Q${SQUARE_MAP_DIGIT_X - 30} ${SQUARE_MAP_DIGIT_Y + 30} ${SQUARE_MAP_DIGIT_X - 36} ${SQUARE_MAP_DIGIT_Y + 22}" stroke="${INK}" stroke-width="1.5" fill="none"/>`;
}

export function getSquareMapSvg(
  side: "front" | "hidden",
  digit: string,
  isDigitFound: boolean
) {
  const content =
    side === "front"
      ? getFrontContent()
      : getBackContent(digit, isDigitFound);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SQUARE_MAP_WIDTH} ${SQUARE_MAP_HEIGHT}" width="${SQUARE_MAP_WIDTH}" height="${SQUARE_MAP_HEIGHT}">`
    + getPaperBackground(`map-paper-${side}`, SQUARE_MAP_WIDTH, SQUARE_MAP_HEIGHT)
    + content
    + `</svg>`;
}
