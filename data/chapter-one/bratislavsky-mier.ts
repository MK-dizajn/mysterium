import type { Scene } from "../../types/game";
import { COUNT_INSPECT_TIMING, THIRD_KEY_TOOTH_NOTCHES } from "./item-art";

export const bratislavskyMierScene: Scene = {
  id: "bratislavsky-mier",
  location: "Primaciálny palác",
  title: "9. Mier, ktorý zmenil Európu",

  cinematicText:
  "Od fasády Primaciálneho paláca sa tentoraz nemusíš nikam presúvať. Zostávaš na správnom mieste. Ďalšia stopa sa nenachádza vonku, ale viaže sa k miestnosti za týmito múrmi, v ktorej sa po veľkej vojne rozhodovalo o budúcnosti Európy.",
  cinematicAudioSrc: "/audio/hlas-057-rozpravac.mp3",

  voiceLine:
    "Nie každá stopa sa dá nájsť pohľadom. Niekedy musíš spojiť miesto, udalosť a jej následok. Mier uzavretý v tomto paláci dostal meno mesta, no podpísali ho v miestnosti, ktorá znásobuje každý obraz.",
  voiceLineAudioSrc: "/audio/hlas-058-patrac.mp3",

  // Overené v teréne (11/2026): na stene paláca je priamo napísaný Bratislavský mier,
  // Zrkadlová sieň sa na tabuliach nespomína – úloha sa pýta, čo sa tu podpísalo, nie kde.
  investigation: {
    objective:
      "Na vonkajšej stene Primaciálneho paláca nájdeš pripomienku udalosti z 26. decembra 1805. Pátrač sa nepýta, kde sa to stalo, ale čo sa tu uzavrelo.",
    detectiveHint:
      "Mier nesie meno mesta. Prečítaj si, čo je napísané na stene paláca.",
    observationType: "inscription",
  },

  puzzle: {
    id: "puzzle-bratislavsky-mier",
    answerLabel: "Zapíš, aký mier sa v tomto paláci podpísal.",
    question:
      "Aký mier bol 26. decembra 1805 podpísaný v Primaciálnom paláci?",
    acceptedAnswers: [
      "Bratislavský mier",
      "bratislavsky mier",
      "Prešporský mier",
      "mier",
      "Mier v Bratislave",
      "Peace of Pressburg",
      "Treaty of Pressburg",
      "Pressburger Frieden",
    ],
    // Pamätná tabuľa na paláci (overené fotkou 11/2026) uvádza dátum „26. XII. 1805“.
    hints: [
      "Nájdi na vonkajšej stene paláca pamätnú tabuľu. Hľadaj dátum 26. XII. 1805.",
      "Prečítaj si, aký mier tabuľa spomína. Odpoveď: Bratislavský mier.",
    ],
    nearMisses: [
      {
        answers: ["Slavkovský mier", "Slavkovsky mier"],
        message:
          "Slavkov bol bitka pred mierom. Hľadaj, v ktorom meste sa mier uzavrel.",
      },
    ],
  },

  history: {
    id: "history-bratislavsky-mier",
    title: "Bratislavský mier z roku 1805",
    shortText:
      "V Zrkadlovej sieni Primaciálneho paláca bol podpísaný jeden z najvýznamnejších mierových dokumentov napoleonských vojen.",
    fullText:
      "Bratislavský mier bol podpísaný 26. decembra 1805 v Zrkadlovej sieni Primaciálneho paláca. Nasledoval po Napoleonovom víťazstve nad rakúskymi a ruskými vojskami v bitke pri Slavkove. Dokument podpísali zástupcovia francúzskeho cisára Napoleona a rakúskeho cisára Františka I. Pamätná tabuľa na paláci uvádza, že mierovú listinu podpísali za francúzskeho cisára Talleyrand a za rakúskeho cisára Lichtenstein. Mier výrazne zmenil politické usporiadanie Európy a oslabil postavenie Rakúska.",
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

  nextReflection:
    "Mier uzavrel poslednú historickú stopu. Teraz už máš všetky časti skladačky, no stále musíš pochopiť, čo ich spája.",

  route:
    "Zostaň pri Primaciálnom paláci a otvor poslednú časť pátračovho prípadu.",

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
            title: "Tretí zub Zlatého kľúča",
            icon: "🗝️",
            description:
              "Tretí zub Zlatého kľúča. Patrí k mieru, ktorý sa v tomto paláci podpísal a zmenil Európu.",
            evidenceKind: "object",
            secretCode: "7",
            clue: "Všetky stopy máš pri sebe. Neodchádzaj – otvor denník a pozri sa na ne spolu.",
            inspect: {
              kind: "count",
              art: "keyTooth",
              intro: "Preskúmaj predmet a objav niečo, čo si nečakal.",
              hint: "Skús ťuknúť na to, čo vidíš na zube.",
              secondHint:
                "Označ každý detail, ktorý vidíš. Keď označíš všetky, objavíš číslo.",
              firstTapText: "Pokračuj. Zdá sa, že tu ešte niečo je.",
              timing: COUNT_INSPECT_TIMING,
              foundText:
                "Objavil si číslo, ktoré ti na konci pomôže odomknúť tajomstvo.",
              hotspotLabel: "Zárezy na hranách zubu kľúča",
              countPoints: THIRD_KEY_TOOTH_NOTCHES,
              countLabel: "Zárez",
              artPart: 3,
            },
            // Mini hra (N1): dátum z pamätnej tabule (overený fotkou 11/2026: „26. XII. 1805“).
            minigame: {
              type: "dateDials",
              intro:
                "Pečať mierovej listiny sa otvorí iba dátumom, ktorý mesto vytesalo do kameňa. Nastav deň, mesiac a rok.",
              dials: [
                {
                  label: "Deň",
                  values: Array.from({ length: 31 }, (_, index) => String(index + 1)),
                  answer: "26",
                },
                {
                  label: "Mesiac",
                  values: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"],
                  answer: "XII",
                },
                {
                  label: "Rok",
                  values: Array.from({ length: 21 }, (_, index) => String(1795 + index)),
                  answer: "1805",
                  start: "1800",
                },
              ],
              submitLabel: "Zlomiť pečať",
              wrongText: "Pečať drží. Niektorý údaj ešte nesedí s tabuľou.",
              hints: [
                "Dátum je na pamätnej tabuli na vonkajšej stene paláca.",
                "Mesiac je na tabuli zapísaný rímskou číslicou.",
                "Nastav 26 · XII · 1805.",
              ],
              compartment: {
                openText: "Pečať praskla. Vnútri leží tretí zub Zlatého kľúča.",
              },
            },
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