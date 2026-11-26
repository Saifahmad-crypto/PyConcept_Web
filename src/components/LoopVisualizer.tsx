import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { FlowchartSVG } from './FlowchartSVG';
import {
  AnimationSpeedController,
  BASE_STEP_MS,
  scaleAnimationMs,
} from './simulators/AnimationSpeedController';
import { ExerciseSuggestionModal } from './simulators/ExerciseSuggestionModal';

type LoopMode = 'for' | 'while';

interface LoopStep {
  iteration: number;
  line: number;
  variableVal: number;
  conditionText: string;
  conditionResult: boolean;
  outputEmitted?: string;
  flowNode: string;
  flowBranch: string;
  note: string;
}

interface LoopVisualizerProps {
  completedChallenges?: string[];
  onOpenChallenge?: (challengeId: string) => void;
}

export const LoopVisualizer: React.FC<LoopVisualizerProps> = ({
  completedChallenges = [],
  onOpenChallenge,
}) => {
  const [loopType, setLoopType] = useState<LoopMode>('for');
  const [startVal, setStartVal] = useState<number>(1);
  const [stopVal, setStopVal] = useState<number>(6);
  const [stepVal, setStepVal] = useState<number>(1);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(BASE_STEP_MS);
  const [pauseOnBranches, setPauseOnBranches] = useState<boolean>(true);
  const [suggestionOpen, setSuggestionOpen] = useState<boolean>(false);
  const shownSuggestionRef = useRef<boolean>(false);

  const { code, steps, sequenceValues, warning } = useMemo(() => {
    const safeStep = stepVal === 0 ? 1 : stepVal;
    const isZeroWarning = stepVal === 0;
    const MAX_ITERS = 20;

    if (loopType === 'for') {
      const codeStr = `for i in range(${startVal}, ${stopVal}, ${safeStep}):\n    print(i)`;
      const seq: number[] = [];
      if (safeStep > 0) {
        for (let v = startVal; v < stopVal && seq.length < MAX_ITERS; v += safeStep) seq.push(v);
      } else {
        for (let v = startVal; v > stopVal && seq.length < MAX_ITERS; v += safeStep) seq.push(v);
      }

      const trace: LoopStep[] = [];
      if (seq.length === 0) {
        trace.push({
          iteration: 0,
          line: 1,
          variableVal: startVal,
          conditionText: `range(${startVal}, ${stopVal}, ${safeStep}) empty`,
          conditionResult: false,
          flowNode: 'end',
          flowBranch: 'loop-exit',
          note: 'Sequence is empty, so the loop body executes 0 times.',
        });
      } else {
        seq.forEach((val, idx) => {
          trace.push({
            iteration: idx + 1,
            line: 1,
            variableVal: val,
            conditionText: `Next item in range -> i = ${val}`,
            conditionResult: true,
            flowNode: 'check',
            flowBranch: 'loop-true',
            note: `Iteration ${idx + 1}: Python assigns ${val} to i.`,
          });
          trace.push({
            iteration: idx + 1,
            line: 2,
            variableVal: val,
            conditionText: `print(${val})`,
            conditionResult: true,
            outputEmitted: String(val),
            flowNode: 'body',
            flowBranch: 'loop-back',
            note: `Loop body prints ${val}.`,
          });
        });
        trace.push({
          iteration: seq.length,
          line: 1,
          variableVal: seq[seq.length - 1],
          conditionText: 'No more items in range()',
          conditionResult: false,
          flowNode: 'end',
          flowBranch: 'loop-exit',
          note: `Sequence exhausted after ${seq.length} iteration(s). Loop exits.`,
        });
      }

      return {
        code: codeStr,
        steps: trace,
        sequenceValues: seq,
        warning: isZeroWarning
          ? 'Step cannot be 0 in Python (using 1 safely).'
          : seq.length >= MAX_ITERS
          ? 'Preview capped at 20 iterations for clear visual display.'
          : '',
      };
    }

    const op = safeStep >= 0 ? '<' : '>';
    const updateCode = safeStep >= 0 ? `count += ${safeStep}` : `count -= ${Math.abs(safeStep)}`;
    const codeStr = `count = ${startVal}\nwhile count ${op} ${stopVal}:\n    print(count)\n    ${updateCode}`;

    const trace: LoopStep[] = [];
    const seq: number[] = [];
    let current = startVal;
    let iter = 0;

    const condOk = (v: number) => (safeStep > 0 ? v < stopVal : v > stopVal);

    while (condOk(current) && iter < MAX_ITERS) {
      iter++;
      seq.push(current);
      trace.push({
        iteration: iter,
        line: 2,
        variableVal: current,
        conditionText: `${current} ${op} ${stopVal}`,
        conditionResult: true,
        flowNode: 'check',
        flowBranch: 'loop-true',
        note: `Condition ${current} ${op} ${stopVal} is True. Entering loop body.`,
      });
      trace.push({
        iteration: iter,
        line: 3,
        variableVal: current,
        conditionText: `print(${current})`,
        conditionResult: true,
        outputEmitted: String(current),
        flowNode: 'body',
        flowBranch: 'loop-true',
        note: `Printed ${current} to output.`,
      });
      const nextVal = current + safeStep;
      trace.push({
        iteration: iter,
        line: 4,
        variableVal: nextVal,
        conditionText: `count becomes ${nextVal}`,
        conditionResult: true,
        flowNode: 'body',
        flowBranch: 'loop-back',
        note: `Updated variable: count changed from ${current} to ${nextVal}.`,
      });
      current = nextVal;
    }

    trace.push({
      iteration: iter,
      line: 2,
      variableVal: current,
      conditionText: `${current} ${op} ${stopVal}`,
      conditionResult: false,
      flowNode: 'end',
      flowBranch: 'loop-exit',
      note: `${current} ${op} ${stopVal} is False! While loop terminates safely.`,
    });

    return {
      code: codeStr,
      steps: trace,
      sequenceValues: seq,
      warning: isZeroWarning
        ? 'Step 0 would cause an infinite while loop (using 1 safely).'
        : iter >= MAX_ITERS
        ? 'Preview capped at 20 iterations for clear visual display.'
        : '',
    };
  }, [loopType, startVal, stopVal, stepVal]);

  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];

  const accumulatedOutputs = steps
    .slice(0, stepIdx + 1)
    .map((s) => s.outputEmitted)
    .filter((v): v is string => Boolean(v));

  const historyRows = steps
    .slice(0, stepIdx + 1)
    .filter((s) => s.outputEmitted !== undefined);

  useEffect(() => {
    if (stepIdx === 0) {
      shownSuggestionRef.current = false;
      setSuggestionOpen(false);
    } else if (stepIdx >= steps.length - 1 && !shownSuggestionRef.current && onOpenChallenge) {
      shownSuggestionRef.current = true;
      const timer = window.setTimeout(() => {
        setSuggestionOpen(true);
      }, 350);
      return () => window.clearTimeout(timer);
    }
  }, [stepIdx, steps.length, onOpenChallenge]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const isConditionStep = currentStep?.flowNode === 'check' || currentStep?.flowNode === 'end';
    const delay = pauseOnBranches && isConditionStep ? Math.round(speedMs * 1.45) : speedMs;
    const timer = setTimeout(() => {
      setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length, speedMs, pauseOnBranches, currentStep?.flowNode]);

  const resetSim = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const allChartVals = sequenceValues.length > 0 ? sequenceValues : [0];
  const maxAbs = Math.max(1, ...allChartVals.map((v) => Math.abs(v)));

  return (
    <div className="space-y-6">
      {/* Control Deck */}
      <div className="rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-3">
            <span className="block text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">Loop Type</span>
            <div className="mt-1.5 inline-flex w-full rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1">
              <button
                type="button"
                onClick={() => {
                  setLoopType('for');
                  resetSim();
                }}
                className={`flex-1 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                  loopType === 'for'
                    ? 'bg-[#E10906] text-white shadow-sm'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                for loop
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoopType('while');
                  resetSim();
                }}
                className={`flex-1 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                  loopType === 'while'
                    ? 'bg-[#E10906] text-white shadow-sm'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                while loop
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:col-span-9">
            <label className="text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
              Start
              <input
                type="number"
                value={startVal}
                onChange={(e) => {
                  setStartVal(Number(e.target.value));
                  resetSim();
                }}
                className="mt-1.5 w-full rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 font-mono text-sm font-semibold text-[#100303] dark:text-[#f0eaea]"
              />
            </label>
            <label className="text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
              Stop (excl.)
              <input
                type="number"
                value={stopVal}
                onChange={(e) => {
                  setStopVal(Number(e.target.value));
                  resetSim();
                }}
                className="mt-1.5 w-full rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 font-mono text-sm font-semibold text-[#100303] dark:text-[#f0eaea]"
              />
            </label>
            <label className="text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
              Step
              <input
                type="number"
                value={stepVal}
                onChange={(e) => {
                  setStepVal(Number(e.target.value));
                  resetSim();
                }}
                className="mt-1.5 w-full rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-3 py-2 font-mono text-sm font-semibold text-[#100303] dark:text-[#f0eaea]"
              />
            </label>
          </div>
        </div>

        <div className="mt-4">
          <AnimationSpeedController
            speedMs={speedMs}
            onChangeSpeedMs={setSpeedMs}
            totalSteps={Math.max(0, steps.length - 1)}
            currentStep={stepIdx}
            pauseOnBranches={pauseOnBranches}
            onTogglePauseOnBranches={() => setPauseOnBranches((v) => !v)}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#E5DFDF] dark:border-[#3a1a1a] pt-4">
          <button
            type="button"
            onClick={() => {
              if (stepIdx >= steps.length - 1) setStepIdx(0);
              setIsPlaying((p) => !p);
            }}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#E10906] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 whitespace-nowrap"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx((prev) => Math.max(0, prev - 1));
            }}
            disabled={stepIdx <= 0}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-colors hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808]/40 dark:bg-[#2a0808]/40 disabled:opacity-40 whitespace-nowrap"
          >
            <SkipBack className="h-4 w-4 text-[#E10906]" />
            Prev
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
            }}
            disabled={stepIdx >= steps.length - 1}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] transition-colors hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808]/40 dark:bg-[#2a0808]/40 disabled:opacity-40 whitespace-nowrap"
          >
            <SkipForward className="h-4 w-4 text-[#E10906]" />
            Next Iteration
          </button>

          <button
            type="button"
            onClick={resetSim}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold text-[#8A8585] dark:text-[#9a8585] transition-colors hover:text-[#100303] dark:hover:text-[#f0eaea] whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            type="button"
            onClick={() => {
              setStartVal(10);
              setStopVal(0);
              setStepVal(-2);
              resetSim();
            }}
            className="ml-auto rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] whitespace-nowrap"
          >
            Load Countdown Preset (10 → 2)
          </button>
        </div>

        {warning && <p className="mt-3 text-xs font-medium text-amber-700 dark:text-amber-300">{warning}</p>}
      </div>

      {/* Live Metrics & Animated Sequence Strip */}
      <div className="rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5">
            <span className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">Iteration Counter</span>
            <p className="mt-1 font-mono text-xl font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
              {currentStep.iteration}{' '}
              <span className="text-xs font-normal text-[#8A8585] dark:text-[#9a8585]">/ {sequenceValues.length}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5">
            <span className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
              Loop Variable ({loopType === 'for' ? 'i' : 'count'})
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-[#E10906] tabular-nums">
              {currentStep.variableVal}
            </p>
          </div>
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5">
            <span className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">Condition Status</span>
            <div className="mt-1.5 flex items-center gap-1.5 font-mono text-sm font-bold">
              {currentStep.conditionResult ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-700 dark:text-emerald-300">True</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                  <span className="text-[#E10906]">False (Exit)</span>
                </>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5">
            <span className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">Accumulated Output</span>
            <p className="mt-1.5 truncate font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {accumulatedOutputs.length > 0 ? accumulatedOutputs.join(', ') : '(none)'}
            </p>
          </div>
        </div>

        {/* Animated Number Sequence */}
        <div>
          <p className="mb-2 text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">Animated Number Sequence</p>
          {sequenceValues.length === 0 ? (
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">No values generated for this start/stop/step combination.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sequenceValues.map((val, idx) => {
                const iterNum = idx + 1;
                const isActive = currentStep.iteration === iterNum && currentStep.conditionResult;
                const isCompleted = iterNum <= accumulatedOutputs.length;
                return (
                    <div
                      key={`${val}-${idx}`}
                      style={{ transitionDuration: `${scaleAnimationMs(200, speedMs)}ms` }}
                      className={`flex h-11 min-w-[48px] flex-col items-center justify-center rounded-xl border px-2.5 font-mono transition-all ${
                        isActive
                          ? 'border-[#E10906] bg-[#E10906] text-white shadow-sm scale-105'
                          : isCompleted
                          ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                          : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#8A8585] dark:text-[#9a8585]'
                      }`}
                    >
                      <span className="text-sm font-bold tabular-nums">{val}</span>
                      <span className={`text-[9px] ${isActive ? 'text-white/90' : 'text-[#8A8585] dark:text-[#9a8585]'}`}>
                        #{iterNum}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        {/* Graphical Visualization: Loop Iteration Bars & Counter Progression Chart */}
        {sequenceValues.length > 0 && (
          <div className="rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1]/60 dark:bg-[#2a0808]/60 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-[#100303] dark:text-[#f0eaea]">
                Counter Progression &amp; Iteration Bars
              </p>
              <span className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                Bar height represents absolute variable magnitude per iteration
              </span>
            </div>
            <div className="flex h-36 items-end gap-2 overflow-x-auto pb-2 pt-4">
              {sequenceValues.map((val, idx) => {
                const iterNum = idx + 1;
                const heightPct = Math.max(14, Math.round((Math.abs(val) / maxAbs) * 100));
                const isCurrent = currentStep.iteration === iterNum && currentStep.conditionResult;
                const isDone = iterNum <= accumulatedOutputs.length;
                return (
                  <div key={idx} className="flex min-w-[34px] flex-1 flex-col items-center justify-end h-full">
                    <span className="mb-1 font-mono text-[10px] font-semibold text-[#100303] dark:text-[#f0eaea] tabular-nums">{val}</span>
                    <div
                      className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                        isCurrent
                          ? 'bg-gradient-to-t from-[#E10906] to-[#8B5CF6]'
                          : isDone
                          ? 'bg-sky-400'
                          : 'bg-[#E5DFDF] dark:bg-[#3a1a1a]'
                      }`}
                      style={{
                        height: `${heightPct}%`,
                        transitionDuration: `${scaleAnimationMs(220, speedMs)}ms`,
                      }}
                    />
                    <span className="mt-1 font-mono text-[10px] text-[#8A8585] dark:text-[#9a8585] tabular-nums">i{iterNum}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Code + Flowchart + Execution History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">Python Code</h3>
          <CodeBlock code={code} activeLine={currentStep.line} title="loop_sim.py" showCopy={false} />
          <div className="rounded-2xl border border-[#F1EEEE] dark:border-[#2a1212] bg-[#FFF1F1] dark:bg-[#2a0808] p-3.5 text-xs text-[#100303] dark:text-[#f0eaea]">
            <strong className="text-[#100303] dark:text-[#f0eaea]">Current Step Note:</strong> {currentStep.note}
          </div>
        </div>

        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">Loop Flowchart</h3>
          <FlowchartSVG
            type={loopType}
            activeNode={currentStep.flowNode}
            activeBranch={currentStep.flowBranch}
            labels={{
              cond1: loopType === 'for' ? `range(${startVal},${stopVal},${stepVal || 1})` : `count = ${startVal}`,
              cond2: loopType === 'for' ? 'More items?' : `count ${stepVal >= 0 ? '<' : '>'} ${stopVal}`,
            }}
          />
        </div>

        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">Execution History</h3>
          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-sm">
            {historyRows.length === 0 ? (
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">Press Play or Next Iteration to trace each loop pass.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] text-[#8A8585] dark:text-[#9a8585]">
                      <th className="py-1.5 pr-3">Iter</th>
                      <th className="py-1.5 pr-3">Var</th>
                      <th className="py-1.5">Output</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1EEEE] dark:divide-[#2a1212]">
                    {historyRows.map((row, i) => (
                      <tr key={i} className="text-[#100303] dark:text-[#f0eaea]">
                        <td className="py-1.5 pr-3 text-[#8A8585] dark:text-[#9a8585] tabular-nums">#{row.iteration}</td>
                        <td className="py-1.5 pr-3 font-semibold text-[#E10906] tabular-nums">{row.variableVal}</td>
                        <td className="py-1.5 font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">{row.outputEmitted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {onOpenChallenge && (
        <ExerciseSuggestionModal
          isOpen={suggestionOpen}
          simulationTitle={loopType === 'for' ? 'for Loop Visualizer' : 'while Loop Visualizer'}
          patternKey={loopType}
          completedChallenges={completedChallenges}
          onClose={() => setSuggestionOpen(false)}
          onReplay={() => {
            setStepIdx(0);
            setIsPlaying(true);
          }}
          onStartChallenge={onOpenChallenge}
        />
      )}
    </div>
  );
};
