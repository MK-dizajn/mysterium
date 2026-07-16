import type { Quest } from "../../types/game";

export const chapterOneQuests: Quest[] = [
  {
    id: "quest-golden-key",
    title: "Zlatý prešporský kľúč",
    description:
      "Nasleduj denník starého pátrača, preskúmaj desať zastávok historického mesta a pochop, čo Zlatý prešporský kľúč v skutočnosti otvára.",
    completedText:
      "Spojil si všetky stopy a získal Zlatý prešporský kľúč. Neotvára obyčajné dvere — odhaľuje pamäť mesta. Na konci denníka si však našiel dôkaz, že ide iba o prvý z viacerých stratených kľúčov.",
    reward: {
      score: 10,
    },
  },
];