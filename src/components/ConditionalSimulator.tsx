import React, { useState, useEffect, useMemo } from 'react';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle2, XCircle, Terminal } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { FlowchartSVG, FlowchartType } from './FlowchartSVG';

type SimExampleId = 'if-basic' | 'if-else' | 'if-elif-else' | 'nested-if';

interface SimStep {
  line: number;
  flowNode: string;
  flowBranch: string;
  conditionText: string;
  conditionResult: boolean | null;
  note: string;
  outputLine?: string;
}

const EXAMPLES: Array<{
  id: SimExampleId;
  label: string;
  flowchart: FlowchartType;
  inputLabel: string;
  defaultVal: number;
  hasSecondary?: boolean;
}> = [
  { id: 'if-basic', label: 'Basic if (Age Eligibility)', flowchart: 'if', inputLabel: 'age', defaultVal: 20 },
  { id: 'if-else', label: 'if-else (Pass / Fail)', flowchart: 'if-else', inputLabel: 'marks', defaultVal: 35 },
  { id: 'if-elif-else', label: 'if-elif-else (Grade Ladder)', flowchart: 'if-elif-else', inputLabel: 'marks', defaultVal: 85 },
  { id: 'nested-if', label: 'Nested if (Entry Gate)', flowchart: 'nested-if', inputLabel: 'age', defaultVal: 21, hasSecondary: true },
];

