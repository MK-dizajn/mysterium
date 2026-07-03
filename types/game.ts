import type { Condition } from "../engine/conditions";

export type GameId = string;
export type ChapterId = string;
export type SceneId = string;
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

export type CodexEntry = {
  id: CodexEntryId;
  title: string;
  shortText: string;
  fullText: string;
};

export type Puzzle = {
  id: PuzzleId;
  question: string;
  acceptedAnswers: string[];
  hints: string[];
};

export type SceneBranch = {
  targetSceneId: SceneId;
  conditions?: Condition[];
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
        type: "addSceneArtifact";
    }
  | {
        type: "addCalculatedPuzzleScore";
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
        type: "setScreen";
        screen: GameScreen;
    };

export type GameEventTrigger = "puzzleSolved" | "sceneEntered";

export type GameEvent = {
  trigger: GameEventTrigger;
  conditions?: Condition[];
  actions: GameAction[];
};

export type Scene = {
  id: SceneId;
  location: string;
  title: string;
  cinematicText: string;
  voiceLine: string;
  puzzle: Puzzle;
  history: CodexEntry;
  artifact: Artifact;
  nextInstruction: string;

  conditions?: Condition[];

  branches?: SceneBranch[];

  events?: GameEvent[];
};

export type Chapter = {
  id: ChapterId;
  city: string;
  title: string;
  subtitle: string;
  introLines: string[];
  scenes: Scene[];
};

export type Game = {
  id: GameId;
  title: string;
  subtitle?: string;
  defaultCity: string;
  chapters: Chapter[];
};

export type GameScreen =
  | "landing"
  | "intro"
  | "puzzle"
  | "history"
  | "finish"
  | "artifact";

export type QuestStatus = "locked" | "active" | "completed";

export type Quest = {
  id: string;
  title: string;
  description: string;
};

export type QuestProgress = {
  questId: string;
  status: QuestStatus;
};

export type GameState = {
  screen: GameScreen;
  currentChapterIndex: number;
  currentSceneIndex: number;
  score: number;
  artifacts: Artifact[];
  quests: QuestProgress[];
  flags: Record<string, boolean>;
};