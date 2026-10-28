import type { Condition } from "../engine/conditions";

export type GameId = string;
export type ChapterId = string;
export type SceneId = string;
export type ActId = string;
export type PuzzleId = string;
export type ArtifactId = string;
export type CodexEntryId = string;

export type Artifact = {
  id: ArtifactId;
  title: string;
  icon: string;
  shortFact: string;
  fullText: string;
};

export type EvidenceKind =
  | "object"
  | "document"
  | "symbol"
  | "fragment";

/**
 * Ako hráč hľadá číslicu na predmete (obrazovka „Prezrieť“, krok B1b-2).
 * Predmet bez inspect má číslicu nájdenú hneď po získaní.
 */
export type ItemInspectArt =
  | "token"
  | "journalPage"
  | "squareMap"
  | "oldTownMap"
  | "educationSeal"
  | "keyTooth";

/** Poloha prvku na počítanie na líci predmetu (0 až 1 zľava a zhora). */
export type InspectCountPoint = {
  x: number;
  y: number;
  /** Názov prvku pre čítačku (napríklad „Okienko“); inak countLabel predmetu. */
  label?: string;
};

/** Kedy sa ukážu nápovedy a „Ukáž číslicu“ (ms od otvorenia alebo poslednej aktivity). */
export type InspectTiming = {
  hintMs: number;
  secondHintMs?: number;
  revealMs: number;
};

export type ItemInspectTranscript = {
  before: string;
  /** Zvýraznené slovo; kliknutím naň hráč objaví číslicu. */
  highlight: string;
  after: string;
};

export type ItemInspect = {
  /** hotspot = miesto na kreslenom predmete, transcript = slovo v prepise. */
  kind: "hotspot" | "count" | "transcript";
  /** Ktorý kreslený obrázok predmetu sa použije (pri prepise nie je). */
  art?: ItemInspectArt;
  /** Úvodný text – tajomný, neprezrádza, že a kde je niečo ukryté. */
  intro: string;
  /** Jemná nápoveda po asi 20 s nečinnosti. */
  hint: string;
  /** Druhý stupeň nápovedy (napríklad po 40 s). */
  secondHint?: string;
  /** Krátky riadok po prvom ťuknutí na prvok (iba raz). */
  firstTapText?: string;
  /** Vlastné časy nápovedí; bez nich 20 s nápoveda a 40 s „Ukáž číslicu“. */
  timing?: InspectTiming;
  /** Text po objavení číslice. */
  foundText: string;
  /** Popis miesta s číslicou pre čítačku obrazovky (nie je viditeľný). */
  hotspotLabel: string;
  transcript?: ItemInspectTranscript;
  /** Prvky na počítanie (kind "count"); ich počet sa rovná číslici. */
  countPoints?: InspectCountPoint[];
  /** Názov jedného prvku pre čítačku (napríklad „Veža“), bez poradového čísla. */
  countLabel?: string;
  /** Poradie časti zloženého predmetu (zuby kľúča 1 až 3): spoje a obrys celku. */
  artPart?: number;
};

export type InventoryItem = {
  id: string;
  title: string;
  icon: string;
  description: string;
  consumable?: boolean;

  evidenceKind?: EvidenceKind;
  secretCode?: string;
  evidenceOrder?: number;
  actId?: ActId;
  inspect?: ItemInspect;
  /** Vodidlo na ďalšie miesto – smeruje, ale neprezrádza odpoveď ďalšej úlohy. */
  clue?: string;
};

export type CodexEntry = {
  id: CodexEntryId;
  title: string;
  shortText: string;
  fullText: string;
};

export type InvestigationType =
  | "observation"
  | "inscription"
  | "architecture"
  | "symbol"
  | "counting"
  | "comparison"
  | "inventory"
  | "deduction";

export type Investigation = {
  objective: string;
  detectiveHint?: string;
  observationType?: InvestigationType;
};

export type Puzzle = {
  id: PuzzleId;

  /**
   * Starší formát zadania. Zostáva voliteľný, aby sa nerozbili
   * existujúce scény, ktoré ešte neprešli na nový investigation flow.
   */
  question?: string;

  /**
   * Krátky pokyn nad vstupom, napríklad:
   * "Zapíš názov mesta" alebo "Zapíš číslo domu".
   */
  answerLabel?: string;

  acceptedAnswers: string[];
  hints: string[];
};

