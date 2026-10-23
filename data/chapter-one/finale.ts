import type { ChapterFinale } from "../../types/game";

/*
 * Finále kapitoly I (kroky B3 až B7). Texty sú schválené autorom; dočasná
 * je ešte cesta k ďalšiemu miestu (isPlaceholder), overí sa v teréne.
 * Obrazovky finále pribudnú v krokoch B4 až B7.
 */
export const chapterOneFinale: ChapterFinale = {
  guardian: {
    title: "Strážca prichádza",
    text:
      "Z tmy pod bránou sa ozvú kroky. Strážca nesie ťažkú truhlicu a kladie ju pred teba. ‚Pátrač ju uzamkol tromi zámkami a jeden kľúč nestačil. Každý zámok sa otvára tým, čo si našiel. Poznáš kódy. Máš aj kľúč.‘",
    skipLabel: "Preskočiť",
    continueLabel: "Otvoriť truhlicu",
  },

  chest: {
    title: "Truhlica starého pátrača",
    intro:
      "Tri zámky, tri trojice číslic. Otváraj ich v poradí, v akom si získaval stopy.",
    lockActIds: ["act-1", "act-2", "act-3"],
    keyItemId: "golden-pressburg-key-complete",
    wrongCodeText: "Zámok sa ani nepohol. Niektorá číslica nesedí.",
    lockOpenedText: "Zámok cvakol. Ďalší čaká.",
    unlockLabel: "Odomknúť zámok",
    lockOpenLabel: "odomknutý",
    lockClosedLabel: "zamknutý",
    insertKeyLabel: "Vložiť Zlatý kľúč",
    openedText:
      "Veko sa pomaly dvíha. Vnútri leží posledný útržok fotografie.",
    continueLabel: "Prijať útržok a pokračovať",
    reward: {
      id: "torn-photo-fragment-chest",
      title: "Štvrtý útržok fotografie",
      icon: "🖼️",
      description:
        "Posledný útržok, ktorý pátrač ukryl pod zámkami. Teraz sa dajú zložiť všetky štyri.",
      actId: "act-3",
    },
  },

  photo: {
    // Dočasný sépiový obrázok (vlastná kresba); nahradí ho historická fotografia
    // v pomere 4 : 3 – stačí vymeniť súbor alebo cestu, kód netreba meniť.
    imageSrc: "/images/finale/historicka-fotografia.jpg",
    imageAlt: "Stará sépiová fotografia mesta",
    fragmentIds: [
      "torn-photo-fragment-act-1",
      "torn-photo-fragment-act-2",
      "torn-photo-fragment-act-3",
      "torn-photo-fragment-chest",
    ],
    title: "Historická fotografia",
    frontDescription:
      "Štyri útržky sa samy spojili. Na starej snímke stojí budova, ktorú ešte nepoznáš, a na rube je poznámka.",
    backLines: [
      "Prešporok ukrýval viac než jeden kľúč.",
      "Tam, kde sa za oponou skrýva pamäť mesta, nájdeš ďalšiu stopu.",
      "Miesto: Slovenské národné divadlo",
      "— pátrač",
    ],
    turnLabel: "Otočiť",
    zoomInLabel: "Priblížiť",
    zoomOutLabel: "Oddialiť",
    frontSideLabel: "Predná strana fotografie",
    backSideLabel: "Zadná strana fotografie",
    continueLabel: "Pokračovať v pátraní",
  },

  nextPlace: {
    question: "Kde pokračuje pátranie? Zadaj názov miesta z fotografie.",
    acceptedAnswers: [
      "Slovenské národné divadlo",
      "SND",
      "Národné divadlo",
    ],
    wrongAnswerText: "Toto nie je to miesto. Pozri sa na fotografiu ešte raz.",
    submitLabel: "Overiť odpoveď",
    showPhotoLabel: "Pozrieť fotografiu",
    closePhotoLabel: "Zavrieť",
    cardTitle: "Ďalšie miesto",
    addressLabel: "Adresa",
    directionsLabel: "Ako sa tam dostaneš",
    finishLabel: "Dokončiť kapitolu",
    name: "Slovenské národné divadlo",
    address: "Hviezdoslavovo námestie 1, Bratislava",
    mapsButtonLabel: "Otvoriť v mapách",
    // Cesta je dočasná, overí sa v teréne.
    directions:
      "Od Primaciálneho námestia sa vráť na Hlavné námestie a prejdi ulicou Rybárska brána na Hviezdoslavovo námestie. Divadlo stojí na jeho konci.",
    isPlaceholder: true,
  },

  ending: {
    label: "Kapitola dokončená",
    title: "Zlatý prešporský kľúč",
    paragraphs: [
      "Kľúč, ktorý si držal, neotvoril dvere, ale pamäť mesta. Michalská brána, úzky dom, lekáreň, stará univerzita, palác, radnica, fontána aj sála, v ktorej sa podpísal mier. Všetko si pamätá, kým sa nenájde niekto, kto si to dokáže prečítať. Pátrač to vedel. Preto nezanechal odpovede, iba stopy.",
    ],
    quoteTitle: "Posledná strana denníka",
    // Úvodzovky „…“ doplní záverečná obrazovka.
    journalQuote: "Prešporok neukrýval jeden kľúč. Toto bol iba prvý.",
    scoreLabel: "Konečné skóre",
    continuationTitle: "Druhý prípad sa blíži",
    continuationText:
      "Fotografia na teba čaká. Hľadaj miesto, na ktoré ukazuje, a pátranie pokračuje.",
    showPlaceLabel: "Zobraziť ďalšie miesto",
    restartLabel: "Hrať kapitolu od začiatku",
    restartConfirmTitle: "Začať odznova?",
    restartConfirmMessage:
      "Dokončenú kapitolu aj získané body vymažeš a začneš od prvej zastávky. Túto akciu nemožno vrátiť.",
    restartConfirmLabel: "Áno, začať odznova",
  },
};
