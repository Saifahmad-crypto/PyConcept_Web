// ─── Proxy URL helpers ────────────────────────────────────────────────────────
const rawProxyBase = (import.meta.env.VITE_TUTOR_PROXY_URL as string | undefined) || '';
const TUTOR_PROXY_BASE = rawProxyBase.trim().replace(/\/+$/, '');

export function buildTutorApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return TUTOR_PROXY_BASE ? `${TUTOR_PROXY_BASE}${normalizedPath}` : normalizedPath;
}

export function hasConfiguredProxyUrl(): boolean {
  // Always true or ready: the app connects through the centralized backend API proxy
  return true;
}

export interface PracticeQuestionResult {
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
}

export interface QuizQuestionResult {
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  concept: string;
  difficulty: string;
  explanation: string;
  recommendedPractice: string;
}
