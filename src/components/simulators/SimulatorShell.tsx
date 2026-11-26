import React, { useEffect, useContext, createContext } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Terminal,
  Cpu,
  CheckCircle2,
  XCircle,
  Gauge,
  BookOpen,
  Info,
  Sparkles,
} from 'lucide-react';
import { SimulatorMeta, TutorSimulatorContext } from '../../types';
import { PythonTraceStep, formatPyLiteral } from '../../utils/pythonEngine';

export const SimulatorTutorContext = createContext<
  ((ctx: TutorSimulatorContext) => void) | null
>(null);

export interface SimulatorShellProps {
  meta: SimulatorMeta;
  code: string;
  steps: PythonTraceStep[];
  stepIndex: number; // 0 = Ready before step 1; 1..steps.length = current step
  isPlaying: boolean;
  speedMs: number;
  onPlay: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onChangeSpeed: (ms: number) => void;
  onBackToHub: () => void;
  initialVariables: Record<string, string | number | boolean | (string | number)[]>;
  initialExplanation: string;
  children: React.ReactNode;
}

const SPEED_OPTIONS = [
  { label: '0.5x Slow', ms: 1350 },
  { label: '1x Normal', ms: 800 },
  { label: '2x Fast', ms: 400 },
  { label: '4x Turbo', ms: 180 },
];

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
]);

const PY_BUILTINS = new Set(['print', 'range', 'len', 'int', 'str', 'abs', 'min', 'max']);

