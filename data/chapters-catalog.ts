import type { ChapterCatalogEntry } from "../types/game";
import { chapterOne } from "./chapter-one";

/*
 * Kapitoly v menu. Nová kapitola = nový riadok (aj iné mesto cez cityId).
 * Kapitola s obsahom má rovnaké id ako jej obsah (Chapter.id).
 */
export const chaptersCatalog: ChapterCatalogEntry[] = [
  {
    id: chapterOne.id,
    cityId: "bratislava",
    number: "I",
    title: chapterOne.title,
    subtitle: "Zlatý prešporský kľúč",
    status: "available",
    route: {
      stops: chapterOne.scenes.length,
      start: "Michalská brána",
      // Dočasný údaj – upraví sa po terénnej skúške (docs/KONTROLA-PRED-VYDANIM.md).
      duration: "asi 2 hodiny (orientačne)",
      isPlaceholder: true,
    },
  },
  {
    id: "bratislava-chapter-2",
    cityId: "bratislava",
    number: "II",
    title: "Kapitola II",
    status: "comingSoon",
  },
  {
    id: "bratislava-chapter-3",
    cityId: "bratislava",
    number: "III",
    title: "Kapitola III",
    status: "comingSoon",
  },
];
