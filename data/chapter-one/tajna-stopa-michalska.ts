import type { Scene } from "../../types/game";

export const tajnaStopaMichalskaScene: Scene = {
  id: "tajna-stopa-michalska",
  location: "Najužší dom pri Michalskej bráne",
  title: "2. Dom, ktorý sa zmestil do medzery",

  cinematicText:
    "Pátračova veta ťa nenechá zájsť ďaleko. Hneď pri Michalskej bráne stojí dom taký úzky, že sa medzi okolité stavby takmer stráca. Väčšina ľudí okolo neho prejde bez toho, aby si uvedomila, že sa pozerá na jednu z najnezvyčajnejších stavieb starého mesta.",

  voiceLine:
    "Mesto niekedy ukryje tajomstvo tak, že ho nestavia do tieňa. Nechá ho priamo pred očami — iba mu vezme priestor. Nájdi dom, ktorý sa medzi svojich susedov takmer nezmestil.",

  investigation: {
    objective:
        "Zostaň pri Michalskej bráne a prezri si domy v jej bezprostrednej blízkosti. Hľadaj fasádu, ktorá je nápadne užšia než všetky ostatné.",
    detectiveHint:
        "Nehľadaj veľkosťou. Hľadaj miesto, ktoré akoby vzniklo iba preto, že medzi dvoma stavbami zostala úzka medzera.",
    observationType: "architecture",
   },

  puzzle: {
    id: "puzzle-tajna-stopa-michalska",
    question:
      "Nájdi mimoriadne úzky dom stojaci hneď vedľa Michalskej brány. Aké číslo má tento dom?",
    acceptedAnswers: ["15", "cislo 15", "číslo 15", "dom 15"],
    hints: [
      "Zostaň v bezprostrednej blízkosti Michalskej brány.",
      "Hľadaj úzky dom na pravej strane pri pohľade na bránu z Michalskej ulice.",
    ],
  },

  history: {
    id: "history-tajna-stopa",
    title: "Dom široký iba približne 1,30 metra",
    shortText:
      "Práve si našiel dom, ktorý väčšina ľudí prehliadne napriek tomu, že stojí priamo pri jednej z najznámejších pamiatok Bratislavy.",
    fullText:
      "Dom číslo 15 pri Michalskej bráne má šírku iba približne 1,30 metra. Vznikol v úzkom priestore medzi Michalskou vežou a susednou stavbou. Uvádza sa ako najužší dom v Bratislave a niekedy dokonca ako jeden z najužších domov v Európe. Je ukážkou toho, ako sa v husto zastavanom stredovekom meste využil prakticky každý dostupný kúsok priestoru.",
  },

  artifact: {
    id: "artifact-najuzsi-dom",
    title: "Najužší dom Bratislavy",
    icon: "🏠",
    shortFact:
      "Dom číslo 15 pri Michalskej bráne má šírku iba približne 1,30 metra.",
    fullText:
      "Nenápadná stavba pri Michalskej bráne pripomína, že najzaujímavejšie mestské objavy nemusia byť najväčšie. Dom sa tiesni v úzkej medzere medzi okolitými stavbami a mnoho návštevníkov si ho napriek jeho výnimočnosti vôbec nevšimne.",
  },

  nextInstruction:
    "Po zadaní čísla domu sa na okraji pátračovho denníka objaví ďalší zápis: „Číslo si zapamätaj. Nie je to odpoveď, ale prvý údaj zámku. Pokračuj ulicou k miestu, nad ktorým bdie Spasiteľ.“",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "tajna_stopa_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "tajna_stopa_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "golden-pressburg-key",
            title: "Prvý údaj zlatého kľúča",
            icon: "🔢",
            description:
              "Číslo 15 zapísané v denníku starého pátrača. Je označené ako prvý údaj zámku, ktorý má viesť k Zlatému prešporskému kľúču.",
          },
        },
      ],
    },
  ],

  branches: [
    {
      targetSceneId: "lekaren-u-salvatora",
      conditions: [
        {
          type: "flag",
          id: "tajna_stopa_solved",
        },
      ],
    },
  ],
};