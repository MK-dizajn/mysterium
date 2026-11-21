/**
 * Tvar štyroch útržkov historickej fotografie (spoločný pre obrazovku
 * fotografie, útržky počas hry a 3D útržok v truhlici).
 *
 * Všetko je v percentách celej fotografie aj s kartónom (pomer 4 : 3).
 * Útržky nie sú štvrtiny, ale časti, ktoré dávajú zmysel:
 *   1 (akt I)    ľavé krídlo budovy a stromy,
 *   2 (akt II)   strecha, sochy a nebo (hore v strede),
 *   3 (akt III)  pravé krídlo, lampa a fiaker,
 *   4 (truhlica) stred priečelia so vstupom a fontánou – podľa neho sa
 *                budova spozná, preto príde až posledný.
 * Roztrhnuté hrany sú nepravidelné (pevné, nemenia sa pri F5). Susedné
 * útržky zdieľajú tie isté body, takže do seba presne zapadnú.
 */

export type PhotoPoint = [number, number];

/** Kde leží obrázok na kartóne (v percentách; obrázok má tiež pomer 4 : 3). */
export const PHOTO_CARD = {
  imageX: 5,
  imageY: 4,
  imageWidth: 90,
  imageHeight: 90,
};

/** Pevná náhoda (rovnaké roztrhnutie pri každom načítaní). */
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296;
  };
}

