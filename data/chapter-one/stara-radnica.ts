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
    answerLabel: "Zadaj, aký predmet zostal v stene veže.",
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

  nextReflection:
    "Stopa v múre dokázala, že mesto uchováva aj udalosti, na ktoré by možno najradšej zabudlo.",

  route:
    "Zostaň na Hlavnom námestí a prejdi niekoľko krokov do jeho stredu k Maximiliánovej fontáne.",

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
            title: "Nahrávka Strážcu",
            icon: "🎙️",
            description:
              "Krátky záznam hlasu Strážcu Michalskej brány. Zatiaľ máš k dispozícii iba jeho prepis.",
            evidenceKind: "document",
            secretCode: "4",
            clue: "V strede námestia už stáročia tečie voda. Niekto nad ňou drží stráž.",
            evidenceOrder: 6,
            actId: "act-2",
            inspect: {
              kind: "transcript",
              intro: "Preskúmaj predmet a objav niečo, čo si nečakal.",
              hint: "Prečítaj si slová Strážcu ešte raz. Jedno z nich vyslovil dôraznejšie než ostatné.",
              foundText:
                "Objavil si číslo, ktoré ti na konci pomôže odomknúť tajomstvo.",
              hotspotLabel: "Zvýraznené slovo v prepise nahrávky",
              transcript: {
                before:
                  "„Hovorí sa, že mesto si pamätá všetko. Je to pravda. Tieto múry videli obliehanie aj mier, korunovácie aj požiare. Keď do radničnej veže narazila delová guľa, mesto ju nevyhodilo – nechalo ju v múre ako svedka. Pátrač tam vtedy stál so mnou a povedal: ‚Zapamätaj si",
                highlight: "štyri",
                after:
                  "veci, ktoré toto mesto nikdy nezabudne.‘ Viac nepovedal. A ja som odvtedy čakal, kým sa objaví niekto, kto bude pokračovať v jeho ceste.“",
              },
            },
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