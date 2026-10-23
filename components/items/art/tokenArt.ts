/**
 * Kresba mosadzného žetónu nultého kilometra ako SVG text.
 * Jediný zdroj kresby: použije ju 2D obrazovka „Prezrieť“
 * aj budúca 3D textúra (krok B1b-2b).
 */

export type TokenSide = "front" | "edge";

export type TokenSvgOptions = {
  side: TokenSide;
  digit: string;
  isDigitFound: boolean;
  /** Predpona id prechodov farieb, aby sa viac SVG na stránke nebilo. */
  idPrefix?: string;
};

const TICK_ANGLES = Array.from({ length: 16 }, (_, index) => index * 22.5);

const EDGE_GROOVES = Array.from({ length: 24 }, (_, index) => 26 + index * 8)
  .filter((x) => x < 96 || x > 144);

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getFrontSvg(faceGradientId: string, withShadow = true) {
  const ticks = TICK_ANGLES.map((angle) => {
    const isMain = angle % 90 === 0;

    return `<line x1="120" y1="36" x2="120" y2="${isMain ? "50" : "44"}" stroke="#5c3f12" stroke-width="${isMain ? 3 : 1.5}" transform="rotate(${angle} 120 120)"/>`;
  }).join("");

  return `<defs><radialGradient id="${faceGradientId}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#f8e3a1"/><stop offset="0.45" stop-color="#d1a14a"/><stop offset="1" stop-color="#6f4b16"/></radialGradient></defs>`
    + `<g>`
    + (withShadow
      ? `<circle cx="120" cy="124" r="104" fill="#2a1c07" opacity="0.6"/>`
      : "")
    + `<circle cx="120" cy="120" r="100" fill="url(#${faceGradientId})" stroke="#5c3f12" stroke-width="3"/>`
    + `<circle cx="120" cy="120" r="86" fill="none" stroke="#8a6224" stroke-width="2" stroke-dasharray="2 4"/>`
    + ticks
    // Veterná ružica
    + `<polygon points="120,58 130,110 182,120 130,130 120,182 110,130 58,120 110,110" fill="#7a5418" opacity="0.85"/>`
    + `<polygon points="120,84 126,114 156,120 126,126 120,156 114,126 84,120 114,114" fill="#f2d48c" opacity="0.9" transform="rotate(45 120 120)"/>`
    + `<circle cx="120" cy="120" r="6" fill="#4a320c"/>`
    + `<text x="120" y="78" text-anchor="middle" font-family="Georgia, serif" font-size="11" letter-spacing="3" fill="#4a320c">BRATISLAVA</text>`
    + `<text x="120" y="172" text-anchor="middle" font-family="Georgia, serif" font-size="14" font-weight="700" letter-spacing="2" fill="#4a320c">0 KM</text>`
    + `</g>`;
}

function getEdgeSvg(
  edgeGradientId: string,
  digit: string,
  isDigitFound: boolean
) {
  const safeDigit = escapeXml(digit);

  // Ryhovanie hrany, okrem hladkého miesta s číslicou
  const grooves = EDGE_GROOVES.map(
    (x) =>
      `<line x1="${x}" y1="101" x2="${x}" y2="139" stroke="#6e4c18" stroke-width="2" opacity="0.55"/>`
  ).join("");

  return `<defs><linearGradient id="${edgeGradientId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d28a"/><stop offset="0.5" stop-color="#b9853a"/><stop offset="1" stop-color="#5e4113"/></linearGradient></defs>`
    + `<g>`
    + `<rect x="16" y="100" width="208" height="48" rx="10" fill="#2a1c07" opacity="0.6"/>`
    + `<rect x="16" y="96" width="208" height="48" rx="10" fill="url(#${edgeGradientId})" stroke="#4a320c" stroke-width="3"/>`
    + grooves
    // Vyrytá číslica: svetlý odlesk pod ňou a samotná číslica
    + `<text x="121" y="132" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" fill="#f6dc9c" opacity="0.5">${safeDigit}</text>`
    + `<text x="120" y="131" text-anchor="middle" font-family="Georgia, serif" font-size="30" font-weight="700" fill="${isDigitFound ? "#fff1c1" : "#5a3d10"}">${safeDigit}</text>`
    + `</g>`;
}

/** Celé SVG žetónu (líce alebo hrana) ako text. */
export function getTokenSvg({
  side,
  digit,
  isDigitFound,
  idPrefix = "token",
}: TokenSvgOptions) {
  const content =
    side === "front"
      ? getFrontSvg(`${idPrefix}-face`)
      : getEdgeSvg(`${idPrefix}-edge`, digit, isDigitFound);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240">${content}</svg>`;
}

/*
 * Textúry pre 3D žetón (krok 2b-2) z tej istej kresby a farieb.
 */

/** Líce bez tieňa, orezané tak, že kotúč vyplní celý kruh textúry. */
export function getTokenFaceTextureSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 20 200 200" width="200" height="200">${getFrontSvg("token-face-texture", false)}</svg>`;
}

/** Jedna ryha hrany; v 3D sa opakuje okolo celého obvodu. */
export function getTokenGrooveTileSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 64" width="16" height="64">`
    + `<rect width="16" height="64" fill="#c99b4b"/>`
    + `<line x1="8" y1="0" x2="8" y2="64" stroke="#6e4c18" stroke-width="2" opacity="0.55"/>`
    + `</svg>`;
}

/** Hladká plôška na hrane s vyrytou číslicou (na výšku). */
export function getTokenDigitPlateSvg(digit: string, isDigitFound: boolean) {
  const safeDigit = escapeXml(digit);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 180" width="120" height="180">`
    + `<defs><linearGradient id="token-plate" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9853a"/><stop offset="0.5" stop-color="#f3d28a"/><stop offset="1" stop-color="#b9853a"/></linearGradient></defs>`
    + `<rect width="120" height="180" fill="url(#token-plate)"/>`
    + `<text x="62" y="128" text-anchor="middle" font-family="Georgia, serif" font-size="110" font-weight="700" fill="#f6dc9c" opacity="0.5">${safeDigit}</text>`
    + `<text x="60" y="125" text-anchor="middle" font-family="Georgia, serif" font-size="110" font-weight="700" fill="${isDigitFound ? "#fff1c1" : "#5a3d10"}">${safeDigit}</text>`
    + `</svg>`;
}