export type DetectiveNote = {
  number: number | string;
  title: string;
  /** Odseky zápisu – skutočný text (číta ho aj čítačka), nie obrázok. */
  paragraphs: string[];
  /** Podpis pod zápisom (zobrazí sa s pomlčkou). */
  signature: string;
  /**
   * Nepovinný obrázok čistého papiera s priehľadným pozadím; ak je,
   * nahradí papier nakreslený v kóde (text ostáva v HTML).
   */
  paperImageSrc?: string;
  /** Predmet v Inventári, pri ktorom je tlačidlo „Prečítať zápis“. */
  itemId?: string;
  introText?: string;
  continueLabel?: string;
  unlockFlagId?: string;
  readFlagId: string;
};

/**
 * Strážca odovzdá zápis textom: ukáže sa po písanom rozhovore
 * (keď video Strážcu chýba), kým hráč zápis neprečíta.
 */
export type NoteHandover = {
  title: string;
  /** Text Strážcu pri odovzdaní zápisu. */
  text: string;
  viewNoteLabel: string;
  closeNoteLabel: string;
};

/**
 * Video Strážcu namiesto písaného rozhovoru. Po skončení alebo „Preskočiť“
 * sa vykonajú tie isté akcie ako po rozhovore a otvorí sa zápis.
 * Keď súbor chýba, ostane rozhovor (npcGate).
 */
export type GuardianVideo = StoryVideoContent & {
  completeActions: GameAction[];
};

export type NpcGate = {
  requiredFlagId: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  buttonLabel: string;
};

export type SceneBranch = {
  targetSceneId: SceneId;
  conditions?: Condition[];
};

export type GameScreen =
  | "landing"
  | "intro"
  | "puzzle"
  | "history"
  | "actTransition"
  | "actChest"
  | "finaleGuardian"
  | "finaleChest"
  | "finalePhoto"
  | "finalePlace"
  | "finish"
  | "artifact"
  | "inventory"
  | "artifacts"
  | "quests"
  | "questJournal"
  | "npc";

export type QuestStatus = "locked" | "active" | "completed";

export type QuestReward = {
  score?: number;
  artifact?: Artifact;
  item?: InventoryItem;
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  completedText?: string;
  reward?: QuestReward;
};

export type QuestProgress = {
  questId: string;
  status: QuestStatus;
  completedAtSceneId?: SceneId;
};

export type GameAction =
  | {
      type: "addScore";
      value: number;
    }
  | {
      type: "addArtifact";
      artifact: Artifact;
    }
  | {
      type: "startQuest";
      questId: string;
    }
  | {
      type: "completeQuest";
      questId: string;
    }
  | {
      type: "setFlag";
      flagId: string;
    }
  | {
      type: "clearFlag";
      flagId: string;
    }
  | {
      type: "toggleFlag";
      flagId: string;
    }
  | {
      type: "startDialogue";
      dialogueId: string;
      nodeId: string;
    }
  | {
      type: "setScreen";
      screen: GameScreen;
    }
  | {
      type: "addInventoryItem";
      item: InventoryItem;
    }
  | {
      type: "removeInventoryItem";
      itemId: string;
    };

export type GameEventTrigger = "puzzleSolved" | "sceneEntered";

export type GameEvent = {
  trigger: GameEventTrigger;
  conditions?: Condition[];
  actions: GameAction[];
};

export type DialogueChoice = {
  id: string;
  text: string;
  conditions?: Condition[];
  actions?: GameAction[];
  nextDialogueNodeId?: string;
};

export type DialogueNode = {
  id: string;
  speaker: string;
  text: string;
  choices?: DialogueChoice[];
};

export type Dialogue = {
  id: string;
  title: string;
  nodes: DialogueNode[];
};

export type Npc = {
  id: string;
  name: string;
  role?: string;
  portrait?: string;
  description?: string;
  dialogueId: string;
};

export type Scene = {
  id: SceneId;
  location: string;
  title: string;
  cinematicText: string;
  voiceLine: string;

  investigation?: Investigation;
  detectiveNote?: DetectiveNote;
  noteHandover?: NoteHandover;
  guardianVideo?: GuardianVideo;
  npcGate?: NpcGate;

  puzzle: Puzzle;
  history: CodexEntry;
  artifact: Artifact;
  /** Pátračova poznámka po vyriešení (nad vodidlom na ďalšie miesto). */
  nextReflection: string;
  /** Cesta na ďalšie miesto pre „Ukáž cestu“ (bez úniku odpovede). */
  route?: string;

  conditions?: Condition[];
  branches?: SceneBranch[];
  events?: GameEvent[];

  dialogues?: Dialogue[];
  npcs?: Npc[];
};

export type ActEndingKind =
  | "guardianVoice"
  | "seal"
  | "mysteryReveal"
  | "keyAssembly";

