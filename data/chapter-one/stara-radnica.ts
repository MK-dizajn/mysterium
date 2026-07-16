import type { Scene } from "../../types/game";

export const staraRadnicaScene: Scene = {
  id: "stara-radnica",
  location: "Stará radnica",
  title: "6. Stopa, ktorú mesto neodstránilo",

  cinematicText:
  "Po niekoľkých krokoch prichádzaš na Hlavné námestie pred vežu Starej radnice. Si na správnom mieste. Budova pôsobí pokojne, no jej múr dodnes nesie stopu chvíle, keď sa mesto ocitlo pod paľbou.",

  voiceLine:
    "Niektoré rany mesto opraví. Iné ponechá na očiach, aby ľudia nezabudli. Hľadaj stopu útoku, ktorá sa nestala súčasťou múzea. Zostala priamo v múre.",

  investigation: {
    objective:
      "Postav sa na Hlavné námestie pred vežu Starej radnice. Prezri priestor vedľa gotického okna na jej prvom poschodí a hľadaj predmet zachovaný priamo v stene.",
    detectiveHint:
      "Nie je to ornament ani súčasť výzdoby. Do múru sa dostal násilím a mesto ho tam ponechalo ako svedka minulosti.",
    observationType: "observation",
  },

  puzzle: {
    id: "puzzle-stara-radnica",
    question:
      "Aký predmet zostal zamurovaný v stene radničnej veže vedľa gotického okna?",
    acceptedAnswers: [
      "delova gula",
      "delová guľa",
      "gula",
      "guľa",
      "delostrelecka gula",
      "delostrelecká guľa",
      "kanonova gula",
      "kanónová guľa",
    ],
    hints: [
      "Pozeraj sa na vežu zo strany Hlavného námestia a sústreď sa na priestor pri gotickom okne.",
      "Ide o muníciu vystrelenú z dela.",
    ],
  },

  history: {
    id: "history-stara-radnica",
    title: "Rana z roku 1809",
    shortText:
      "V radničnej veži zostala zamurovaná delová guľa z napoleonského bombardovania Bratislavy.",
    fullText:
      "V roku 1809 bola Bratislava ostreľovaná napoleonským vojskom. Jednu z delových gulí neskôr zamurovali vedľa gotického okna na prvom poschodí radničnej veže, kde zostala dodnes. Po napoleonských vojnách sa delové gule zachovávali aj na ďalších poškodených bratislavských budovách. Podľa jednej z tradovaných interpretácií označovali domy poškodené bombardovaním, ktoré mohli mať nárok na daňovú úľavu.",
  },

  artifact: {
    id: "artifact-stara-radnica",
    title: "Stará radnica",
    icon: "🏛️",
    shortFact:
      "Na veži Starej radnice zostala viditeľná delová guľa z bombardovania mesta v roku 1809.",
    fullText:
      "Stará radnica vznikala postupným spájaním viacerých historických domov a patrí medzi najstaršie mestské stavby Bratislavy. Jej veža neuchováva iba hodiny a architektonické detaily. V stene zostala aj skutočná stopa napoleonského bombardovania, ktorú väčšina návštevníkov námestia nikdy nezbadá.",
  },

  nextInstruction:
  "Stopa v múre dokázala, že mesto uchováva aj udalosti, na ktoré by možno najradšej zabudlo.\n\nZostaň na Hlavnom námestí a prejdi niekoľko krokov do jeho stredu k Maximiliánovej fontáne.",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "stara_radnica_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "stara_radnica_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "evidence-cannonball-fragment",
            title: "Úlomok delovej gule",
            icon: "⚫",
            description:
              "Ťažký kovový úlomok so stopami poškodenia. Na jeho povrchu je vyrazená piata dvojica číslic tajnej kombinácie.",
            evidenceKind: "fragment",
            secretCode: "09",
            evidenceOrder: 6,
            actId: "act-2",
          },
        },
      ],
    },
  ],

  branches: [
    {
      targetSceneId: "maximilianova-fontana",
      conditions: [
        {
          type: "flag",
          id: "stara_radnica_solved",
        },
      ],
    },
  ],
};