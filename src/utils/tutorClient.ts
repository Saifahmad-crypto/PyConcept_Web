import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import {
  TutorMode,
  TutorPracticeCard,
  TutorQuizCard,
  TutorSimulatorContext,
} from '../types';

const BROWSER_KEY_STORAGE = 'pyverse_browser_gemini_key';

export const FALLBACK_GEMINI_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
] as const;

export function getStoredBrowserApiKey(): string {
  try {
    return (localStorage.getItem(BROWSER_KEY_STORAGE) || '').trim();
  } catch {
    return '';
  }
}

export function setStoredBrowserApiKey(key: string): void {
  try {
    const clean = key.trim();
    if (clean) {
      localStorage.setItem(BROWSER_KEY_STORAGE, clean);
    } else {
      localStorage.removeItem(BROWSER_KEY_STORAGE);
    }
  } catch {
    // ignore storage errors
  }
}

const TUTOR_SYSTEM_INSTRUCTION = `You are PyVerse AI Tutor, an adaptive Python programming teacher.
Your mission is to help students genuinely understand Python rather than simply giving them answers.
Teach from the learner's current knowledge level. Assume beginner knowledge unless the supplied learning context indicates otherwise.
Use simple language, small examples and relatable analogies.
When explaining code, describe what each important line does and why it is needed.
Use hints and guiding questions before revealing complete solutions in practice mode.
Never fabricate code execution results, test results, learning progress or simulator states.
Stay focused on Python education. Keep responses concise, structured, and easy to scan.`;

export interface DirectLearnerContext {
  activeTopic?: string;
  difficulty?: string;
  xp?: number;
  completedLessons?: string[];
  completedMissions?: string[];
  completedChallenges?: string[];
  completedBugHunts?: string[];
  conceptsUnderstood?: string[];
  conceptsToReview?: string[];
  practiceAttempts?: number;
  practiceSuccesses?: number;
}

function buildDirectContext(
  mode: string,
  learnerContext?: DirectLearnerContext,
  simulatorContext?: TutorSimulatorContext | null
): string {
  const lines = [
    `[PYVERSE LEARNER CONTEXT]:`,
    `- Active Topic: ${learnerContext?.activeTopic || 'Conditional Statements'}`,
    `- Current Difficulty: ${learnerContext?.difficulty || 'Beginner'}`,
    `- Mode: ${mode}`,
    `- XP: ${learnerContext?.xp ?? 0}`,
    `- Completed Lessons (${learnerContext?.completedLessons?.length ?? 0}): ${
      learnerContext?.completedLessons?.join(', ') || 'None yet'
    }`,
    `- Concepts Understood: ${learnerContext?.conceptsUnderstood?.join(', ') || 'None yet'}`,
    `- Concepts To Review: ${learnerContext?.conceptsToReview?.join(', ') || 'None yet'}`,
  ];

  if (simulatorContext) {
    lines.push(
      `[ATTACHED PYVERSE SIMULATOR CONTEXT]:`,
      `- Simulator: ${simulatorContext.simulatorTitle} (${simulatorContext.category})`,
      `- Current Line: ${simulatorContext.currentLine ?? 'Initial state'}`,
      `- Active Code Line: ${simulatorContext.activeCodeLine ?? 'N/A'}`,
      `- Variables: ${JSON.stringify(simulatorContext.variables ?? {})}`,
      `- Console Output: ${JSON.stringify(simulatorContext.outputLines ?? [])}`,
      `- Code:\n\`\`\`python\n${simulatorContext.code}\n\`\`\``
    );
  }
  return lines.join('\n');
}

async function runWithModelFallback<T>(
  fn: (model: string) => Promise<T>
): Promise<T> {
  let lastErr: unknown;
  for (const model of FALLBACK_GEMINI_MODELS) {
    try {
      return await fn(model);
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
      const retryable =
        msg.includes('503') ||
        msg.includes('unavailable') ||
        msg.includes('not_found') ||
        msg.includes('404');
      if (!retryable) {
        throw err;
      }
    }
  }
  throw lastErr;
}

