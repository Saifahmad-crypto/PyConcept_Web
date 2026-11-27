import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { Sparkles, Hash, ArrowRight, Play, CheckCircle2, Loader2 } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

const FizzBuzz3D = lazy(() => import('./FizzBuzz3D'));

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const FizzBuzzStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [maxN, setMaxN] = useState<number>(15);

  const code = useMemo(() => {
    return [
      `n = ${maxN}`,
      `results = []`,
      `for i in range(1, n + 1):`,
      `    if i % 3 == 0 and i % 5 == 0:`,
      `        val = "FizzBuzz"`,
      `        print(f"{i} -> FizzBuzz (3 aur 5 dono se divisible)")`,
      `    elif i % 3 == 0:`,
      `        val = "Fizz"`,
      `        print(f"{i} -> Fizz (3 se divisible)")`,
      `    elif i % 5 == 0:`,
      `        val = "Buzz"`,
      `        print(f"{i} -> Buzz (5 se divisible)")`,
      `    else:`,
      `        val = str(i)`,
      `        print(f"{i} -> {i}")`,
      `    results.append(val)`,
    ].join('\n');
  }, [maxN]);

  const runner = useSimulatorRunner(code);

  const [reactiveMode, setReactiveMode] = useState(true);
  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  const currentI = Number(runner.activeStep?.variables.i ?? maxN);
  const currentVal = String(runner.activeStep?.variables.val ?? '');

  // Live evaluated items for display
  const items = useMemo(() => {
    const list: Array<{ num: number; tag: string; type: 'fizzbuzz' | 'fizz' | 'buzz' | 'num' }> = [];
    for (let i = 1; i <= maxN; i++) {
      if (i % 3 === 0 && i % 5 === 0) {
        list.push({ num: i, tag: 'FizzBuzz', type: 'fizzbuzz' });
      } else if (i % 3 === 0) {
        list.push({ num: i, tag: 'Fizz', type: 'fizz' });
      } else if (i % 5 === 0) {
        list.push({ num: i, tag: 'Buzz', type: 'buzz' });
      } else {
        list.push({ num: i, tag: String(i), type: 'num' });
      }
    }
    return list;
  }, [maxN]);

  const handleSliderChange = (val: number) => {
    setReactiveMode(true);
    setMaxN(val);
  };

  const getTagBadge = (type: string) => {
    switch (type) {
      case 'fizzbuzz':
        return 'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold';
      case 'fizz':
        return 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold';
      case 'buzz':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold';
      default:
        return 'border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400';
    }
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
      initialVariables={{ n: maxN, i: 1, val: '1' }}
      initialExplanation="N choose karo (1-30). Python for loop 1 se n tak iterate karta hai aur har number pe % 3 aur % 5 check karta hai."
      scene3D={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
                3D Cyber Token Sequencer &amp; Modulo Laser Processor
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#9a8585]">
                Interactive 3D numerical tokens, quantum laser classifier, and pointer memory trace.
              </p>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="flex h-[430px] items-center justify-center rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-[#0c040e] text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-[#E10906]" />
                <span className="ml-2 text-xs font-mono">Loading 3D Token Environment...</span>
              </div>
            }
          >
            <FizzBuzz3D
              maxN={maxN}
              currentI={currentI}
              currentVal={currentVal}
              onSelectN={handleSliderChange}
            />
          </Suspense>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
              FizzBuzz Loop Simulator
            </h2>
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
              Classic Python loop pattern: <code>range(1, n + 1)</code> ke sath <code>% 15 == 0</code> pehle check hota hai!
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Short (5)', val: 5 },
              { label: 'Classic (15)', val: 15 },
              { label: 'Medium (20)', val: 20 },
              { label: 'Full (30)', val: 30 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => handleSliderChange(p.val)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  maxN === p.val
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-red-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* N Slider */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-[#100303] dark:text-[#f0eaea] uppercase tracking-wider font-mono">
              <Hash className="w-4 h-4 text-red-500" />
              <span>Range Limit N: {maxN} numbers</span>
            </label>
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              range(1, {maxN + 1})
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={maxN}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#8A8585] dark:text-[#9a8585]">
            <span>1</span>
            <span>10</span>
            <span>15 (First FizzBuzz)</span>
            <span>20</span>
            <span>30</span>
          </div>
        </div>

        {/* Live Visual List of FizzBuzz Output */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DFDF]/60 dark:border-[#3a1a1a] pb-3">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Loop Output Stream ({items.length} Iterations)</span>
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-blue-500">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> % 3: Fizz
              </span>
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> % 5: Buzz
              </span>
              <span className="flex items-center gap-1 text-purple-500">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> % 15: FizzBuzz
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 max-h-[320px] overflow-y-auto p-1">
            {items.map((it) => {
              const isCurrentStep = runner.stepIndex > 0 && currentI === it.num;
              return (
                <div
                  key={it.num}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                    isCurrentStep
                      ? 'border-red-500 bg-red-500/15 ring-2 ring-red-500/40 shadow-sm scale-[1.02]'
                      : 'border-[#E5DFDF]/60 dark:border-[#2a1010] bg-stone-50/50 dark:bg-[#150707]'
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">
                    #{it.num}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${getTagBadge(
                      it.type
                    )}`}
                  >
                    {it.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
