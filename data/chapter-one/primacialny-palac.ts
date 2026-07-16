import type { Scene } from "../../types/game";

export const primacialnyPalacScene: Scene = {
  id: "primacialny-palac",
  location: "Primaciálny palác",
  title: "8. Láskavosť a spravodlivosť",

  cinematicText:
  "Z Hlavného námestia prechádzaš na susedné Primaciálne námestie. Pred tebou stojí svetlá fasáda Primaciálneho paláca. Si na správnom mieste. Pátrač teraz nehľadá meno majiteľa ani veľký erb, ale dve malé písmená ukrývajúce zásady moci.",

  voiceLine:
    "Moc bez zásad je iba prázdny titul. Arcibiskup preto nechal na fasáde dve vlastnosti, podľa ktorých sa mal rozhodovať. Nehľadaj celé slová. Nájdi ich začiatočné písmená.",

  investigation: {
    objective:
      "Prezri si strednú časť fasády Primaciálneho paláca. Hľadaj dve malé detské postavy, ktoré držia samostatné písmená.",
    detectiveHint:
      "Písmená predstavujú latinské slová pre láskavosť a spravodlivosť. Potrebuješ ich zapísať v poradí, v akom ich vidíš.",
    observationType: "symbol",
  },

  puzzle: {
    id: "puzzle-primacialny-palac",
    question:
      "Ktoré dve písmená držia postavy na fasáde Primaciálneho paláca?",
    acceptedAnswers: [
      "ci",
      "c i",
      "c a i",
      "c, i",
      "c-i",
      "c+i",
    ],
    hints: [
      "Hľadaj v strednej časti fasády dve detské postavy.",
      "Prvé písmeno je C a druhé I.",
    ],
  },

  history: {
    id: "history-primacialny-palac",
    title: "Clementia et Iustitia",
    shortText:
      "Písmená C a I znamenajú láskavosť a spravodlivosť — osobné heslo arcibiskupa Jozefa Batthyányho.",
    fullText:
      "Na fasáde Primaciálneho paláca držia dve detské postavy písmená C a I. Ide o skratku latinského hesla „Clementia et Iustitia“, teda „Láskavosť a spravodlivosť“. Heslo používal arcibiskup Jozef Batthyány, ktorý dal palác vybudovať v rokoch 1778 až 1781. Zaujímavosťou je, že prevzal heslo Márie Terézie, ale obrátil poradie slov.",
  },

  artifact: {
    id: "artifact-primacialny-palac",
    title: "Primaciálny palác",
    icon: "🏛️",
    shortFact:
      "Na fasáde paláca sa ukrýva heslo C a I — láskavosť a spravodlivosť.",
    fullText:
      "Primaciálny palác je jednou z najvýznamnejších klasicistických stavieb Bratislavy. Dal ho postaviť ostrihomský arcibiskup Jozef Batthyány. Fasáda neukazuje iba jeho erb a cirkevnú moc, ale aj zásady, ku ktorým sa hlásil: láskavosť a spravodlivosť.",
  },

  nextInstruction:
  "Láskavosť a spravodlivosť vytvorili ďalšiu časť skladačky. Palác však ukrýva ešte jednu stopu spojenú s udalosťou, ktorá zmenila Európu.\n\nZostaň pri Primaciálnom paláci. Ďalšia úloha sa viaže k jeho Zrkadlovej sieni a Bratislavskému mieru.",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "primacialny_palac_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "primacialny_palac_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "evidence-ci-emblem",
            title: "Emblém C · I",
            icon: "⚖️",
            description:
              "Medený emblém s písmenami C a I, symbolmi láskavosti a spravodlivosti. Na zadnej strane je vyrytá siedma dvojica číslic tajnej kombinácie.",
            evidenceKind: "symbol",
            secretCode: "81",
            evidenceOrder: 8,
            actId: "act-3",
          },
        },
      ],
    },
  ],

  branches: [
    {
      targetSceneId: "bratislavsky-mier",
      conditions: [
        {
          type: "flag",
          id: "primacialny_palac_solved",
        },
      ],
    },
  ],
};