import React, { useState, useMemo } from 'react';
import { Timer, OctagonX, CheckCircle2 } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';
import { scaleAnimationMs } from '../AnimationSpeedController';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const CountdownTimerStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [startCount, setStartCount] = useState<number>(5);
  const [enableBreak, setEnableBreak] = useState<boolean>(false);
  const [stopAt, setStopAt] = useState<number>(2);

  const code = useMemo(() => {
    if (!enableBreak) {
      return [
        `count = ${startCount}`,
        `while count > 0:`,
        `    print("T-minus", count)`,
        `    count = count - 1`,
        `print("Done! while condition is False.")`,
      ].join('\n');
    }
    return [
      `count = ${startCount}`,
      `stop_at = ${stopAt}`,
      `while count > 0:`,
      `    if count == stop_at:`,
      `        print("Emergency stop at", count)`,
      `        break`,
      `    print("T-minus", count)`,
      `    count = count - 1`,
      `print("Countdown exited.")`,
    ].join('\n');
  }, [startCount, enableBreak, stopAt]);

  const runner = useSimulatorRunner(code);

  const currentCount = Number(
    runner.activeStep?.variables.count ?? startCount
  );
  const brokeEarly = runner.activeStep?.kind === 'break' ||
    (runner.activeStep?.outputLines.some((l) => l.includes('Emergency stop')) ?? false);
  const finishedNaturally =
    runner.stepIndex >= runner.steps.length && runner.steps.length > 0 && !brokeEarly;

  const pct =
    startCount > 0 ? Math.max(0, Math.min(100, (currentCount / startCount) * 100)) : 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const handleUpdate = (fn: () => void) => {
    fn();
    runner.reset();
  };

  return (
    <SimulatorShell
      meta={meta}
      code={code}
      steps={runner.steps}
      stepIndex={runner.stepIndex}
      isPlaying={runner.isPlaying}
      speedMs={runner.speedMs}
      onPlay={runner.play}
      onPause={runner.pause}
      onNextStep={runner.nextStep}
      onPrevStep={runner.prevStep}
      onJumpToStep={runner.jumpToStep}
      onReset={runner.reset}
      onChangeSpeed={runner.setSpeedMs}
      onBackToHub={onBackToHub}
      initialVariables={
        enableBreak ? { count: startCount, stop_at: stopAt } : { count: startCount }
      }
      initialExplanation='Set a starting number (or test 0 and break) and press Play or Next Step to watch the while loop condition count down to termination.'
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Synchronized Digital Countdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9a8585]">
              Every tick updates strictly from the <code className="font-mono text-sky-700 dark:text-sky-300">while count &gt; 0</code> step.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleUpdate(() => {
                  setStartCount(0);
                  setEnableBreak(false);
                })
              }
              className="rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-sky-300"
            >
              Test Start = 0
            </button>
            <button
              type="button"
              onClick={() =>
                handleUpdate(() => {
                  setStartCount(6);
                  setEnableBreak(true);
                  setStopAt(2);
                })
              }
              className="rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-violet-300"
            >
              Demo break at 2
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] p-5 sm:grid-cols-12 items-center">
          {/* Large Digital Ring Display */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-xs sm:col-span-7">
            <div className="relative flex h-44 w-44 items-center justify-center">
              <svg className="h-44 w-44 -rotate-90" viewBox="0 0 160 160" aria-hidden="true">
                <defs>
                  <linearGradient id="cdGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E10906" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={brokeEarly ? '#F43F5E' : 'url(#cdGrad)'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: `stroke-dashoffset ${scaleAnimationMs(360, runner.speedMs)}ms ease`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-5xl font-extrabold text-[#1E293B] tabular-nums">
                  {currentCount}
                </span>
                <span className="mt-1 font-mono text-xs font-medium text-slate-500 dark:text-[#9a8585]">
                  count
                </span>
              </div>
            </div>

            {/* Condition & Termination Readout */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-4 py-2 text-xs font-semibold">
              {brokeEarly ? (
                <>
                  <OctagonX className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  <span className="text-rose-800 dark:text-rose-200">Stopped early via break</span>
                </>
              ) : finishedNaturally ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-800 dark:text-emerald-200">
                    Terminated: {currentCount} &gt; 0 is False
                  </span>
                </>
              ) : (
                <>
                  <Timer className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                  <span className="font-mono text-[#1E293B]">
                    count &gt; 0 → {currentCount > 0 ? 'True' : 'False'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-xs sm:col-span-5">
            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="cd-start" className="font-semibold text-[#1E293B]">
                  Starting Number: <span className="font-mono text-sky-700 dark:text-sky-300 tabular-nums">{startCount}</span>
                </label>
              </div>
              <input
                id="cd-start"
                type="range"
                min={0}
                max={12}
                step={1}
                value={startCount}
                onChange={(e) => handleUpdate(() => setStartCount(Number(e.target.value)))}
                className="mt-2 w-full accent-[#E10906] cursor-pointer"
              />
              <div className="flex justify-between font-mono text-[11px] text-slate-500 dark:text-[#9a8585]">
                <span>0 (Edge Case)</span>
                <span>12</span>
              </div>
            </div>

            <div className="border-t border-[#F1EEEE] dark:border-[#2a1212] pt-3">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#1E293B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableBreak}
                  onChange={(e) => handleUpdate(() => setEnableBreak(e.target.checked))}
                  className="h-4 w-4 rounded accent-[#8B5CF6]"
                />
                Enable <code className="font-mono text-violet-700 dark:text-violet-300">break</code> trigger
              </label>

              {enableBreak && (
                <div className="mt-3">
                  <label htmlFor="cd-stop-at" className="block text-xs text-[#8A8585] dark:text-[#9a8585]">
                    Break when <code className="font-mono">count ==</code>
                  </label>
                  <input
                    id="cd-stop-at"
                    type="number"
                    min={1}
                    max={Math.max(1, startCount)}
                    value={stopAt}
                    onChange={(e) => handleUpdate(() => setStopAt(Number(e.target.value)))}
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm font-bold text-[#1E293B] focus:border-violet-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
