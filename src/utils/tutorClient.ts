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

// ─── Browser API Key (localStorage) ──────────────────────────────────────────
const BROWSER_KEY_STORAGE = 'pyverse_gemini_api_key';

export function getStoredBrowserApiKey(): string {
  try {
    return localStorage.getItem(BROWSER_KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
}

export function setStoredBrowserApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(BROWSER_KEY_STORAGE, key.trim());
    } else {
      localStorage.removeItem(BROWSER_KEY_STORAGE);
    }
  } catch {
    // ignore
  }
}

// ─── Direct Gemini API (browser fallback when no proxy) ───────────────────────
// Uses the public Gemini REST API — no backend required.
const GEMINI_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

type GeminiRole = 'user' | 'model';
interface GeminiContent { role: GeminiRole; parts: Array<{ text: string }> }

function buildSystemPrompt(topic: string, difficulty: string): string {
  return `You are PyVerse AI Tutor — a friendly, adaptive Python tutor. Current topic: ${topic}. Learner level: ${difficulty}. Keep answers concise, use simple language, include short Python code examples where helpful. Format code in markdown fenced blocks.`;
}

/** Convert chat history [{role, content}] → Gemini contents array */
function toGeminiContents(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): GeminiContent[] {
  const contents: GeminiContent[] = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Understood! I am ready to help you learn Python.' }] },
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

export async function directStreamTutorReply({
  apiKey,
  messages,
  topic,
  difficulty,
  signal,
  onChunk,
}: {
  apiKey: string;
  messages: Array<{ role: string; content: string }>;
  topic: string;
  difficulty: string;
  signal: AbortSignal;
  onChunk: (text: string) => void;
}): Promise<void> {
  const systemPrompt = buildSystemPrompt(topic, difficulty);
  const contents = toGeminiContents(messages, systemPrompt);

  for (const model of GEMINI_MODELS) {
    try {
      const ok = await tryGeminiStream(apiKey, model, contents, signal, onChunk);
      if (ok) return;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') throw err;
      // try next model
    }
  }
  throw new Error('All Gemini models failed. Check your API key and try again.');
}

export async function directGeneratePractice({
  apiKey,
  topic,
  difficulty,
}: {
  apiKey: string;
  topic: string;
  difficulty: string;
}): Promise<{
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
}> {
  const prompt = `Generate a Python practice question for topic "${topic}" at "${difficulty}" level.
Return ONLY valid JSON (no markdown) with this exact shape:
{
  "title": "short task title",
  "concept": "the main Python concept being practiced",
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
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;
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
      return JSON.parse(text.trim()) as ReturnType<typeof directGeneratePractice> extends Promise<infer T> ? T : never;
    } catch {
      // try next model
    }
  }
  throw new Error('Could not generate practice question. Check your API key.');
}

export async function directGenerateQuiz({
  apiKey,
  topic,
  difficulty,
}: {
  apiKey: string;
  topic: string;
  difficulty: string;
}): Promise<{
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  concept: string;
  difficulty: string;
  explanation: string;
  recommendedPractice: string;
}> {
  const prompt = `Generate a multiple-choice Python quiz question for topic "${topic}" at "${difficulty}" level.
Return ONLY valid JSON (no markdown) with this exact shape:
{
  "question": "the question text",
  "codeSnippet": "optional short Python snippet or empty string",
  "options": ["option A", "option B", "option C", "option D"],
  "correctIndex": 0,
  "concept": "the Python concept being tested",
  "difficulty": "${difficulty}",
  "explanation": "why that answer is correct",
  "recommendedPractice": "short suggestion for what to practice next"
}`;

  for (const model of GEMINI_MODELS) {
    const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;
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
      return JSON.parse(text.trim()) as ReturnType<typeof directGenerateQuiz> extends Promise<infer T> ? T : never;
    } catch {
      // try next model
    }
  }
  throw new Error('Could not generate quiz question. Check your API key.');
}
