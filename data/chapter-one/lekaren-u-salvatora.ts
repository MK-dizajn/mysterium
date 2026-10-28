import type { Scene } from "../../types/game";

export const lekarenUSalvatoraScene: Scene = {
  id: "lekaren-u-salvatora",
  location: "Lekáreň U Salvátora",
  title: "3. Mysli na koniec",

  cinematicText:
  "Po Michalskej a Ventúrskej ulici prichádzaš na Panskú ulicu k historickej Lekárni U Salvátora. Si na správnom mieste. Jej fasáda však ukrýva viac než názov a výzdobu — zostal na nej odkaz starší než samotná budova.",
  cinematicAudioSrc: "/audio/hlas-021-rozpravac.mp3",
  
  voiceLine:
    "Liečiteľ musí poznať nielen začiatok svojho rozhodnutia, ale aj jeho následky. Zapísal som si preto jedinú radu: Čokoľvek robíš, mysli na koniec. Nájdi miesto, odkiaľ tieto slová pochádzajú.",
  voiceLineAudioSrc: "/audio/hlas-022-patrac.mp3",

  investigation: {
    objective:
        "Postav sa pred Lekáreň U Salvátora a pozorne si prezri jej vonkajšie priečelie. Pátrač nehľadá názov lekárne ani súčasné nápisy. Hľadá starý latinský odkaz a rok, ktorým sa končí.",
    detectiveHint:
        "Keď nájdeš latinský text, nečítaj iba jeho začiatok. Skutočná stopa sa ukrýva na jeho úplnom konci.",
    observationType: "inscription",
   },

  puzzle: {
    id: "puzzle-lekaren-salvator",
    answerLabel: "Zadaj rok, ktorým sa končí latinský nápis.",
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

  nextReflection:
    "Rok 1658 bol druhou časťou skladačky. Pátrač tým pripomenul, že každé rozhodnutie má svoj dôsledok.",

  // Bez čísla domu – číslo by sa dalo zameniť za stopu alebo číslicu kódu.
  route:
    "Pokračuj po Panskej ulici späť na Ventúrsku. Zastav sa pri budove Academie Istropolitany s pamätnou tabuľou.",

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
            id: "evidence-apothecary-seal",
            title: "Pátračova strana z denníka",
            icon: "📜",
            description:
              "Zažltnutá strana vytrhnutá z pátračovho denníka. Pátrač si na ňu prepísal latinský odkaz z Lekárne U Salvátora.",
            evidenceKind: "document",
            secretCode: "1",
            clue: "Vráť sa na ulicu, kde sa v meste prvýkrát učilo ako na univerzite. Hľadaj dom poznania.",
            evidenceOrder: 3,
            actId: "act-1",
            inspect: {
              kind: "hotspot",
              art: "journalPage",
              intro: "Preskúmaj predmet a objav niečo, čo si nečakal.",
              hint: "Aj druhá strana listu môže niečo skrývať. Pozri sa, čo si pátrač poznačil.",
              foundText:
                "Objavil si číslo, ktoré ti na konci pomôže odomknúť tajomstvo.",
              hotspotLabel: "Podčiarknutá číslica v poznámke na zadnej strane listu",
            },
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
          itemId: "evidence-brass-house-token",
        },
        {
          type: "inventoryItem",
          itemId: "evidence-apothecary-seal",
        },
      ],
    },
  ],
};