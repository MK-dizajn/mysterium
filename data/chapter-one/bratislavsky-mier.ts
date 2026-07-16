import type { Scene } from "../../types/game";

export const bratislavskyMierScene: Scene = {
  id: "bratislavsky-mier",
  location: "Primaciálny palác",
  title: "9. Miestnosť, ktorá zmenila Európu",

  cinematicText:
  "Od fasády Primaciálneho paláca sa tentoraz nemusíš nikam presúvať. Zostávaš na správnom mieste. Ďalšia stopa sa nenachádza vonku, ale viaže sa k miestnosti za týmito múrmi, v ktorej sa po veľkej vojne rozhodovalo o budúcnosti Európy.",

  voiceLine:
    "Nie každá stopa sa dá nájsť pohľadom. Niekedy musíš spojiť miesto, udalosť a jej následok. Mier uzavretý v tomto paláci dostal meno mesta, no podpísali ho v miestnosti, ktorá znásobuje každý obraz.",

  investigation: {
    objective:
      "Použi pátračov historický záznam. Hľadaná miestnosť sa nachádza v Primaciálnom paláci a jej názov súvisí s predmetmi, ktoré opakujú obraz človeka stojaceho pred nimi.",
    detectiveHint:
      "Keď sa do takého predmetu pozrieš, uvidíš svoju vlastnú podobu. V paláci nimi bola vyzdobená celá reprezentačná sieň.",
    observationType: "deduction",
  },

  puzzle: {
    id: "puzzle-bratislavsky-mier",
    question:
      "V ktorej miestnosti Primaciálneho paláca bol 26. decembra 1805 podpísaný Bratislavský mier?",
    acceptedAnswers: [
      "zrkadlova sien",
      "zrkadlová sieň",
      "sien zrkadiel",
      "sieň zrkadiel",
      "zrkadlova sala",
      "zrkadlová sála",
      "hall of mirrors",
    ],
    hints: [
      "Názov miestnosti súvisí s odrazom obrazu.",
      "Odpoveď tvoria dve slová: Zrkadlová sieň.",
    ],
  },

  history: {
    id: "history-bratislavsky-mier",
    title: "Bratislavský mier z roku 1805",
    shortText:
      "V Zrkadlovej sieni Primaciálneho paláca bol podpísaný jeden z najvýznamnejších mierových dokumentov napoleonských vojen.",
    fullText:
      "Bratislavský mier bol podpísaný 26. decembra 1805 v Zrkadlovej sieni Primaciálneho paláca. Nasledoval po Napoleonovom víťazstve nad rakúskymi a ruskými vojskami v bitke pri Slavkove. Dokument podpísali zástupcovia francúzskeho cisára Napoleona a rakúskeho cisára Františka I. Mier výrazne zmenil politické usporiadanie Európy a oslabil postavenie Rakúska.",
  },

  artifact: {
    id: "artifact-bratislavsky-mier",
    title: "Bratislavský mier",
    icon: "🕊️",
    shortFact:
      "Mierová zmluva z 26. decembra 1805 bola podpísaná v Zrkadlovej sieni Primaciálneho paláca.",
    fullText:
      "Bratislava sa v roku 1805 na krátky čas ocitla v centre európskej diplomacie. V Primaciálnom paláci sa rokovalo o následkoch Napoleonovho víťazstva pri Slavkove. Zmluva vstúpila do dejín ako Bratislavský, v zahraničí aj Prešporský mier.",
  },

  nextInstruction:
  "Mier uzavrel poslednú historickú stopu. Teraz už máš všetky časti skladačky, no stále musíš pochopiť, čo ich spája.\n\nZostaň pri Primaciálnom paláci a otvor poslednú časť pátračovho prípadu.",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "bratislavsky_mier_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "bratislavsky_mier_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "evidence-peace-seal",
            title: "Pečať Bratislavského mieru",
            icon: "🕊️",
            description:
              "Laková pečať z mierového dokumentu uzavretého v Primaciálnom paláci. Na jej okraji je vyrytá ôsma dvojica číslic tajnej kombinácie.",
            evidenceKind: "document",
            secretCode: "05",
            evidenceOrder: 9,
            actId: "act-3",
          },
        },
      ],
    },
  ],

  branches: [
    {
      targetSceneId: "zlaty-presporsky-kluc",
      conditions: [
        {
          type: "flag",
          id: "bratislavsky_mier_solved",
        },
      ],
    },
  ],
};