import type { ChapterCatalogEntry } from "../types/game";
import { unlockChapter } from "./unlockStore";

/**
 * Obchádzanie zámku kapitol pri vývoji: adresa s parametrom odomkne všetky
 * dostupné kapitoly. Funguje iba vo vývojovom režime (npm run dev). Pri builde
 * pre hráčov je podmienka vždy nepravdivá a celý obsah (aj názov parametra)
 * sa z hotovej verzie vypustí – overuje to test K2.
 */
export function applyDevUnlock(catalog: ChapterCatalogEntry[]) {
  if (process.env.NODE_ENV === "development") {
    const params = new URLSearchParams(window.location.search);

    if (params.get("dev-odomknut") === "1") {
      for (const chapter of catalog) {
        if (chapter.status === "available") {
          unlockChapter(chapter.id, "dev");
        }
      }
    }
  }
}