function highlightLine(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const regex = /(#.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
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
        <span key={k++} className="text-slate-500 italic">
          {word}
        </span>
      );
    } else if (word.startsWith('"') || word.startsWith("'")) {
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
        <span key={k++} className="font-semibold text-violet-300">
          {word}
        </span>
      );
    } else if (PY_BUILTINS.has(word)) {
      tokens.push(
        <span key={k++} className="text-sky-300">
          {word}
        </span>
      );
    } else {
      tokens.push(
        <span key={k++} className="text-slate-100">
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

export const SimulatorShell: React.FC<SimulatorShellProps> = ({
  meta,
  code,
  steps,
  stepIndex,
  isPlaying,
  speedMs,
  onPlay,
  onPause,
  onNextStep,
  onReset,
  onChangeSpeed,
  onBackToHub,
  initialVariables,
  initialExplanation,
  children,
}) => {
  const totalSteps = steps.length;
  const activeStep: PythonTraceStep | null =
    stepIndex > 0 && stepIndex <= totalSteps ? steps[stepIndex - 1] : null;
  const isFinished = totalSteps > 0 && stepIndex >= totalSteps;

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= totalSteps) {
      onPause();
      return;
    }
    const timer = window.setTimeout(() => {
      onNextStep();
    }, speedMs);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, totalSteps, speedMs, onNextStep, onPause]);

  const onAskTutor = useContext(SimulatorTutorContext);
  const codeLines = code.split('\n');
  const currentVars = activeStep ? activeStep.variables : initialVariables;
  const currentOutput = activeStep ? activeStep.outputLines : [];
  const progressPct = totalSteps > 0 ? Math.round((stepIndex / totalSteps) * 100) : 0;

  const handleAskTutorAboutStep = () => {
    if (!onAskTutor) return;
    onAskTutor({
      simulatorId: meta.id,
      simulatorTitle: meta.title,
      category: meta.category,
      concepts: meta.concepts,
      code,
      currentLine: activeStep?.line,
      activeCodeLine: activeStep ? codeLines[activeStep.line - 1]?.trim() : undefined,
      variables: currentVars,
      conditionExpr: activeStep?.conditionExpr,
      conditionResult: activeStep?.conditionResult,
      outputLines: currentOutput,
      explanation: activeStep ? activeStep.explanation : initialExplanation,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Top Navigation & Simulator Identity Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-center">
        <div>
          <button
            type="button"
            onClick={onBackToHub}
            className="mb-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 transition-colors hover:text-violet-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Simulators Hub
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="font-mono font-semibold text-sky-700">
              Simulator {meta.number}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {meta.category === 'conditionals'
                ? 'Conditional Statements'
                : 'Loops'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{meta.difficulty}</span>
          </div>

          <h1 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B] sm:text-3xl">
            {meta.title}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            {meta.realLifeScenario} Concepts:{' '}
            <span className="font-mono text-xs font-semibold text-violet-700">
              {meta.concepts.join(' · ')}
            </span>
          </p>
        </div>

        <div className="flex max-w-sm items-start gap-2 rounded-xl border border-sky-200/80 bg-[#F0F9FF] px-3.5 py-2.5 text-xs text-slate-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
          <span>
            Synchronized educational Python execution engine — every visual change is driven directly by the highlighted line.
          </span>
        </div>
      </div>

      {/* Main Split-Screen Environment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* LEFT SIDE — REAL-LIFE SIMULATION */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            {children}
          </div>
        </div>

        {/* RIGHT SIDE — PYTHON CODE & VARIABLE INSPECTOR */}
        <div className="lg:col-span-5 space-y-4">
          {/* Code Execution Viewer */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-[#0F172A] shadow-lg shadow-slate-900/5">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#1E293B] px-4 py-2.5 text-xs">
              <span className="font-mono font-medium text-slate-200">
                {meta.id.replace(/-/g, '_')}.py
              </span>
              <span className="font-mono text-sky-300 tabular-nums">
                {activeStep
                  ? `Line ${activeStep.line} · ${activeStep.statusLabel}`
                  : isFinished
                  ? 'Execution Complete'
                  : 'Ready to Run'}
              </span>
            </div>

            <div className="overflow-x-auto py-3 font-mono text-xs sm:text-[13px] leading-6">
              {codeLines.map((lineText, idx) => {
                const lineNum = idx + 1;
                const isActive = activeStep?.line === lineNum;
                return (
                  <div
                    key={lineNum}
                    className={`flex items-center px-3 transition-colors duration-150 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#38BDF8]/25 via-[#6366F1]/20 to-[#8B5CF6]/20'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="w-5 shrink-0 select-none text-center text-[10px] font-bold text-sky-400">
                      {isActive ? '▶' : ''}
                    </span>
                    <span
                      className={`w-7 shrink-0 select-none pr-2 text-right tabular-nums ${
                        isActive ? 'font-bold text-sky-300' : 'text-slate-500'
                      }`}
                    >
                      {lineNum}
                    </span>
                    <pre className="whitespace-pre text-slate-100">
                      {lineText.length > 0 ? highlightLine(lineText) : ' '}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Variables & Condition Evaluator Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
                <Cpu className="h-4 w-4 text-violet-600" aria-hidden="true" />
                Live Variables &amp; State
              </div>
              {activeStep?.loopVar && (
                <span className="font-mono text-xs font-semibold text-sky-700 tabular-nums">
                  Loop Pass #{activeStep.loopVar.iteration}
                </span>
              )}
            </div>

            {/* Variable Grid */}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(currentVars).map(([name, val]) => {
                const formatted =
                  typeof val === 'string' ||
                  typeof val === 'number' ||
                  typeof val === 'boolean' ||
                  Array.isArray(val) ||
                  val === null
                    ? formatPyLiteral(val as never)
                    : String(val);
                return (
                  <div
                    key={name}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-200/80 bg-[#F8FAFC] px-3 py-2 text-xs"
                  >
                    <span className="font-mono font-medium text-slate-600 truncate">
                      {name}
                    </span>
                    <span className="font-mono font-bold text-[#1E293B] tabular-nums truncate max-w-[130px]">
                      {formatted}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Condition Result Box */}
            {activeStep?.conditionExpr !== undefined &&
              activeStep.conditionResult !== undefined && (
                <div
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs ${
                    activeStep.conditionResult
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-amber-200 bg-amber-50 text-amber-900'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium opacity-80">
                      Evaluated Expression
                    </span>
                    <code className="font-mono font-semibold break-all">
                      {activeStep.conditionExpr}
                    </code>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 font-mono font-bold">
                    {activeStep.conditionResult ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                        True
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                        False
                      </>
                    )}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION — CONTROLS, EXPLANATION & CONSOLE */}
      <div className="mt-6 space-y-5">
        {/* Execution Controls Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Play / Pause / Step / Reset */}
            <div className="flex flex-wrap items-center gap-2.5">
              {!isPlaying ? (
                <button
                  type="button"
                  onClick={onPlay}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  {isFinished ? 'Replay' : stepIndex === 0 ? 'Play' : 'Resume'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPause}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-5 py-2 text-xs font-semibold text-violet-800 transition-colors hover:bg-violet-100 whitespace-nowrap"
                >
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  Pause
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (isPlaying) onPause();
                  onNextStep();
                }}
                disabled={isFinished}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#1E293B] transition-colors hover:border-sky-300 hover:bg-[#F0F9FF] disabled:opacity-40 whitespace-nowrap"
              >
                <SkipForward className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
                Next Step
              </button>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#1E293B] whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </button>
            </div>

            {/* Speed Control & Step Progress */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <span className="text-xs font-medium text-slate-500">Speed:</span>
                <div className="inline-flex rounded-xl border border-slate-200 bg-[#F8FAFC] p-0.5">
                  {SPEED_OPTIONS.map((opt) => (
                    <button
                      key={opt.ms}
                      type="button"
                      onClick={() => onChangeSpeed(opt.ms)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all whitespace-nowrap ${
                        speedMs === opt.ms
                          ? 'bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#1E293B]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold text-[#1E293B] tabular-nums">
                  Step {stepIndex} / {totalSteps}
                </span>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] transition-all duration-200"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Explanation + Live Output Console */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-6">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Step-by-Step Explanation
              </div>
              <span className="font-mono text-[11px] font-medium text-slate-500 tabular-nums">
                {activeStep ? `Line ${activeStep.line}` : 'Initial State'}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#1E293B]">
              {activeStep ? activeStep.explanation : initialExplanation}
            </p>
            {isFinished && (
              <p className="mt-2 text-xs font-semibold text-emerald-700">
                Simulation finished cleanly. Adjust inputs or press Reset / Replay to experiment again.
              </p>
            )}
            {onAskTutor && (
              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  Want a deeper breakdown of this step?
                </span>
                <button
                  type="button"
                  onClick={handleAskTutorAboutStep}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-gradient-to-r from-[#F0F9FF] to-violet-50 px-3 py-1.5 text-xs font-semibold text-sky-800 transition-colors hover:border-violet-300 hover:text-violet-800 whitespace-nowrap"
                >
                  <Sparkles className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
                  Ask AI Tutor about this step
                </button>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-[#0F172A] shadow-sm lg:col-span-6">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#1E293B] px-4 py-2.5 text-xs">
              <span className="inline-flex items-center gap-2 font-semibold text-slate-200">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                Live Output Console
              </span>
              <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                {currentOutput.length} line{currentOutput.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="min-h-[104px] max-h-[180px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
              {currentOutput.length === 0 ? (
                <p className="text-slate-500">
                  No console output yet. Step through print() statements to see live output.
                </p>
              ) : (
                <div className="space-y-1">
                  {currentOutput.map((line, i) => (
                    <div key={i} className="flex gap-2 text-emerald-300">
                      <span className="select-none text-slate-600">&gt;</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
