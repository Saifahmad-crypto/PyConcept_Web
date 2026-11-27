export type SectionId =
  | 'landing'
  | 'home'
  | 'learn'
  | 'lab'
  | 'games'
  | 'studio'
  | 'tutor'
  | 'revision'
  | 'progress'
  // Legacy aliases retained cleanly so all internal cross-links continue working seamlessly
  | 'simulators'
  | 'playground'
  | 'challenges'
  | 'quiz';

export type TopicId = 'basics' | 'conditionals' | 'loops';

export type LearnStageId =
  | 'explore'
  | 'understand'
  | 'visualize'
  | 'experiment'
  | 'practise'
  | 'test';

export type LabTabId =
  | 'create-system'
  | 'simulators'
  | 'conditionals-lab'
  | 'loops-lab'
  | 'memory-explorer'
  | 'execution-visualizer'
  | 'flowchart-builder'
  // Legacy aliases
  | 'conditional-sim'
  | 'loop-viz'
  | 'games';

export type GamesHubTabId =
  | 'mini-games'
  | 'escape-room'
  | 'bug-hunter'
  | 'challenges'
  | 'quizzes'
  | 'logic-lab';

export type RevisionTabId =
  | 'cheat-sheets'
  | 'flashcards'
  | 'arena'
  | 'quizzes'
  | 'visual-notes';

export type StudioTabId = 'sandbox' | 'challenges';

export type SimulatorId =
  | 'traffic-signal'
  | 'atm-decision'
  | 'smart-ac'
  | 'shopping-discount'
  | 'grade-calculator'
  | 'leap-year'
  | 'electricity-bill'
  | 'elevator-floor'
  | 'countdown-timer'
  | 'parking-scanner'
  | 'atm-cash-counter'
  | 'fizzbuzz'
  | 'number-guessing'
  | 'pattern-printer'
  | 'multiplication-table';

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

export interface LessonNote {
  lessonId: string;
  topic: TopicId;
  title: string;
  note: string;
  updatedAt: number;
}

export interface MissionDef {
  id: string;
  topic: TopicId;
  number: string;
  title: string;
  objective: string;
  intro: string;
  exampleCode: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
  linkedLessonId?: string;
}

export interface QuizQuestion {
  id: string;
  topic: Exclude<TopicId, 'basics'> | TopicId;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodingChallenge {
  id: string;
  topic: Exclude<TopicId, 'basics'>;
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
export type TutorMode =
  | 'explain'
  | 'example'
  | 'line_by_line'
  | 'debug'
  | 'hint'
  | 'practice'
  | 'quiz'
  | 'simulator'
  | 'review_solution';

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

export type ActivityType =
  | 'lesson'
  | 'mission'
  | 'simulator'
  | 'challenge'
  | 'quiz'
  | 'game'
  | 'daily-quest'
  | 'bug-hunt'
  | 'escape-room'
  | 'sandbox';

export interface ActivityRecord {
  id: string; // Unique key e.g. "lesson:c-if", "daily:2026-11-26"
  type: ActivityType;
  title: string;
  topic: TopicId | 'mixed';
  completed: boolean;
  score?: number;
  maxScore?: number;
  xpAwarded: number;
  timestamp: number;
  attempts: number;
}

export interface XPHistoryEntry {
  id: string;
  activityId: string;
  label: string;
  amount: number;
  timestamp: number;
}

export interface SavedSnippet {
  id: string;
  title: string;
  code: string;
  updatedAt: number;
}

export interface UserPreferences {
  preferredMode: 'guided' | 'explorer' | 'challenge';
  fontSize: 'normal' | 'large';
  reducedMotion: boolean;
  soundEffects: boolean;
}

export interface DailyQuestDef {
  id: string;
  type: 'predict-output' | 'find-error' | 'missing-code' | 'condition-solve' | 'loop-iterations';
  topic: TopicId;
  difficulty: 'Easy' | 'Medium';
  estimatedMinutes: number;
  xpReward: number;
  title: string;
  instructions: string;
  code: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface FlashcardDef {
  id: string;
  topic: TopicId;
  front: string;
  codeHint?: string;
  back: string;
  example: string;
}

export interface BugChallengeDef {
  id: string;
  topic: TopicId;
  category:
    | 'Syntax Error'
    | 'Incorrect Condition'
    | 'Off-by-One Loop'
    | 'Variable Update'
    | 'Wrong Output';
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  title: string;
  description: string;
  buggyCode: string;
  expectedOutput: string;
  stdinLines?: string[];
  hints: [string, string, string, string];
  solutionCode: string;
  xpReward: number;
  verify: (output: string, code: string) => { passed: boolean; message: string };
}

export interface LearningProgress {
  version: number;
  xp: number;
  xpHistory: XPHistoryEntry[];
  activities: Record<string, ActivityRecord>;
  completedLessons: string[];
  completedMissions: string[];
  completedChallenges: string[];
  completedBugHunts: string[];
  completedEscapeRooms: string[];
  completedDailyQuests: string[];
  understoodFlashcards: string[];
  quizScores: {
    conditionals: QuizScoreRecord | null;
    loops: QuizScoreRecord | null;
  };
  gameScores: Record<string, GameScoreRecord>;
  gameAttempts: Record<string, number>;
  visitedSimulators: string[];
  simulatorRuns: number;
  sandboxRuns: number;
  activeDates: string[];
  longestStreak: number;
  activeTutorTopic: TutorTopic;
  tutorDifficulty: TutorDifficulty;
  conceptsUnderstood: string[];
  conceptsToReview: string[];
  practiceAttempts: number;
  practiceSuccesses: number;
  recentTopics: string[];
  savedSnippets: SavedSnippet[];
  bookmarkedLessons: string[];
  lessonNotes: Record<string, LessonNote>;
  preferences: UserPreferences;
}
