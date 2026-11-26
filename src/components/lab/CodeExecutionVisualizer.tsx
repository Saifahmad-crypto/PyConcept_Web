import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Terminal,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { tracePythonCode, formatPyLiteral } from '../../utils/pythonEngine';
import {
  AnimationSpeedController,
  useSharedSimulatorSpeed,
} from '../simulators/AnimationSpeedController';

const EXEC_TEMPLATES = [
  {
    id: 'branch-loop',
    label: 'Condition + Loop',
    code: `score = 82\nif score >= 75:\n    print("Honors")\nelse:\n    print("Pass")\n\nfor i in range(1, 4):\n    print("Badge", i)`,
  },
  {
    id: 'while-break',
    label: 'while + break',
    code: `fuel = 3\nwhile fuel > 0:\n    print("Fuel:", fuel)\n    fuel -= 1\n    if fuel == 1:\n        print("Low reserve!")\n        break`,
  },
  {
    id: 'nested',
    label: 'Nested Loop Sum',
    code: `total = 0\nfor r in range(1, 3):\n    for c in range(1, 4):\n        total += c\nprint("Total:", total)`,
  },
];

export const CodeExecutionVisualizer: React.FC = () => {
  const [code, setCode] = useState(EXEC_TEMPLATES[0].code);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { speedMs, setSpeedMs } = useSharedSimulatorSpeed();
  const trace = useMemo(() => tracePythonCode(code), [code]);
  const steps = trace.steps;

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [code]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((s) => Math.min(steps.length, s + 1));
    }, speedMs);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length, speedMs]);

  const activeStep = stepIndex > 0 && stepIndex <= steps.length ? steps[stepIndex - 1] : null;
  const prevStep = stepIndex > 1 && stepIndex <= steps.length ? steps[stepIndex - 2] : null;
  const nextStepPreview = stepIndex < steps.length ? steps[stepIndex] : null;

  const codeLines = code.split('\n');

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold text-[#E10906]">Line-by-Line Tracer</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-[#100303] dark:text-[#f0eaea]">
            Code Execution Visualizer
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#8A8585] dark:text-[#9a8585]">
            Watch Python execute line-by-line, inspect previous/current/next lines, trace variable
            updates, and jump cleanly to any step on the timeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {EXEC_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setCode(tpl.code)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                code === tpl.code
                  ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#100303] dark:text-[#f0eaea]'
                  : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
              }`}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="space-y-3 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (isPlaying) setIsPlaying(false);
                else {
                  if (stepIndex >= steps.length) setStepIndex(0);
                  setIsPlaying(true);
                }
              }}
              disabled={steps.length === 0}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#E10906] px-4 py-2 text-xs font-semibold text-white shadow-xs disabled:opacity-40"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {isPlaying ? 'Pause' : stepIndex >= steps.length && steps.length > 0 ? 'Replay' : 'Run'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIndex((s) => Math.max(0, s - 1));
              }}
              disabled={stepIndex <= 0}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] disabled:opacity-40"
            >
              <SkipBack className="h-3.5 w-3.5 text-[#E10906]" />
              Prev
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIndex((s) => Math.min(steps.length, s + 1));
              }}
              disabled={stepIndex >= steps.length}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] disabled:opacity-40"
            >
              <SkipForward className="h-3.5 w-3.5 text-[#E10906]" />
              Next
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIndex(0);
              }}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-2 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs tabular-nums">
            <span className="text-[#8A8585] dark:text-[#9a8585]">
              Prev: <strong className="text-[#100303] dark:text-[#f0eaea]">{prevStep ? `L${prevStep.line}` : '—'}</strong>
            </span>
            <span className="text-[#E10906]">
              Current: <strong>{activeStep ? `L${activeStep.line}` : 'Ready'}</strong>
            </span>
            <span className="text-[#8A8585] dark:text-[#9a8585]">
              Next: <strong className="text-[#100303] dark:text-[#f0eaea]">{nextStepPreview ? `L${nextStepPreview.line}` : 'End'}</strong>
            </span>
            <span className="font-bold text-[#100303] dark:text-[#f0eaea]">
              Step {stepIndex}/{steps.length}
            </span>
          </div>
        </div>

        <AnimationSpeedController
          speedMs={speedMs}
          onChangeSpeedMs={setSpeedMs}
          totalSteps={steps.length}
          currentStep={stepIndex}
          compact
        />
      </div>

      {/* Main Split: Editor + Live Trace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Code Editor & Line Highlighting */}
        <div className="space-y-4 lg:col-span-6">
          <div className="overflow-hidden rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2.5 text-xs text-[#CFC8C8]">
              <span className="font-mono font-semibold">Editable Python Input</span>
              <span className="text-[#8A8585] dark:text-[#9a8585]">Edit code to regenerate execution trace</span>
            </div>
            <div className="p-3">
              <textarea
                aria-label="Python code for execution visualizer"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={8}
                spellCheck={false}
                className="w-full resize-y rounded-xl border border-[#2C1616] bg-[#0B1120] p-3 font-mono text-xs sm:text-sm leading-6 text-[#FBF5F9] focus:border-[#E10906] focus:outline-none"
              />
            </div>

            <div className="border-t border-[#2C1616] py-2 font-mono text-xs leading-6">
              {codeLines.map((ln, idx) => {
                const lineNum = idx + 1;
                const isActive = activeStep?.line === lineNum;
                const isPrev = prevStep?.line === lineNum && !isActive;
                return (
                  <div
                    key={lineNum}
                    className={`flex items-center px-3 ${
                      isActive
                        ? 'bg-[#FFF1F1] dark:bg-[#2a0808]0/25 text-white'
                        : isPrev
                        ? 'bg-[#190909]/60 text-[#CFC8C8]'
                        : 'text-[#8A8585] dark:text-[#9a8585]'
                    }`}
                  >
                    <span className="w-5 shrink-0 text-[10px] font-bold text-[#E10906]">
                      {isActive ? '▶' : isPrev ? '•' : ''}
                    </span>
                    <span className="w-7 shrink-0 pr-2 text-right text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                      {lineNum}
                    </span>
                    <pre className="whitespace-pre">{ln || ' '}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {trace.error && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
              <div>
                <p className="font-bold">
                  {trace.error.type} on line {trace.error.line}
                </p>
                <p className="mt-0.5">{trace.error.message}</p>
                <p className="mt-1 text-rose-800">{trace.error.hint}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Variables, Condition Check, Output & Timeline */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1EEEE] dark:border-[#2a1212] pb-2.5">
              <h3 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                Live State &amp; Variables
              </h3>
              {activeStep?.loopVar && (
                <span className="font-mono text-xs font-semibold text-[#E10906] tabular-nums">
                  {activeStep.loopVar.name} = {activeStep.loopVar.value} · pass #
                  {activeStep.loopVar.iteration}
                </span>
              )}
            </div>

            {activeStep && Object.keys(activeStep.variables).length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(activeStep.variables).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 font-mono text-xs"
                  >
                    <span className="text-[#8A8585] dark:text-[#9a8585]">{k}</span>
                    <span className="font-bold text-[#E10906] tabular-nums">
                      {formatPyLiteral(v as never)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                Step forward to watch variables initialize and change.
              </p>
            )}

            {activeStep?.conditionExpr !== undefined &&
              activeStep.conditionResult !== undefined && (
                <div
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs ${
                    activeStep.conditionResult
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-amber-200 bg-amber-50 text-amber-900'
                  }`}
                >
                  <code className="font-mono font-semibold">{activeStep.conditionExpr}</code>
                  <span className="inline-flex items-center gap-1 font-mono font-bold">
                    {activeStep.conditionResult ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        True
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-amber-600" />
                        False
                      </>
                    )}
                  </span>
                </div>
              )}

            <div className="rounded-xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1] dark:bg-[#2a0808] p-3 text-xs text-[#100303] dark:text-[#f0eaea]">
              <strong className="text-[#E10906]">Execution Note: </strong>
              {activeStep
                ? activeStep.explanation
                : 'Ready to begin line-by-line tracing.'}
            </div>
          </div>

          {/* Output Console */}
          <div className="overflow-hidden rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303]">
            <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2 text-xs text-[#CFC8C8]">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                Live Output
              </span>
              <span className="font-mono text-[11px] text-[#8A8585] dark:text-[#9a8585]">
                {activeStep?.outputLines.length ?? 0} lines
              </span>
            </div>
            <div className="min-h-[84px] p-3.5 font-mono text-xs text-emerald-300">
              {activeStep && activeStep.outputLines.length > 0 ? (
                activeStep.outputLines.map((ln, idx) => <div key={idx}>&gt; {ln}</div>)
              ) : (
                <span className="text-[#8A8585] dark:text-[#9a8585]">No print() output yet.</span>
              )}
            </div>
          </div>

          {/* Interactive Execution Timeline */}
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs">
            <p className="mb-2 font-display text-xs font-bold text-[#100303] dark:text-[#f0eaea]">
              Execution Trace Timeline (Click any step)
            </p>
            <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
              {steps.map((st, idx) => {
                const current = stepIndex === idx + 1;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setStepIndex(idx + 1);
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-1.5 text-left text-xs transition-colors ${
                      current
                        ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] font-semibold'
                        : 'border-[#F1EEEE] dark:border-[#2a1212] bg-[#FBF5F9] dark:bg-[#0f0303] hover:border-[#E10906]'
                    }`}
                  >
                    <span className="truncate font-mono text-[11px] text-[#100303] dark:text-[#f0eaea]">
                      #{idx + 1} · L{st.line} · {st.statusLabel}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-[#8A8585] dark:text-[#9a8585]">
                      {st.kind}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2.5 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E10906]" />
            <span>
              Educational tracer subset: supports assignments, arithmetic/Boolean expressions,
              if/elif/else, for/range(), while, break, continue, and print(). For full CPython,
              use Coding Studio.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