export async function directStreamTutorReply(params: {
  apiKey: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  mode: TutorMode;
  learnerContext: DirectLearnerContext;
  simulatorContext: TutorSimulatorContext | null;
  signal: AbortSignal;
  onChunk: (text: string) => void;
}): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey });
  const trimmed = params.messages.slice(-14).map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.content || '').slice(0, 8000) }],
  }));

  const lastIdx = trimmed.length - 1;
  const ctx = buildDirectContext(params.mode, params.learnerContext, params.simulatorContext);
  trimmed[lastIdx] = {
    role: 'user',
    parts: [
      {
        text: `${ctx}\n\n[STUDENT MESSAGE]:\n${trimmed[lastIdx].parts[0].text}`,
      },
    ],
  };

  await runWithModelFallback(async (model) => {
    const stream = await ai.models.generateContentStream({
      model,
      contents: trimmed,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingLevel:
            params.mode === 'debug' ? ThinkingLevel.MEDIUM : ThinkingLevel.LOW,
        },
        abortSignal: params.signal,
      },
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        params.onChunk(chunk.text);
      }
    }
  });
}

export async function directGeneratePractice(params: {
  apiKey: string;
  learnerContext: DirectLearnerContext;
  focusRequest?: string;
  difficultyAdjustment?: 'simpler' | 'same' | 'harder';
}): Promise<Omit<TutorPracticeCard, 'hintsRevealed' | 'solutionRevealed'>> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey });
  const prompt = `${buildDirectContext('practice', params.learnerContext, null)}
Difficulty adjustment: ${params.difficultyAdjustment || 'same'}.
Focus: ${params.focusRequest || params.learnerContext.activeTopic || 'Python'}.
Generate 1 beginner-friendly Python practice task with 3 progressive hints and a solution.`;

  return runWithModelFallback(async (model) => {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            concept: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            problemStatement: { type: Type.STRING },
            expectedOutput: { type: Type.STRING },
            starterCode: { type: Type.STRING },
            hint1: { type: Type.STRING },
            hint2: { type: Type.STRING },
            hint3: { type: Type.STRING },
            solutionCode: { type: Type.STRING },
            solutionExplanation: { type: Type.STRING },
          },
          required: [
            'title',
            'concept',
            'difficulty',
            'problemStatement',
            'expectedOutput',
            'starterCode',
            'hint1',
            'hint2',
            'hint3',
            'solutionCode',
            'solutionExplanation',
          ],
        },
      },
    });
    return JSON.parse(response.text || '{}') as Omit<
      TutorPracticeCard,
      'hintsRevealed' | 'solutionRevealed'
    >;
  });
}

export async function directGenerateQuiz(params: {
  apiKey: string;
  learnerContext: DirectLearnerContext;
  focusRequest?: string;
  difficultyAdjustment?: 'simpler' | 'same' | 'harder';
}): Promise<TutorQuizCard> {
  const ai = new GoogleGenAI({ apiKey: params.apiKey });
  const prompt = `${buildDirectContext('quiz', params.learnerContext, null)}
Difficulty adjustment: ${params.difficultyAdjustment || 'same'}.
Focus: ${params.focusRequest || params.learnerContext.activeTopic || 'Python'}.
Generate 1 concise 4-option multiple-choice Python question.`;

  return runWithModelFallback(async (model) => {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            codeSnippet: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            concept: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            explanation: { type: Type.STRING },
            recommendedPractice: { type: Type.STRING },
          },
          required: [
            'question',
            'options',
            'correctIndex',
            'concept',
            'difficulty',
            'explanation',
            'recommendedPractice',
          ],
        },
      },
    });
    return JSON.parse(response.text || '{}') as TutorQuizCard;
  });
}
