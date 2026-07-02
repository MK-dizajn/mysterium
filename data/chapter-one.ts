import type { Chapter } from "../types/game";

export const chapterOne: Chapter = {
  id: "bratislava-chapter-1",
  city: "Bratislava",
  title: "Stratený denník starého pátrača",
  subtitle: "Kapitola I: Zlatý prešporský kľúč",
  introLines: [
    "Mesto si pamätá všetko.",
    "Niektoré tajomstvá čakali celé stáročia.",
    "Ak toto čítaš, znamená to, že som zlyhal.",
  ],
  scenes: [
    {
      id: "michalska-brana",
      location: "Michalská brána",
      title: "1. Nultý bod",
      cinematicText:
        "Pod klenbou Michalskej brány sa stretávajú cesty sveta. Starý pátrač tu zanechal prvú stopu.",
      voiceLine:
        "Začni tam, kde králi vstupovali do mesta. Pozri sa pod nohy. Nie všetko, čo je vyryté v kove, je iba ozdoba.",
      puzzle: {
        id: "puzzle-michalska-brana",
        question:
          "Postav sa na kovový kruh nultého kilometra. Nájdi mesto s najmenšou a najväčšou vzdialenosťou. Zadaj jeho názov.",
        acceptedAnswers: ["vieden", "viedeň", "vienna"],
        hints: [
          "Hľadaj mesto s najmenším číslom kilometrov.",
          "Je to hlavné mesto Rakúska.",
        ],
      },
      history: {
        id: "history-michalska-brana",
        title: "Michalská brána",
        shortText:
          "Jediná zachovaná brána stredovekého opevnenia Bratislavy.",
        fullText:
          "Michalská brána pochádza zo stredovekého opevnenia mesta a dodnes tvorí jeden z najvýraznejších vstupov do historického jadra. Kovový nultý kilometer pod bránou ukazuje vzdialenosti viacerých svetových miest. Väčšina ľudí po ňom prejde bez povšimnutia, no práve takéto detaily budú v Mysteriách rozhodovať.",
      },
      artifact: {
        id: "artifact-michalska-brana",
        title: "Michalská brána",
        icon: "🏰",
        shortFact: "Brána, kadiaľ do mesta vstupovali kupci, stráže aj králi.",
        fullText:
          "Michalská brána je poslednou zachovanou mestskou bránou Bratislavy. Kedysi bola súčasťou obranného systému mesta a jej veža slúžila ako pozorovací bod.",
      },
      nextInstruction:
        "Pokračuj dole Michalskou ulicou smerom do mesta. Keď sa ulica zmení na Ventúrsku, hľadaj po pravej strane Lekáreň U Salvátora.",

      events: [
        {
          trigger: "puzzleSolved",
          actions: [
            {
              type: "addScore",
              value: 10,
            },
          ],
        },
      ],
    },
  ],
};