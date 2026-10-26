import type { Game } from "../types/game";
import { chapterOne } from "./chapter-one";

export const mysteriumGame: Game = {
  id: "mysterium-bratislava",
  title: "Mysterium",
  subtitle: "Mestské dobrodružstvá ukryté v histórii",
  defaultCity: "Bratislava",
  chapters: [chapterOne],
  // Iba počas beta testu – pred vydaním odstrániť (pozri docs/KONTROLA-PRED-VYDANIM.md).
  previewNotice:
    "Ukážková verzia 0.1 – niektoré obrázky, zvuky a údaje sú zatiaľ dočasné.",
};