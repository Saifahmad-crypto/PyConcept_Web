import React, { useEffect, useContext, createContext, useRef, useState, useMemo } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Terminal,
  Cpu,
  CheckCircle2,
  XCircle,
  BookOpen,
  Info,
  Sparkles,
  History,
  ChevronDown,
} from 'lucide-react';
import { SimulatorId, SimulatorMeta, TutorSimulatorContext } from '../../types';
import { PythonTraceStep, formatPyLiteral } from '../../utils/pythonEngine';
import {
  AnimationSpeedController,
  SimulatorSpeedContext,
  SimulatorSpeedProvider,
  scaleAnimationMs,
  speedMsToFps,
  speedMsToMultiplier,
  useSharedSimulatorSpeed,
  useSimulatorSpeed,
} from './AnimationSpeedController';

import { ExerciseSuggestionModal } from './ExerciseSuggestionModal';

export { SimulatorSpeedProvider, useSimulatorSpeed };

export const SimulatorTutorContext = createContext<
  ((ctx: TutorSimulatorContext) => void) | null
>(null);

export const SimulatorRunContext = createContext<
  ((id: SimulatorId) => void) | null
>(null);

export const SimulatorChallengeContext = createContext<{
  completedChallenges: string[];
  onOpenChallenge: (challengeId: string) => void;
} | null>(null);

