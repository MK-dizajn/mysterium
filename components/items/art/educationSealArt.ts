/**
 * Pečať vzdelanosti (scéna 4) ako SVG text – jediný zdroj kresby pre 2D
 * aj 3D (textúra a reliéf). Líce: koruna, otvorená kniha, nápis po obvode
 * a lúče presne podľa zoznamu v data/chapter-one/item-art.ts.
 * Rub: hladký bronz s nápisom (bez lúčov).
 *
 * Kresba je orezaná na kotúč (viewBox 20 20 200 200), aby v 3D vyplnila
 * celé líce valca. Body zoznamu (0 až 1) sa vzťahujú na tento výrez.
 */

import type { InspectCountPoint } from "../../../types/game";

export const EDUCATION_SEAL_SIZE = 200;

const DARK = "#4a2f0e";

function getDisc(gradientId: string) {
  return `<defs><radialGradient id="${gradientId}" cx="38%" cy="32%" r="78%"><stop offset="0" stop-color="#e8c27a"/><stop offset="0.5" stop-color="#b07a32"/><stop offset="1" stop-color="#5a3a12"/></radialGradient></defs>`
    + `<circle cx="120" cy="120" r="99" fill="url(#${gradientId})" stroke="${DARK}" stroke-width="3"/>`
    + `<circle cx="120" cy="120" r="80" fill="none" stroke="${DARK}" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.7"/>`;
}

/** Lúč od stredu (za korunou) smerom k bodu zoznamu a ďalej von. */
function getRay(point: InspectCountPoint) {
  const dx = point.x - 0.5;
  const dy = point.y - 0.5;
  const angle = Math.atan2(dy, dx);
  const inner = 0.12 * EDUCATION_SEAL_SIZE;
  const outer = 0.37 * EDUCATION_SEAL_SIZE;
  const halfWidth = 0.045;

  const tipX = 120 + Math.cos(angle) * outer;
  const tipY = 120 + Math.sin(angle) * outer;
  const leftX = 120 + Math.cos(angle - halfWidth * 2.2) * inner;
  const leftY = 120 + Math.sin(angle - halfWidth * 2.2) * inner;
  const rightX = 120 + Math.cos(angle + halfWidth * 2.2) * inner;
  const rightY = 120 + Math.sin(angle + halfWidth * 2.2) * inner;

  return `<polygon data-count-element="ray" points="${leftX.toFixed(1)},${leftY.toFixed(1)} ${tipX.toFixed(1)},${tipY.toFixed(1)} ${rightX.toFixed(1)},${rightY.toFixed(1)}" fill="#f2d38c" stroke="${DARK}" stroke-width="1"/>`;
}

function getFrontContent(rays: InspectCountPoint[], textPathId: string) {
  return `<defs><path id="${textPathId}" d="M120 120 m-89 0 a89 89 0 1 1 178 0 a89 89 0 1 1 -178 0"/></defs>`
    + `<text font-family="Georgia, serif" font-size="11" letter-spacing="2" fill="${DARK}"><textPath href="#${textPathId}" startOffset="2%">ACADEMIA ✦ ISTROPOLITANA ✦ ACADEMIA ✦ ISTROPOLITANA ✦</textPath></text>`
    + rays.map(getRay).join("")
    // Koruna
    + `<polygon points="98,124 98,104 108,114 120,98 132,114 142,104 142,124" fill="#6b4416" stroke="${DARK}" stroke-width="1.5"/>`
    + `<rect x="98" y="124" width="44" height="7" fill="#6b4416" stroke="${DARK}" stroke-width="1.5"/>`
    // Otvorená kniha
    + `<path d="M120 146 Q104 138 88 142 L88 168 Q104 164 120 172 Z" fill="#f2d38c" stroke="${DARK}" stroke-width="1.5"/>`
    + `<path d="M120 146 Q136 138 152 142 L152 168 Q136 164 120 172 Z" fill="#f2d38c" stroke="${DARK}" stroke-width="1.5"/>`;
}

function getBackContent() {
  return `<text x="120" y="118" text-anchor="middle" font-family="Georgia, serif" font-size="16" letter-spacing="3" fill="${DARK}">SAPIENTIA</text>`
    + `<text x="120" y="140" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-style="italic" fill="${DARK}">Múdrosť nad zlato</text>`;
}

export function getEducationSealSvg(
  side: "front" | "hidden",
  rays: InspectCountPoint[],
  idPrefix: string
) {
  const content =
    side === "front"
      ? getFrontContent(rays, `${idPrefix}-seal-ring`)
      : getBackContent();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 ${EDUCATION_SEAL_SIZE} ${EDUCATION_SEAL_SIZE}" width="${EDUCATION_SEAL_SIZE}" height="${EDUCATION_SEAL_SIZE}">`
    + getDisc(`${idPrefix}-seal-bronze-${side}`)
    + content
    + `</svg>`;
}
