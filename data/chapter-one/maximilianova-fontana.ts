import type { Scene } from "../../types/game";

export const maximilianovaFontanaScene: Scene = {
  id: "maximilianova-fontana",
  location: "Maximiliánova fontána",
  title: "7. Strážca nad vodou",

  cinematicText:
  "Od Starej radnice prejdeš iba niekoľko krokov do stredu Hlavného námestia. Si na správnom mieste. Pred tebou stojí fontána, ktorá po stáročia sledovala trhy, oslavy aj nepokoje mesta.",

  voiceLine:
    "Meno môže klamať. Legenda môže prežiť pravdu. Preto sa nespoliehaj na názov fontány. Pozri sa na postavu nad vodou a urči, čím bola pripravená chrániť mesto.",

  investigation: {
    objective:
      "Prezri si postavu stojacu úplne na vrchole fontány. Sústreď sa na jej odev a výstroj, nie na názov pamiatky.",
    detectiveHint:
      "Nehľadáš konkrétne meno. Zisti, akým druhom bojovníka postava podľa svojho vzhľadu je.",
    observationType: "observation",
  },

  puzzle: {
    id: "puzzle-maximilianova-fontana",
    question:
      "Čo má postava na vrchole fontány oblečené ako ochranu pri boji?",
    acceptedAnswers: [
      "brnenie",
      "zbroj",
      "rytierske brnenie",
      "rytierska zbroj",
      "platove brnenie",
      "plátové brnenie",
    ],
    hints: [
      "Pozri sa na celé telo postavy, nie iba na jej tvár.",
      "Takúto kovovú ochranu nosievali rytieri v boji.",
    ],
  },

  history: {
    id: "history-maximilianova-fontana",
    title: "Maximilián alebo Roland?",
    shortText:
      "Postava rytiera na vrchole fontány má dve identity a obe sa stali súčasťou príbehu Bratislavy.",
    fullText:
      "Maximiliánova fontána bola vytvorená v roku 1572 v kamenárskej dielni Andreasa Luttringera s finančnou podporou kráľa Maximiliána II. Postava na jej vrchole je odetá ako rytier v brnení. Podľa jednej interpretácie predstavuje samotného Maximiliána II. Iná tradícia v nej vidí legendárneho rytiera Rolanda, ochrancu mestských práv. Preto je pamiatka známa aj ako Rolandova fontána.",
  },

  artifact: {
    id: "artifact-maximilianova-fontana",
    title: "Maximiliánova fontána",
    icon: "⛲",
    shortFact:
      "Najznámejšiu bratislavskú fontánu stráži rytier, ktorého identita zostáva súčasťou mestskej legendy.",
    fullText:
      "Fontána stojí na Hlavnom námestí od roku 1572. Jej mohutná kruhová nádrž a vysoký stĺp s rytierom tvorili nielen výzdobu, ale pripomínali aj význam vody pre mesto. Postava môže predstavovať kráľa Maximiliána II. alebo legendárneho Rolanda. Bratislava si ponechala obe vysvetlenia.",
  },

  nextInstruction:
  "Rytier nad vodou pripomenul, že ochranca mesta nemusí mať iba jedno meno.\n\nZ Hlavného námestia pokračuj cez krátky priechod na Primaciálne námestie. Zastav sa pred hlavným priečelím Primaciálneho paláca.",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "maximilianova_fontana_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "maximilianova_fontana_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "evidence-guardian-buckle",
            title: "Rytierska spona strážcu",
            icon: "⚔️",
            description:
              "Kovová spona zdobená motívom rytiera z fontány. Na vnútornej strane je vyrytá šiesta dvojica číslic tajnej kombinácie.",
            evidenceKind: "object",
            secretCode: "72",
            evidenceOrder: 7,
            actId: "act-3",
          },
        },
      ],
    },
  ],

  branches: [
    {
      targetSceneId: "primacialny-palac",
      conditions: [
        {
          type: "flag",
          id: "maximilianova_fontana_solved",
        },
      ],
    },
  ],
};