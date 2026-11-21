import type { MapPoint, Scene } from "../types/game";

/*
 * Odkazy do Google Máp. Hra polohu telefónu nezisťuje: odkaz iba otvorí
 * mapu a hráč na mieste sám potvrdí, že tam je.
 */

/** Odkaz, ktorý otvorí hľadané miesto v Google Mapách (podľa názvu). */
export function getMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

/** Odkaz presne na odmeraný bod: https://www.google.com/maps?q=šírka,dĺžka. */
export function getMapPointUrl(point: MapPoint) {
  return `https://www.google.com/maps?q=${point.lat},${point.lng}`;
}

/** Odkaz na bod zastávky; bez odmeraných súradníc sa odkaz neukáže (null). */
export function getSceneMapsUrl(scene: Scene | undefined): string | null {
  return scene?.mapPoint ? getMapPointUrl(scene.mapPoint) : null;
}
