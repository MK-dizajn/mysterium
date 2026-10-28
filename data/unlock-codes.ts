import type { UnlockCode } from "../types/game";

/*
 * Kódy „Mám kód“, ktoré odomknú časť hry. Ukladá sa iba odtlačok kódu
 * (engine/unlockCodes.ts – hashUnlockCode), samotný kód nikde v projekte nie je.
 * Nový kód: pridať riadok s odtlačkom a cieľom (kapitola, akt).
 * Je to ochrana pred náhodným otvorením, nie zabezpečenie (všetko beží v telefóne).
 */
export const unlockCodes: UnlockCode[] = [
  {
    id: "kapitola-1-akt-2",
    codeHash:
      "93b3ce4667248309c3176add459f5235ea7d30c287b849eb1fc4a5c65f281227",
    label: "Kapitola I · Akt II – Moc a poznanie",
    target: { chapterId: "bratislava-chapter-1", actId: "act-2" },
  },
  {
    id: "kapitola-1-akt-3",
    codeHash:
      "7a9bf03727a2e50b84eba5f2ddff072d8aed764e68dc850824c50961e4c83ca6",
    label: "Kapitola I · Akt III – Posledné tajomstvo",
    target: { chapterId: "bratislava-chapter-1", actId: "act-3" },
  },
];
