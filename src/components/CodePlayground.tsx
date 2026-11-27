import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Info,
  Copy,
  Check,
  Keyboard,
  Cpu,
  BookmarkPlus,
  FolderOpen,
  Sparkles,
  Square,
  Loader2,
} from 'lucide-react';
import { PLAYGROUND_EXAMPLES } from '../data/curriculumData';
import { SavedSnippet } from '../types';
import { runPythonCode, PythonRunResult } from '../utils/pythonEngine';
import { pyodideService, PyodideProgressStatus } from '../workers/pyodideRunner';
import { CodeExplainerModal } from './studio/CodeExplainerModal';

interface CodePlaygroundProps {
  externalCode?: string | null;
  onConsumeExternalCode?: () => void;
  onRecordSandboxRun?: () => void;
  savedSnippets?: SavedSnippet[];
  onSaveSnippet?: (title: string, code: string) => void;
  onDeleteSnippet?: (id: string) => void;
  onOpenTutorWithCode?: (code: string) => void;
}

const INPUT_DEMO_CODE = `# Interactive input() demo\nname = input("Enter your name: ")\nscore = int(input("Enter your score (0-100): "))\n\nif score >= 75:\n    print(f"Awesome job {name}! Honors unlocked.")\nelse:\n    print(f"Keep practicing, {name}!")`;

const PY_KEYWORDS = new Set([
  'if',
  'elif',
  'else',
  'for',
  'in',
  'while',
  'break',
  'continue',
  'and',
  'or',
  'not',
  'True',
  'False',
  'None',
  'pass',
]);

const PY_BUILTINS = new Set([
  'print',
  'input',
  'range',
  'len',
  'int',
  'float',
  'str',
  'bool',
  'abs',
  'min',
  'max',
  'sum',
  'round',
]);

function highlightPythonLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex =
    /(#.*$|f"(?:\\.|[^"])*"|f'(?:\\.|[^'])*'|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(line.slice(lastIndex, match.index));
    }
    const word = match[0];
    if (word.startsWith('#')) {
      tokens.push(
        <span key={k++} className="text-[#8A8585] dark:text-[#9a8585] italic">
          {word}
        </span>
      );
    } else if (
      word.startsWith('"') ||
      word.startsWith("'") ||
      word.startsWith('f"') ||
      word.startsWith("f'")
    ) {
      tokens.push(
        <span key={k++} className="text-emerald-300">
          {word}
        </span>
      );
    } else if (/^\d/.test(word)) {
      tokens.push(
        <span key={k++} className="text-amber-300">
          {word}
        </span>
      );
    } else if (PY_KEYWORDS.has(word)) {
      tokens.push(
        <span key={k++} className="font-semibold text-[#FF6B6B]">
          {word}
        </span>
      );
    } else if (PY_BUILTINS.has(word)) {
      tokens.push(
        <span key={k++} className="text-[#E10906]">
          {word}
        </span>
      );
    } else {
      tokens.push(
        <span key={k++} className="text-[#FBF5F9]">
          {word}
        </span>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push(line.slice(lastIndex));
  }
  return tokens;
}

