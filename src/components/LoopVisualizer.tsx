import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { FlowchartSVG } from './FlowchartSVG';

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

export const LoopVisualizer: React.FC = () => {
  const [loopType, setLoopType] = useState<LoopMode>('for');
  const [startVal, setStartVal] = useState<number>(1);
  const [stopVal, setStopVal] = useState<number>(6);
  const [stepVal, setStepVal] = useState<number>(1);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(850);

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
    if (!isPlaying) return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
    }, speedMs);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length, speedMs]);

  const resetSim = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const allChartVals = sequenceValues.length > 0 ? sequenceValues : [0];
  const maxAbs = Math.max(1, ...allChartVals.map((v) => Math.abs(v)));

  return (
    <div className="space-y-6">
      {/* Control Deck */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
          <div className="md:col-span-3">
            <span className="block text-xs font-semibold text-slate-600">Loop Type</span>
            <div className="mt-1.5 inline-flex w-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-1">
              <button
                type="button"
                onClick={() => {
                  setLoopType('for');
                  resetSim();
                }}
                className={`flex-1 rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                  loopType === 'for'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#1E293B]'
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
                    ? 'bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#1E293B]'
                }`}
              >
                while loop
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:col-span-5">
            <label className="text-xs font-semibold text-slate-600">
              Start
              <input
                type="number"
                value={startVal}
                onChange={(e) => {
                  setStartVal(Number(e.target.value));
                  resetSim();
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-3 py-2 font-mono text-sm font-semibold text-[#1E293B]"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Stop (excl.)
              <input
                type="number"
                value={stopVal}
                onChange={(e) => {
                  setStopVal(Number(e.target.value));
                  resetSim();
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-3 py-2 font-mono text-sm font-semibold text-[#1E293B]"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              Step
              <input
                type="number"
                value={stepVal}
                onChange={(e) => {
                  setStepVal(Number(e.target.value));
                  resetSim();
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-3 py-2 font-mono text-sm font-semibold text-[#1E293B]"
              />
            </label>
          </div>

          <div className="md:col-span-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label htmlFor="loop-speed" className="font-semibold">Animation Speed</label>
              <span className="font-mono font-medium text-slate-700 tabular-nums">{speedMs} ms</span>
            </div>
            <input
              id="loop-speed"
              type="range"
              min={250}
              max={1600}
              step={150}
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="mt-2 w-full accent-violet-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => {
              if (stepIdx >= steps.length - 1) setStepIdx(0);
              setIsPlaying((p) => !p);
            }}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 whitespace-nowrap"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
            }}
            disabled={stepIdx >= steps.length - 1}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1E293B] transition-colors hover:border-violet-300 hover:bg-violet-50/40 disabled:opacity-40 whitespace-nowrap"
          >
            <SkipForward className="h-4 w-4 text-violet-600" />
            Next Iteration
          </button>

          <button
            type="button"
            onClick={resetSim}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:text-[#1E293B] whitespace-nowrap"
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
            className="ml-auto rounded-xl border border-sky-200 bg-[#F0F9FF] px-3.5 py-2 text-xs font-semibold text-sky-800 hover:border-sky-300 whitespace-nowrap"
          >
            Load Countdown Preset (10 → 2)
          </button>
        </div>

        {warning && <p className="mt-3 text-xs font-medium text-amber-700">{warning}</p>}
      </div>

      {/* Live Metrics & Animated Sequence Strip */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3.5">
            <span className="text-xs font-medium text-slate-500">Iteration Counter</span>
            <p className="mt-1 font-mono text-xl font-bold text-[#1E293B] tabular-nums">
              {currentStep.iteration}{' '}
              <span className="text-xs font-normal text-slate-500">/ {sequenceValues.length}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3.5">
            <span className="text-xs font-medium text-slate-500">
              Loop Variable ({loopType === 'for' ? 'i' : 'count'})
            </span>
            <p className="mt-1 font-mono text-xl font-bold text-violet-700 tabular-nums">
              {currentStep.variableVal}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3.5">
            <span className="text-xs font-medium text-slate-500">Condition Status</span>
            <div className="mt-1.5 flex items-center gap-1.5 font-mono text-sm font-bold">
              {currentStep.conditionResult ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span className="text-emerald-700">True</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-violet-600" aria-hidden="true" />
                  <span className="text-violet-700">False (Exit)</span>
                </>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-3.5">
            <span className="text-xs font-medium text-slate-500">Accumulated Output</span>
            <p className="mt-1.5 truncate font-mono text-sm font-bold text-emerald-700">
              {accumulatedOutputs.length > 0 ? accumulatedOutputs.join(', ') : '(none)'}
            </p>
          </div>
        </div>

        {/* Animated Number Sequence */}
        <div>
          <p className="mb-2 text-xs font-semibold text-slate-600">Animated Number Sequence</p>
          {sequenceValues.length === 0 ? (
            <p className="text-xs text-slate-500">No values generated for this start/stop/step combination.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sequenceValues.map((val, idx) => {
                const iterNum = idx + 1;
                const isActive = currentStep.iteration === iterNum && currentStep.conditionResult;
                const isCompleted = iterNum <= accumulatedOutputs.length;
                return (
                  <div
                    key={`${val}-${idx}`}
                    className={`flex h-11 min-w-[48px] flex-col items-center justify-center rounded-xl border px-2.5 font-mono transition-all duration-200 ${
                      isActive
                        ? 'border-violet-400 bg-gradient-to-br from-[#38BDF8] to-[#8B5CF6] text-white shadow-sm scale-105'
                        : isCompleted
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-400'
                    }`}
                  >
                    <span className="text-sm font-bold tabular-nums">{val}</span>
                    <span className={`text-[9px] ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
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
          <div className="rounded-2xl border border-sky-100 bg-[#F0F9FF]/60 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-[#1E293B]">
                Counter Progression &amp; Iteration Bars
              </p>
              <span className="text-xs text-slate-600">
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
                    <span className="mb-1 font-mono text-[10px] font-semibold text-slate-700 tabular-nums">{val}</span>
                    <div
                      className={`w-full max-w-[36px] rounded-t-lg transition-all duration-200 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-[#0EA5E9] to-[#8B5CF6]'
                          : isDone
                          ? 'bg-sky-400'
                          : 'bg-slate-200'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="mt-1 font-mono text-[10px] text-slate-500 tabular-nums">i{iterNum}</span>
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
          <h3 className="font-display text-sm font-bold text-[#1E293B]">Python Code</h3>
          <CodeBlock code={code} activeLine={currentStep.line} title="loop_sim.py" showCopy={false} />
          <div className="rounded-2xl border border-sky-100 bg-[#F0F9FF] p-3.5 text-xs text-slate-700">
            <strong className="text-[#1E293B]">Current Step Note:</strong> {currentStep.note}
          </div>
        </div>

        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-display text-sm font-bold text-[#1E293B]">Loop Flowchart</h3>
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
          <h3 className="font-display text-sm font-bold text-[#1E293B]">Execution History</h3>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            {historyRows.length === 0 ? (
              <p className="text-xs text-slate-500">Press Play or Next Iteration to trace each loop pass.</p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-1.5 pr-3">Iter</th>
                      <th className="py-1.5 pr-3">Var</th>
                      <th className="py-1.5">Output</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyRows.map((row, i) => (
                      <tr key={i} className="text-[#1E293B]">
                        <td className="py-1.5 pr-3 text-slate-500 tabular-nums">#{row.iteration}</td>
                        <td className="py-1.5 pr-3 font-semibold text-violet-700 tabular-nums">{row.variableVal}</td>
                        <td className="py-1.5 font-bold text-emerald-700 tabular-nums">{row.outputEmitted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
