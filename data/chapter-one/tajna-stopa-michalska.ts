import type { Scene } from "../../types/game";

export const tajnaStopaMichalskaScene: Scene = {
  id: "tajna-stopa-michalska",
  location: "Najužší dom pri Michalskej bráne",
  title: "2. Dom, ktorý sa zmestil do medzery",

  cinematicText:
  "Od Michalskej brány stačí urobiť len niekoľko krokov. Medzi okolitými budovami stojí nenápadný dom, ktorý väčšina návštevníkov ani nezaregistruje. Si na správnom mieste. Práve tu sa ukrýva jedna z najnezvyčajnejších stavieb starého Prešporka.",

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
  "Číslo bolo iba prvou časťou skladačky. Samo osebe ešte nič neotvára.\n\nPokračuj Michalskou ulicou smerom na Ventúrsku a následne na Panskú ulicu. Tvojou ďalšou zastávkou je historická Lekáreň U Salvátora.",

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
            id: "evidence-brass-house-token",
            title: "Mosadzný domový štítok",
            icon: "🏷️",
            description:
              "Malý mosadzný štítok s obrysom úzkeho domu. Na zadnej strane je vyrytá prvá dvojica číslic tajnej kombinácie.",
            evidenceKind: "object",
            secretCode: "15",
            evidenceOrder: 2,
            actId: "act-1",
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