type PyodideRuntime = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (msg: string) => void }) => void;
};

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  externalCode,
  onConsumeExternalCode,
  onRecordSandboxRun,
  savedSnippets = [],
  onSaveSnippet,
  onDeleteSnippet,
  onOpenTutorWithCode,
}) => {
  const [selectedExampleId, setSelectedExampleId] = useState<string>(PLAYGROUND_EXAMPLES[0].id);
  const [code, setCode] = useState<string>(() => externalCode || PLAYGROUND_EXAMPLES[0].code);
  const [stdinText, setStdinText] = useState<string>('Maya\n88');
  const [copied, setCopied] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetSavedFlash, setSnippetSavedFlash] = useState(false);
  const [runtimeMode, setRuntimeMode] = useState<'fast' | 'real'>('fast');
  const [pyodideState, setPyodideState] = useState<PyodideProgressStatus>('idle');
  const [pyodideMsg, setPyodideMsg] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const preRef = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    const unsub = pyodideService.subscribeStatus((st, msg) => {
      setPyodideState(st);
      setPyodideMsg(msg);
    });
    return unsub;
  }, []);

  const [result, setResult] = useState<PythonRunResult | null>(() =>
    runPythonCode(externalCode || PLAYGROUND_EXAMPLES[0].code, ['Maya', '88'])
  );

  useEffect(() => {
    if (!externalCode) return;
    setCode(externalCode);
    setResult(runPythonCode(externalCode, stdinText.split('\n')));
    onConsumeExternalCode?.();
  }, [externalCode, onConsumeExternalCode, stdinText]);

  const selectedExample = PLAYGROUND_EXAMPLES.find((e) => e.id === selectedExampleId);
  const usesInput = /\binput\s*\(/.test(code);

  const handleSelectEngine = (mode: 'fast' | 'real') => {
    setRuntimeMode(mode);
    if (mode === 'real') {
      pyodideService.init();
    }
  };

  const handleSelectExample = (id: string) => {
    if (id === 'ex-input-demo') {
      setSelectedExampleId(id);
      setCode(INPUT_DEMO_CODE);
      setResult(runPythonCode(INPUT_DEMO_CODE, stdinText.split('\n')));
      return;
    }
    const found = PLAYGROUND_EXAMPLES.find((e) => e.id === id);
    if (!found) return;
    setSelectedExampleId(id);
    setCode(found.code);
    setResult(runPythonCode(found.code, stdinText.split('\n')));
  };

  const handleRun = async () => {
    onRecordSandboxRun?.();
    const stdinLines = stdinText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    if (runtimeMode === 'real') {
      setIsRunning(true);
      try {
        const res = await pyodideService.runCode(code, stdinLines, 10000);
        setIsRunning(false);
        if (res.success) {
          setResult({
            success: true,
            output: res.output,
            stepsExecuted: code.split('\n').length,
          });
        } else {
          setResult({
            success: false,
            output: res.output,
            stepsExecuted: 0,
            error: {
              type: res.error?.type || 'PythonError',
              line: 1,
              message: res.error?.message || 'Execution error occurred.',
              hint: res.error?.hint || 'Check your Python syntax or loop bounds.',
            },
          });
        }
      } catch (err: any) {
        setIsRunning(false);
        setResult({
          success: false,
          output: '',
          stepsExecuted: 0,
          error: {
            type: 'WorkerExecutionError',
            line: 1,
            message: err?.message || 'Worker execution failed.',
            hint: 'Click Run again to retry.',
          },
        });
      }
      return;
    }

    setResult(runPythonCode(code, stdinText.split('\n')));
  };

  const handleStop = () => {
    pyodideService.stop();
    setIsRunning(false);
  };

  const handleReset = () => {
    const defaultCode =
      selectedExampleId === 'ex-input-demo'
        ? INPUT_DEMO_CODE
        : selectedExample?.code || PLAYGROUND_EXAMPLES[0].code;
    setCode(defaultCode);
    setResult(runPythonCode(defaultCode, stdinText.split('\n')));
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Ignore clipboard failures cleanly
    }
  };

  const handleClearOutput = () => {
    setResult(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.substring(0, start) + '    ' + code.substring(end);
      setCode(updated);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      });
    }
  };

  const codeLines = code.split('\n');
  const lineCount = codeLines.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E5DFDF] dark:border-[#3a1a1a] pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold text-[#E10906]">PyVerse Python Sandbox</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-4xl">
            Interactive Python Sandbox
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#8A8585] dark:text-[#9a8585]">
            Write and experiment with Python code, test <code className="font-mono text-[#E10906]">input()</code>, and see instant syntax-highlighted output.
          </p>
        </div>

        {/* Engine Selector: Fast (basic) / Real Python */}
        <div className="flex flex-col items-start gap-2 lg:items-end">
          <div className="inline-flex items-center gap-1 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-1 shadow-xs">
            <button
              type="button"
              onClick={() => handleSelectEngine('fast')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                runtimeMode === 'fast'
                  ? 'bg-[#E10906] text-white shadow-xs'
                  : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
              }`}
            >
              <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
              Fast (Basic Engine)
            </button>
            <button
              type="button"
              onClick={() => handleSelectEngine('real')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                runtimeMode === 'real'
                  ? 'bg-gradient-to-r from-[#E10906] to-[#8B5CF6] text-white shadow-xs'
                  : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
              }`}
            >
              {pyodideState === 'loading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Real Python (Pyodide)</span>
            </button>
          </div>
          <p className="flex items-center gap-1.5 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
            <Info className="h-3.5 w-3.5 text-[#E10906] shrink-0" aria-hidden="true" />
            {runtimeMode === 'real' ? (
              pyodideState === 'loading' ? (
                <span className="text-amber-500 font-medium animate-pulse">
                  {pyodideMsg || 'Downloading & initializing CPython in Web Worker...'}
                </span>
              ) : pyodideState === 'ready' ? (
                <span>Running CPython 3.12 Web Worker · 10s timeout guard active</span>
              ) : pyodideState === 'error' ? (
                <span className="text-rose-500">{pyodideMsg}</span>
              ) : (
                <span>Click Run to start full Python 3.12 execution</span>
              )
            ) : (
              <span>Instant beginner AST engine with infinite-loop &amp; indentation guards.</span>
            )}
          </p>
        </div>
      </div>

      {/* Controls & Example Selector */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="playground-example-select" className="text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
            Example Program:
          </label>
          <select
            id="playground-example-select"
            value={selectedExampleId}
            onChange={(e) => handleSelectExample(e.target.value)}
            className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-xs font-medium text-[#100303] dark:text-[#f0eaea] focus:border-[#E10906] focus:outline-none sm:text-sm"
          >
            {PLAYGROUND_EXAMPLES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))}
            <option value="ex-input-demo">9. Interactive input() Demo</option>
          </select>
          <span className="hidden text-xs text-[#8A8585] dark:text-[#9a8585] xl:inline">
            {selectedExampleId === 'ex-input-demo'
              ? 'Reads lines from Program Inputs below using input().'
              : selectedExample?.description}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isRunning ? (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 font-display text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-700 whitespace-nowrap animate-pulse"
            >
              <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
              Stop Execution
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRun}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#E10906] px-4 py-2 font-display text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              Run Code
            </button>
          )}
          <button
            type="button"
            onClick={() => setExplainerOpen(true)}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#E10906] bg-[#E10906]/10 px-4 py-2 font-display text-xs font-semibold text-[#E10906] shadow-sm transition-all hover:bg-[#E10906] hover:text-white whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Explain Step-by-Step
          </button>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3.5 py-2 text-xs font-medium text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] whitespace-nowrap"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3.5 py-2 text-xs font-medium text-[#100303] dark:text-[#f0eaea] hover:bg-[#F1EEEE] dark:hover:bg-[#221010] dark:bg-[#221010] whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleClearOutput}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-medium text-[#8A8585] dark:text-[#9a8585] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303] whitespace-nowrap"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear Output
          </button>
        </div>
      </div>

      {/* Editor + Output Console Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Syntax-Highlighted Code Editor */}
        <div className="space-y-4 lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] shadow-lg shadow-[#100303]/5">
            <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2.5 text-xs text-[#CFC8C8]">
              <span className="font-mono font-medium">main.py</span>
              <span className="text-[#8A8585] dark:text-[#9a8585]">Syntax highlighted · Tab = 4 spaces</span>
            </div>

            <div className="flex">
              {/* Line Numbers */}
              <div
                aria-hidden="true"
                className="select-none border-r border-[#2C1616] bg-[#0B1120] px-3 py-4 text-right font-mono text-xs leading-6 text-[#8A8585] dark:text-[#9a8585] tabular-nums"
              >
                {Array.from({ length: Math.max(13, lineCount) }, (_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              {/* Synchronized Highlight Layer + Editable Textarea */}
              <div className="relative min-h-[344px] flex-1 overflow-hidden">
                <pre
                  ref={preRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-4 font-mono text-sm leading-6"
                >
                  {codeLines.map((ln, idx) => (
                    <div key={idx}>{ln.length > 0 ? highlightPythonLine(ln) : '\u00A0'}</div>
                  ))}
                </pre>
                <textarea
                  aria-label="Python code editor"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onScroll={(e) => {
                    if (preRef.current) {
                      preRef.current.scrollTop = e.currentTarget.scrollTop;
                      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  rows={14}
                  className="relative z-10 h-full min-h-[344px] w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-transparent caret-sky-400 selection:bg-[#E10906]/30 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Interactive Stdin Box (for input() support) */}
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="sandbox-stdin"
                className="inline-flex items-center gap-2 font-display text-xs font-bold text-[#100303] dark:text-[#f0eaea]"
              >
                <Keyboard className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                Program Inputs (for <code className="font-mono text-[#E10906]">input()</code>, one per line)
              </label>
              <span className="font-mono text-[11px] text-[#8A8585] dark:text-[#9a8585]">
                {usesInput ? 'Detected input() in code' : 'Optional stdin buffer'}
              </span>
            </div>
            <textarea
              id="sandbox-stdin"
              rows={2}
              value={stdinText}
              onChange={(e) => setStdinText(e.target.value)}
              placeholder="Line 1 = first input(), Line 2 = second input()..."
              className="mt-2 w-full rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 font-mono text-xs text-[#100303] dark:text-[#f0eaea] focus:border-[#E10906] focus:outline-none"
            />
          </div>

          {/* Local Saved Snippets */}
          {onSaveSnippet && (
            <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-[#100303] dark:text-[#f0eaea]">
                  <FolderOpen className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                  Saved Local Snippets ({savedSnippets.length})
                </span>
                {snippetSavedFlash && (
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    Saved to this browser!
                  </span>
                )}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSaveSnippet(snippetTitle || `Snippet ${savedSnippets.length + 1}`, code);
                  setSnippetTitle('');
                  setSnippetSavedFlash(true);
                  setTimeout(() => setSnippetSavedFlash(false), 1800);
                }}
                className="flex flex-wrap gap-2"
              >
                <input
                  type="text"
                  value={snippetTitle}
                  onChange={(e) => setSnippetTitle(e.target.value)}
                  placeholder="Name this Python script..."
                  aria-label="Snippet title"
                  className="min-w-0 flex-1 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-xs text-[#100303] dark:text-[#f0eaea] focus:border-[#E10906] focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#190909] whitespace-nowrap"
                >
                  <BookmarkPlus className="h-3.5 w-3.5" aria-hidden="true" />
                  Save Script
                </button>
              </form>

              {savedSnippets.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {savedSnippets.map((snip) => (
                    <div
                      key={snip.id}
                      className="inline-flex items-center gap-1 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] pl-3 pr-1.5 py-1.5 text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setCode(snip.code);
                          setResult(runPythonCode(snip.code, stdinText.split('\n')));
                        }}
                        className="font-semibold text-[#100303] dark:text-[#f0eaea] hover:text-[#E10906]"
                      >
                        {snip.title}
                      </button>
                      {onDeleteSnippet && (
                        <button
                          type="button"
                          onClick={() => onDeleteSnippet(snip.id)}
                          aria-label={`Delete ${snip.title}`}
                          className="rounded-lg p-1 text-[#8A8585] dark:text-[#9a8585] hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600"
                        >
                          <Trash2 className="h-3 w-3" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Output Console */}
        <div className="lg:col-span-5">
          <div className="flex h-full min-h-[390px] flex-col overflow-hidden rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] shadow-lg shadow-[#100303]/5">
            <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2.5 text-xs">
              <span className="font-semibold text-[#CFC8C8]">Output Console</span>
              {result && (
                <span
                  className={`inline-flex items-center gap-1.5 font-mono text-xs ${
                    result.success ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {result.success ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Executed ({result.stepsExecuted} steps)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      {result.error?.type}
                    </>
                  )}
                </span>
              )}
            </div>

            <div className="flex-1 p-4 font-mono text-sm leading-relaxed">
              {!result ? (
                <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                  Console cleared. Click &quot;Run Code&quot; to execute your script.
                </p>
              ) : (
                <div className="space-y-4">
                  {result.output ? (
                    <pre className="whitespace-pre-wrap text-emerald-300">{result.output}</pre>
                  ) : result.success ? (
                    <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                      Program ran without errors and produced no print() output.
                    </p>
                  ) : null}

                  {result.error && (
                    <div className="rounded-xl border border-rose-500/40 bg-rose-950/60 p-4 font-sans text-xs space-y-2">
                      <p className="font-mono font-bold text-rose-300">
                        {result.error.type} on Line {result.error.line}
                      </p>
                      <p className="text-[#FBF5F9]">{result.error.message}</p>
                      <p className="rounded-lg border border-[#2C1616] bg-[#0B1120] p-2.5 text-amber-200">
                        <strong>Beginner Tip:</strong> {result.error.hint}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CodeExplainerModal
        code={code}
        isOpen={explainerOpen}
        onClose={() => setExplainerOpen(false)}
        onOpenTutorWithCode={onOpenTutorWithCode}
      />
    </div>
  );
};
