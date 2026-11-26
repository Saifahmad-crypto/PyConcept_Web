import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

function getConfiguredModel(): string {
  const raw = (process.env.GEMINI_MODEL || '').trim();
  if (/^gemini-[a-z0-9._-]+$/i.test(raw)) {
    return raw;
  }
  return DEFAULT_MODEL;
}

const TUTOR_SYSTEM_INSTRUCTION = `You are PyVerse AI Tutor, an adaptive Python programming teacher.

Your mission is to help students genuinely understand Python rather than simply giving them answers.

Teach from the learner's current knowledge level. Assume beginner knowledge unless the supplied learning context indicates otherwise.

Use simple language, small examples and relatable analogies. Introduce technical terminology gradually.

When explaining code, describe what each important line does and why it is needed.

When the learner attempts a question, evaluate their reasoning and identify misconceptions.

Use hints and guiding questions before revealing complete solutions in practice mode.

If the learner is struggling, simplify the explanation and use a different example.

If the learner understands a concept, gradually increase the challenge.

Never fabricate code execution results, test results, learning progress or simulator states.

Never claim to remember information that is not present in the supplied conversation or learner progress context.

Stay focused on Python education. If a request is unrelated, politely guide the learner back to learning.

Your success is measured by the learner's understanding, not by how much code or text you generate.

Additional PyVerse platform guidance:
- PyVerse teaches Python Basics, Topic 08 (Conditional Statements: if, if-else, if-elif-else, nested if, comparison & logical operators), and Topic 09 (Loops: for, while, range(), break, continue, nested loops).
- PyVerse also includes 8 Interactive Real-Life Simulators:
  1. Traffic Signal Simulator (Conditionals: if-elif-else)
  2. ATM Decision Simulator (Conditionals: if-else, nested if, logical & comparison operators)
  3. Smart AC Controller (Conditionals: if-else, comparison & boolean conditions)
  4. Shopping Discount Calculator (Conditionals: if-elif-else, arithmetic & comparison)
  5. Elevator Floor Simulator (Loops: for loop, range(), loop variables)
  6. Countdown Timer (Loops: while loop, condition termination, break)
  7. Parking Slot Scanner (Loops: for/while, continue, break)
  8. ATM Cash Counter (Loops: while/for, accumulation, conditional termination)
- Format Python examples inside fenced \`\`\`python code blocks so students can read line numbers and test them in the PyVerse Playground.
- When reviewing student code, explain what the code does, point out exact line numbers with syntax or logical issues, explain why the error happens, give hints first before full rewrites unless requested, and do NOT claim you executed the code unless output was explicitly provided.
- Where appropriate for teaching a concept, structure your explanation clearly using: Simple explanation, Real-life example, Python code, Line-by-line explanation, Try it yourself, and a short Quick understanding check question — while keeping normal follow-up conversation natural.`;

interface ChatTurnInput {
  role: 'user' | 'assistant';
  content: string;
}

interface LearnerContextInput {
  activeTopic?: string;
  difficulty?: string;
  xp?: number;
  completedLessons?: string[];
  completedMissions?: string[];
  completedChallenges?: string[];
  completedBugHunts?: string[];
  conceptsUnderstood?: string[];
  conceptsToReview?: string[];
  quizScores?: Record<string, unknown>;
  practiceAttempts?: number;
  practiceSuccesses?: number;
}

