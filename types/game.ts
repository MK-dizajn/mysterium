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
  /** Text po objavení číslice. */
  foundText: string;
  /** Popis miesta s číslicou pre čítačku obrazovky (nie je viditeľný). */
  hotspotLabel: string;
  transcript?: ItemInspectTranscript;
  /** Prvky na počítanie (kind "count"); ich počet sa rovná číslici. */
  countPoints?: InspectCountPoint[];
  /** Názov jedného prvku pre čítačku (napríklad „Veža“), bez poradového čísla. */
  countLabel?: string;
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
  imageSrc: string;
  imageAlt?: string;
  introText?: string;
  continueLabel?: string;
  unlockFlagId?: string;
  readFlagId: string;
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
  npcGate?: NpcGate;

  puzzle: Puzzle;
  history: CodexEntry;
  artifact: Artifact;
  nextInstruction: string;

  conditions?: Condition[];
  branches?: SceneBranch[];
  events?: GameEvent[];

  dialogues?: Dialogue[];
  npcs?: Npc[];
};

export type ActEndingKind = "guardianVoice" | "seal" | "mysteryReveal";

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
};

export type Chapter = {
  id: ChapterId;
  city: string;
  title: string;
  subtitle: string;
  introLines: string[];
  quests: Quest[];
  acts: Act[];
  scenes: Scene[];
};

export type Game = {
  id: GameId;
  title: string;
  subtitle?: string;
  defaultCity: string;
  chapters: Chapter[];
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