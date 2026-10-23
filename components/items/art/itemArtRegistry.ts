import type { InspectCountPoint, ItemInspectArt } from "../../../types/game";
import { EDUCATION_SEAL_SIZE, getEducationSealSvg } from "./educationSealArt";
import {
  getJournalPageSvg,
  JOURNAL_PAGE_DIGIT_X,
  JOURNAL_PAGE_DIGIT_Y,
  JOURNAL_PAGE_HEIGHT,
  JOURNAL_PAGE_WIDTH,
} from "./journalPageArt";
import { getKeyToothSvg, KEY_BIT } from "./keyToothArt";
import {
  getSquareMapSvg,
  SQUARE_MAP_DIGIT_X,
  SQUARE_MAP_DIGIT_Y,
  SQUARE_MAP_HEIGHT,
  SQUARE_MAP_WIDTH,
} from "./mapArt";
import {
  getOldTownMapSvg,
  OLD_TOWN_MAP_HEIGHT,
  OLD_TOWN_MAP_WIDTH,
} from "./oldTownMapArt";
import { getTokenSvg } from "./tokenArt";

/** „hidden“ = druhá strana (hrana žetónu, rub listu). */
export type ItemArtSide = "front" | "hidden";

export type ItemArtSvgOptions = {
  side: ItemArtSide;
  digit: string;
  isDigitFound: boolean;
  idPrefix: string;
  countPoints?: InspectCountPoint[];
  /** Poradie časti zloženého predmetu (zuby kľúča). */
  artPart?: number;
};

export type ItemArtDefinition = {
  /** coin = žetón (štvorcový rámik), flat = predmet s pomerom strán kresby. */
  shape: "coin" | "flat";
  /** Ktorý 3D model sa použije. */
  model3D: "token" | "paper" | "seal" | "tooth";
  /** Rozmery kresby (určujú pomer strán). */
  width: number;
  height: number;
  getSvg: (options: ItemArtSvgOptions) => string;
  /** Stred skrytej číslice na skrytej strane (0 až 1 zľava a zhora). */
  hotspotCenter: { x: number; y: number };
  turnLabel: string;
  turnBackLabel: string;
  /** Plochý predmet sa bez tlačidla obrátiť nedá, preto je viditeľné hneď. */
  isTurnButtonAlwaysVisible: boolean;
  /** Oznámenie pre čítačku, keď je hľadaná strana otočená k hráčovi. */
  facingAnnouncement: string;
};

const FLAT_TURN = {
  turnLabel: "Obrátiť",
  turnBackLabel: "Obrátiť späť",
  isTurnButtonAlwaysVisible: true,
};

export const ITEM_ARTS: Record<ItemInspectArt, ItemArtDefinition> = {
  token: {
    shape: "coin",
    model3D: "token",
    width: 240,
    height: 240,
    getSvg: ({ side, digit, isDigitFound, idPrefix }) =>
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
    model3D: "paper",
    width: JOURNAL_PAGE_WIDTH,
    height: JOURNAL_PAGE_HEIGHT,
    getSvg: ({ side, digit, isDigitFound }) =>
      getJournalPageSvg(side, digit, isDigitFound),
    hotspotCenter: {
      x: JOURNAL_PAGE_DIGIT_X / JOURNAL_PAGE_WIDTH,
      y: JOURNAL_PAGE_DIGIT_Y / JOURNAL_PAGE_HEIGHT,
    },
    ...FLAT_TURN,
    facingAnnouncement: "Zadná strana listu je otočená k tebe.",
  },
  squareMap: {
    shape: "flat",
    model3D: "paper",
    width: SQUARE_MAP_WIDTH,
    height: SQUARE_MAP_HEIGHT,
    getSvg: ({ side, digit, isDigitFound }) =>
      getSquareMapSvg(side, digit, isDigitFound),
    hotspotCenter: {
      x: SQUARE_MAP_DIGIT_X / SQUARE_MAP_WIDTH,
      y: SQUARE_MAP_DIGIT_Y / SQUARE_MAP_HEIGHT,
    },
    ...FLAT_TURN,
    facingAnnouncement: "Zadná strana mapy je otočená k tebe.",
  },
  oldTownMap: {
    shape: "flat",
    model3D: "paper",
    width: OLD_TOWN_MAP_WIDTH,
    height: OLD_TOWN_MAP_HEIGHT,
    getSvg: ({ side, countPoints = [] }) =>
      getOldTownMapSvg(side, countPoints),
    hotspotCenter: { x: 0.5, y: 0.5 },
    ...FLAT_TURN,
    facingAnnouncement: "Zadná strana mapy je otočená k tebe.",
  },
  educationSeal: {
    shape: "flat",
    model3D: "seal",
    width: EDUCATION_SEAL_SIZE,
    height: EDUCATION_SEAL_SIZE,
    getSvg: ({ side, idPrefix, countPoints = [] }) =>
      getEducationSealSvg(side, countPoints, idPrefix),
    hotspotCenter: { x: 0.5, y: 0.5 },
    ...FLAT_TURN,
    facingAnnouncement: "Zadná strana pečate je otočená k tebe.",
  },
  keyTooth: {
    shape: "flat",
    model3D: "tooth",
    width: KEY_BIT.width,
    height: KEY_BIT.height,
    getSvg: ({ side, idPrefix, countPoints = [], artPart = 1 }) =>
      getKeyToothSvg(side, countPoints, artPart, idPrefix),
    hotspotCenter: { x: 0.5, y: 0.5 },
    ...FLAT_TURN,
    facingAnnouncement: "Zadná strana zuba je otočená k tebe.",
  },
};
