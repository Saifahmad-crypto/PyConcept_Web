import React, { useState, useMemo, Suspense, lazy } from 'react';
import { Banknote, CheckCircle2, AlertCircle, Layers, Loader2 } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';
import { scaleAnimationMs } from '../AnimationSpeedController';

const CashCounter3D = lazy(() => import('./CashCounter3D'));

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

type Denom = 100 | 200 | 500;

export const CashCounterStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [denomination, setDenomination] = useState<Denom>(500);
  const [numNotes, setNumNotes] = useState<number>(6);
  const [targetAmount, setTargetAmount] = useState<number>(2000);
  const [loopMode, setLoopMode] = useState<'while' | 'for'>('while');

  const safeNotes = Math.max(0, Math.min(20, Math.round(Number(numNotes) || 0)));
  const safeTarget = Math.max(0, Math.round(Number(targetAmount) || 0));

  const code = useMemo(() => {
    if (loopMode === 'while') {
      return [
        `denomination = ${denomination}`,
        `num_notes = ${safeNotes}`,
        `target = ${safeTarget}`,
        `counted = 0`,
        `total = 0`,
        `while counted < num_notes and (target == 0 or total < target):`,
        `    counted = counted + 1`,
        `    total = total + denomination`,
        `    print("Note", counted, "-> Total:", total)`,
        `print("Finished:", total, "in", counted, "notes")`,
      ].join('\n');
    }
    return [
      `denomination = ${denomination}`,
      `num_notes = ${safeNotes}`,
      `target = ${safeTarget}`,
      `counted = 0`,
      `total = 0`,
      `for n in range(1, num_notes + 1):`,
      `    if target > 0 and total >= target:`,
      `        print("Target reached -> break!")`,
      `        break`,
      `    counted = n`,
      `    total = total + denomination`,
      `    print("Note", counted, "-> Total:", total)`,
      `print("Finished:", total, "in", counted, "notes")`,
    ].join('\n');
  }, [denomination, safeNotes, safeTarget, loopMode]);

  const runner = useSimulatorRunner(code);

  const counted = Number(runner.activeStep?.variables.counted ?? 0);
  const total = Number(runner.activeStep?.variables.total ?? 0);
  const remaining = Math.max(0, safeNotes - counted);
  const isDone = runner.stepIndex >= runner.steps.length && runner.steps.length > 0;
  const hitTargetEarly = safeTarget > 0 && total >= safeTarget && remaining > 0;

  const noteColors =
    denomination === 500
      ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-[#100303] dark:text-[#f0eaea]'
      : denomination === 200
      ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
      : 'border-sky-400 bg-[#F0F9FF] text-sky-900 dark:text-sky-200';

  const resetWith = (fn: () => void) => {
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
      initialVariables={{
        denomination,
        num_notes: safeNotes,
        target: safeTarget,
        counted: 0,
        total: 0,
      }}
      initialExplanation='Pick a note denomination, quantity, and optional target amount, then press Play to watch the loop feed notes one by one and accumulate the total.'
      scene3D={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
                3D Interactive Cash Counter
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#9a8585]">
                Physical stacks shift from uncounted to counted pile note-by-note with sensor scan.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                Total: ₹{total}
              </span>
              <span className="rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2.5 py-1 text-xs font-mono font-bold text-sky-700 dark:text-sky-300">
                Counted: {counted} / {safeNotes}
              </span>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex h-[380px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#100303] text-slate-300">
                <Loader2 className="h-8 w-8 animate-spin text-[#E10906]" />
                <span className="text-xs font-medium">Loading 3D Cash Counter Scene...</span>
              </div>
            }
          >
            <CashCounter3D
              denomination={denomination}
              counted={counted}
              totalNotes={safeNotes}
              totalAmount={total}
              targetAmount={safeTarget}
              isDone={isDone}
            />
          </Suspense>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Educational Cash Counting Machine
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9a8585]">
              Sample currency denominations for practicing loop counters &amp; accumulation.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] p-1 gap-1">
            {(['while', 'for'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => resetWith(() => setLoopMode(m))}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  loopMode === m
                    ? 'bg-gradient-to-r from-[#E10906] to-[#8B5CF6] text-white shadow-xs'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#1E293B]'
                }`}
              >
                {m} loop
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] p-3">
            <span className="block text-xs font-semibold text-[#8A8585] dark:text-[#9a8585] mb-2">
              Note Denomination
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {([100, 200, 500] as Denom[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => resetWith(() => setDenomination(d))}
                  className={`rounded-lg border py-1.5 font-mono text-xs font-bold transition-all ${
                    denomination === d
                      ? 'border-sky-500 bg-gradient-to-r from-[#E10906] to-[#8B5CF6] text-white shadow-xs'
                      : 'border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#1E293B] hover:border-sky-300'
                  }`}
                >
                  ₹{d}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] p-3">
            <label htmlFor="cash-notes" className="block text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
              Number of Notes (0–20)
            </label>
            <input
              id="cash-notes"
              type="number"
              min={0}
              max={20}
              value={numNotes}
              onChange={(e) => resetWith(() => setNumNotes(Number(e.target.value)))}
              className="mt-1.5 w-full rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm font-bold text-[#1E293B] tabular-nums focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] p-3">
            <label htmlFor="cash-target" className="block text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
              Target Limit ₹ (0 = All)
            </label>
            <input
              id="cash-target"
              type="number"
              min={0}
              max={10000}
              step={100}
              value={targetAmount}
              onChange={(e) => resetWith(() => setTargetAmount(Number(e.target.value)))}
              className="mt-1.5 w-full rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-1.5 font-mono text-sm font-bold text-[#1E293B] tabular-nums focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Cash Counter Machine Visual */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] p-5 space-y-4">
          {/* LED Display */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#0F172A] p-4 text-white">
            <div>
              <span className="text-[11px] text-slate-400">Notes Counted</span>
              <p className="mt-0.5 font-mono text-2xl font-extrabold text-sky-300 tabular-nums">
                {counted} <span className="text-sm font-normal text-slate-400">/ {safeNotes}</span>
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Accumulated Total</span>
              <p className="mt-0.5 font-mono text-2xl font-extrabold text-emerald-300 tabular-nums">
                ₹{total.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Target Limit</span>
              <p className="mt-0.5 font-mono text-2xl font-extrabold text-violet-300 tabular-nums">
                {safeTarget > 0 ? `₹${safeTarget.toLocaleString('en-IN')}` : 'None'}
              </p>
            </div>
          </div>

          {/* Hopper -> Roller -> Output Stack */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 items-stretch">
            <div className="rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                Input Hopper
              </div>
              <p className="mt-2 font-mono text-xl font-bold text-[#1E293B] tabular-nums">
                {remaining} notes left
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {Array.from({ length: Math.min(remaining, 8) }, (_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${noteColors}`}
                  >
                    ₹{denomination}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3.5 text-center">
              <span className="text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">Optical Counter</span>
              <div
                style={{ transitionDuration: `${scaleAnimationMs(260, runner.speedMs)}ms` }}
                className={`mt-2 flex h-12 w-24 items-center justify-center rounded-xl border-2 font-mono text-sm font-extrabold transition-all ${
                  runner.activeStep?.kind === 'assign' &&
                  runner.activeStep.codeLine.includes('total = total')
                    ? `${noteColors} scale-105 shadow-sm`
                    : 'border-dashed border-slate-300 dark:border-[#4a2525] bg-slate-50 dark:bg-[#1a0808] text-slate-400'
                }`}
              >
                <Banknote className="mr-1 h-4 w-4" aria-hidden="true" />₹{denomination}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3.5 text-center">
              <span className="text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">Counted Stack</span>
              <p className="mt-2 font-mono text-xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {counted} counted
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {Array.from({ length: Math.min(counted, 8) }, (_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold ${noteColors}`}
                  >
                    ₹{denomination}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {isDone && (
            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold ${
                safeNotes === 0
                  ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                  : 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
              }`}
            >
              {safeNotes === 0 ? (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  Empty input (0 notes): Loop condition was False immediately — ₹0 counted.
                </>
              ) : hitTargetEarly ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  Target ₹{safeTarget.toLocaleString('en-IN')} reached after {counted} notes ({remaining} notes left uncounted).
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  All {counted} notes counted! Total accumulated: ₹{total.toLocaleString('en-IN')}.
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </SimulatorShell>
  );
};
