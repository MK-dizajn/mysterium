/**
 * Tvar štyroch útržkov historickej fotografie (spoločný pre obrazovku
 * fotografie a 3D útržok v truhlici).
 *
 * Roztrhnuté hrany: zvislá a vodorovná trhlina cez stred fotografie
 * (v percentách). Susedné útržky zdieľajú tie isté body, takže do seba
 * presne zapadnú.
 */

export type PhotoPoint = [number, number];

const VERTICAL_TOP: PhotoPoint[] = [
  [51.5, 0], [49, 5], [52, 10], [50.5, 15], [48, 20], [51, 25],
  [49.5, 30], [52.5, 35], [49, 40], [51, 45], [50, 50],
];
const VERTICAL_BOTTOM: PhotoPoint[] = [
  [50, 50], [48.5, 55], [51.5, 60], [49, 65], [52, 70], [50, 75],
  [47.5, 80], [51, 85], [49, 90], [52, 95], [50.5, 100],
];
const HORIZONTAL_LEFT: PhotoPoint[] = [
  [0, 48.5], [5, 51.5], [10, 49], [15, 52], [20, 50], [25, 47.5],
  [30, 51], [35, 49], [40, 52.5], [45, 49.5], [50, 50],
];
const HORIZONTAL_RIGHT: PhotoPoint[] = [
  [50, 50], [55, 52], [60, 49], [65, 51.5], [70, 48], [75, 51],
  [80, 49.5], [85, 52], [90, 48.5], [95, 51], [100, 49.5],
];

const reversed = (points: PhotoPoint[]) => [...points].reverse();

/** Obrys útržkov 1 až 4 (v percentách fotografie). */
export const PHOTO_PIECE_POINTS: PhotoPoint[][] = [
  // 1: vľavo hore
  [[0, 0], ...VERTICAL_TOP, ...reversed(HORIZONTAL_LEFT)],
  // 2: vpravo hore
  [...reversed(VERTICAL_TOP), [100, 0], ...reversed(HORIZONTAL_RIGHT)],
  // 3: vľavo dole
  [...HORIZONTAL_LEFT, ...VERTICAL_BOTTOM, [0, 100]],
  // 4: vpravo dole
  [...HORIZONTAL_RIGHT, [100, 100], ...reversed(VERTICAL_BOTTOM)],
];
