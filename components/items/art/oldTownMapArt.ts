/**
 * Kus mapy: staré mesto (scéna 2) ako SVG text – jediný zdroj kresby
 * pre 2D aj 3D. Líce: hradby, ulice, Dunaj, vyznačený úzky dom
 * a veže presne podľa zoznamu v data/chapter-one/item-art.ts.
 * Rub: pátračova poznámka (bez veží).
 */

import type { InspectCountPoint } from "../../../types/game";
import { getPaperBackground } from "./paper";

export const OLD_TOWN_MAP_WIDTH = 400;
export const OLD_TOWN_MAP_HEIGHT = 300;

const INK = "#3b2a12";
const LINE = "#5c4626";

/** Jedna veža: telo, strecha a okienko, stredom v bode (x, y). */
function getTower(x: number, y: number) {
  return `<g data-count-element="tower">`
    + `<rect x="${x - 7}" y="${y - 6}" width="14" height="22" fill="#b8955a" stroke="${LINE}" stroke-width="1.5"/>`
    + `<polygon points="${x - 9},${y - 6} ${x},${y - 22} ${x + 9},${y - 6}" fill="#8a2d1f" stroke="${LINE}" stroke-width="1.5"/>`
    + `<rect x="${x - 2}" y="${y}" width="4" height="6" fill="${INK}"/>`
    + `</g>`;
}

function getFrontContent(towers: InspectCountPoint[]) {
  return `<text x="200" y="30" text-anchor="middle" font-family="Georgia, serif" font-size="14" letter-spacing="2" fill="${INK}">STARÝ PREŠPOROK</text>`
    // Dunaj
    + `<path d="M0 256 Q100 240 200 258 T400 252 L400 300 L0 300 Z" fill="#9fb3a8" opacity="0.55"/>`
    + `<text x="330" y="284" font-family="Georgia, serif" font-size="12" font-style="italic" fill="${INK}">Dunaj</text>`
    // Hradby
    + `<polygon points="36,56 366,48 374,236 28,242" fill="none" stroke="${LINE}" stroke-width="3" stroke-dasharray="10 5"/>`
    // Ulice
    + `<path d="M40 150 L370 140 M120 52 L130 240 M232 50 L226 240 M300 50 L306 236" stroke="#b9a06a" stroke-width="8" opacity="0.5" fill="none"/>`
    // Bloky domov
    + `<rect x="60" y="168" width="52" height="48" fill="#cfb37a" stroke="${LINE}" stroke-width="1"/>`
    + `<rect x="140" y="160" width="74" height="56" fill="#cfb37a" stroke="${LINE}" stroke-width="1"/>`
    + `<rect x="244" y="154" width="44" height="64" fill="#cfb37a" stroke="${LINE}" stroke-width="1"/>`
    + `<rect x="318" y="150" width="40" height="70" fill="#cfb37a" stroke="${LINE}" stroke-width="1"/>`
    // Vyznačený úzky dom
    + `<rect x="292" y="170" width="9" height="40" fill="#b8955a" stroke="#8a1d1d" stroke-width="2"/>`
    + `<text x="296" y="230" text-anchor="middle" font-family="'Times New Roman', Times, serif" font-size="11" font-weight="700" fill="#8a1d1d" style="font-variant-numeric: lining-nums">č. 15</text>`
    // Veže presne podľa zoznamu
    + towers
      .map((point) =>
        getTower(point.x * OLD_TOWN_MAP_WIDTH, point.y * OLD_TOWN_MAP_HEIGHT)
      )
      .join("");
}

function getBackContent() {
  return `<text x="40" y="78" font-family="Georgia, serif" font-size="16" font-style="italic" fill="${INK}">Mesto sa najlepšie spoznáva z výšky.</text>`
    + `<text x="40" y="106" font-family="Georgia, serif" font-size="14" font-style="italic" fill="${INK}">Kto chce vidieť ďaleko, musí zdvihnúť zrak.</text>`
    + `<text x="360" y="150" text-anchor="end" font-family="Georgia, serif" font-size="13" font-style="italic" fill="${INK}">— pátrač</text>`
    + `<path d="M40 210 Q120 190 200 212 T360 206" stroke="${LINE}" stroke-width="1.5" fill="none" opacity="0.6"/>`;
}

export function getOldTownMapSvg(
  side: "front" | "hidden",
  towers: InspectCountPoint[]
) {
  const content = side === "front" ? getFrontContent(towers) : getBackContent();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OLD_TOWN_MAP_WIDTH} ${OLD_TOWN_MAP_HEIGHT}" width="${OLD_TOWN_MAP_WIDTH}" height="${OLD_TOWN_MAP_HEIGHT}">`
    + getPaperBackground(`old-town-paper-${side}`, OLD_TOWN_MAP_WIDTH, OLD_TOWN_MAP_HEIGHT)
    + content
    + `</svg>`;
}
