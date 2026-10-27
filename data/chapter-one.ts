import type { Chapter } from "../types/game";
import { chapterOneActs } from "./chapter-one/acts";
import { chapterOneFinale } from "./chapter-one/finale";
import { chapterOneQuests } from "./chapter-one/quests";
import { michalskaBranaScene } from "./chapter-one/michalska-brana";
import { tajnaStopaMichalskaScene } from "./chapter-one/tajna-stopa-michalska";
import { lekarenUSalvatoraScene } from "./chapter-one/lekaren-u-salvatora";
import { venturskaBranaSpomienokScene } from "./chapter-one/venturska-brana-spomienok";
import { mirbachovPalacScene } from "./chapter-one/mirbachov-palac";
import { staraRadnicaScene } from "./chapter-one/stara-radnica";
import { maximilianovaFontanaScene } from "./chapter-one/maximilianova-fontana";
import { primacialnyPalacScene } from "./chapter-one/primacialny-palac";
import { bratislavskyMierScene } from "./chapter-one/bratislavsky-mier";
import { zlatyPresporskyKlucScene } from "./chapter-one/zlaty-presporsky-kluc";

export const chapterOne: Chapter = {
  id: "bratislava-chapter-1",
  city: "Bratislava",
  title: "Stratený denník starého pátrača",
  subtitle: "Kapitola I: Zlatý prešporský kľúč",
  introVideo: {
    title: "Stratený denník starého pátrača",
    videoSrc: "/videos/uvod-bratislava.mp4",
    posterSrc: "/videos/uvod-bratislava.poster.jpg",
    captionsSrc: "/videos/uvod-bratislava.sk.vtt",
    videoDescription:
      "Video: prelet nad Bratislavou až k Michalskej bráne. Hlas rozpráva o zmiznutom pátračovi.",
    skipLabel: "Preskočiť",
    endLabel: "Spustiť kapitolu",
    seenFlagId: "seen_intro_city_video",
  },

  arrival: {
    label: "Prvá stopa",
    title: "Vydaj sa k Michalskej bráne",
    text: "Posledná stopa pátrača sa končí pod Michalskou bránou. Postav sa pod jej oblúk a nájdi v dlažbe bronzový kruh.",
    fallbackTitle: "Pátračov denník",
    fallbackText:
      "Kedysi tu žil pátrač, ktorý zbieral tajomstvá mesta. Jedného večera zmizol a jeho stopy sa stratili v uliciach starého mesta. Poslednú z nich nájdeš pod Michalskou bránou.",
    mapsQuery: "Michalská brána, Michalská ulica, Bratislava",
    mapsLabel: "Otvoriť v mapách",
    confirmLabel: "Som pri bráne",
  },

  quests: chapterOneQuests,

  acts: chapterOneActs,

  scenes: [
    michalskaBranaScene,     
    tajnaStopaMichalskaScene,
    lekarenUSalvatoraScene,
    venturskaBranaSpomienokScene, 
    mirbachovPalacScene,
    staraRadnicaScene,
    maximilianovaFontanaScene,
    primacialnyPalacScene,
    bratislavskyMierScene,
    zlatyPresporskyKlucScene,
  ],

  guidance: {
    nextClueTitle: "Ďalšia stopa",
    showRouteLabel: "Ukáž cestu",
    hideRouteLabel: "Skryť cestu",
    inventoryClueLabel: "Stopa",
  },

  finale: chapterOneFinale,
};