export interface SimulatorShellProps {
  meta: SimulatorMeta;
  code: string;
  steps: PythonTraceStep[];
  stepIndex: number; // 0 = Ready before step 1; 1..steps.length = current step
  isPlaying: boolean;
  speedMs?: number;
  onPlay: () => void;
  onPause: () => void;
  onNextStep: () => void;
  onPrevStep?: () => void;
  onJumpToStep?: (step: number) => void;
  onReset: () => void;
  onChangeSpeed?: (ms: number) => void;
  onBackToHub: () => void;
  initialVariables: Record<string, string | number | boolean | (string | number)[]>;
  initialExplanation: string;
  children: React.ReactNode;
}

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
  const regex =
    /(#.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
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

export const SimulatorShell: React.FC<SimulatorShellProps> = ({
  meta,
  code,
  steps,
  stepIndex,
  isPlaying,
  speedMs: propSpeedMs,
  onPlay,
  onPause,
  onNextStep,
  onPrevStep,
  onJumpToStep,
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

  const sharedSpeed = useSharedSimulatorSpeed();
  const speedMs = propSpeedMs ?? sharedSpeed.speedMs;
  const pauseOnBranches = sharedSpeed.pauseOnBranches;

  const handleSpeedChange = useMemo(
    () => (nextMs: number) => {
      sharedSpeed.setSpeedMs(nextMs);
      if (onChangeSpeed) {
        onChangeSpeed(nextMs);
      }
    },
    [sharedSpeed, onChangeSpeed]
  );

  const [historyOpen, setHistoryOpen] = useState(true);
  const [frameProgress, setFrameProgress] = useState(0);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const recordedRunRef = useRef(false);
  const shownSuggestionForRunRef = useRef(false);
  const frameProgressRef = useRef(0);

  const onAskTutor = useContext(SimulatorTutorContext);
  const onRecordRun = useContext(SimulatorRunContext);
  const challengeCtx = useContext(SimulatorChallengeContext);

  const isDecisionStep =
    activeStep?.kind === 'if' ||
    activeStep?.kind === 'elif' ||
    activeStep?.kind === 'else' ||
    activeStep?.kind === 'for' ||
    activeStep?.kind === 'while' ||
    activeStep?.kind === 'break' ||
    activeStep?.kind === 'continue';

  const effectiveFrameMs =
    pauseOnBranches && isDecisionStep ? Math.round(speedMs * 1.45) : speedMs;
  const effectiveFps = speedMsToFps(effectiveFrameMs);

  const speedCtxValue = useMemo(
    () => ({
      speedMs: effectiveFrameMs,
      multiplier: speedMsToMultiplier(speedMs),
      fps: effectiveFps,
      pauseOnBranches,
      scaleMs: (baseMs: number) => scaleAnimationMs(baseMs, effectiveFrameMs),
      setSpeedMs: handleSpeedChange,
      setMultiplier: (nextMult: number) => {
        sharedSpeed.setMultiplier(nextMult);
        if (onChangeSpeed) {
          onChangeSpeed(Math.round(800 / nextMult));
        }
      },
      setFps: (nextFps: number) => {
        sharedSpeed.setFps(nextFps);
        if (onChangeSpeed && nextFps > 0) {
          onChangeSpeed(Math.round(1000 / nextFps));
        }
      },
      setPauseOnBranches: sharedSpeed.setPauseOnBranches,
    }),
    [effectiveFrameMs, effectiveFps, speedMs, pauseOnBranches, handleSpeedChange, sharedSpeed, onChangeSpeed]
  );

  useEffect(() => {
    if (stepIndex === 0) {
      recordedRunRef.current = false;
      shownSuggestionForRunRef.current = false;
      setSuggestionOpen(false);
    } else if (stepIndex >= 1 && !recordedRunRef.current && onRecordRun) {
      recordedRunRef.current = true;
      onRecordRun(meta.id);
    }
  }, [stepIndex, meta.id, onRecordRun]);

  // Open Exercise Suggestion modal cleanly once per simulation completion
  useEffect(() => {
    if (!isFinished) return;
    if (shownSuggestionForRunRef.current) return;
    if (!challengeCtx?.onOpenChallenge) return;

    shownSuggestionForRunRef.current = true;
    const timer = window.setTimeout(() => {
      setSuggestionOpen(true);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [isFinished, challengeCtx]);

  // Reset per-frame progress whenever the active step changes or playback stops
  useEffect(() => {
    frameProgressRef.current = 0;
    setFrameProgress(0);
  }, [stepIndex, isPlaying]);

  // Dynamic requestAnimationFrame clock that scales frame duration in real time even mid-frame
  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= totalSteps) {
      onPause();
      return;
    }

    let rafId = 0;
    let lastTs = performance.now();

    const tick = (now: number) => {
      const dt = Math.max(0, now - lastTs);
      lastTs = now;
      const nextProgress = frameProgressRef.current + dt / Math.max(80, effectiveFrameMs);

      if (nextProgress >= 1) {
        frameProgressRef.current = 0;
        setFrameProgress(0);
        onNextStep();
        return;
      }

      frameProgressRef.current = nextProgress;
      setFrameProgress(nextProgress);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [isPlaying, stepIndex, totalSteps, effectiveFrameMs, onNextStep, onPause]);

  // Keyboard step controls (Space = Play/Pause, ArrowRight = Next, ArrowLeft = Prev)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }
      if (e.key === 'ArrowRight' && stepIndex < totalSteps) {
        e.preventDefault();
        if (isPlaying) onPause();
        onNextStep();
      } else if (e.key === 'ArrowLeft' && onPrevStep && stepIndex > 0) {
        e.preventDefault();
        onPrevStep();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isPlaying) onPause();
        else onPlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, stepIndex, totalSteps, onPlay, onPause, onNextStep, onPrevStep]);

  const codeLines = code.split('\n');
  const currentVars = activeStep ? activeStep.variables : initialVariables;
  const prevStepVars =
    stepIndex > 1 && stepIndex <= totalSteps
      ? steps[stepIndex - 2].variables
      : initialVariables;
  const currentOutput = activeStep ? activeStep.outputLines : [];
  const progressPct = totalSteps > 0 ? Math.round((stepIndex / totalSteps) * 100) : 0;
  const executedHistory = steps.slice(0, stepIndex);

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
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#E5DFDF] dark:border-[#3a1a1a] pb-5 lg:flex-row lg:items-center">
        <div>
          <button
            type="button"
            onClick={onBackToHub}
            className="mb-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#E10906] transition-colors hover:text-[#E10906]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Simulators Hub
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
            <span className="font-mono font-semibold text-[#E10906]">
              Simulator {meta.number}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {meta.category === 'conditionals' ? 'Conditional Statements' : 'Loops'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{meta.difficulty}</span>
          </div>

          <h1 className="mt-1 font-display text-2xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-3xl">
            {meta.title}
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-[#8A8585] dark:text-[#9a8585]">
            {meta.realLifeScenario} Concepts:{' '}
            <span className="font-mono text-xs font-semibold text-[#E10906]">
              {meta.concepts.join(' · ')}
            </span>
          </p>
        </div>

        <div className="flex max-w-sm items-start gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-3.5 py-2.5 text-xs text-[#100303] dark:text-[#f0eaea]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#E10906]" aria-hidden="true" />
          <span>
            Purpose-built educational execution engine for synchronized step-by-step Python
            visualization.
          </span>
        </div>
      </div>

      {/* Main Split-Screen Environment */}
      <SimulatorSpeedContext.Provider value={speedCtxValue}>
        <div
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start"
          style={
            {
              '--sim-frame-ms': `${effectiveFrameMs}ms`,
              '--sim-speed-scale': String(effectiveFrameMs / 800),
            } as React.CSSProperties
          }
        >
          {/* LEFT SIDE — REAL-LIFE SIMULATION */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 sm:p-6 shadow-sm">
              {children}
            </div>
          </div>

          {/* RIGHT SIDE — PYTHON CODE & VARIABLE INSPECTOR */}
          <div className="lg:col-span-5 space-y-4">
            {/* Code Execution Viewer */}
            <div className="overflow-hidden rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] shadow-lg shadow-[#100303]/5">
              <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2.5 text-xs">
                <span className="font-mono font-medium text-[#CFC8C8]">
                  {meta.id.replace(/-/g, '_')}.py
                </span>
                <span className="font-mono text-[#E10906] tabular-nums">
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
                      style={{ transitionDuration: `${speedCtxValue.scaleMs(160)}ms` }}
                      className={`flex items-center px-3 transition-colors ${
                        isActive
                          ? 'bg-[#E10906]/15'
                          : 'hover:bg-[#190909]/40'
                      }`}
                    >
                    <span className="w-5 shrink-0 select-none text-center text-[10px] font-bold text-[#E10906]">
                      {isActive ? '▶' : ''}
                    </span>
                    <span
                      className={`w-7 shrink-0 select-none pr-2 text-right tabular-nums ${
                        isActive ? 'font-bold text-[#E10906]' : 'text-[#8A8585] dark:text-[#9a8585]'
                      }`}
                    >
                      {lineNum}
                    </span>
                    <pre className="whitespace-pre text-[#FBF5F9]">
                      {lineText.length > 0 ? highlightLine(lineText) : ' '}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Variables & Condition Evaluator Card */}
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1EEEE] dark:border-[#2a1212] pb-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
                <Cpu className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                Live Variables &amp; Memory
              </div>
              {activeStep?.loopVar && (
                <span className="font-mono text-xs font-semibold text-[#E10906] tabular-nums">
                  Loop Pass #{activeStep.loopVar.iteration}
                </span>
              )}
            </div>

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
                const prevFormatted =
                  prevStepVars && name in prevStepVars
                    ? formatPyLiteral(prevStepVars[name] as never)
                    : formatted;
                const changed = stepIndex > 0 && formatted !== prevFormatted;

                return (
                  <div
                    key={name}
                    style={{ transitionDuration: `${speedCtxValue.scaleMs(240)}ms` }}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs transition-colors ${
                      changed
                        ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808]'
                        : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303]'
                    }`}
                  >
                    <span className="font-mono font-medium text-[#8A8585] dark:text-[#9a8585] truncate">
                      {name}
                    </span>
                    <span
                      className={`font-mono font-bold tabular-nums truncate max-w-[130px] ${
                        changed ? 'text-[#E10906]' : 'text-[#100303] dark:text-[#f0eaea]'
                      }`}
                    >
                      {formatted}
                    </span>
                  </div>
                );
              })}
            </div>

            {activeStep?.conditionExpr !== undefined &&
              activeStep.conditionResult !== undefined && (
                <div
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-xs ${
                    activeStep.conditionResult
                      ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                      : 'border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
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
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        True
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        False
                      </>
                    )}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
      </SimulatorSpeedContext.Provider>

      {/* BOTTOM SECTION — CONTROLS, EXPLANATION, CONSOLE & EXECUTION HISTORY */}
      <div className="mt-6 space-y-5">
        {/* Execution Controls Bar */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {!isPlaying ? (
                <button
                  type="button"
                  onClick={onPlay}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md whitespace-nowrap"
                >
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  {isFinished ? 'Replay' : stepIndex === 0 ? 'Play' : 'Resume'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPause}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] px-5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-colors hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808] whitespace-nowrap"
                >
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  Pause
                </button>
              )}

              {onPrevStep && (
                <button
                  type="button"
                  onClick={onPrevStep}
                  disabled={stepIndex <= 0}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-colors hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808] disabled:opacity-40 whitespace-nowrap"
                >
                  <SkipBack className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                  Prev
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (isPlaying) onPause();
                  onNextStep();
                }}
                disabled={isFinished}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-colors hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808] disabled:opacity-40 whitespace-nowrap"
              >
                <SkipForward className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                Next Step
              </button>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-medium text-[#8A8585] dark:text-[#9a8585] transition-colors hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303] hover:text-[#100303] dark:hover:text-[#f0eaea] whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </button>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-semibold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                  Step {stepIndex} / {totalSteps}
                </span>
                <div className="h-2 w-28 overflow-hidden rounded-full bg-[#F1EEEE] dark:bg-[#221010]">
                  <div
                    style={{
                      width: `${progressPct}%`,
                      transitionDuration: `${speedCtxValue.scaleMs(220)}ms`,
                    }}
                    className="h-full rounded-full bg-[#E10906] transition-all"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                <span>
                  {effectiveFps.toFixed(2)} FPS · {effectiveFrameMs}ms
                  {pauseOnBranches && isDecisionStep ? ' (branch focus)' : ''}
                </span>
                <div className="h-1 w-16 overflow-hidden rounded-full bg-[#F1EEEE] dark:bg-[#221010]">
                  <div
                    className="h-full rounded-full bg-[#E10906]"
                    style={{ width: `${Math.round(frameProgress * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <AnimationSpeedController
            speedMs={speedMs}
            onChangeSpeedMs={handleSpeedChange}
            totalSteps={totalSteps}
            currentStep={stepIndex}
            pauseOnBranches={pauseOnBranches}
            onTogglePauseOnBranches={sharedSpeed.togglePauseOnBranches}
          />
        </div>

        {/* Step-by-Step Explanation + Live Output Console */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 shadow-sm lg:col-span-6">
            <div className="flex items-center justify-between gap-2 border-b border-[#F1EEEE] dark:border-[#2a1212] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#E10906]">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Step-by-Step Explanation
              </div>
              <span className="font-mono text-[11px] font-medium text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                {activeStep ? `Line ${activeStep.line}` : 'Initial State'}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#100303] dark:text-[#f0eaea]">
              {activeStep ? activeStep.explanation : initialExplanation}
            </p>
            {isFinished && (
              <p className="mt-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Simulation finished cleanly. Adjust inputs or press Reset / Replay to experiment again.
              </p>
            )}
            {onAskTutor && (
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#F1EEEE] dark:border-[#2a1212] pt-3">
                <span className="text-[11px] text-[#8A8585] dark:text-[#9a8585]">
                  Want a deeper breakdown of this step?
                </span>
                <button
                  type="button"
                  onClick={handleAskTutorAboutStep}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-3 py-1.5 text-xs font-semibold text-[#E10906] transition-colors hover:border-[#E10906] hover:text-[#E10906] whitespace-nowrap"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />
                  Ask AI Tutor about this step
                </button>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] shadow-sm lg:col-span-6">
            <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2.5 text-xs">
              <span className="inline-flex items-center gap-2 font-semibold text-[#CFC8C8]">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                Live Output Console
              </span>
              <span className="font-mono text-[11px] text-[#8A8585] dark:text-[#9a8585] tabular-nums">
                {currentOutput.length} line{currentOutput.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="min-h-[104px] max-h-[180px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
              {currentOutput.length === 0 ? (
                <p className="text-[#8A8585] dark:text-[#9a8585]">
                  No console output yet. Step through print() statements to see live output.
                </p>
              ) : (
                <div className="space-y-1">
                  {currentOutput.map((line, i) => (
                    <div key={i} className="flex gap-2 text-emerald-300">
                      <span className="select-none text-[#8A8585] dark:text-[#9a8585]">&gt;</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Execution History Timeline */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] shadow-sm">
          <button
            type="button"
            onClick={() => setHistoryOpen((o) => !o)}
            aria-expanded={historyOpen}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left"
          >
            <span className="inline-flex items-center gap-2 font-display text-xs font-bold text-[#100303] dark:text-[#f0eaea]">
              <History className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
              Execution History ({executedHistory.length} / {totalSteps} steps logged)
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[#8A8585] dark:text-[#9a8585] transition-transform ${
                historyOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {historyOpen && (
            <div className="border-t border-[#F1EEEE] dark:border-[#2a1212] px-5 py-3">
              {executedHistory.length === 0 ? (
                <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                  Press Play or Next Step to record execution history here.
                </p>
              ) : (
                <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
                  {executedHistory.map((step, idx) => {
                    const isCurrent = idx === executedHistory.length - 1;
                    const rowContent = (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono text-[11px] font-bold text-[#E10906] tabular-nums">
                            #{idx + 1} · L{step.line}
                          </span>
                          <span className="truncate text-[#100303] dark:text-[#f0eaea]">{step.explanation}</span>
                        </div>
                        <span className="font-mono text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585] shrink-0">
                          {step.statusLabel}
                        </span>
                      </>
                    );

                    if (onJumpToStep) {
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onJumpToStep(idx + 1)}
                          className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors ${
                            isCurrent
                              ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808]'
                              : 'border-[#F1EEEE] dark:border-[#2a1212] bg-[#FBF5F9] dark:bg-[#0f0303] hover:border-[#E10906]'
                          }`}
                        >
                          {rowContent}
                        </button>
                      );
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs ${
                          isCurrent
                            ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808]'
                            : 'border-[#F1EEEE] dark:border-[#2a1212] bg-[#FBF5F9] dark:bg-[#0f0303]'
                        }`}
                      >
                        {rowContent}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {challengeCtx?.onOpenChallenge && (
        <ExerciseSuggestionModal
          isOpen={suggestionOpen}
          simulationTitle={meta.title}
          patternKey={meta.id}
          completedChallenges={challengeCtx.completedChallenges}
          onClose={() => setSuggestionOpen(false)}
          onReplay={() => {
            onReset();
            window.setTimeout(() => onPlay(), 40);
          }}
          onStartChallenge={challengeCtx.onOpenChallenge}
        />
      )}
    </div>
  );
};