/** Ľahký moment na konci aktu (bez truhlice). */
export type ActEnding = {
  kind: ActEndingKind;
  /** Nadpis momentu, napríklad „Hlas Strážcu“ alebo „Pečať“. */
  label: string;
  text: string;
  /** Predmet, ktorý hráč na konci aktu dostane (iba raz). */
  reward?: InventoryItem;
  continueLabel: string;
};

export type Act = {
  id: ActId;
  title: string;
  /** Scény aktu v poradí, v akom ich hráč prechádza. */
  sceneIds: SceneId[];
  /** Označenie zámku truhlice pre tento akt (napríklad „I“). */
  lockLabel: string;
  ending?: ActEnding;
  /** „Vydaj sa k …“ pri začiatku aktu odomknutom kódom (prvý akt používa príchod kapitoly). */
  arrival?: ChapterArrival;
};

/** Kód „Mám kód“: iba odtlačok, nikdy samotný kód. */
export type UnlockCode = {
  id: string;
  /** SHA-256 z upraveného kódu s predponou (engine/unlockCodes.ts). */
  codeHash: string;
  label: string;
  target: {
    chapterId: ChapterId;
    actId: ActId;
  };
};

/** Strážca prináša truhlicu (video je voliteľné, bez neho sa ukáže text). */
export type FinaleGuardian = {
  title: string;
  text: string;
  /** Video (napríklad /videos/straz.mp4); nikdy sa nespustí samo. */
  videoSrc?: string;
  /** Obrázok pred spustením videa. */
  posterSrc?: string;
  /** Titulky k videu (súbor .vtt). */
  captionsSrc?: string;
  skipLabel: string;
  continueLabel: string;
};

/** Jedna truhlica s tromi zámkami, ktoré sa odomykajú v poradí. */
export type FinaleChest = {
  title: string;
  intro: string;
  /** Úvod, keď sú všetky zámky otvorené (kľúč ešte nie). */
  introAllOpen: string;
  /** Úvod po otvorení veka. */
  introOpened: string;
  /** Zámky v poradí odomykania; kódy sa berú z dôkazov scén aktu. */
  lockActIds: ActId[];
  /** Predmet, ktorý sa po troch zámkoch vloží do stredného zámku. */
  keyItemId: string;
  wrongCodeText: string;
  lockOpenedText: string;
  /** Hláška po odomknutí posledného zámku. */
  lastLockOpenedText: string;
  /** Tlačidlo pod zámkom, ktorý je na rade. */
  unlockLabel: string;
  /** Stav zámku pre čítačku. */
  lockOpenLabel: string;
  lockClosedLabel: string;
  lockNextLabel: string;
  /** Riadok pod 3D truhlicou. */
  rotateHint: string;
  /** Riadok pod 3D truhlicou, keď sú všetky zámky otvorené. */
  rotateHintAllOpen: string;
  /** Oddialenie priblíženého zámku bez odomykania. */
  backLabel: string;
  /** Riadok pod 3D truhlicou pri priblíženom zámku. */
  dialHint: string;
  /** Popis kolieska pre čítačku, napríklad „Koliesko {index} z {count}“. */
  dialWheelLabel: string;
  /** Nadpis rozbaliteľného bloku s 2D ovládaním pod 3D truhlicou. */
  accessibleControlsTitle: string;
  insertKeyLabel: string;
  /** Riadok pod 3D truhlicou počas vkladania kľúča a otvárania veka. */
  keyTurningText: string;
  /** Riadok pod 3D truhlicou po otvorení. */
  openedHint: string;
  openedText: string;
  /** Tlačidlo po prevzatí štvrtého útržku. */
  continueLabel: string;
  /** Štvrtý útržok fotografie (pridá sa iba raz). */
  reward: InventoryItem;
};

/** Historická fotografia zložená z útržkov. */
export type FinalePhoto = {
  /** Obrázkový súbor, ktorý kód rozreže na útržky. */
  imageSrc: string;
  imageAlt: string;
  /** Útržky v poradí skladania. */
  fragmentIds: string[];
  title: string;
  frontDescription: string;
  /** Text na zadnej strane vrátane názvu ďalšieho miesta. */
  backLines: string[];
  turnLabel: string;
  /** Tlačidlá + a − (popis pre čítačku). */
  zoomInLabel: string;
  zoomOutLabel: string;
  /** Oznámenie strany pre čítačku po otočení. */
  frontSideLabel: string;
  backSideLabel: string;
  continueLabel: string;
};

