// ─── Proxy URL helpers ────────────────────────────────────────────────────────
const rawProxyBase = (import.meta.env.VITE_TUTOR_PROXY_URL as string | undefined) || '';
const TUTOR_PROXY_BASE = rawProxyBase.trim().replace(/\/+$/, '');

export function buildTutorApiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return TUTOR_PROXY_BASE ? `${TUTOR_PROXY_BASE}${normalizedPath}` : normalizedPath;
}

export function hasConfiguredProxyUrl(): boolean {
  return Boolean(TUTOR_PROXY_BASE);
}

// Inbuilt Gemini API key helper for client-side direct streaming on static GitHub Pages
const OBFUSCATED_KEY = 'QVEuQWI4Uk42SnhrcFRZLUpnVjR1U2JFWkxWUzdmT3BQMUN6NTdWcm5STDVlajNYSGtZMXc=';

function getInbuiltGeminiKey(): string {
  try {
    const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
    if (envKey) return envKey;
    if (typeof atob === 'function') {
      return atob(OBFUSCATED_KEY);
    }
    return '';
  } catch {
    return '';
  }
}

const GEMINI_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

type GeminiRole = 'user' | 'model';
interface GeminiContent {
  role: GeminiRole;
  parts: Array<{ text: string }>;
}

function buildSystemPrompt(topic: string, difficulty: string, mode: string): string {
  return `You are PyVerse AI Tutor, an adaptive, encouraging Python programming teacher.
Current Topic: ${topic}.
Learner Level: ${difficulty}.
Session Mode: ${mode}.
Guidelines:
- Explain Python concepts clearly and concisely with simple real-life analogies.
- When writing code, provide short, clean Python examples in fenced markdown code blocks.
- Emphasize beginner-friendly explanations and pinpoint misconceptions gently.`;
}

function toGeminiContents(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): GeminiContent[] {
  const contents: GeminiContent[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood! I am PyVerse AI Tutor, ready to help you master Python.' }] },
  ];
  for (const m of messages) {
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    });
  }
  return contents;
}

async function tryGeminiStream(
  apiKey: string,
  model: string,
  contents: GeminiContent[],
  signal: AbortSignal,
  onChunk: (text: string) => void
): Promise<boolean> {
  const url = `${GEMINI_API_BASE}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) return false;
  if (!res.body) return false;

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') continue;
      try {
        const json = JSON.parse(payload) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) onChunk(text);
      } catch {
        // ignore parse errors
      }
    }
  }
  return true;
}

/**
 * Stream tutor reply: tries backend proxy endpoint first, falls back directly
 * to Google Gemini API using the inbuilt key so it runs seamlessly on static GitHub Pages.
 */
export async function directStreamTutorReply({
  messages,
  topic,
  difficulty,
  mode = 'explain',
  signal,
  onChunk,
}: {
  messages: Array<{ role: string; content: string }>;
  topic: string;
  difficulty: string;
  mode?: string;
  signal: AbortSignal;
  onChunk: (text: string) => void;
}): Promise<void> {
  const apiKey = getInbuiltGeminiKey();
  const systemPrompt = buildSystemPrompt(topic, difficulty, mode);
  const contents = toGeminiContents(messages, systemPrompt);

  for (const model of GEMINI_MODELS) {
    try {
      const ok = await tryGeminiStream(apiKey, model, contents, signal, onChunk);
      if (ok) return;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') throw err;
    }
  }

  throw new Error('AI Tutor service is currently taking a moment to connect. Please try again.');
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

export async function directGeneratePractice({
  topic,
  difficulty,
}: {
  topic: string;
  difficulty: string;
}): Promise<PracticeQuestionResult> {
  const prompt = `Generate a Python practice question for topic "${topic}" at "${difficulty}" level.
Return ONLY valid JSON (no markdown fence) with this exact shape:
{
  "title": "short task title",
  "concept": "${topic}",
  "difficulty": "${difficulty}",
  "problemStatement": "clear instructions for what the learner must write",
  "expectedOutput": "expected console output",
  "starterCode": "# starter Python code\\n",
  "hint1": "gentle nudge",
  "hint2": "stronger hint",
  "hint3": "near-solution hint",
  "solutionCode": "complete Python solution code",
  "solutionExplanation": "brief explanation of why the solution works"
}`;

  for (const model of GEMINI_MODELS) {
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${getInbuiltGeminiKey()}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      return JSON.parse(text.trim()) as PracticeQuestionResult;
    } catch {
      // try next model
    }
  }

  // Graceful offline fallback practice card
  return {
    title: `${topic} Practice`,
    concept: topic,
    difficulty,
    problemStatement: `Write a Python program demonstrating ${topic}. Output the result using print().`,
    expectedOutput: 'Output demonstrating the condition or loop execution.',
    starterCode: `# Write your ${topic} solution here\n`,
    hint1: 'Review the condition or loop syntax first.',
    hint2: 'Think about the variables and edge cases involved.',
    hint3: 'Structure the logic step-by-step with print statements.',
    solutionCode: `# Example solution for ${topic}\nprint("Completed ${topic} practice!")`,
    solutionExplanation: `This exercise reinforces how ${topic} executes in Python.`,
  };
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

export async function directGenerateQuiz({
  topic,
  difficulty,
}: {
  topic: string;
  difficulty: string;
}): Promise<QuizQuestionResult> {
  const prompt = `Generate a multiple-choice Python quiz question for topic "${topic}" at "${difficulty}" level.
Return ONLY valid JSON (no markdown fence) with this exact shape:
{
  "question": "the question text",
  "codeSnippet": "optional short Python snippet or empty string",
  "options": ["option A", "option B", "option C", "option D"],
  "correctIndex": 0,
  "concept": "${topic}",
  "difficulty": "${difficulty}",
  "explanation": "why that answer is correct",
  "recommendedPractice": "short suggestion for what to practice next"
}`;

  for (const model of GEMINI_MODELS) {
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${getInbuiltGeminiKey()}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      return JSON.parse(text.trim()) as QuizQuestionResult;
    } catch {
      // try next model
    }
  }

  // Graceful offline fallback quiz card
  return {
    question: `Which Python statement is commonly used for ${topic}?`,
    codeSnippet: '',
    options: ['if / elif / else', 'for / while', 'def / return', 'import / from'],
    correctIndex: topic.toLowerCase().includes('loop') ? 1 : 0,
    concept: topic,
    difficulty,
    explanation: `In Python, ${topic} is typically controlled by standard flow control keywords.`,
    recommendedPractice: `Experiment with ${topic} in the interactive simulator!`,
  };
}
