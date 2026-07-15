import type { Scene } from "../../types/game";

export const lekarenUSalvatoraScene: Scene = {
  id: "lekaren-u-salvatora",
  location: "Lekáreň U Salvátora",
  title: "3. Mysli na koniec",

  cinematicText:
    "Pátračova stopa ťa privedie na Panskú ulicu. Pred tebou stojí historická lekáreň, ktorej fasáda ukrýva viac než iba meno a výzdobu. Niekde na tomto mieste zostal odkaz starší než samotná budova, v ktorej sa dnes nachádza.",

  voiceLine:
    "Liečiteľ musí poznať nielen začiatok svojho rozhodnutia, ale aj jeho následky. Pátrač si preto zapísal jedinú radu: Čokoľvek robíš, mysli na koniec. Nájdi miesto, odkiaľ tieto slová pochádzajú.",

  investigation: {
    objective:
        "Prezri si priečelie Lekárne U Salvátora. Pátrač nehľadá názov budovy ani výklady. Hľadá historický latinský odkaz, ktorý prežil stáročia.",
    detectiveHint:
        "Keď nájdeš latinský text, nečítaj iba jeho začiatok. Skutočná stopa sa ukrýva na jeho úplnom konci.",
    observationType: "inscription",
   },

  puzzle: {
    id: "puzzle-lekaren-salvator",
    question:
      "Nájdi pri Lekárni U Salvátora latinský nápis, ktorý sa končí slovami „respice finem“. Aký rok je uvedený na jeho konci?",
    acceptedAnswers: [
      "1658",
      "rok 1658",
      "v roku 1658",
      "tisic seststo patdesiat osem",
      "tisíc šesťsto päťdesiatosem",
    ],
    hints: [
      "Hľadaj historický nápis, nie aktuálnu tabuľu s názvom lekárne.",
      "Číslo sa nachádza na konci latinského odkazu.",
    ],
  },

  history: {
    id: "history-lekaren-salvator",
    title: "Odkaz, ktorý prežil stáročia",
    shortText:
      "Latinský nápis pripomína, že pri každom rozhodnutí treba myslieť na jeho následky.",
    fullText:
      "Nápis „Quidquid agis, prudenter agas et respice finem, 1658“ možno preložiť ako: „Čokoľvek robíš, rob rozvážne a mysli na koniec.“ Rok 1658 odkazuje na staršiu históriu lekárne a jej zariadenia. Dnešná budova Lekárne U Salvátora vznikla až v roku 1904 pre lekárnika Rudolfa Adlera. Vo vnútri sa však nachádza barokový lekárenský mobiliár s viac než 300-ročnou históriou, ktorý sa spája s niekdajšou jezuitskou lekárňou.",
  },

  artifact: {
    id: "artifact-lekaren-u-salvatora",
    title: "Lekáreň U Salvátora",
    icon: "⚕️",
    shortFact:
      "Historická lekáreň ukrýva latinský odkaz z roku 1658: pri všetkom, čo robíš, mysli na koniec.",
    fullText:
      "Lekáreň U Salvátora patrí medzi najvýraznejšie historické lekárne Bratislavy. Budova pochádza z roku 1904, no jej príbeh siaha omnoho hlbšie. Vzácny barokový mobiliár má viac než 300 rokov a latinský nápis pripomína zásadu, ktorá platila pre lekárnikov aj pátračov: konať rozvážne a myslieť na následky.",
  },

  nextInstruction:
    "Keď zadáš správny rok, v denníku sa odkryje ďalšia veta: „Prvý údaj označil dom. Druhý patrí odkazu, ktorý prežil stáročia. Čísla však nie sú kľúčom samy osebe. Na Ventúrskej hľadaj miesto, kde sa uchovávali príbehy ľudí, ktorí mesto navštívili.“",

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "lekaren_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "lekaren_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "salvator-1658-clue",
            title: "Odkaz z roku 1658",
            icon: "📜",
            description:
              "Druhá časť pátračovej šifry. Latinský odkaz pripomína: „Čokoľvek robíš, rob rozvážne a mysli na koniec.“",
          },
        },
      ],
    },
  ],

  branches: [
    {
      targetSceneId: "venturska-brana-spomienok",
      conditions: [
        {
          type: "inventoryItem",
          itemId: "golden-pressburg-key",
        },
        {
          type: "inventoryItem",
          itemId: "salvator-1658-clue",
        },
      ],
    },
  ],
};