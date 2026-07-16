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
    objective:
        "Postav sa priamo pod Michalskú bránu a prezri kovový kruh v dlažbe. Porovnaj mestá a vzdialenosti, ktoré sú na ňom uvedené.",
    detectiveHint:
        "Pátrač nezačínal najvzdialenejšou stopou. Zaujímala ho tá, ku ktorej vedie najkratšia cesta.",
    observationType: "comparison",
   },

  puzzle: {
    id: "puzzle-michalska-brana",
    question:
      "Nájdi pod bránou kovový kruh so svetovými mestami. Pátračovo pravidlo znie: „Prvá stopa patrí mestu, ku ktorému vedie najkratšia cesta.“ Ktoré mesto spomedzi uvedených názvov hľadáš?",
    acceptedAnswers: ["vieden", "viedeň", "vienna", "wien"],
    hints: [
      "Porovnaj vzdialenosti uvedené pri jednotlivých mestách.",
      "Hľadané mesto je hlavným mestom susedného Rakúska.",
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
              id: "choice-start-investigation",
              text: "Pozriem sa po mieste sám.",
              actions: [
                {
                  type: "setFlag",
                  flagId: "talked_to_michalska_guardian",
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
        {
          id: "under-gate",
          speaker: "Strážca Michalskej brány",
          text:
            "Je to bod, ktorý spája Bratislavu so svetom. Pátrač z množstva vzdialených miest vybral jediné. To, ktoré je k nám najbližšie.",
          choices: [
            {
              id: "choice-accept-quest",
              text: "Nájdem ho.",
              actions: [
                {
                  type: "setFlag",
                  flagId: "talked_to_michalska_guardian",
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