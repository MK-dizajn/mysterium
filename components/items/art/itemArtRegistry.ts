import type { ItemInspectArt } from "../../../types/game";
import {
  getJournalPageSvg,
  JOURNAL_PAGE_DIGIT_X,
  JOURNAL_PAGE_DIGIT_Y,
  JOURNAL_PAGE_HEIGHT,
  JOURNAL_PAGE_WIDTH,
} from "./journalPageArt";
import {
  getSquareMapSvg,
  SQUARE_MAP_DIGIT_X,
  SQUARE_MAP_DIGIT_Y,
  SQUARE_MAP_HEIGHT,
  SQUARE_MAP_WIDTH,
} from "./mapArt";
import { getTokenSvg } from "./tokenArt";

/** „hidden“ = strana so skrytou číslicou (hrana žetónu, rub listu). */
export type ItemArtSide = "front" | "hidden";

export type ItemArtDefinition = {
  /** coin = žetón (valec), flat = tenký list papiera. */
  shape: "coin" | "flat";
  /** Rozmery kresby (určujú pomer strán). */
  width: number;
  height: number;
  getSvg: (
    side: ItemArtSide,
    digit: string,
    isDigitFound: boolean,
    idPrefix: string
  ) => string;
  /** Stred skrytej číslice na skrytej strane (0 až 1 zľava a zhora). */
  hotspotCenter: { x: number; y: number };
  turnLabel: string;
  turnBackLabel: string;
  /** Plochý list sa bez tlačidla obrátiť nedá, preto je viditeľné hneď. */
  isTurnButtonAlwaysVisible: boolean;
  /** Oznámenie pre čítačku, keď je skrytá strana otočená k hráčovi. */
  facingAnnouncement: string;
};

export const ITEM_ARTS: Record<ItemInspectArt, ItemArtDefinition> = {
  token: {
    shape: "coin",
    width: 240,
    height: 240,
    getSvg: (side, digit, isDigitFound, idPrefix) =>
      getTokenSvg({
        side: side === "front" ? "front" : "edge",
        digit,
        isDigitFound,
        idPrefix,
      }),
    hotspotCenter: { x: 0.5, y: 0.5 },
    turnLabel: "Otočiť na hranu",
    turnBackLabel: "Otočiť späť",
    isTurnButtonAlwaysVisible: false,
    facingAnnouncement: "Vyrytá číslica je natočená k tebe.",
  },
  journalPage: {
    shape: "flat",
    width: JOURNAL_PAGE_WIDTH,
    height: JOURNAL_PAGE_HEIGHT,
    getSvg: (side, digit, isDigitFound) =>
      getJournalPageSvg(side, digit, isDigitFound),
    hotspotCenter: {
      x: JOURNAL_PAGE_DIGIT_X / JOURNAL_PAGE_WIDTH,
      y: JOURNAL_PAGE_DIGIT_Y / JOURNAL_PAGE_HEIGHT,
    },
    turnLabel: "Obrátiť",
    turnBackLabel: "Obrátiť späť",
    isTurnButtonAlwaysVisible: true,
    facingAnnouncement: "Zadná strana listu je otočená k tebe.",
  },
  squareMap: {
    shape: "flat",
    width: SQUARE_MAP_WIDTH,
    height: SQUARE_MAP_HEIGHT,
    getSvg: (side, digit, isDigitFound) =>
      getSquareMapSvg(side, digit, isDigitFound),
    hotspotCenter: {
      x: SQUARE_MAP_DIGIT_X / SQUARE_MAP_WIDTH,
      y: SQUARE_MAP_DIGIT_Y / SQUARE_MAP_HEIGHT,
    },
    turnLabel: "Obrátiť",
    turnBackLabel: "Obrátiť späť",
    isTurnButtonAlwaysVisible: true,
    facingAnnouncement: "Zadná strana mapy je otočená k tebe.",
  },
};
