import React, { useState } from 'react';
import { Play, RotateCcw, Trash2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { PLAYGROUND_EXAMPLES } from '../data/curriculumData';
import { runPythonCode, PythonRunResult } from '../utils/pythonEngine';

export const CodePlayground: React.FC = () => {
  const [selectedExampleId, setSelectedExampleId] = useState<string>(PLAYGROUND_EXAMPLES[0].id);
  const [code, setCode] = useState<string>(PLAYGROUND_EXAMPLES[0].code);
  const [result, setResult] = useState<PythonRunResult | null>(() =>
    runPythonCode(PLAYGROUND_EXAMPLES[0].code)
  );

  const selectedExample = PLAYGROUND_EXAMPLES.find((e) => e.id === selectedExampleId)!;

  const handleSelectExample = (id: string) => {
    const found = PLAYGROUND_EXAMPLES.find((e) => e.id === id);
    if (!found) return;
    setSelectedExampleId(id);
    setCode(found.code);
    setResult(runPythonCode(found.code));
  };

  const handleRun = () => {
    setResult(runPythonCode(code));
  };

  const handleReset = () => {
    setCode(selectedExample.code);
    setResult(runPythonCode(selectedExample.code));
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

  const lineCount = code.split('\n').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-800/80 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium text-blue-400">Code Playground</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
            Guided Python Simulation
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Experiment with conditionals, loops, <code className="font-mono text-sky-300">range()</code>,{' '}
            <code className="font-mono text-sky-300">break</code>, and{' '}
            <code className="font-mono text-sky-300">continue</code> directly in your browser.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-[#0D1426] px-3.5 py-2.5 text-xs text-slate-300 max-w-md">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
          <span>
            This playground runs a <strong>guided in-browser Python logic simulation</strong> (no backend server required) supporting beginner syntax, indentation checks, and loop safety guards.
          </span>
        </div>
      </div>

      {/* Controls & Example Selector */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/90 bg-[#0D1426] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="playground-example-select" className="text-xs font-medium text-slate-400">
            Load Example:
          </label>
          <select
            id="playground-example-select"
            value={selectedExampleId}
            onChange={(e) => handleSelectExample(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            {PLAYGROUND_EXAMPLES.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))}
          </select>
          <span className="text-xs text-slate-400 hidden xl:inline">
            {selectedExample.description}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRun}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 whitespace-nowrap"
          >
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Run Code
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleClearOutput}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear Output
          </button>
        </div>
      </div>

      {/* Editor + Output Console Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Code Editor */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0A101E]">
            <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#0E1629] px-4 py-2.5 text-xs text-slate-400">
              <span className="font-mono">main.py</span>
              <span>Tip: Press Tab to indent 4 spaces</span>
            </div>
            <div className="flex">
              {/* Line Numbers */}
              <div
                aria-hidden="true"
                className="select-none border-r border-slate-800/70 bg-[#080D18] px-3 py-4 text-right font-mono text-xs leading-6 text-slate-600 tabular-nums"
              >
                {Array.from({ length: Math.max(12, lineCount) }, (_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              <textarea
                aria-label="Python code editor"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                rows={14}
                className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Output Console */}
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0A101E]">
            <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#0E1629] px-4 py-2.5 text-xs">
              <span className="font-semibold text-slate-300">Output Console</span>
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
                <p className="text-xs text-slate-500">
                  Console cleared. Click &quot;Run Code&quot; to execute your script.
                </p>
              ) : (
                <div className="space-y-4">
                  {result.output ? (
                    <pre className="whitespace-pre-wrap text-emerald-300">{result.output}</pre>
                  ) : result.success ? (
                    <p className="text-xs text-slate-500">
                      Program ran without errors and produced no print() output.
                    </p>
                  ) : null}

                  {result.error && (
                    <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 font-sans text-xs space-y-2">
                      <p className="font-mono font-bold text-rose-300">
                        {result.error.type} on Line {result.error.line}
                      </p>
                      <p className="text-slate-200">{result.error.message}</p>
                      <p className="rounded-lg bg-[#090E1A] p-2.5 text-amber-200">
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
    </div>
  );
};
