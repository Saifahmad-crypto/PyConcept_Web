export type SectionId =
  | 'home'
  | 'learn'
  | 'lab'
  | 'simulators'
  | 'tutor'
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

export type TutorTopic = 'Python Basics' | 'Conditional Statements' | 'Loops';
export type TutorDifficulty = 'Beginner' | 'Guided' | 'Intermediate';
export type TutorMode = 'learn' | 'doubt' | 'review' | 'practice' | 'quiz';

export interface TutorPracticeCard {
  title: string;
  concept: string;
  difficulty: string;
  problemStatement: string;
  expectedOutput: string;
  starterCode: string;
  hint1: string;
  hint2: string;
  hint3: string;
  solutionCode: string;
  solutionExplanation: string;
  hintsRevealed: number; // 0..3
  solutionRevealed: boolean;
}

export interface TutorQuizCard {
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  concept: string;
  difficulty: string;
  explanation: string;
  recommendedPractice: string;
  selectedIndex?: number;
  submitted?: boolean;
}

export interface TutorSimulatorContext {
  simulatorId: SimulatorId;
  simulatorTitle: string;
  category: string;
  concepts: string[];
  code: string;
  currentLine?: number;
  activeCodeLine?: string;
  variables?: Record<string, unknown>;
  conditionExpr?: string;
  conditionResult?: boolean;
  outputLines?: string[];
  explanation?: string;
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mode?: TutorMode;
  practiceCard?: TutorPracticeCard;
  quizCard?: TutorQuizCard;
  simulatorContext?: TutorSimulatorContext | null;
  feedbackGiven?: 'helpful' | 'confused' | 'harder' | null;
  isError?: boolean;
}

export interface TutorChatSession {
  id: string;
  title: string;
  topic: TutorTopic;
  mode: TutorMode;
  updatedAt: number;
  messages: TutorMessage[];
}

export interface LearningProgress {
  completedLessons: string[];
  completedChallenges: string[];
  quizScores: {
    conditionals: QuizScoreRecord | null;
    loops: QuizScoreRecord | null;
  };
  gameScores: Record<string, GameScoreRecord>;
  activeTutorTopic: TutorTopic;
  tutorDifficulty: TutorDifficulty;
  conceptsUnderstood: string[];
  conceptsToReview: string[];
  practiceAttempts: number;
  practiceSuccesses: number;
  recentTopics: string[];
}
