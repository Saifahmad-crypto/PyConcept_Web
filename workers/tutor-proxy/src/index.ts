export interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL?: string;
  ALLOWED_ORIGIN?: string;
  RATE_LIMIT_MAX?: string;
  RATE_LIMIT_WINDOW_MS?: string;
}

const FALLBACK_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest',
];

const SYSTEM_INSTRUCTION = `You are PyVerse AI Tutor, an adaptive Python programming teacher.
Help students genuinely understand Python rather than simply giving them answers.
Use simple language, short examples, and step-by-step explanations.
In practice mode, give progressive hints before full solutions.`;

// In-memory sliding-window rate limiter per Worker isolate
const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const prev = rateBuckets.get(ip) ?? [];
  const recent = prev.filter((ts) => now - ts < windowMs);
  if (recent.length >= maxRequests) {
    rateBuckets.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateBuckets.set(ip, recent);
  return false;
}

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || '*';
  const configured = env.ALLOWED_ORIGIN || '*';
  const allowOrigin =
    configured === '*' || origin === configured || origin.startsWith('http://localhost:')
      ? origin
      : configured;

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function jsonResponse(
  data: unknown,
  status: number,
  request: Request,
  env: Env
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request, env),
    },
  });
}

function getCandidateModels(env: Env): string[] {
  const primary = (env.GEMINI_MODEL || '').trim();
  return Array.from(
    new Set(primary ? [primary, ...FALLBACK_MODELS] : FALLBACK_MODELS)
  );
}

async function callGeminiWithFallback(
  env: Env,
  endpointSuffix: string,
  payload: unknown
): Promise<globalThis.Response> {
  const models = getCandidateModels(env);
  let lastRes: globalThis.Response | null = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:${endpointSuffix}?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return res;
    }

    lastRes = res;
    if (res.status !== 503 && res.status !== 404 && res.status !== 429) {
      return res;
    }
  }

  return lastRes!;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/api/tutor/health' && request.method === 'GET') {
      return jsonResponse(
        {
          configured: Boolean(env.GEMINI_API_KEY),
          model: env.GEMINI_MODEL || FALLBACK_MODELS[0],
        },
        200,
        request,
        env
      );
    }

    if (!env.GEMINI_API_KEY) {
      return jsonResponse(
        {
          code: 'API_KEY_MISSING',
          message: 'GEMINI_API_KEY secret is not configured on the Cloudflare Worker.',
        },
        503,
        request,
        env
      );
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const maxReq = Number(env.RATE_LIMIT_MAX || '20');
    const windowMs = Number(env.RATE_LIMIT_WINDOW_MS || '60000');

    if (isRateLimited(ip, maxReq, windowMs)) {
      return jsonResponse(
        {
          code: 'RATE_LIMIT',
          message: 'Too many requests. Please wait a minute before trying again.',
        },
        429,
        request,
        env
      );
    }

    if (path === '/api/tutor/stream' && request.method === 'POST') {
      const body = (await request.json()) as {
        messages?: Array<{ role: string; content: string }>;
        mode?: string;
        learnerContext?: Record<string, unknown>;
        simulatorContext?: Record<string, unknown> | null;
      };

      const messages = Array.isArray(body.messages) ? body.messages.slice(-14) : [];
      if (messages.length === 0) {
        return jsonResponse({ message: 'Messages array is required.' }, 400, request, env);
      }

      const contents = messages.map((m, idx) => {
        const text = String(m.content || '').slice(0, 8000);
        const finalText =
          idx === messages.length - 1
            ? `[MODE: ${body.mode || 'explain'}]\n[CONTEXT: ${JSON.stringify(
                body.learnerContext || {}
              )}]\n${
                body.simulatorContext
                  ? `[SIMULATOR: ${JSON.stringify(body.simulatorContext)}]\n`
                  : ''
              }\n[STUDENT MESSAGE]:\n${text}`
            : text;

        return {
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: finalText }],
        };
      });

      const upstream = await callGeminiWithFallback(env, 'streamGenerateContent', {
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
      });

      if (!upstream.ok || !upstream.body) {
        return jsonResponse(
          { message: 'Unable to reach Gemini right now. Please try again shortly.' },
          upstream.status || 502,
          request,
          env
        );
      }

      // Gemini streamGenerateContent without alt=sse returns a JSON array stream;
      // use alt=sse or parse JSON response cleanly and emit PyVerse SSE events.
      const text = await upstream.text();
      let combined = '';
      try {
        const arr = JSON.parse(text) as Array<{
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        }>;
        for (const item of arr) {
          for (const part of item.candidates?.[0]?.content?.parts ?? []) {
            if (part.text) combined += part.text;
          }
        }
      } catch {
        combined = text;
      }

      const sseBody = `data: ${JSON.stringify({ type: 'chunk', text: combined })}\n\ndata: ${JSON.stringify({ type: 'done' })}\n\n`;
      return new Response(sseBody, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache',
          ...corsHeaders(request, env),
        },
      });
    }

    if (
      (path === '/api/tutor/practice' || path === '/api/tutor/quiz') &&
      request.method === 'POST'
    ) {
      const body = (await request.json()) as {
        learnerContext?: Record<string, unknown>;
        focusRequest?: string;
        difficultyAdjustment?: string;
      };

      const isPractice = path === '/api/tutor/practice';
      const prompt = isPractice
        ? `Generate ONE beginner-friendly Python practice task as JSON with keys: title, concept, difficulty, problemStatement, expectedOutput, starterCode, hint1, hint2, hint3, solutionCode, solutionExplanation. Context: ${JSON.stringify(
            body
          )}`
        : `Generate ONE 4-option Python multiple-choice quiz question as JSON with keys: question, codeSnippet, options (4 strings), correctIndex (0..3), concept, difficulty, explanation, recommendedPractice. Context: ${JSON.stringify(
            body
          )}`;

      const upstream = await callGeminiWithFallback(env, 'generateContent', {
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      });

      if (!upstream.ok) {
        return jsonResponse(
          { message: 'Could not generate response from Gemini.' },
          upstream.status || 502,
          request,
          env
        );
      }

      const raw = (await upstream.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const jsonText = raw.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const parsed = JSON.parse(jsonText);

      return jsonResponse(
        isPractice ? { question: parsed } : { quiz: parsed },
        200,
        request,
        env
      );
    }

    return jsonResponse({ message: 'Not found' }, 404, request, env);
  },
};
