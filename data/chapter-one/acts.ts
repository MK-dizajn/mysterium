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
    ending: {
      kind: "guardianVoice",
      label: "Hlas Strážcu",
      text:
        "Tri stopy máš za sebou. Pátrač mi povedal, že kto dôjde až sem, nezačal náhodou. Ešte nie je čas na otázky. Prijmi prvý útržok fotografie a pokračuj.",
      reward: {
        id: "torn-photo-fragment-act-1",
        title: "Prvý útržok fotografie",
        icon: "🖼️",
        description:
          "Útržok starej fotografie, ktorý ti odovzdal Strážca. Na zadnej strane je časť ručne napísanej správy, ktorá vedie k ďalším miestam vyšetrovania.",
        actId: "act-2",
      },
      continueLabel: "Prijať útržok",
    },
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
    ending: {
      kind: "seal",
      label: "Pečať",
      text:
        "Vzdelanie, znak aj stopa vojny. Mesto si pamätá všetko, aj to, na čo by najradšej zabudlo. Druhý útržok fotografie je tvoj.",
      reward: {
        id: "torn-photo-fragment-act-2",
        title: "Druhý útržok fotografie",
        icon: "🖼️",
        description:
          "Druhý útržok starej fotografie, ktorý ti pripadol po pečati. Po spojení s prvou časťou odhaľuje, že všetky doterajšie stopy smerujú k poslednému tajomstvu pátračovho denníka.",
        actId: "act-3",
      },
      continueLabel: "Prijať útržok",
    },
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
    ending: {
      kind: "keyAssembly",
      label: "Kľúč je kompletný",
      text:
        "Tri zuby do seba zapadli bez jedinej škáry, akoby na seba čakali celé storočia. V rukách držíš Zlatý prešporský kľúč. Neotvára obyčajný zámok. Strážca vie, ktorý.",
      reward: {
        id: "torn-photo-fragment-act-3",
        title: "Tretí útržok fotografie",
        icon: "🖼️",
        description:
          "Tretí útržok starej fotografie, ktorý sa objavil v okamihu, keď sa kľúč spojil.",
        actId: "act-3",
      },
      continueLabel: "Prijať útržok",
    },
  },
];
