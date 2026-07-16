import type { Scene } from "../../types/game";

export const venturskaBranaSpomienokScene: Scene = {
  id: "venturska-brana-spomienok",
  location: "Academia Istropolitana",
  title: "4. Dom, v ktorom sa začalo vzdelanie",

  cinematicText:
  "Z Panskej ulice sa vraciaš na Ventúrsku a po krátkej chôdzi prichádzaš k domu číslo 3. Si na správnom mieste. Za nenápadnou fasádou sa kedysi stretávali učenci, astronómovia a ľudia, ktorí sa snažili porozumieť svetu.",

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
  "Meno zakladateľa pridalo do skladačky ďalšiu vrstvu. Pátrač teraz vedie tvoju pozornosť od vzdelania k moci a rodovým znakom.\n\nPokračuj po Ventúrskej smerom na Františkánske námestie. Zastav sa pred Mirbachovým palácom.",

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
            id: "evidence-academia-seal",
            title: "Pečať Academie Istropolitany",
            icon: "🎓",
            description:
              "Kovová pečať s obrysom otvorenej knihy a kráľovskej koruny. Na jej hrane je vyrazená tretia dvojica číslic tajnej kombinácie.",
            evidenceKind: "object",
            secretCode: "65",
            evidenceOrder: 4,
            actId: "act-2",
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