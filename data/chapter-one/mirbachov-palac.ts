import type { Scene } from "../../types/game";

export const mirbachovPalacScene: Scene = {
  id: "mirbachov-palac",
  location: "Mirbachov palác",
  title: "5. Znak posledných pánov",

  cinematicText:
  "Z Ventúrskej prichádzaš na Františkánske námestie. Oproti kostolu stojí bohato zdobený Mirbachov palác. Si na správnom mieste. Pátrač však nehľadá jeho najvýraznejšiu ozdobu, ale znak človeka, ktorého rod tu zanechal svoju stopu.",

  voiceLine:
    "Majitelia prichádzajú a odchádzajú. Ich mená vyblednú, no znaky zostávajú nad hlavami tých, ktorí sa nikdy nepozrú nahor. Nájdi symbol ukrytý pod korunou.",

  investigation: {
    objective:
      "Postav sa pred hlavné priečelie Mirbachovho paláca a prezri jeho hornú strednú časť. Nad oknami hľadaj výzdobu zakončenú korunou.",
    detectiveHint:
      "Pátrač nehľadá sochu ani letopočet. Hľadá znak, ktorým šľachtický rod označoval svoj majetok a pôvod.",
    observationType: "symbol",
  },

  puzzle: {
    id: "puzzle-mirbachov-palac",
    question:
      "Aký druh rodového znaku sa nachádza v hornej strednej časti fasády pod grófskou korunou?",
    acceptedAnswers: [
      "erb",
      "rodovy erb",
      "rodový erb",
      "slachticky erb",
      "šľachtický erb",
      "znak",
      "rodovy znak",
      "rodový znak",
    ],
    hints: [
      "Pozri sa úplne hore do stredu priečelia.",
      "Takýto znak býva tvorený štítom a označuje šľachtický rod.",
    ],
  },

  history: {
    id: "history-mirbachov-palac",
    title: "Palác, ktorý sa stal galériou",
    shortText:
      "Rodový erb na fasáde patril Nyáryovcom, predposledným súkromným majiteľom paláca.",
    fullText:
      "Mirbachov palác vznikol v rokoch 1768 až 1770 ako honosné mestské sídlo. Jeho hornú strednú časť zdobí rodový erb Nyáryovcov pod grófskou korunou. Predposledným majiteľom bol gróf Koloman Nyáry. Posledný majiteľ, Emil Mirbach, si uvedomoval historickú aj umeleckú hodnotu paláca. Budova neskôr prešla do vlastníctva mesta a od roku 1975 slúži ako Galéria mesta Bratislavy.",
  },

  artifact: {
    id: "artifact-mirbachov-palac",
    title: "Mirbachov palác",
    icon: "🎨",
    shortFact:
      "Na fasáde paláca zostal rodový erb jeho predposledných majiteľov.",
    fullText:
      "Mirbachov palác je jedným z najzachovalejších rokokových palácov starého Prešporka. Jeho fasáda spája prísnu symetriu s bohatou ornamentálnou výzdobou. Rodový erb nad priečelím pripomína Nyáryovcov, hoci palác dnes nesie meno až svojho posledného súkromného majiteľa Emila Mirbacha.",
  },

  nextInstruction:
  "Rodový erb pripomenul, že mená majiteľov sa môžu stratiť, no ich znaky zostávajú.\n\nZ Františkánskeho námestia pokračuj krátkou cestou na Hlavné námestie. Zastav sa pred vežou Starej radnice.",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "mirbachov_palac_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "mirbachov_palac_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "evidence-nyary-crest-seal",
            title: "Pečať rodu Nyáry",
            icon: "🛡️",
            description:
              "Tmavá vosková pečať s odtlačkom rodového erbu. Na zadnej strane je vyrytá štvrtá dvojica číslic tajnej kombinácie.",
            evidenceKind: "symbol",
            secretCode: "70",
            evidenceOrder: 5,
            actId: "act-2",
          },
        },
      ],
    },
  ],

  branches: [
    {
      targetSceneId: "stara-radnica",
      conditions: [
        {
          type: "flag",
          id: "mirbachov_palac_solved",
        },
      ],
    },
  ],
};