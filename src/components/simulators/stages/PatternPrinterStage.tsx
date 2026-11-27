import React, { useState, useMemo, useEffect } from 'react';
import { Layers, Star, Sliders, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const PatternPrinterStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [rows, setRows] = useState<number>(5);
  const [useStringMultiply, setUseStringMultiply] = useState<boolean>(false);

  // Generate python code based on toggle
  const code = useMemo(() => {
    if (useStringMultiply) {
      return [
        `rows = ${rows}`,
        `# Python Shortcut: String Multiplication ("*" * i)`,
        `for i in range(1, rows + 1):`,
        `    line = "*" * i`,
        `    print(line)`,
      ].join('\n');
    }
    return [
      `rows = ${rows}`,
      `# Nested Loop: Outer Loop controls Rows, Inner Loop controls Stars`,
      `for i in range(1, rows + 1):`,
      `    line = ""`,
      `    for j in range(1, i + 1):`,
      `        line += "*"`,
      `    print(line)`,
    ].join('\n');
  }, [rows, useStringMultiply]);

  const runner = useSimulatorRunner(code);

  const [reactiveMode, setReactiveMode] = useState(true);
  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  const currentI = Number(runner.activeStep?.variables.i ?? rows);

  // Pattern lines for rendering
  const patternLines = useMemo(() => {
    const list: string[] = [];
    for (let i = 1; i <= rows; i++) {
      list.push('*'.repeat(i));
    }
    return list;
  }, [rows]);

  const handleRowsChange = (r: number) => {
    setReactiveMode(true);
    setRows(Math.max(1, Math.min(10, r)));
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
      initialVariables={{ rows, i: 1, line: '*' }}
      initialExplanation="Rows adjust karo (1-10) aur toggle switch se dekho: Python nested loops (for i... for j...) se star grid banata hai ya string multiplication ('*' * i) se!"
    >
      <div className="space-y-6">
        {/* Header & Mode Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
              Pattern Printer (Nested Loops vs String Multiply)
            </h2>
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
              Outer loop rows badhata hai (i), aur inner loop har row mein utne stars add karta hai (j).
            </p>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => {
              setReactiveMode(true);
              setUseStringMultiply((prev) => !prev);
            }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
              useStringMultiply
                ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
            }`}
          >
            <span>{useStringMultiply ? 'Mode: "*" * i (String Repetition)' : 'Mode: Nested Loop (for j in range)'}</span>
            <span className="underline text-[10px] opacity-80">(Switch)</span>
          </button>
        </div>

        {/* Rows Slider & Presets */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-[#100303] dark:text-[#f0eaea] uppercase tracking-wider font-mono">
              <Star className="w-4 h-4 text-amber-500 fill-current" />
              <span>Triangle Height (Rows): {rows}</span>
            </label>
            <div className="flex gap-1.5">
              {[3, 5, 7, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleRowsChange(num)}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                    rows === num
                      ? 'border-red-500 bg-red-600 text-white'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={rows}
            onChange={(e) => handleRowsChange(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
          />
        </div>

        {/* Visual Star Pyramid Render */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Visual Terminal / Canvas Output */}
          <div className="md:col-span-7 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-stone-950 p-6 shadow-sm font-mono text-emerald-400 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2 text-[11px] text-stone-400">
              <span>PyVerse Virtual Terminal</span>
              <span>rows = {rows}</span>
            </div>

            <div className="pt-2 space-y-1.5 select-none text-base sm:text-lg tracking-widest">
              {patternLines.map((line, idx) => {
                const rowNum = idx + 1;
                const isCurrentActive = runner.stepIndex > 0 && currentI === rowNum;
                return (
                  <div
                    key={rowNum}
                    className={`flex items-center gap-3 px-2 py-1 rounded transition-colors ${
                      isCurrentActive
                        ? 'bg-red-500/20 text-white font-bold ring-1 ring-red-500/50'
                        : 'text-amber-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-stone-600 select-none w-5">
                      {rowNum}:
                    </span>
                    <span>{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Logic Comparison Card */}
          <div className="md:col-span-5 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-stone-600 dark:text-stone-300 block pb-1 border-b border-[#E5DFDF]/60 dark:border-[#3a1a1a]">
              Loop Concept Mechanics
            </span>

            <div className="space-y-3 text-xs leading-relaxed text-stone-600 dark:text-stone-300">
              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40">
                <p className="font-bold font-mono text-red-600 dark:text-red-400">Outer Loop (Rows):</p>
                <p className="mt-0.5"><code>for i in range(1, {rows + 1}):</code> har row ke liye 1 se {rows} tak step karta hai.</p>
              </div>

              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40">
                <p className="font-bold font-mono text-blue-600 dark:text-blue-400">
                  {useStringMultiply ? 'String Multiplication:' : 'Inner Loop (Columns):'}
                </p>
                <p className="mt-0.5">
                  {useStringMultiply
                    ? 'Python string operator "*" string ko "i" times repeat karke ek line mein print karta hai.'
                    : 'for j in range(1, i + 1): har row "i" mein theek "i" stars character-by-character jodta hai.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
