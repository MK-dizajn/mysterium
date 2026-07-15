import type { Scene } from "../../types/game";

export const maximilianovaFontanaScene: Scene = {
  id: "maximilianova-fontana",
  location: "Maximiliánova fontána",
  title: "7. Strážca nad vodou",

  cinematicText:
    "Od radničnej veže ťa delí od ďalšej stopy iba niekoľko krokov. V strede Hlavného námestia stojí fontána, ktorá po stáročia sledovala trhy, oslavy aj nepokoje. Nad vodou sa dvíha postava muža, no mesto si dodnes nie je celkom isté, koho vlastne predstavuje.",

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
    "Keď potvrdíš rytierovu zbroj, v denníku sa objaví ďalší zápis: „Múr niesol ranu. Voda dostala strážcu. Teraz hľadaj palác, nad ktorého bránou spočíva váha cirkevnej moci.“ Pokračuj z Hlavného námestia na Primaciálne námestie.",

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
            id: "armoured-guardian-clue",
            title: "Zbroj mestského strážcu",
            icon: "⚔️",
            description:
              "Šiesta časť pátračovej šifry. Postava nad fontánou pripomína, že ochranca mesta nemusí mať iba jedno meno.",
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