/** Zadanie názvu ďalšieho miesta a karta „Ďalšie miesto“. */
export type FinaleNextPlace = {
  question: string;
  acceptedAnswers: string[];
  wrongAnswerText: string;
  submitLabel: string;
  /** Otvorí fotografiu nad zadaním a jej zatvorenie. */
  showPhotoLabel: string;
  closePhotoLabel: string;
  /** Karta po správnej odpovedi. */
  cardTitle: string;
  addressLabel: string;
  directionsLabel: string;
  /** Tlačidlo z karty ďalej. */
  finishLabel: string;
  name: string;
  address: string;
  /** Text tlačidla, ktoré otvorí adresu v Google Mapách. */
  mapsButtonLabel: string;
  directions: string;
  /** Dočasný údaj, pred vydaním sa nahradí. */
  isPlaceholder?: boolean;
};

/** Záverečný text kapitoly. */
export type FinaleEnding = {
  label: string;
  title: string;
  paragraphs: string[];
  /** Nadpis rámčeka s citátom; citát je bez úvodzoviek (doplní obrazovka). */
  quoteTitle: string;
  journalQuote: string;
  scoreLabel: string;
  continuationTitle: string;
  continuationText: string;
  /** Tlačidlo, ktoré znova ukáže kartu „Ďalšie miesto“. */
  showPlaceLabel: string;
  /** Začať kapitolu odznova a potvrdzovacie okno. */
  restartLabel: string;
  restartConfirmTitle: string;
  restartConfirmMessage: string;
  restartConfirmLabel: string;
};

export type ChapterFinale = {
  guardian: FinaleGuardian;
  chest: FinaleChest;
  photo: FinalePhoto;
  nextPlace: FinaleNextPlace;
  ending: FinaleEnding;
};

/** Texty vodidiel a tlačidla „Ukáž cestu“. */
export type ChapterGuidance = {
  nextClueTitle: string;
  showRouteLabel: string;
  hideRouteLabel: string;
  inventoryClueLabel: string;
};

/**
 * Video v príbehu na celú obrazovku. Spustí sa hneď po ťuknutí, ktoré naň
 * viedlo; dá sa pozastaviť a preskočiť.
 */
export type StoryVideoContent = {
  title: string;
  videoSrc: string;
  posterSrc?: string;
  captionsSrc?: string;
  /** Krátky popis deja videa pre čítačku obrazovky. */
  videoDescription: string;
  skipLabel: string;
  /** Tlačidlo po skončení videa (napríklad „Spustiť kapitolu“); bez neho hra pokračuje hneď. */
  endLabel?: string;
  /** Príznak, že hráč video videl alebo preskočil. */
  seenFlagId: string;
};

/**
 * Úvodné video kapitoly po „Začať pátranie“. Ukáže sa iba raz
 * za hru (po „Začať odznova“ znova).
 */
export type ChapterIntroVideo = StoryVideoContent;

/** Obrazovka „Vydaj sa k …“: kam má hráč ísť a potvrdenie, že tam je. */
export type ChapterArrival = {
  label: string;
  title: string;
  text: string;
  /** Ukáže sa iba vtedy, keď sa úvodné video nedá prehrať (aby hráč nestratil príbeh). */
  fallbackTitle?: string;
  fallbackText?: string;
  /** Miesto pre odkaz do máp. */
  mapsQuery: string;
  mapsLabel: string;
  confirmLabel: string;
};

export type Chapter = {
  id: ChapterId;
  city: string;
  title: string;
  subtitle: string;
  introVideo?: ChapterIntroVideo;
  arrival: ChapterArrival;
  quests: Quest[];
  acts: Act[];
  scenes: Scene[];
  guidance: ChapterGuidance;
  finale?: ChapterFinale;
};

export type Game = {
  id: GameId;
  title: string;
  subtitle?: string;
  defaultCity: string;
  chapters: Chapter[];
  /**
   * Štítok ukážkovej verzie na úvodnej obrazovke (počas beta testu namiesto
   * vety o zvuku). Pred vydaním sa odstráni a vráti sa pôvodná veta.
   */
  previewNotice?: string;
};

export type GameState = {
  screen: GameScreen;
  currentChapterIndex: number;
  currentSceneIndex: number;
  currentActId: ActId;
  score: number;
  artifacts: Artifact[];
  inventory: InventoryItem[];
  quests: QuestProgress[];
  flags: Record<string, boolean>;
  hintsUsed: Record<PuzzleId, number>;
  /** Predmety, na ktorých hráč našiel číslicu kódu. */
  foundCodeItemIds: string[];
  /** Predmety, ktorých číslicu hráč odhalil tlačidlom „Ukáž číslicu“. */
  revealedCodeItemIds: string[];
  activeDialogueId?: string;
  activeDialogueNodeId?: string;
  activeNpcId?: string;
  returnScreen?: GameScreen;
};