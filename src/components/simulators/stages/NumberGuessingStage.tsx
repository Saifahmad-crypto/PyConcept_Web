import React, { useState, useMemo, useEffect } from 'react';
import { Target, Search, ArrowRight, CheckCircle2, RotateCcw, Zap } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const NumberGuessingStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [secret, setSecret] = useState<number>(42);

  // Pre-calculate binary search trace steps in Python
  const code = useMemo(() => {
    return [
      `secret_target = ${secret}`,
      `low = 1`,
      `high = 100`,
      `attempts = 0`,
      `while True:`,
      `    attempts += 1`,
      `    guess = (low + high) // 2`,
      `    if guess == secret_target:`,
      `        status = "FOUND"`,
      `        print(f"BINGO! Found {secret_target} in {attempts} attempts!")`,
      `        break`,
      `    elif guess < secret_target:`,
      `        status = "TOO_LOW"`,
      `        print(f"Guess {guess} is TOO LOW -> low becomes {guess + 1}")`,
      `        low = guess + 1`,
      `    else:`,
      `        status = "TOO_HIGH"`,
      `        print(f"Guess {guess} is TOO HIGH -> high becomes {guess - 1}")`,
      `        high = guess - 1`,
    ].join('\n');
  }, [secret]);

  const runner = useSimulatorRunner(code);

  const [reactiveMode, setReactiveMode] = useState(true);
  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  const currentLow = Number(runner.activeStep?.variables.low ?? 1);
  const currentHigh = Number(runner.activeStep?.variables.high ?? 100);
  const currentGuess = Number(runner.activeStep?.variables.guess ?? Math.floor((1 + 100) / 2));
  const currentAttempts = Number(runner.activeStep?.variables.attempts ?? 0);
  const currentStatus = String(runner.activeStep?.variables.status ?? (secret === currentGuess ? 'FOUND' : 'SEARCHING'));

  // Pre-compute full binary search path
  const searchHistory = useMemo(() => {
    const list: Array<{ step: number; low: number; high: number; guess: number; status: string }> = [];
    let l = 1;
    let h = 100;
    let att = 0;
    while (l <= h && att < 12) {
      att++;
      const g = Math.floor((l + h) / 2);
      if (g === secret) {
        list.push({ step: att, low: l, high: h, guess: g, status: 'MATCH (Target Found)' });
        break;
      } else if (g < secret) {
        list.push({ step: att, low: l, high: h, guess: g, status: 'TOO LOW -> Range shifts right' });
        l = g + 1;
      } else {
        list.push({ step: att, low: l, high: h, guess: g, status: 'TOO HIGH -> Range shifts left' });
        h = g - 1;
      }
    }
    return list;
  }, [secret]);

  const handleSelectSecret = (val: number) => {
    setReactiveMode(true);
    setSecret(Math.max(1, Math.min(100, val)));
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
      initialVariables={{ secret_target: secret, low: 1, high: 100, attempts: 0 }}
      initialExplanation="Secret number set karo (1-100). Python ka while True loop Binary Search use karta hai: har step par search range aadhi (half) ho jaati hai jab tak match na ho!"
    >
      <div className="space-y-6">
        {/* Header & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
              Binary Search &amp; while True Loop
            </h2>
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
              <code>while True:</code> loop tab tak chalta hai jab tak <code>guess == secret</code> par <code>break</code> trigger na ho.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '42 (Classic)', val: 42 },
              { label: '73 (Upper)', val: 73 },
              { label: '17 (Lower)', val: 17 },
              { label: '1 (Extreme Low)', val: 1 },
              { label: '100 (Extreme High)', val: 100 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => handleSelectSecret(p.val)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  secret === p.val
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-red-300'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Target */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900/60">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase text-stone-500">Secret Target</p>
              <p className="text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                Computer ko ye number dhoondhna hai (1 - 100)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={100}
              value={secret}
              onChange={(e) => handleSelectSecret(Number(e.target.value))}
              className="w-40 sm:w-56 h-2.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
            />
            <span className="font-display text-xl font-bold w-12 text-center text-red-600 dark:text-red-400">
              {secret}
            </span>
          </div>
        </div>

        {/* Low-High Dynamic Range Visual Bar */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-red-500" />
              <span>Current Search Space: [{currentLow} ... {currentHigh}]</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 font-bold">
              Total Steps: {searchHistory.length} max
            </span>
          </div>

          {/* Graphical Range Bar */}
          <div className="relative w-full h-10 bg-stone-100 dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 flex items-center">
            {/* Active Range Window */}
            <div
              className="absolute h-full bg-red-500/20 dark:bg-red-500/30 border-x-2 border-red-500 transition-all duration-300"
              style={{
                left: `${currentLow - 1}%`,
                width: `${Math.max(1, currentHigh - currentLow + 1)}%`,
              }}
            />
            {/* Secret Target Indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-emerald-500 z-10 transition-all duration-200"
              style={{ left: `${secret - 1}%` }}
              title={`Secret Target: ${secret}`}
            />
            {/* Current Midpoint Guess Indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-red-600 z-10 transition-all duration-200 shadow-md"
              style={{ left: `${currentGuess - 1}%` }}
              title={`Current Guess: ${currentGuess}`}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400">
            <span>Low: {currentLow}</span>
            <span className="text-red-500 font-bold">Mid Guess: {currentGuess}</span>
            <span>High: {currentHigh}</span>
          </div>
        </div>

        {/* Step-by-Step Binary Halving Log */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-3">
          <span className="text-xs font-bold uppercase font-mono tracking-wider text-stone-600 dark:text-stone-300 block pb-1 border-b border-[#E5DFDF]/60 dark:border-[#3a1a1a]">
            Binary Search Convergence Log
          </span>

          <div className="space-y-2">
            {searchHistory.map((item) => {
              const isMatch = item.guess === secret;
              return (
                <div
                  key={item.step}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
                    isMatch
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'border-stone-200 dark:border-[#2a1010] bg-stone-50/50 dark:bg-[#150707] text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-[10px] font-bold">
                      Step {item.step}
                    </span>
                    <span>
                      Range: [{item.low}, {item.high}] &rarr; Mid: <strong>{item.guess}</strong>
                    </span>
                  </div>

                  <span className="text-[11px] font-sans font-medium flex items-center gap-1">
                    {isMatch && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>{item.status}</span>
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
