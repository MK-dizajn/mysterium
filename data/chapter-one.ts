import type { Chapter } from "../types/game";
import { chapterOneQuests } from "./chapter-one/quests";
import { michalskaBranaScene } from "./chapter-one/michalska-brana";
import { tajnaStopaMichalskaScene } from "./chapter-one/tajna-stopa-michalska";
import { lekarenUSalvatoraScene } from "./chapter-one/lekaren-u-salvatora";
import { venturskaBranaSpomienokScene } from "./chapter-one/venturska-brana-spomienok";
import { mirbachovPalacScene } from "./chapter-one/mirbachov-palac";
import { staraRadnicaScene } from "./chapter-one/stara-radnica";
import { maximilianovaFontanaScene } from "./chapter-one/maximilianova-fontana";

export const chapterOne: Chapter = {
  id: "bratislava-chapter-1",
  city: "Bratislava",
  title: "Stratený denník starého pátrača",
  subtitle: "Kapitola I: Zlatý prešporský kľúč",
  introLines: [
    "Mesto si pamätá všetko.",
    "Niektoré tajomstvá čakali celé stáročia.",
    "Ak toto čítaš, znamená to, že som zlyhal.",
  ],

  quests: chapterOneQuests,

  scenes: [
    michalskaBranaScene,     
    tajnaStopaMichalskaScene,
    lekarenUSalvatoraScene,
    venturskaBranaSpomienokScene, 
    mirbachovPalacScene,
    staraRadnicaScene,
    maximilianovaFontanaScene,
  ],
};