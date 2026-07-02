import type { Game } from "../types/game";
import { chapterOne } from "./chapter-one";

export const mysteriumGame: Game = {
  id: "mysterium-bratislava",
  title: "Mysterium",
  subtitle: "Mestské dobrodružstvá ukryté v histórii",
  defaultCity: "Bratislava",
  chapters: [chapterOne],
};