import type { ChapterFinale } from "../../types/game";

/*
 * Finále kapitoly I (kroky B3 až B7). Texty sú dočasné, nahradí ich autor.
 * Obrazovky finále zatiaľ neexistujú; hra tieto dáta začne používať v kroku B3b.
 */
export const chapterOneFinale: ChapterFinale = {
  guardian: {
    title: "Strážca prichádza",
    text:
      "Z tieňa brány vystúpi Strážca. V náručí nesie starú okovanú truhlicu a opatrne ju položí pred teba. „Pátrač ju zamkol tromi zámkami. Otvorí ju iba ten, kto prešiel celú cestu.“",
    skipLabel: "Preskočiť",
    continueLabel: "Pristúpiť k truhlici",
  },

  chest: {
    title: "Pátračova truhlica",
    intro:
      "Truhlica má tri zámky a uprostred kľúčovú dierku. Zámky sa otvárajú jeden po druhom, od prvého po tretí.",
    lockActIds: ["act-1", "act-2", "act-3"],
    keyItemId: "golden-pressburg-key-complete",
    wrongCodeText:
      "Mechanizmus sa nepohol. Niektorá číslica nesedí. Pozri sa do Zápisníka kódov.",
    lockOpenedText: "Zámok cvakol a povolil.",
    insertKeyLabel: "Vložiť Zlatý kľúč",
    openedText:
      "Kľúč sa otočil a veko sa pomaly zdvihlo. Na dne truhlice leží posledný útržok fotografie.",
    reward: {
      id: "torn-photo-fragment-chest",
      title: "Štvrtý útržok fotografie",
      icon: "🖼️",
      description:
        "Posledný útržok starej fotografie z pátračovej truhlice. Po zložení so zvyšnými tromi vznikne celý obraz.",
      actId: "act-3",
    },
  },

  photo: {
    // Dočasný obrázok sa doplní v kroku B5, neskôr ho nahradí historická fotografia.
    imageSrc: "/images/finale/historicka-fotografia.jpg",
    imageAlt: "Stará sépiová fotografia mesta",
    fragmentIds: [
      "torn-photo-fragment-act-1",
      "torn-photo-fragment-act-2",
      "torn-photo-fragment-act-3",
      "torn-photo-fragment-chest",
    ],
    title: "Zložená fotografia",
    frontDescription:
      "Štyri útržky do seba zapadli. Pred tebou je stará fotografia, na ktorej mesto vyzerá inak, než ho poznáš.",
    backLines: [
      "Kto dočítal až sem, nech ide ďalej.",
      "Ďalšia stopa čaká tam, kde mesto hrá divadlo.",
      "Slovenské národné divadlo",
      "— pátrač",
    ],
  },

  nextPlace: {
    question: "Napíš názov miesta zo zadnej strany fotografie.",
    acceptedAnswers: [
      "Slovenské národné divadlo",
      "SND",
      "Národné divadlo",
    ],
    wrongAnswerText:
      "Toto miesto pátrač nemyslel. Pozri sa znova na zadnú stranu fotografie.",
    name: "Slovenské národné divadlo",
    address: "Hviezdoslavovo námestie 1, 811 02 Bratislava",
    directions:
      "Z Hlavného námestia prejdi Rybárskou bránou na Hviezdoslavovo námestie. Historická budova divadla stojí na jeho konci, chôdza trvá asi 5 minút.",
    isPlaceholder: true,
  },

  ending: {
    label: "Kapitola dokončená",
    title: "Zlatý prešporský kľúč",
    summaryTitle: "Prípad uzavretý",
    summaryText:
      "Posledná stopa zapadla na svoje miesto. Starý pátrač mal pravdu — Bratislava neukrývala len príbeh, ale mapu.",
    paragraphs: [
      "Zlatý prešporský kľúč nebol predmetom, ktorý by otváral obyčajné dvere. Tvorili ho spomienky ukryté vo fasádach, nápisoch, erboch a ranách, ktoré na meste zanechali stáročia.",
      "V Artefaktoch zostáva zaznamenaná pamäť starého Prešporka. V inventári máš dokončený kľúč aj zloženú fotografiu, ktorej zadná strana ukazuje, kam viedla pátračova cesta ďalej.",
    ],
    journalQuote: "„Prešporok neukrýval jeden kľúč. Toto bol iba prvý.“",
    continuationTitle: "Pátranie pokračuje",
    continuationText:
      "Prvý prípad sa skončil, no fotografia odhaľuje začiatok väčšieho tajomstva. Príbeh bude pokračovať v druhej kapitole.",
  },
};
