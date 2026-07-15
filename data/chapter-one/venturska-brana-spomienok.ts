import type { Scene } from "../../types/game";

export const venturskaBranaSpomienokScene: Scene = {
  id: "venturska-brana-spomienok",
  location: "Academia Istropolitana",
  title: "4. Dom, v ktorom sa začalo vzdelanie",

  cinematicText:
    "Ventúrska ulica pokračuje medzi palácmi a starými meštianskymi domami. Pátračov denník ťa však nevedie k najhonosnejšej fasáde. Zastaví ťa pred kamennou budovou, ktorá na prvý pohľad pôsobí nenápadne. Práve tu sa však kedysi stretávali učenci, astronómovia a ľudia, ktorí sa snažili porozumieť svetu.",

  voiceLine:
    "Prvý údaj si našiel na dome. Druhý v odkaze lekárnika. Teraz hľadaj miesto, kde sa otázky nepovažovali za slabosť, ale za začiatok poznania. Meno muža, ktorý ho založil, otvorí ďalšiu časť denníka.",

  investigation: {
    objective:
        "Na Ventúrskej ulici nájdi budovu Academie Istropolitany a prezri si pamätnú tabuľu na jej fasáde. Hľadaj meno panovníka, ktorý školu založil.",
    detectiveHint:
        "Pátrač nehľadá rok ani názov školy. Potrebuje meno človeka, ktorý dal vzdelaniu v meste nový začiatok.",
    observationType: "inscription",
   },

  puzzle: {
    id: "puzzle-venturska-brana",
    question:
      "Nájdi na Ventúrskej ulici budovu Academie Istropolitany a pamätnú tabuľu na jej fasáde. Ktorý panovník podľa tabule založil túto školu?",
    acceptedAnswers: [
      "matej korvin",
      "matej korvín",
      "matias korvin",
      "matiáš korvín",
      "korvin",
      "korvín",
      "matej",
    ],
    hints: [
      "Hľadaj budovu na adrese Ventúrska 3.",
      "Odpoveď je napísaná na tmavej pamätnej tabuli upevnenej na fasáde.",
    ],
  },

  history: {
    id: "history-venturska",
    title: "Prvá univerzita na území dnešného Slovenska",
    shortText:
      "Za nenápadnou fasádou na Ventúrskej ulici sídlila Academia Istropolitana.",
    fullText:
      "Academia Istropolitana bola založená v roku 1465 z podnetu uhorského kráľa Mateja Korvína. Považuje sa za prvú univerzitu na území dnešného Slovenska. Pôsobili na nej učenci z viacerých častí Európy a vyučovala sa tu okrem iného matematika, astronómia, medicína a slobodné umenia. Názov Istropolitana vychádza zo slova Istropolis, teda z pomenovania Bratislavy ako mesta na Dunaji.",
  },

  artifact: {
    id: "artifact-academia-istropolitana",
    title: "Academia Istropolitana",
    icon: "🎓",
    shortFact:
      "Prvá univerzita na území dnešného Slovenska bola založená v roku 1465.",
    fullText:
      "Budova Academie Istropolitany na Ventúrskej ulici je pripomienkou obdobia, keď sa Bratislava stala miestom európskeho vzdelania. Medzi jej učiteľmi boli matematici, astronómovia, lekári a humanisti. Mnoho ľudí prejde popri budove bez toho, aby tušili, že kráčajú okolo jednej z najvýznamnejších kapitol dejín vzdelávania na Slovensku.",
  },

  nextInstruction:
    "Keď vyslovíš meno zakladateľa, tri zápisy v denníku sa spoja: „Pätnásť označilo miesto. Rok pripomenul rozvahu. Kráľ otvoril cestu poznaniu.“ Medzi stránkami sa objaví obrys kľúča. Ešte však nie je celý — chýba mu posledný zub.",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "venturska_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "venturska_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "corvin-founder-clue",
            title: "Meno kráľa zakladateľa",
            icon: "👑",
            description:
              "Tretia časť pátračovej šifry. Matej Korvín založil Academiu Istropolitanu a otvoril v meste cestu vzdelaniu.",
          },
        },
      ],
    },
  ],

  branches: [
    {
     targetSceneId: "mirbachov-palac",
     conditions: [
         {
         type: "flag",
         id: "venturska_solved",
        },
        ],
    },
    ],

};