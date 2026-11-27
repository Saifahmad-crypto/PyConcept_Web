export interface CodeLineStep {
  lineNumber: number;
  rawText: string;
  trimmedText: string;
  indent: number;
  category:
    | 'variable'
    | 'condition'
    | 'loop'
    | 'print'
    | 'input'
    | 'function'
    | 'flow'
    | 'comment'
    | 'empty';
  title: string;
  explanation: string;
  proTip?: string;
  variablesAffected?: string[];
  mockVariablesState: Record<string, string>;
  isExecutable: boolean;
}

export interface ExplainerSummary {
  totalLines: number;
  executableLines: number;
  variablesFound: string[];
  hasConditionals: boolean;
  hasLoops: boolean;
  hasInput: boolean;
  hasPrint: boolean;
  steps: CodeLineStep[];
}

function cleanLiteral(val: string): string {
  return val.trim().replace(/^['"]|['"]$/g, '');
}

/**
 * Pure-client, deterministic Python AST-lite line-by-line explainer.
 * Analyzes structure, simulates variable state progression, and provides
 * beginner-friendly educational explanations with common pitfalls.
 */
export function analyzePythonCodeStepByStep(code: string): ExplainerSummary {
  const lines = code.replace(/\r\n/g, '\n').split('\n');
  const steps: CodeLineStep[] = [];
  const trackedVars: Record<string, string> = {};
  const allVarNames = new Set<string>();

  let hasConditionals = false;
  let hasLoops = false;
  let hasInput = false;
  let hasPrint = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();
    const lineNum = i + 1;

    // Indent calculation
    let indent = 0;
    for (let c = 0; c < raw.length; c++) {
      if (raw[c] === ' ') indent++;
      else if (raw[c] === '\t') indent += 4;
      else break;
    }

    // 1. Empty lines
    if (trimmed === '') {
      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: '',
        indent,
        category: 'empty',
        title: 'Blank Line',
        explanation: 'Spacing used for code readability. Python ignores blank lines during execution.',
        mockVariablesState: { ...trackedVars },
        isExecutable: false,
      });
      continue;
    }

    // 2. Comments
    if (trimmed.startsWith('#')) {
      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'comment',
        title: 'Comment Annotation',
        explanation: `Python ignores this line: "${trimmed.replace(/^#\s*/, '')}". Used by programmers to document logic.`,
        proTip: 'Comments start with # in Python and help make your code self-documenting.',
        mockVariablesState: { ...trackedVars },
        isExecutable: false,
      });
      continue;
    }

    // Strip inline comments for parsing
    const codePart = trimmed.split('#')[0].trim();

    // 3. Print statement
    if (/^print\s*\(/.test(codePart)) {
      hasPrint = true;
      const content = codePart.replace(/^print\s*\(/, '').replace(/\)\s*$/, '');
      let title = 'Print to Console';
      let explanation = `Evaluates (${content}) and displays the formatted result on the screen.`;

      if (content.includes('f"') || content.includes("f'")) {
        explanation = `Uses Python's f-string formatting to interpolate expressions inside curly braces { } directly into the text.`;
      }

      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'print',
        title,
        explanation,
        proTip: 'print() adds a newline by default. Use print(..., end="") to avoid automatic newlines.',
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    // 4. Input statement
    if (/=\s*.*input\s*\(/.test(codePart)) {
      hasInput = true;
      const match = codePart.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)/);
      const varName = match ? match[1] : 'input_value';
      const isInt = /int\s*\(\s*input/.test(codePart);
      const isFloat = /float\s*\(\s*input/.test(codePart);

      allVarNames.add(varName);
      trackedVars[varName] = isInt ? '0' : isFloat ? '0.0' : '"<user input>"';

      let explanation = `Prompts the user for keyboard input and assigns the entered text to variable '${varName}'.`;
      if (isInt) {
        explanation = `Reads user keyboard input, converts the string into an integer with int(), and stores it in '${varName}'.`;
      } else if (isFloat) {
        explanation = `Reads user keyboard input, converts the string into a decimal float with float(), and stores it in '${varName}'.`;
      }

      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'input',
        title: `Input Prompt → Store in '${varName}'`,
        explanation,
        variablesAffected: [varName],
        proTip: 'input() always returns a string (str). Remember to wrap in int() or float() for numerical math!',
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    // 5. For Loop
    if (/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+(.+):/.test(codePart)) {
      hasLoops = true;
      const match = codePart.match(/^for\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+(.+):/);
      const loopVar = match ? match[1] : 'i';
      const iterExpr = match ? match[2].trim() : '';
      allVarNames.add(loopVar);

      let explanation = `Starts a for-loop. In each iteration, variable '${loopVar}' takes the next element from ${iterExpr}.`;
      let proTip = 'The indented block below will execute once for each element in the sequence.';

      if (iterExpr.startsWith('range(')) {
        const rangeArgs = iterExpr.replace(/^range\s*\(/, '').replace(/\)\s*$/, '').split(',').map((s) => s.trim());
        if (rangeArgs.length === 1) {
          explanation = `Iterates ${rangeArgs[0]} times. Variable '${loopVar}' starts at 0 and goes up to ${Number(rangeArgs[0]) - 1} (stop value is excluded).`;
          trackedVars[loopVar] = '0';
        } else if (rangeArgs.length >= 2) {
          explanation = `Iterates from ${rangeArgs[0]} up to ${Number(rangeArgs[1]) - 1}. Variable '${loopVar}' is updated on each pass.`;
          trackedVars[loopVar] = rangeArgs[0];
        }
        proTip = 'range(start, stop) excludes the stop number! range(1, 5) produces 1, 2, 3, 4.';
      } else {
        trackedVars[loopVar] = `'first_item'`;
      }

      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'loop',
        title: `For Loop Header (Iterate '${loopVar}')`,
        explanation,
        variablesAffected: [loopVar],
        proTip,
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    // 6. While Loop
    if (/^while\s+(.+):/.test(codePart)) {
      hasLoops = true;
      const match = codePart.match(/^while\s+(.+):/);
      const cond = match ? match[1].trim() : 'condition';

      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'loop',
        title: `While Loop (Test '${cond}')`,
        explanation: `Checks condition '${cond}'. As long as this expression evaluates to True, Python will repeat the indented block below.`,
        proTip: 'Ensure something inside the loop modifies the variables in the condition, otherwise you get an infinite loop!',
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    // 7. If / Elif / Else Conditionals
    if (/^if\s+(.+):/.test(codePart)) {
      hasConditionals = true;
      const cond = codePart.replace(/^if\s+/, '').replace(/:$/, '').trim();
      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'condition',
        title: `If Condition Check ('${cond}')`,
        explanation: `Evaluates condition '${cond}'. If True, Python enters the indented block directly underneath. If False, it skips ahead.`,
        proTip: "Use '==' for comparison, not '=' which is assignment!",
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    if (/^elif\s+(.+):/.test(codePart)) {
      hasConditionals = true;
      const cond = codePart.replace(/^elif\s+/, '').replace(/:$/, '').trim();
      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'condition',
        title: `Elif Condition Check ('${cond}')`,
        explanation: `Alternative branch: Python checks '${cond}' ONLY if all previous 'if' and 'elif' checks in this ladder were False.`,
        proTip: "Python stops checking remaining elif/else branches as soon as the first True branch is found.",
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    if (/^else\s*:/.test(codePart)) {
      hasConditionals = true;
      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'condition',
        title: 'Else Fallback Branch',
        explanation: `Default catch-all branch. Runs if none of the preceding 'if' or 'elif' conditions were met.`,
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    // 8. Flow control (break, continue, pass)
    if (/^(break|continue|pass)\b/.test(codePart)) {
      const kw = codePart.split(/\s+/)[0];
      let exp = '';
      if (kw === 'break') exp = 'Immediately exits the enclosing loop entirely.';
      else if (kw === 'continue') exp = 'Skips the remainder of the current loop iteration and moves to the next pass.';
      else exp = 'Placeholder that does nothing (null operation).';

      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'flow',
        title: `Flow Control: '${kw}'`,
        explanation: exp,
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    // 9. Augmented assignment (+=, -=, *=, /=)
    const augMatch = codePart.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(\+=|-=|\*=|\/=)\s*(.*)/);
    if (augMatch) {
      const varName = augMatch[1];
      const op = augMatch[2];
      const expr = augMatch[3].trim();
      allVarNames.add(varName);

      trackedVars[varName] = `<updated ${varName} ${op} ${expr}>`;

      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'variable',
        title: `Update Variable '${varName}' (${op} ${expr})`,
        explanation: `Modifies '${varName}' by applying operator '${op}' with '${expr}'. Equivalent to '${varName} = ${varName} ${op[0]} ${expr}'.`,
        variablesAffected: [varName],
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    // 10. Normal Assignment (name = value)
    const assignMatch = codePart.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)/);
    if (assignMatch && !assignMatch[2].startsWith('=')) {
      const varName = assignMatch[1];
      const expr = assignMatch[2].trim();
      allVarNames.add(varName);

      trackedVars[varName] = expr;

      steps.push({
        lineNumber: lineNum,
        rawText: raw,
        trimmedText: trimmed,
        indent,
        category: 'variable',
        title: `Assign Variable '${varName}'`,
        explanation: `Evaluates '${expr}' and binds the result to variable name '${varName}' in Python memory.`,
        variablesAffected: [varName],
        proTip: 'Variable names should be descriptive and use snake_case in Python.',
        mockVariablesState: { ...trackedVars },
        isExecutable: true,
      });
      continue;
    }

    // 11. Generic statement / Expression
    steps.push({
      lineNumber: lineNum,
      rawText: raw,
      trimmedText: trimmed,
      indent,
      category: 'function',
      title: `Execute Statement`,
      explanation: `Python evaluates the statement '${trimmed}'.`,
      mockVariablesState: { ...trackedVars },
      isExecutable: true,
    });
  }

  const executableCount = steps.filter((s) => s.isExecutable).length;

  return {
    totalLines: lines.length,
    executableLines: executableCount,
    variablesFound: Array.from(allVarNames),
    hasConditionals,
    hasLoops,
    hasInput,
    hasPrint,
    steps,
  };
}

import { buildTutorApiUrl, hasConfiguredProxyUrl } from './tutorClient';

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

/**
 * AI-powered line-by-line explanation call via the centralized backend proxy
 * with seamless direct Gemini fallback on GitHub Pages.
 */
export async function fetchAiLineByLineExplanation({
  code,
}: {
  code: string;
}): Promise<Array<{ lineNumber: number; title: string; explanation: string }>> {
  if (!code.trim()) return [];

  // Try server proxy first if configured
  if (hasConfiguredProxyUrl()) {
    try {
      const res = await fetch(buildTutorApiUrl('/api/tutor/explain-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          steps?: Array<{ lineNumber: number; title: string; explanation: string }>;
        };
        if (Array.isArray(data.steps) && data.steps.length > 0) {
          return data.steps;
        }
      }
    } catch {
      // Fallback to direct Gemini API call
    }
  }

  // Direct Gemini API call for static GitHub Pages hosting
  try {
    const prompt = `Analyze this Python snippet line-by-line for a beginner student.
Code:
\`\`\`python
${code.slice(0, 3000)}
\`\`\`

Return a JSON array of objects with exact keys:
[
  {
    "lineNumber": 1,
    "title": "short step title",
    "explanation": "clear, friendly beginner explanation of what Python does on this line and what variables or outputs change"
  }
]
Return ONLY valid JSON array with no extra markdown text.`;

    const apiKey = getInbuiltGeminiKey();
    const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text);
        }
      } catch {
        // try next model
      }
    }
    return [];
  } catch {
    return [];
  }
}
