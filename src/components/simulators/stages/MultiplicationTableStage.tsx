import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, ArrowRight, CheckCircle2, Sparkles, Hash } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const MultiplicationTableStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [tableNum, setTableNum] = useState<number>(7);

  const code = useMemo(() => {
    return [
      `num = ${tableNum}`,
      `table = []`,
      `for i in range(1, 11):`,
      `    ans = num * i`,
      `    row_text = f"{num} x {i} = {ans}"`,
      `    print(row_text)`,
      `    table.append(ans)`,
    ].join('\n');
  }, [tableNum]);

  const runner = useSimulatorRunner(code);

  const [reactiveMode, setReactiveMode] = useState(true);
  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  const currentI = Number(runner.activeStep?.variables.i ?? 10);
  const currentAns = Number(runner.activeStep?.variables.ans ?? tableNum * 10);

  // 10 table rows
  const rows = useMemo(() => {
    const list: Array<{ i: number; ans: number; formula: string }> = [];
    for (let i = 1; i <= 10; i++) {
      list.push({ i, ans: tableNum * i, formula: `${tableNum} × ${i}` });
    }
    return list;
  }, [tableNum]);

  const handleSelectTable = (n: number) => {
    setReactiveMode(true);
    setTableNum(Math.max(1, Math.min(99, n)));
  };

  return (
    <SimulatorShell
      meta={meta}
      code={code}
      steps={runner.steps}
      stepIndex={runner.stepIndex}
      isPlaying={runner.isPlaying}
      speedMs={runner.speedMs}
      onPlay={() => {
        setReactiveMode(false);
        runner.play();
      }}
      onPause={runner.pause}
      onNextStep={() => {
        setReactiveMode(false);
        runner.nextStep();
      }}
      onPrevStep={() => {
        setReactiveMode(false);
        runner.prevStep();
      }}
      onJumpToStep={(s) => {
        setReactiveMode(false);
        runner.jumpToStep(s);
      }}
      onReset={() => {
        setReactiveMode(false);
        runner.reset();
      }}
      onChangeSpeed={runner.setSpeedMs}
      onBackToHub={onBackToHub}
      initialVariables={{ num: tableNum, i: 1, ans: tableNum * 1 }}
      initialExplanation="Number chuno ya slider drag karo. Python for loop range(1, 11) se 1 se 10 tak iterate karta hai aur har bar num * i calculate karke print karta hai."
    >
      <div className="space-y-6">
        {/* Header & Quick Table Pickers */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
              Multiplication Table Generator (Pahaada)
            </h2>
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
              <code>for i in range(1, 11):</code> 10 baar chalta hai aur har iteration me calculation karta hai.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[2, 5, 7, 9, 12, 19].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleSelectTable(val)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  tableNum === val
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-red-300'
                }`}
              >
                Table of {val}
              </button>
            ))}
          </div>
        </div>

        {/* Number Input Control Card */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900/60">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase text-stone-500">Selected Number</p>
              <p className="text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                Choose any number from 1 to 50
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={50}
              value={tableNum}
              onChange={(e) => handleSelectTable(Number(e.target.value))}
              className="w-40 sm:w-56 h-2.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
            />
            <span className="font-display text-2xl font-extrabold text-red-600 dark:text-red-400 w-12 text-center">
              {tableNum}
            </span>
          </div>
        </div>

        {/* Row-by-Row Multiplication Grid */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DFDF]/60 dark:border-[#3a1a1a] pb-3 text-xs font-mono">
            <span className="font-bold text-stone-600 dark:text-stone-300">
              Generated Rows (1 to 10)
            </span>
            <span className="text-stone-500">
              Active Step: <code>i = {currentI}</code> &rarr; <code>{tableNum} × {currentI} = {currentAns}</code>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {rows.map((row) => {
              const isCurrent = runner.stepIndex > 0 && currentI === row.i;
              return (
                <div
                  key={row.i}
                  className={`flex flex-col p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'border-red-500 bg-red-500/10 ring-2 ring-red-500/30 scale-[1.02] shadow-sm'
                      : 'border-[#E5DFDF]/60 dark:border-[#2a1010] bg-stone-50/50 dark:bg-[#150707]'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-stone-400">
                    Pass #{row.i}
                  </span>
                  <div className="mt-1 flex items-baseline justify-between font-mono">
                    <span className="text-sm font-semibold text-stone-600 dark:text-stone-300">
                      {row.formula}
                    </span>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      = {row.ans}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