/** Roztrhnutá čiara z bodu do bodu: drobné zuby a mierne vlnenie. */
function tear(from: PhotoPoint, to: PhotoPoint, seed: number): PhotoPoint[] {
  const random = createRandom(seed);
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const count = Math.max(8, Math.ceil(length / 2.2));
  // Kolmica na smer čiary (roztrhnutie uhýba do strán).
  const normal: PhotoPoint = [
    -(to[1] - from[1]) / length,
    (to[0] - from[0]) / length,
  ];
  const points: PhotoPoint[] = [];

  for (let index = 0; index <= count; index += 1) {
    const t = index / count;
    const isEnd = index === 0 || index === count;
    const offset = isEnd
      ? 0
      : (random() - 0.5) * 2.2 + Math.sin(t * Math.PI * 3 + seed) * 0.9;
    const x = from[0] + (to[0] - from[0]) * t + normal[0] * offset;
    const y = from[1] + (to[1] - from[1]) * t + normal[1] * offset;

    points.push([Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
  }

  return points;
}

/**
 * Miesta, kde sa stretávajú tri útržky. Nastavené podľa obrázka SND
 * (20. 11. 2026): zvislé trhliny idú medzi krídlami a stredným rizalitom
 * (asi 34 % a 70 % šírky obrázka), vodorovná pod rímsou kupoly, nad
 * lodžiou s bustami (asi 32 % výšky obrázka).
 */
const JOINT_LEFT: PhotoPoint = [35, 31.5];
const JOINT_RIGHT: PhotoPoint = [68.5, 31];

const LEFT_TOP = tear([34.5, 0], JOINT_LEFT, 11);
const LEFT_BOTTOM = tear(JOINT_LEFT, [35.5, 100], 23);
const RIGHT_TOP = tear([69, 0], JOINT_RIGHT, 37);
const RIGHT_BOTTOM = tear(JOINT_RIGHT, [68.5, 100], 41);
const MIDDLE = tear(JOINT_LEFT, JOINT_RIGHT, 53);

const reversed = (points: PhotoPoint[]) => [...points].reverse();

/** Obrys útržkov 1 až 4 (v percentách fotografie, v smere hodinových ručičiek). */
export const PHOTO_PIECE_POINTS: PhotoPoint[][] = [
  // 1: ľavé krídlo
  [[0, 0], ...LEFT_TOP, ...LEFT_BOTTOM.slice(1), [0, 100]],
  // 2: strecha a nebo
  [...RIGHT_TOP, ...reversed(MIDDLE).slice(1), ...reversed(LEFT_TOP).slice(1)],
  // 3: pravé krídlo
  [[100, 0], [100, 100], ...reversed(RIGHT_BOTTOM), ...reversed(RIGHT_TOP).slice(1)],
  // 4: stred priečelia
  [...MIDDLE, ...RIGHT_BOTTOM.slice(1), ...reversed(LEFT_BOTTOM).slice(0, -1)],
];

/** Rub fotografie je zrkadlový: útržok vpredu vľavo je na rube vpravo. */
export function getMirroredPiecePoints(index: number): PhotoPoint[] {
  return (PHOTO_PIECE_POINTS[index] ?? PHOTO_PIECE_POINTS[0]).map(([x, y]) => [100 - x, y]);
}

/** Na rube: na ktorom útržku je riadok s miestom (rub útržku z truhlice). */
export const BACK_PLACE_PIECE = 3;
const BACK_PLACE_TOP = 38;
const BACK_PLACE_BOTTOM = 80;
/** Odstup textu od trhliny (percentá šírky). */
const BACK_PLACE_MARGIN = 1.5;

/** Odstup textu od okraja kartónu (percentá). */
const BACK_EDGE_MARGIN = 4;

/**
 * Miesta pre poznámku na rube – každý kus nesie svoj kúsok (oprava 1):
 * ľavý stĺpec (rub pravého krídla) prvá veta, horný stred (rub strechy)
 * začiatok druhej vety, pravý stĺpec (rub ľavého krídla) jej pokračovanie
 * a dole podpis, stredný dolný kus (rub útržku z truhlice) miesto.
 */
export const BACK_SLOTS = [
  { role: "first", piece: 2, top: 6, bottom: 62 },
  { role: "secondStart", piece: 1, top: 5, bottom: 27 },
  { role: "secondRest", piece: 0, top: 6, bottom: 76 },
  { role: "place", piece: BACK_PLACE_PIECE, top: BACK_PLACE_TOP, bottom: BACK_PLACE_BOTTOM },
  { role: "signature", piece: 0, top: 82, bottom: 95 },
] as const;

/**
 * Obdĺžnik na rube (v percentách), ktorý celý leží vnútri rubu daného
 * kusu medzi výškami top a bottom – text v ňom nepretne žiadna trhlina.
 */
export function getBackSafeBox(piece: number, top: number, bottom: number) {
  const polygon = getMirroredPiecePoints(piece);
  const xs = polygon.map(([x]) => x);
  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
  let left = -Infinity;
  let right = Infinity;

  for (let y = top; y <= bottom; y += 0.5) {
    // Kde vodorovná čiara v tejto výške pretína obrys útržku.
    const crossings: number[] = [];

    polygon.forEach(([x1, y1], index) => {
      const [x2, y2] = polygon[(index + 1) % polygon.length];

      if ((y1 > y) !== (y2 > y)) {
        crossings.push(x1 + ((y - y1) * (x2 - x1)) / (y2 - y1));
      }
    });

    const leftEdge = Math.max(...crossings.filter((x) => x < centerX));
    const rightEdge = Math.min(...crossings.filter((x) => x > centerX));
    left = Math.max(left, leftEdge + BACK_PLACE_MARGIN);
    right = Math.min(right, rightEdge - BACK_PLACE_MARGIN);
  }

  left = Math.max(left, BACK_EDGE_MARGIN);
  right = Math.min(right, 100 - BACK_EDGE_MARGIN);

  return {
    left: Math.ceil(left * 10) / 10,
    right: Math.floor(right * 10) / 10,
    top,
    bottom,
  };
}

/**
 * Obdĺžnik na rube, ktorý celý leží vnútri rubu útržku z truhlice –
 * riadok „Miesto: …“ tam nepretne žiadny šev.
 */
export function getBackPlaceBox() {
  return getBackSafeBox(BACK_PLACE_PIECE, BACK_PLACE_TOP, BACK_PLACE_BOTTOM);
}

export type PieceBox = { left: number; top: number; width: number; height: number };

/** Ohraničenie útržku (v percentách fotografie). */
export function getPieceBox(index: number): PieceBox {
  const points = PHOTO_PIECE_POINTS[index] ?? PHOTO_PIECE_POINTS[0];
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);

  return {
    left,
    top,
    width: Math.max(...xs) - left,
    height: Math.max(...ys) - top,
  };
}
