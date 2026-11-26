export type SectionId =
  | 'home'
  | 'learn'
  | 'lab'
  | 'simulators'
  | 'playground'
  | 'challenges'
  | 'quiz'
  | 'progress';

export type TopicId = 'conditionals' | 'loops';

export type LabTabId = 'conditional-sim' | 'loop-viz' | 'games';

export type SimulatorId =
  | 'traffic-signal'
  | 'atm-decision'
  | 'smart-ac'
  | 'shopping-discount'
  | 'elevator-floor'
  | 'countdown-timer'
  | 'parking-scanner'
  | 'atm-cash-counter';

export type SimulatorCategory = 'conditionals' | 'loops';

export interface SimulatorMeta {
  id: SimulatorId;
  number: string;
  title: string;
  category: SimulatorCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Applied';
  shortDescription: string;
  realLifeScenario: string;
  concepts: string[];
}

export interface LessonDef {
  id: string;
  topic: TopicId;
  number: string;
  title: string;
  summary: string;
}

export interface QuizQuestion {
  id: string;
  topic: TopicId;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodingChallenge {
  id: string;
  topic: TopicId;
  title: string;
  difficulty: 'Beginner' | 'Guided' | 'Applied';
  description: string;
  requirements: string[];
  sampleOutput: string;
  starterCode: string;
  hint: string;
  solutionCode: string;
  validateOutput: (output: string, code: string) => { passed: boolean; message: string };
}

export interface PlaygroundExample {
  id: string;
  title: string;
  topic: TopicId;
  description: string;
  code: string;
}

export interface QuizScoreRecord {
  bestScore: number;
  total: number;
  attempts: number;
  lastScore: number;
}

export interface GameScoreRecord {
  bestScore: number;
  maxScore: number;
  completed: boolean;
}

export interface LearningProgress {
  completedLessons: string[];
  completedChallenges: string[];
  quizScores: {
    conditionals: QuizScoreRecord | null;
    loops: QuizScoreRecord | null;
  };
  gameScores: Record<string, GameScoreRecord>;
}