export const ConditionalSimulator: React.FC = () => {
  const [exampleId, setExampleId] = useState<SimExampleId>('if-elif-else');
  const [inputValue, setInputValue] = useState<number>(85);
  const [hasId, setHasId] = useState<boolean>(true);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(950);

  const activeExample = EXAMPLES.find((e) => e.id === exampleId)!;

  const { code, steps } = useMemo(() => {
    const val = Number.isFinite(inputValue) ? inputValue : 0;

    if (exampleId === 'if-basic') {
      const codeStr = `age = ${val}\n\nif age >= 18:\n    print("Eligible")\nprint("Check complete")`;
      const s: SimStep[] = [
        {
          line: 1,
          flowNode: 'start',
          flowBranch: 'to-cond',
          conditionText: `age = ${val}`,
          conditionResult: null,
          note: `Assigned ${val} to variable age.`,
        },
        {
          line: 3,
          flowNode: 'cond1',
          flowBranch: val >= 18 ? 'true' : 'false',
          conditionText: `${val} >= 18`,
          conditionResult: val >= 18,
          note:
            val >= 18
              ? `${val} >= 18 is True. Entering the indented if block.`
              : `${val} >= 18 is False. Skipping the indented if block.`,
        },
      ];
      if (val >= 18) {
        s.push({
          line: 4,
          flowNode: 'action1',
          flowBranch: 'to-end',
          conditionText: 'print("Eligible")',
          conditionResult: true,
          note: 'Inside if block: prints "Eligible".',
          outputLine: 'Eligible',
        });
      }
      s.push({
        line: 5,
        flowNode: 'end',
        flowBranch: '',
        conditionText: 'print("Check complete")',
        conditionResult: null,
        note: 'Unindented line after if runs unconditionally.',
        outputLine: 'Check complete',
      });
      return { code: codeStr, steps: s };
    }

    if (exampleId === 'if-else') {
      const codeStr = `marks = ${val}\n\nif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")`;
      const passed = val >= 40;
      const s: SimStep[] = [
        {
          line: 1,
          flowNode: 'start',
          flowBranch: 'to-cond',
          conditionText: `marks = ${val}`,
          conditionResult: null,
          note: `Stored marks = ${val}.`,
        },
        {
          line: 3,
          flowNode: 'cond1',
          flowBranch: passed ? 'true' : 'false',
          conditionText: `${val} >= 40`,
          conditionResult: passed,
          note: passed
            ? `${val} >= 40 is True. Taking the True branch.`
            : `${val} >= 40 is False. Jumping to the else branch.`,
        },
      ];
      if (passed) {
        s.push({
          line: 4,
          flowNode: 'action1',
          flowBranch: 'end-true',
          conditionText: 'print("Pass")',
          conditionResult: true,
          note: 'Executed True branch: prints "Pass".',
          outputLine: 'Pass',
        });
      } else {
        s.push({
          line: 5,
          flowNode: 'cond1',
          flowBranch: 'false',
          conditionText: 'else:',
          conditionResult: false,
          note: 'Entering the else fallback branch.',
        });
        s.push({
          line: 6,
          flowNode: 'action2',
          flowBranch: 'end-false',
          conditionText: 'print("Fail")',
          conditionResult: false,
          note: 'Executed False branch: prints "Fail".',
          outputLine: 'Fail',
        });
      }
      s.push({
        line: 6,
        flowNode: 'end',
        flowBranch: '',
        conditionText: 'Program finished',
        conditionResult: null,
        note: 'Conditional execution completed.',
      });
      return { code: codeStr, steps: s };
    }

    if (exampleId === 'if-elif-else') {
      const codeStr = `marks = ${val}\n\nif marks >= 90:\n    print("Grade A")\nelif marks >= 75:\n    print("Grade B")\nelif marks >= 40:\n    print("Pass")\nelse:\n    print("Fail")`;
      const s: SimStep[] = [
        {
          line: 1,
          flowNode: 'start',
          flowBranch: 'to-cond1',
          conditionText: `marks = ${val}`,
          conditionResult: null,
          note: `Stored marks = ${val}. Checking ladder top to bottom.`,
        },
        {
          line: 3,
          flowNode: 'cond1',
          flowBranch: val >= 90 ? 'true1' : 'false1',
          conditionText: `${val} >= 90`,
          conditionResult: val >= 90,
          note:
            val >= 90
              ? `${val} >= 90 is True! Running first branch and skipping rest.`
              : `${val} >= 90 is False. Moving to first elif.`,
        },
      ];

      if (val >= 90) {
        s.push({
          line: 4,
          flowNode: 'action1',
          flowBranch: 'true1',
          conditionText: 'print("Grade A")',
          conditionResult: true,
          note: 'Printed "Grade A". Remaining elif/else branches are skipped.',
          outputLine: 'Grade A',
        });
      } else {
        s.push({
          line: 5,
          flowNode: 'cond2',
          flowBranch: val >= 75 ? 'true2' : 'false2',
          conditionText: `${val} >= 75`,
          conditionResult: val >= 75,
          note:
            val >= 75
              ? `${val} >= 75 is True! Running Grade B branch.`
              : `${val} >= 75 is False. Moving to next elif.`,
        });
        if (val >= 75) {
          s.push({
            line: 6,
            flowNode: 'action2',
            flowBranch: 'true2',
            conditionText: 'print("Grade B")',
            conditionResult: true,
            note: 'Printed "Grade B". Remaining branches skipped.',
            outputLine: 'Grade B',
          });
        } else {
          s.push({
            line: 7,
            flowNode: 'cond3',
            flowBranch: val >= 40 ? 'true3' : 'false3',
            conditionText: `${val} >= 40`,
            conditionResult: val >= 40,
            note:
              val >= 40
                ? `${val} >= 40 is True! Running Pass branch.`
                : `${val} >= 40 is False. Falling back to else.`,
          });
          if (val >= 40) {
            s.push({
              line: 8,
              flowNode: 'action3',
              flowBranch: 'true3',
              conditionText: 'print("Pass")',
              conditionResult: true,
              note: 'Printed "Pass".',
              outputLine: 'Pass',
            });
          } else {
            s.push({
              line: 9,
              flowNode: 'action4',
              flowBranch: 'false3',
              conditionText: 'else:',
              conditionResult: false,
              note: 'All conditions were False, entering else.',
            });
            s.push({
              line: 10,
              flowNode: 'action4',
              flowBranch: 'false3',
              conditionText: 'print("Fail")',
              conditionResult: false,
              note: 'Printed "Fail".',
              outputLine: 'Fail',
            });
          }
        }
      }
      s.push({
        line: 10,
        flowNode: 'end',
        flowBranch: '',
        conditionText: 'Program finished',
        conditionResult: null,
        note: 'Only the first matching branch ran.',
      });
      return { code: codeStr, steps: s };
    }

    const pyBool = hasId ? 'True' : 'False';
    const codeStr = `age = ${val}\nhas_id = ${pyBool}\n\nif age >= 18:\n    if has_id == True:\n        print("Allowed")\n    else:\n        print("Need ID")\nelse:\n    print("Too young")`;
    const s: SimStep[] = [
      {
        line: 1,
        flowNode: 'start',
        flowBranch: 'to-outer',
        conditionText: `age = ${val}, has_id = ${pyBool}`,
        conditionResult: null,
        note: `Initialized age = ${val} and has_id = ${pyBool}.`,
      },
      {
        line: 4,
        flowNode: 'cond1',
        flowBranch: val >= 18 ? 'outer-true' : 'outer-false',
        conditionText: `${val} >= 18`,
        conditionResult: val >= 18,
        note:
          val >= 18
            ? `${val} >= 18 is True. Entering outer if to check inner condition.`
            : `${val} >= 18 is False. Skipping inner if and jumping to outer else.`,
      },
    ];
    if (val >= 18) {
      s.push({
        line: 5,
        flowNode: 'cond2',
        flowBranch: hasId ? 'inner-true' : 'inner-false',
        conditionText: `${pyBool} == True`,
        conditionResult: hasId,
        note: hasId
          ? 'Inner condition is True. Printing "Allowed".'
          : 'Inner condition is False. Taking inner else.',
      });
      if (hasId) {
        s.push({
          line: 6,
          flowNode: 'action1',
          flowBranch: 'inner-true',
          conditionText: 'print("Allowed")',
          conditionResult: true,
          note: 'Output: Allowed',
          outputLine: 'Allowed',
        });
      } else {
        s.push({
          line: 8,
          flowNode: 'action2',
          flowBranch: 'inner-false',
          conditionText: 'print("Need ID")',
          conditionResult: false,
          note: 'Output: Need ID',
          outputLine: 'Need ID',
        });
      }
    } else {
      s.push({
        line: 10,
        flowNode: 'action3',
        flowBranch: 'outer-false',
        conditionText: 'print("Too young")',
        conditionResult: false,
        note: 'Output: Too young',
        outputLine: 'Too young',
      });
    }
    s.push({
      line: 10,
      flowNode: 'end',
      flowBranch: '',
      conditionText: 'Program finished',
      conditionResult: null,
      note: 'Nested conditional check finished.',
    });
    return { code: codeStr, steps: s };
  }, [exampleId, inputValue, hasId]);

  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const accumulatedOutput = steps
    .slice(0, stepIdx + 1)
    .map((s) => s.outputLine)
    .filter((line): line is string => Boolean(line));

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

  const handleSelectExample = (id: SimExampleId) => {
    const found = EXAMPLES.find((e) => e.id === id)!;
    setExampleId(id);
    setInputValue(found.defaultVal);
    setStepIdx(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleExecuteAll = () => {
    setIsPlaying(false);
    setStepIdx(steps.length - 1);
  };

  return (
    <div className="space-y-6">
      {/* Control Deck */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <label htmlFor="sim-example" className="block text-xs font-semibold text-slate-600">
              Select Conditional Example
            </label>
            <select
              id="sim-example"
              value={exampleId}
              onChange={(e) => handleSelectExample(e.target.value as SimExampleId)}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-[#F8FAFC] px-3 py-2 text-sm font-medium text-[#1E293B] focus:border-sky-500 focus:outline-none"
            >
              {EXAMPLES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-end gap-4 lg:col-span-4">
            <label className="text-xs font-semibold text-slate-600">
              Enter <code className="font-mono text-sky-700">{activeExample.inputLabel}</code>:
              <input
                type="number"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(Number(e.target.value));
                  setStepIdx(0);
                  setIsPlaying(false);
                }}
                className="mt-1.5 block w-28 rounded-xl border border-slate-300 bg-[#F8FAFC] px-3 py-2 font-mono text-sm font-semibold text-[#1E293B] focus:border-sky-500 focus:outline-none"
              />
            </label>

            {activeExample.hasSecondary && (
              <label className="flex min-h-[38px] items-center gap-2 rounded-xl border border-slate-300 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#1E293B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasId}
                  onChange={(e) => {
                    setHasId(e.target.checked);
                    setStepIdx(0);
                    setIsPlaying(false);
                  }}
                  className="accent-sky-600"
                />
                has_id = True
              </label>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label htmlFor="cond-speed" className="font-semibold">Animation Speed</label>
              <span className="font-mono font-medium text-slate-700 tabular-nums">{speedMs} ms / step</span>
            </div>
            <input
              id="cond-speed"
              type="range"
              min={300}
              max={1800}
              step={150}
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="mt-2 w-full accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Playback Toolbar */}
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => {
              if (stepIdx >= steps.length - 1) setStepIdx(0);
              setIsPlaying((p) => !p);
            }}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 whitespace-nowrap"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={stepIdx >= steps.length - 1}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1E293B] transition-colors hover:border-sky-300 hover:bg-[#F0F9FF] disabled:opacity-40 whitespace-nowrap"
          >
            <SkipForward className="h-4 w-4 text-sky-600" />
            Next Step
          </button>

          <button
            type="button"
            onClick={handleExecuteAll}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#1E293B] transition-colors hover:border-violet-300 hover:bg-violet-50/40 whitespace-nowrap"
          >
            <Terminal className="h-4 w-4 text-violet-600" />
            Execute Program
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:text-[#1E293B] whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <span className="ml-auto font-mono text-xs font-medium text-slate-500 tabular-nums">
            Step {stepIdx + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Three Coordinated Panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-display text-sm font-bold text-[#1E293B]">1. Python Code</h3>
          <CodeBlock code={code} activeLine={currentStep.line} title="simulator.py" showCopy={false} />
        </div>

        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-display text-sm font-bold text-[#1E293B]">2. Live Flowchart Path</h3>
          <FlowchartSVG
            type={activeExample.flowchart}
            activeNode={currentStep.flowNode}
            activeBranch={currentStep.flowBranch}
          />
        </div>

        <div className="space-y-3 lg:col-span-4">
          <h3 className="font-display text-sm font-bold text-[#1E293B]">3. Execution &amp; Output</h3>
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">Current Evaluation</p>
              <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-sky-100 bg-[#F0F9FF] px-3 py-2.5">
                <code className="font-mono text-xs font-semibold text-[#1E293B]">{currentStep.conditionText}</code>
                {currentStep.conditionResult !== null && (
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-xs font-bold ${
                      currentStep.conditionResult ? 'text-emerald-700' : 'text-violet-700'
                    }`}
                  >
                    {currentStep.conditionResult ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
                    )}
                    {currentStep.conditionResult ? 'True' : 'False'}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{currentStep.note}</p>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <p className="mb-2 text-xs font-semibold text-slate-500">Execution Timeline</p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {steps.slice(0, stepIdx + 1).map((st, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 font-mono text-[11px] ${
                      idx === stepIdx
                        ? 'bg-sky-50 text-sky-900 font-semibold border border-sky-200'
                        : 'text-slate-600'
                    }`}
                  >
                    <span className="truncate">
                      L{st.line}: {st.conditionText}
                    </span>
                    {st.conditionResult !== null && (
                      <span className={st.conditionResult ? 'text-emerald-700' : 'text-violet-700'}>
                        {st.conditionResult ? 'True' : 'False'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <p className="mb-1.5 text-xs font-semibold text-slate-500">Program Output</p>
              <div className="min-h-[68px] rounded-xl border border-slate-200 bg-[#0F172A] p-3 font-mono text-xs text-emerald-300">
                {accumulatedOutput.length > 0 ? (
                  accumulatedOutput.map((line, i) => <div key={i}>{line}</div>)
                ) : (
                  <span className="text-slate-400">(No output emitted yet)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
