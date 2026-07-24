import type { Scene } from "../../types/game";

export const michalskaBranaScene: Scene = {
  id: "michalska-brana",
  location: "Michalská brána",
  title: "1. Bod, od ktorého sa meria svet",

  cinematicText:
    "Pod klenbou Michalskej brány sa miešajú kroky návštevníkov s ozvenou starého mesta. Väčšina ľudí prejde ďalej bez zastavenia. Ty však vieš, že pátrač nezačal svoju cestu pohľadom nahor, ale miestom, od ktorého sa symbolicky meria celý svet.",

  voiceLine:
    "Nehľadaj značku, ktorú som tu zanechal ja. Hľadaj tú, ktorú tu zanechalo mesto. Mená sú roztrúsené po celom svete, no prvé z nich leží bližšie, než si myslíš.",

  investigation: {
    objective: `Postav sa priamo pod Michalskú bránu.

Nájdi kovový kruh v dlažbe s názvami miest a prezri si vzdialenosti, ktoré sú pri nich uvedené.

Pátračovo pravidlo znie: „Prvá stopa patrí mestu, ku ktorému vedie najkratšia cesta.“`,
    detectiveHint:
      "Pátrač nezačínal najvzdialenejšou stopou. Zaujímala ho tá, ku ktorej vedie najkratšia cesta.",
    observationType: "comparison",
  },

  npcGate: {
    requiredFlagId: "talked_to_michalska_guardian",
    eyebrow: "Stopa je zamknutá",
    title: "Brána mlčí...",
    paragraphs: [
      "Pod klenbou Michalskej brány cítiš zvláštny nepokoj. Nultý bod je priamo pred tebou, no jeho význam ti zatiaľ uniká.",
      "V tieni brány stojí osamelá postava. Zdá sa, že čaká práve na teba. Možno pozná spôsob, akým starý pátrač čítal stopy mesta.",
    ],
    buttonLabel: "Osloviť Strážcu",
  },

  detectiveNote: {
    number: 1,
    title: "Nultý bod",
    imageSrc: "/images/journal/detective-note-entry-1.png",
    imageAlt:
      "Odtrhnutý list zo starého pátračovho denníka s prvým zápisom.",
    introText:
      "Strážca ti podáva zažltnutý list. Papier neukrýva hotovú odpoveď — iba pravidlo, podľa ktorého starý pátrač začínal svoje vyšetrovania.",
    continueLabel: "Preskúmať nultý bod",
    unlockFlagId: "talked_to_michalska_guardian",
    readFlagId: "read_detective_note_nulty_bod",
  },

  puzzle: {
    id: "puzzle-michalska-brana",
    answerLabel: "Zapíš názov mesta, ku ktorému vedie najkratšia cesta.",
    acceptedAnswers: ["vieden", "viedeň", "vienna", "wien"],
    hints: [
      "Nepozeraj iba na názvy miest. Porovnaj čísla, ktoré označujú ich vzdialenosť.",
      "Hľadané mesto je hlavným mestom susedného Rakúska.",
      "Správna odpoveď je Viedeň.",
    ],
  },

  history: {
    id: "history-michalska-brana",
    title: "Miesto, od ktorého sa meria svet",
    shortText:
      "Práve si našiel bratislavský nultý kilometer, ktorý väčšina návštevníkov prekročí bez povšimnutia.",
    fullText:
      "Kovový kilometrovník pod Michalskou bránou ukazuje smery a vzdialenosti európskych i svetových miest od Bratislavy. Najbližším z uvedených hlavných miest je Viedeň. Nad tebou pritom stojí jediná zachovaná brána pôvodného mestského opevnenia. Kedysi ňou ľudia vstupovali do chráneného mesta. Dnes si cez ňu symbolicky vstúpil do pátračovho prípadu.",
  },

  artifact: {
    id: "artifact-nulty-kilometer",
    title: "Odtlačok nultého kilometra",
    icon: "🧭",
    shortFact:
      "Prvá stopa neviedla k tajnému znaku, ale ku skutočnému detailu ukrytému priamo pod nohami.",
    fullText:
      "Kovový kruh spája Bratislavu so vzdialenými miestami sveta. Pátrač si však nevybral najvzdialenejšie mesto. Zaujímalo ho to najbližšie. Niekedy nie je najťažšie nájsť vzdialenú odpoveď, ale všimnúť si tú, ktorá leží priamo pred tebou.",
  },

  nextInstruction:
    "Keď vyslovíš meno najbližšieho mesta, v denníku sa odkryje prvá veta: „Brána je iba začiatok. Ďalšiu stopu hľadaj v dome, ktorý mal medzi susedmi sotva miesto.“",

  dialogues: [
    {
      id: "dialogue-strazca-michalska",
      title: "Strážca Michalskej brány",
      nodes: [
        {
          id: "start",
          speaker: "Strážca Michalskej brány",
          text:
            "Každý deň tadiaľto prejdú stovky ľudí. Obdivujú vežu, fotografujú bránu a pokračujú ďalej. Pátrač si však všimol to, po čom všetci kráčajú.",
          choices: [
            {
              id: "choice-ask-below",
              text: "Čo mám hľadať pod bránou?",
              nextDialogueNodeId: "under-gate",
            },
            {
              id: "choice-ask-patrac",
              text: "Čo ti tu pátrač zanechal?",
              nextDialogueNodeId: "handover-note",
            },
          ],
        },
        {
          id: "under-gate",
          speaker: "Strážca Michalskej brány",
          text:
            "Je tam bod, ktorý spája Bratislavu so svetom. Pátrač však nechcel, aby som ti prezradil mesto. Zanechal iba pravidlo, podľa ktorého ho dokážeš nájsť sám.",
          choices: [
            {
              id: "choice-see-note",
              text: "Ukáž mi jeho pravidlo.",
              nextDialogueNodeId: "handover-note",
            },
          ],
        },
        {
          id: "handover-note",
          speaker: "Strážca Michalskej brány",
          text:
            "Strážca sa na chvíľu odmlčí. Zo svojho kabáta vytiahne starý zažltnutý papier, opatrne ho rozloží a podá ti ho. „Pátrač mi povedal, že ak sa raz objaví niekto, kto bude pokračovať v jeho práci, mám mu odovzdať toto. Odpoveď v ňom nehľadaj. Naučí ťa iba to, ako rozmýšľal.“",
          choices: [
            {
              id: "choice-accept-note",
              text: "Prijať Pátračov zápis",
              actions: [
                {
                  type: "setFlag",
                  flagId: "talked_to_michalska_guardian",
                },
                {
                  type: "addInventoryItem",
                  item: {
                    id: "detective-note-nulty-bod",
                    title: "Pátračov zápis č. 1 – Nultý bod",
                    icon: "📜",
                    description:
                      "Zažltnutá strana zo strateného denníka. Neobsahuje hotovú odpoveď, ale pravidlo: z množstva ciest vybrať tú najkratšiu.",
                    evidenceKind: "document",
                    actId: "act-1",
                  },
                },
                {
                  type: "startQuest",
                  questId: "quest-golden-key",
                },
                {
                  type: "setScreen",
                  screen: "puzzle",
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  npcs: [
    {
      id: "npc-strazca-michalska",
      name: "Strážca Michalskej brány",
      role: "Tichý pozorovateľ",
      description:
        "Postava stojaca v tieni poslednej zachovanej brány mestského opevnenia. Zdá sa, akoby sledovala ľudí, ktorí prechádzajú ponad stopu bez povšimnutia.",
      dialogueId: "dialogue-strazca-michalska",
    },
  ],

  events: [
    {
      trigger: "puzzleSolved",
      conditions: [
        {
          type: "flag",
          id: "michalska_brana_solved",
          value: false,
        },
      ],
      actions: [
        {
          type: "setFlag",
          flagId: "michalska_brana_solved",
        },
        {
          type: "addInventoryItem",
          item: {
            id: "evidence-zero-kilometre-token",
            title: "Žetón nultého kilometra",
            icon: "🧭",
            description:
              "Mosadzný žetón s vyrytými smermi svetových miest. Na jeho zadnej strane sa nachádza prvá dvojica číslic tajnej kombinácie.",
            evidenceKind: "object",
            secretCode: "00",
            evidenceOrder: 1,
            actId: "act-1",
          },
        },
      ],
    },
  ],

  branches: [
    {
      targetSceneId: "tajna-stopa-michalska",
      conditions: [
        {
          type: "flag",
          id: "michalska_brana_solved",
        },
      ],
    },
  ],
};