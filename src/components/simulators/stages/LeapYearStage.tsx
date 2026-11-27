import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const LeapYearStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [year, setYear] = useState<number>(2024);

  const code = useMemo(
    () =>
      [
        `year = ${year}`,
        `div_by_4 = (year % 4 == 0)`,
        `div_by_100 = (year % 100 == 0)`,
        `div_by_400 = (year % 400 == 0)`,
        `is_leap = (div_by_4 and not div_by_100) or div_by_400`,
        `if is_leap:`,
        `    result = "LEAP YEAR"`,
        `    days = 366`,
        `    print(f"{year} is a Leap Year (366 days, Feb has 29 days)!")`,
        `else:`,
        `    result = "COMMON YEAR"`,
        `    days = 365`,
        `    print(f"{year} is a Common Year (365 days, Feb has 28 days)")`,
      ].join('\n'),
    [year]
  );

  const runner = useSimulatorRunner(code);

  const [reactiveMode, setReactiveMode] = useState(true);
  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  const divBy4 = year % 4 === 0;
  const divBy100 = year % 100 === 0;
  const divBy400 = year % 400 === 0;
  const isLeapCalculated = (divBy4 && !divBy100) || divBy400;

  const currentResult = String(
    runner.activeStep?.variables.result ?? (isLeapCalculated ? 'LEAP YEAR' : 'COMMON YEAR')
  );
  const currentDays = Number(
    runner.activeStep?.variables.days ?? (isLeapCalculated ? 366 : 365)
  );

  const handleSelectPreset = (y: number) => {
    setReactiveMode(true);
    setYear(y);
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
      initialVariables={{ year, div_by_4: divBy4, div_by_100: divBy100, div_by_400: divBy400, is_leap: isLeapCalculated }}
      initialExplanation="Year badlo ya presets try karo (2024, 1900, 2000). Python dekhta hai: 4 se divisible ho aur 100 se na ho, ya seedhe 400 se divisible ho."
    >
      <div className="space-y-6">
        {/* Preset Years & Explanations */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
              Leap Year Logic Simulator
            </h2>
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
              Logic: <code className="font-mono text-red-600 dark:text-red-400 font-bold">(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)</code>
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '2024 (Leap: % 4 == 0)', val: 2024 },
              { label: '1900 (Century Not Leap: % 100 == 0)', val: 1900 },
              { label: '2000 (Century Leap: % 400 == 0)', val: 2000 },
              { label: '2023 (Common Year)', val: 2023 },
              { label: '2028 (Next Leap)', val: 2028 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => handleSelectPreset(preset.val)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  year === preset.val
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-red-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Year Input Control Card */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900/60">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase text-stone-500">Test Any Year</p>
              <p className="text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                Enter Year Number (e.g. 2024, 1900, 2000, 2026)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              min={1}
              max={9999}
              value={year}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  handleSelectPreset(val);
                }
              }}
              className="w-32 px-3 py-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-stone-50 dark:bg-[#1a0808] text-center font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea] focus:border-red-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleSelectPreset(year + 1)}
              className="px-3 py-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-stone-50 dark:bg-[#1a0808] text-xs font-bold font-mono hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              +1 Yr
            </button>
            <button
              type="button"
              onClick={() => handleSelectPreset(year - 1)}
              className="px-3 py-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-stone-50 dark:bg-[#1a0808] text-xs font-bold font-mono hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              -1 Yr
            </button>
          </div>
        </div>

        {/* Visual Outcome & Condition Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Visual Calendar Outcome */}
          <div
            className={`md:col-span-5 rounded-2xl border p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden transition-all duration-300 ${
              isLeapCalculated
                ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/20 dark:from-[#062013] dark:to-[#090101]'
                : 'border-stone-300 dark:border-stone-800 bg-gradient-to-br from-white via-white to-stone-50 dark:from-[#140404] dark:to-[#090101]'
            }`}
          >
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Gregorian Calendar Result
              </span>

              <div className="my-2">
                <span className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-[#100303] dark:text-[#f0eaea]">
                  {year}
                </span>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider ${
                  isLeapCalculated
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                }`}
              >
                {isLeapCalculated ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{currentResult}</span>
              </div>

              <p className="text-xs font-mono text-[#8A8585] dark:text-[#9a8585] pt-2">
                Total Days: <strong>{currentDays} days</strong> • February has{' '}
                <strong>{isLeapCalculated ? '29 days' : '28 days'}</strong>
              </p>
            </div>
          </div>

          {/* Three Boolean Checkers */}
          <div className="md:col-span-7 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-stone-600 dark:text-stone-300 block pb-1 border-b border-[#E5DFDF]/60 dark:border-[#3a1a1a]">
              Three Mathematical Conditions Traced
            </span>

            {/* Condition 1: year % 4 == 0 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-[#2a1010] bg-stone-50/50 dark:bg-[#150707] text-xs font-mono">
              <div>
                <p className="font-bold text-[#100303] dark:text-[#f0eaea]">
                  1. {year} % 4 == 0 (Remainder: {year % 4})
                </p>
                <p className="text-[11px] text-stone-500 font-sans">
                  Har 4 saal mein leap year hota hai (General rule)
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded font-bold text-xs ${
                  divBy4
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                }`}
              >
                {String(divBy4)}
              </span>
            </div>

            {/* Condition 2: year % 100 != 0 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-[#2a1010] bg-stone-50/50 dark:bg-[#150707] text-xs font-mono">
              <div>
                <p className="font-bold text-[#100303] dark:text-[#f0eaea]">
                  2. {year} % 100 != 0 (Century Check)
                </p>
                <p className="text-[11px] text-stone-500 font-sans">
                  Century years (jaise 1900) leap nahi hote, jab tak 400 se divide na ho
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded font-bold text-xs ${
                  !divBy100
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                }`}
              >
                {String(!divBy100)}
              </span>
            </div>

            {/* Condition 3: year % 400 == 0 */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-stone-200 dark:border-[#2a1010] bg-stone-50/50 dark:bg-[#150707] text-xs font-mono">
              <div>
                <p className="font-bold text-[#100303] dark:text-[#f0eaea]">
                  3. {year} % 400 == 0 (Exception to Century)
                </p>
                <p className="text-[11px] text-stone-500 font-sans">
                  2000 or 1600 jaise 400 se divisible century years leap hote hain
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded font-bold text-xs ${
                  divBy400
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                    : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {String(divBy400)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
