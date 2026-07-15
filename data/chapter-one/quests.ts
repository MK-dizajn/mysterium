import type { Quest } from "../../types/game";

export const chapterOneQuests: Quest[] = [
  {
    id: "quest-golden-key",
    title: "Zlatý prešporský kľúč",
    description:
      "Sleduj stopu starého pátrača a odhaľ význam zlatého kľúča, ktorý sa ukrýva v prvej časti kapitoly.",
    completedText:
      "Zistil si, že Zlatý prešporský kľúč neotvára obyčajné dvere. Otvára spomienky mesta.",
    reward: {
      score: 10,
    },
  },
];