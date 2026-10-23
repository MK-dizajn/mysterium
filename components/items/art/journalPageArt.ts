/**
 * Pátračova strana z denníka (scéna 3) ako SVG text – jediný zdroj kresby
 * pre 2D aj 3D. Líce: latinský odkaz z lekárne. Rub: poznámky
 * s podčiarknutou číslicou.
 */

import { escapeXml, getHandwrittenDigit, getPaperBackground } from "./paper";

export const JOURNAL_PAGE_WIDTH = 300;
export const JOURNAL_PAGE_HEIGHT = 400;

/** Stred podčiarknutej číslice na rube (v jednotkách kresby). */
export const JOURNAL_PAGE_DIGIT_X = 240;
export const JOURNAL_PAGE_DIGIT_Y = 300;

const INK = "#3b2a12";
const HAND = "Georgia, 'Times New Roman', serif";

function getRuledLines() {
  return Array.from({ length: 14 }, (_, index) => 72 + index * 22)
    .map(
      (y) =>
        `<line x1="16" y1="${y}" x2="284" y2="${y}" stroke="#b9a06a" stroke-width="1" opacity="0.35"/>`
    )
    .join("")
    + `<line x1="40" y1="20" x2="40" y2="380" stroke="#b5574a" stroke-width="1.5" opacity="0.4"/>`;
}

function getFrontContent() {
  return getRuledLines()
    + `<text x="150" y="52" text-anchor="middle" font-family="${HAND}" font-size="18" font-style="italic" font-weight="700" fill="${INK}">Lekáreň U Salvátora</text>`
    + `<text x="150" y="118" text-anchor="middle" font-family="${HAND}" font-size="21" font-style="italic" fill="${INK}">Quidquid agis,</text>`
    + `<text x="150" y="150" text-anchor="middle" font-family="${HAND}" font-size="21" font-style="italic" fill="${INK}">prudenter agas</text>`
    + `<text x="150" y="182" text-anchor="middle" font-family="${HAND}" font-size="21" font-style="italic" fill="${INK}">et respice finem.</text>`
    + `<text x="150" y="222" text-anchor="middle" font-family="'Times New Roman', Times, serif" font-size="22" font-weight="700" fill="${INK}" style="font-variant-numeric: lining-nums">1658</text>`
    + `<text x="150" y="268" text-anchor="middle" font-family="${HAND}" font-size="13" font-style="italic" fill="${INK}">Čokoľvek robíš, rob rozvážne</text>`
    + `<text x="150" y="290" text-anchor="middle" font-family="${HAND}" font-size="13" font-style="italic" fill="${INK}">a mysli na koniec.</text>`
    // Atramentová škvrna
    + `<circle cx="238" cy="342" r="9" fill="${INK}" opacity="0.22"/>`
    + `<circle cx="250" cy="350" r="3" fill="${INK}" opacity="0.18"/>`;
}

function getBackContent(digit: string, isDigitFound: boolean) {
  const lines = [
    "Pri lekárni som pochopil,",
    "že každé tajomstvo má",
    "svoj začiatok aj koniec.",
    "Koniec už poznám. Začiatok",
    "si musím zapísať, aby",
    "som ho nestratil.",
  ];

  const body = lines
    .map(
      (line, index) =>
        `<text x="52" y="${108 + index * 22}" font-family="${HAND}" font-size="14" font-style="italic" fill="${INK}">${escapeXml(line)}</text>`
    )
    .join("");

  return getRuledLines()
    + `<text x="150" y="52" text-anchor="middle" font-family="${HAND}" font-size="16" font-style="italic" fill="${INK}">Poznámky</text>`
    + body
    // Poznámka na okraji s podčiarknutou číslicou
    + `<text x="196" y="${JOURNAL_PAGE_DIGIT_Y + 9}" text-anchor="end" font-family="${HAND}" font-size="14" font-style="italic" fill="${INK}">Môj prvý krok:</text>`
    + getHandwrittenDigit(digit, JOURNAL_PAGE_DIGIT_X, JOURNAL_PAGE_DIGIT_Y + 10, isDigitFound)
    + `<line x1="${JOURNAL_PAGE_DIGIT_X - 13}" y1="${JOURNAL_PAGE_DIGIT_Y + 17}" x2="${JOURNAL_PAGE_DIGIT_X + 13}" y2="${JOURNAL_PAGE_DIGIT_Y + 19}" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`;
}

export function getJournalPageSvg(
  side: "front" | "hidden",
  digit: string,
  isDigitFound: boolean
) {
  const content =
    side === "front"
      ? getFrontContent()
      : getBackContent(digit, isDigitFound);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${JOURNAL_PAGE_WIDTH} ${JOURNAL_PAGE_HEIGHT}" width="${JOURNAL_PAGE_WIDTH}" height="${JOURNAL_PAGE_HEIGHT}">`
    + getPaperBackground(`journal-paper-${side}`, JOURNAL_PAGE_WIDTH, JOURNAL_PAGE_HEIGHT)
    + content
    + `</svg>`;
}
