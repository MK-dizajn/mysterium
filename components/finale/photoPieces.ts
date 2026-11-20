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

/** Miesta, kde sa stretávajú tri útržky. */
const JOINT_LEFT: PhotoPoint = [30.5, 42];
const JOINT_RIGHT: PhotoPoint = [69, 41];

const LEFT_TOP = tear([31.5, 0], JOINT_LEFT, 11);
const LEFT_BOTTOM = tear(JOINT_LEFT, [32, 100], 23);
const RIGHT_TOP = tear([68, 0], JOINT_RIGHT, 37);
const RIGHT_BOTTOM = tear(JOINT_RIGHT, [67.5, 100], 41);
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
