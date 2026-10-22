import type { Act } from "../../types/game";

export const chapterOneActs: Act[] = [
  {
    id: "act-1",
    title: "Akt I – Prvé stopy",
    sceneIds: [
      "michalska-brana",
      "tajna-stopa-michalska",
      "lekaren-u-salvatora",
    ],
    lockLabel: "I",
  },
  {
    id: "act-2",
    title: "Akt II – Moc a poznanie",
    sceneIds: [
      "venturska-brana-spomienok",
      "mirbachov-palac",
      "stara-radnica",
    ],
    lockLabel: "II",
  },
  {
    id: "act-3",
    title: "Akt III – Posledné tajomstvo",
    sceneIds: [
      "maximilianova-fontana",
      "primacialny-palac",
      "bratislavsky-mier",
      "zlaty-presporsky-kluc",
    ],
    lockLabel: "III",
  },
];
