export type Artifact = {
  id: string;
  title: string;
  icon: string;
  shortFact: string;
  fullText: string;
};

export type GameStep = {
  id: string;
  location: string;
  title: string;
  cinematicText: string;
  voiceLine: string;
  puzzleQuestion: string;
  acceptedAnswers: string[];
  hints: string[];
  historyTitle: string;
  historyShort: string;
  historyFull: string;
  artifact: Artifact;
  nextInstruction: string;
};

export type Chapter = {
  id: string;
  city: string;
  title: string;
  subtitle: string;
  introLines: string[];
  steps: GameStep[];
};