interface SimulatorContextInput {
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

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildContextPreamble(
  mode: string,
  learnerContext?: LearnerContextInput,
  simulatorContext?: SimulatorContextInput | null
): string {
  const lines: string[] = [
    `[SESSION MODE]: ${mode}`,
    `[LEARNER CONTEXT]:`,
    `- Active Topic: ${learnerContext?.activeTopic || 'Python Basics'}`,
    `- Current Difficulty Level: ${learnerContext?.difficulty || 'Beginner'}`,
    `- Learner XP: ${learnerContext?.xp ?? 0} XP`,
    `- Completed PyVerse Lessons (${learnerContext?.completedLessons?.length ?? 0}): ${
      learnerContext?.completedLessons?.length
        ? learnerContext.completedLessons.join(', ')
        : 'None yet'
    }`,
    `- Completed Missions (${learnerContext?.completedMissions?.length ?? 0}): ${
      learnerContext?.completedMissions?.length
        ? learnerContext.completedMissions.join(', ')
        : 'None yet'
    }`,
    `- Completed Challenges (${learnerContext?.completedChallenges?.length ?? 0}): ${
      learnerContext?.completedChallenges?.length
        ? learnerContext.completedChallenges.join(', ')
        : 'None yet'
    }`,
    `- Completed Bug Hunts (${learnerContext?.completedBugHunts?.length ?? 0}): ${
      learnerContext?.completedBugHunts?.length
        ? learnerContext.completedBugHunts.join(', ')
        : 'None yet'
    }`,
    `- Concepts Marked Understood: ${
      learnerContext?.conceptsUnderstood?.length
        ? learnerContext.conceptsUnderstood.join(', ')
        : 'None yet'
    }`,
    `- Concepts Needing Improvement: ${
      learnerContext?.conceptsToReview?.length
        ? learnerContext.conceptsToReview.join(', ')
        : 'None identified yet'
    }`,
    `- Practice Stats: ${learnerContext?.practiceSuccesses ?? 0}/${
      learnerContext?.practiceAttempts ?? 0
    } solved`,
  ];

  if (simulatorContext) {
    lines.push(
      `[ATTACHED PYVERSE SIMULATOR CONTEXT]:`,
      `- Simulator: ${simulatorContext.simulatorTitle} (${simulatorContext.category})`,
      `- Concepts: ${simulatorContext.concepts.join(', ')}`,
      `- Current Execution Line: ${simulatorContext.currentLine ?? 'Initial state'}`,
      `- Active Code Line: ${simulatorContext.activeCodeLine ?? 'N/A'}`,
      `- Variables Snapshot: ${JSON.stringify(simulatorContext.variables ?? {})}`,
      `- Condition Evaluated: ${
        simulatorContext.conditionExpr !== undefined
          ? `${simulatorContext.conditionExpr} -> ${simulatorContext.conditionResult}`
          : 'N/A'
      }`,
      `- Console Output So Far: ${JSON.stringify(simulatorContext.outputLines ?? [])}`,
      `- Simulator Step Note: ${simulatorContext.explanation ?? 'N/A'}`,
      `- Full Simulator Code:\n\`\`\`python\n${simulatorContext.code}\n\`\`\``
    );
  }

  return lines.join('\n');
}

function mapGeminiError(err: unknown): { status: number; message: string; code: string } {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();

  if (lower.includes('api_key_invalid') || lower.includes('api key not valid') || lower.includes('401')) {
    return {
      status: 401,
      code: 'API_KEY_INVALID',
      message: 'The configured GEMINI_API_KEY was rejected. Please verify it in Settings > Secrets.',
    };
  }
  if (lower.includes('permission_denied') || lower.includes('403')) {
    return {
      status: 403,
      code: 'PERMISSION_DENIED',
      message: 'Gemini API access was denied for the current key. Check permissions in Settings > Secrets.',
    };
  }
  if (lower.includes('resource_exhausted') || lower.includes('429') || lower.includes('quota')) {
    return {
      status: 429,
      code: 'RATE_LIMIT',
      message: 'The AI Tutor is receiving too many requests right now. Please wait a moment and retry.',
    };
  }
  if (lower.includes('timeout') || lower.includes('aborted') || lower.includes('etimedout')) {
    return {
      status: 504,
      code: 'TIMEOUT',
      message: 'The AI Tutor request timed out. Please try again.',
    };
  }
  if (lower.includes('not_found') || lower.includes('404')) {
    return {
      status: 502,
      code: 'MODEL_UNAVAILABLE',
      message: 'The configured Gemini model is unavailable. Check GEMINI_MODEL configuration.',
    };
  }
  return {
    status: 502,
    code: 'UPSTREAM_ERROR',
    message: 'Unable to reach the AI Tutor right now. Please check your connection and try again.',
  };
}

async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message.toLowerCase() : '';
      const isTransient = msg.includes('429') || msg.includes('503') || msg.includes('unavailable');
      if (!isTransient || attempt === retries) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 700 * (attempt + 1)));
    }
  }
  throw lastErr;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/tutor/health', (_req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const configured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY');
    res.json({
      configured,
      model: getConfiguredModel(),
    });
  });

  // Streaming adaptive tutoring endpoint (SSE)
  app.post('/api/tutor/stream', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        code: 'API_KEY_MISSING',
        message:
          'GEMINI_API_KEY is not configured on the server. Add GEMINI_API_KEY in Settings > Secrets or your server environment to enable PyVerse AI Tutor.',
      });
      return;
    }

    const { messages, mode, learnerContext, simulatorContext } = req.body as {
      messages?: ChatTurnInput[];
      mode?: string;
      learnerContext?: LearnerContextInput;
      simulatorContext?: SimulatorContextInput | null;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ code: 'INVALID_REQUEST', message: 'Messages array is required.' });
      return;
    }

    const modeAliases: Record<string, string> = {
      learn: 'explain',
      doubt: 'example',
      review: 'debug',
    };
    const normalizedInput = mode && modeAliases[mode] ? modeAliases[mode] : mode;
    const validModes = new Set([
      'explain',
      'example',
      'line_by_line',
      'debug',
      'hint',
      'practice',
      'quiz',
      'simulator',
      'review_solution',
    ]);
    const safeMode = normalizedInput && validModes.has(normalizedInput) ? normalizedInput : 'explain';
    const trimmedHistory = messages.slice(-14).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 8000) }],
    }));

    // Prepend current learning context cleanly to the latest user message
    const lastIdx = trimmedHistory.length - 1;
    if (trimmedHistory[lastIdx].role !== 'user') {
      res.status(400).json({ code: 'INVALID_REQUEST', message: 'Last message must be from user.' });
      return;
    }

    const contextBlock = buildContextPreamble(safeMode, learnerContext, simulatorContext);
    let modeDirective = '';
    if (safeMode === 'debug') {
      modeDirective =
        '\n[MODE DIRECTIVE - DEBUG MY CODE]: Carefully explain what the student code does, list any syntax or logical bugs with line numbers, explain why they happen, give hints to fix them without rewriting everything unnecessarily, and only give the full corrected code if requested. Do NOT claim you executed the code unless output was given.';
    } else if (safeMode === 'line_by_line') {
      modeDirective =
        '\n[MODE DIRECTIVE - EXPLAIN LINE BY LINE]: Walk through the Python code strictly line by line (Line 1, Line 2, ...), showing variable changes, condition evaluations (True/False), and why each line is indented or ordered that way.';
    } else if (safeMode === 'simulator') {
      modeDirective =
        '\n[MODE DIRECTIVE - EXPLAIN THIS SIMULATOR]: Connect the simulator scenario (e.g. Traffic Signal, ATM, AC, Discount, Elevator, Countdown, Parking, Cash Counter) directly to the Python condition or loop step, explaining why the branch or iteration triggered.';
    } else if (safeMode === 'review_solution') {
      modeDirective =
        '\n[MODE DIRECTIVE - REVIEW MY SOLUTION]: Praise what works correctly in the student solution, check edge cases (boundary values like >= vs >, off-by-one range bounds, readability), and suggest one clean improvement without overwhelming them.';
    } else if (safeMode === 'hint') {
      modeDirective =
        '\n[MODE DIRECTIVE - GIVE ME A HINT]: Give a gentle, progressive nudge or guiding question that helps the student figure out the next step themselves without immediately revealing the full answer or complete solution code.';
    } else if (safeMode === 'example') {
      modeDirective =
        '\n[MODE DIRECTIVE - REAL-LIFE EXAMPLES]: Explain the concept using a relatable everyday analogy, map that analogy directly to a short beginner-friendly Python snippet, and finish with one brief check question.';
    } else if (safeMode === 'practice') {
      modeDirective =
        '\n[MODE DIRECTIVE - PRACTICE WITH ME]: If the student attempted a solution, evaluate their logic patiently, pinpoint any misconception, and give a guiding hint rather than immediately dumping the full solution unless they explicitly ask for the full solution.';
    } else if (safeMode === 'quiz') {
      modeDirective =
        '\n[MODE DIRECTIVE - TEST MY KNOWLEDGE]: Evaluate the student reasoning concisely, clarify misconceptions, and suggest what to practice next.';
    } else {
      modeDirective =
        '\n[MODE DIRECTIVE - EXPLAIN SIMPLY]: Teach clearly in plain, beginner-friendly language using Simple explanation, Real-life example, Python code, Line-by-line explanation, Try it yourself, and a Quick understanding check where appropriate.';
    }

    trimmedHistory[lastIdx] = {
      role: 'user',
      parts: [
        {
          text: `${contextBlock}${modeDirective}\n\n[STUDENT MESSAGE]:\n${trimmedHistory[lastIdx].parts[0].text}`,
        },
      ],
    };

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);
    res.on('close', () => {
      if (!res.writableEnded) {
        clearTimeout(timeoutId);
        controller.abort();
      }
    });

    try {
      const stream = await withRetry(() =>
        ai.models.generateContentStream({
          model: getConfiguredModel(),
          contents: trimmedHistory,
          config: {
            systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
            thinkingConfig: {
              thinkingLevel:
                safeMode === 'debug' ? ThinkingLevel.MEDIUM : ThinkingLevel.LOW,
            },
            abortSignal: controller.signal,
          },
        })
      );

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunkText })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      res.end();
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.write(
        `data: ${JSON.stringify({ type: 'error', code: mapped.code, message: mapped.message })}\n\n`
      );
      res.end();
    } finally {
      clearTimeout(timeoutId);
    }
  });

  // Structured Practice Question Generator (with progressive 3-level hints + solution)
  app.post('/api/tutor/practice', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        code: 'API_KEY_MISSING',
        message:
          'GEMINI_API_KEY is not configured on the server. Add GEMINI_API_KEY in Settings > Secrets to generate adaptive practice questions.',
      });
      return;
    }

    const { learnerContext, focusRequest, difficultyAdjustment } = req.body as {
      learnerContext?: LearnerContextInput;
      focusRequest?: string;
      difficultyAdjustment?: 'simpler' | 'same' | 'harder';
    };

    const prompt = `${buildContextPreamble('practice', learnerContext, null)}

Generate ONE beginner-friendly Python practice problem tailored to the learner's active topic (${
      learnerContext?.activeTopic || 'Python Basics'
    }), current difficulty (${learnerContext?.difficulty || 'Beginner'}${
      difficultyAdjustment === 'harder'
        ? ' — step up to slightly more challenging'
        : difficultyAdjustment === 'simpler'
        ? ' — keep extra gentle and foundational'
        : ''
    }), and any concepts needing improvement.
${focusRequest ? `Specific learner request: ${focusRequest.slice(0, 500)}` : ''}

Provide 3 progressive hints:
- hint1: A tiny conceptual nudge without giving away syntax.
- hint2: A clearer direction about which Python construct or condition to use.
- hint3: A helpful partial structure or template (with blanks/comments) without the final answer.
And provide solutionCode (clean Python) and solutionExplanation.`;

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: getConfiguredModel(),
          contents: prompt,
          config: {
            systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
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
        })
      );

      const text = (response.text ?? '{}').trim();
      const parsed = JSON.parse(text);
      res.json({ question: parsed });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ code: mapped.code, message: mapped.message });
    }
  });

  // Structured Adaptive Quiz Question Generator
  app.post('/api/tutor/quiz', async (req: Request, res: Response) => {
    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        code: 'API_KEY_MISSING',
        message:
          'GEMINI_API_KEY is not configured on the server. Add GEMINI_API_KEY in Settings > Secrets to generate adaptive quiz checks.',
      });
      return;
    }

    const { learnerContext, focusRequest, difficultyAdjustment } = req.body as {
      learnerContext?: LearnerContextInput;
      focusRequest?: string;
      difficultyAdjustment?: 'simpler' | 'same' | 'harder';
    };

    const prompt = `${buildContextPreamble('quiz', learnerContext, null)}

Generate ONE short multiple-choice or code-output Python quiz question tailored to the learner's topic (${
      learnerContext?.activeTopic || 'Python Basics'
    }) and difficulty (${learnerContext?.difficulty || 'Beginner'}${
      difficultyAdjustment === 'harder'
        ? ' — slightly harder than before'
        : difficultyAdjustment === 'simpler'
        ? ' — simpler foundational check'
        : ''
    }).
${focusRequest ? `Specific focus: ${focusRequest.slice(0, 500)}` : ''}
Include 4 concise options, 0-based correctIndex (0..3), concept name tested, and a clear explanation of why the correct option works and common mistakes.`;

    try {
      const response = await withRetry(() =>
        ai.models.generateContent({
          model: getConfiguredModel(),
          contents: prompt,
          config: {
            systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                codeSnippet: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
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
        })
      );

      const text = (response.text ?? '{}').trim();
      const parsed = JSON.parse(text);
      res.json({ quiz: parsed });
    } catch (err) {
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ code: mapped.code, message: mapped.message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Production build not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`PyVerse server listening on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start PyVerse server:', err);
  process.exit(1);
});
