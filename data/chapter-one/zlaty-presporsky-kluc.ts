import type { Scene } from "../../types/game";

export const zlatyPresporskyKlucScene: Scene = {
  id: "zlaty-presporsky-kluc",
  location: "Pátračov denník",
  title: "10. Zlatý prešporský kľúč",

  cinematicText:
  "Zostávaš pri Primaciálnom paláci, no pozornosť sa už neupiera na ďalšiu budovu. Všetky indície, ktoré si počas cesty získal, sa pred tebou spájajú do jedného obrazu. Číslo domu, latinský odkaz, meno kráľa, rodový erb, rana v múre, strážca nad vodou, láskavosť, spravodlivosť aj mier. Jednotlivo sú úlomkami minulosti. Spolu vytvárajú význam Zlatého prešporského kľúča.",

  voiceLine:
    "Hľadal si kľúč z kovu, no celý čas si držal iba jeho časti. Mesto ho nerozdelilo podľa tvaru, ale podľa spomienok. Teraz vyslov, čo všetky nájdené stopy spoločne chránia.",

  investigation: {
    objective:
      "Otvor inventár a pripomeň si všetky indície získané počas kapitoly. Nehľadaj medzi nimi rovnaké číslo ani písmeno. Hľadaj spoločný význam všetkých miest, udalostí a ľudí.",
    detectiveHint:
      "Domy, nápisy, erby aj poškodené múry prežili svojich tvorcov. Vďaka nim mesto nezabudlo, čo sa v ňom odohralo.",
    observationType: "deduction",
  },

  puzzle: {
    id: "puzzle-zlaty-presporsky-kluc",
    question:
      "Čo podľa pátračovho denníka všetky nájdené stopy spoločne uchovávajú?",
    acceptedAnswers: [
      "pamat mesta",
      "pamäť mesta",
      "spomienky mesta",
      "spomienku mesta",
      "historiu mesta",
      "históriu mesta",
      "minulost mesta",
      "minulosť mesta",
      "pamat bratislavy",
      "pamäť bratislavy",
      "spomienky bratislavy",
    ],
    hints: [
      "Nejde o konkrétny predmet ani osobu. Ide o to, čo zostáva po udalostiach a ľuďoch.",
      "Pátrač od začiatku tvrdil, že mesto si pamätá všetko.",
    ],
  },

  history: {
    id: "history-zlaty-presporsky-kluc",
    title: "Mesto ako živá pamäť",
    shortText:
      "Historické mesto nie je iba súbor budov. Každý detail môže uchovávať spomienku na ľudí a udalosti, ktoré ho formovali.",
    fullText:
      "Počas cesty si neobjavoval izolované pamiatky. Nultý kilometer, najužší dom, starý latinský odkaz, prvá univerzita, šľachtický erb, delová guľa, mestský strážca, arcibiskupské heslo aj mierová zmluva sú rôznymi podobami pamäti Bratislavy. Niektoré stopy vznikli zámerne, iné zostali po vojnách alebo po ľuďoch, ktorí už dávno odišli. Spoločne dokazujú, že mesto rozpráva svoj príbeh tým, ktorí sa naučia pozerať.",
  },

  artifact: {
    id: "artifact-pamat-stareho-presporka",
    title: "Pamäť starého Prešporka",
    icon: "📖",
    shortFact:
      "Prvá kapitola odhalila, že Zlatý prešporský kľúč neotvára dvere, ale spomienky mesta.",
    fullText:
      "Zlatý prešporský kľúč je symbolom schopnosti čítať mesto ako denník. Každá fasáda, nápis, poškodenie či umelecký detail môže byť zápisom, ktorý prežil celé generácie. Kľúč patrí tomu, kto tieto zápisy dokáže nájsť, pochopiť a uchovať.",
  },

  nextInstruction:
  "Zlatý prešporský kľúč sa pred tebou konečne odhalil. Neotvára obyčajné dvere — odhaľuje pamäť mesta.\n\nNa poslednej strane však zostal útržok mapy a veta: „Prešporok neukrýval jeden kľúč. Toto bol iba prvý.“ Prvý prípad sa skončil. Pátranie pokračuje v ďalšej kapitole.",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "zlaty_presporsky_kluc_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "zlaty_presporsky_kluc_solved",
        },
        {
          type: "setFlag",
          flagId: "chapter_one_completed",
        },
        {
          type: "completeQuest",
          questId: "quest-golden-key",
        },
        {
          type: "addScore",
          value: 10,
        },
        {
          type: "addInventoryItem",
          item: {
            id: "golden-pressburg-key-complete",
            title: "Zlatý prešporský kľúč",
            icon: "🗝️",
            description:
              "Prvý zo stratených kľúčov starého pátrača. Neotvára obyčajné dvere — odhaľuje spomienky, ktoré mesto ukrylo priamo pred očami svojich obyvateľov.",
          },
        },
        {
          type: "addInventoryItem",
          item: {
            id: "chapter-two-map-fragment",
            title: "Útržok mapy ďalšieho prípadu",
            icon: "🗺️",
            description:
              "Poškodený kúsok mapy s neznámym symbolom. Pátrač ho ukryl za poslednou stranou denníka. Dokazuje, že Zlatý prešporský kľúč bol iba začiatkom väčšieho prípadu.",
          },
        },
      ],
    },
  ],
};