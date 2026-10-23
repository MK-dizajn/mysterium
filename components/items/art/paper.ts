/** Spoločné časti kresieb papierových predmetov (strana denníka, mapa). */

export function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Zostarnutý papier s jemne stmavnutým okrajom. */
export function getPaperBackground(
  gradientId: string,
  width: number,
  height: number
) {
  return `<defs><linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1e4c3"/><stop offset="0.6" stop-color="#e2cfa2"/><stop offset="1" stop-color="#c9b07a"/></linearGradient></defs>`
    + `<rect width="${width}" height="${height}" fill="url(#${gradientId})"/>`
    + `<rect x="4" y="4" width="${width - 8}" height="${height - 8}" fill="none" stroke="#a8884f" stroke-width="3" opacity="0.55"/>`;
}

/**
 * Ručne napísaná číslica. Nenájdená je obyčajný atrament,
 * nájdená sa zvýrazní žltým zvýrazňovačom a tmavočervenou farbou.
 */
export function getHandwrittenDigit(
  digit: string,
  x: number,
  y: number,
  isDigitFound: boolean,
  fontSize = 28
) {
  const safeDigit = escapeXml(digit);
  const highlight = isDigitFound
    ? `<rect x="${x - fontSize * 0.55}" y="${y - fontSize * 0.95}" width="${fontSize * 1.1}" height="${fontSize * 1.25}" rx="4" fill="#f5d76e" opacity="0.75"/>`
    : "";

  return highlight
    + `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Times New Roman', Times, serif" font-size="${fontSize}" font-weight="700" fill="${isDigitFound ? "#7a1414" : "#2f2210"}" style="font-variant-numeric: lining-nums">${safeDigit}</text>`;
}
