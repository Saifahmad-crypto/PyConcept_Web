import React, { useState, useMemo } from 'react';
import { Banknote, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

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
      ? 'border-violet-400 bg-violet-50 text-violet-900'
      : denomination === 200
      ? 'border-amber-400 bg-amber-50 text-amber-900'
      : 'border-sky-400 bg-[#F0F9FF] text-sky-900';

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
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Educational Cash Counting Machine
            </h2>
            <p className="text-xs text-slate-500">
              Sample currency denominations for practicing loop counters &amp; accumulation.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-[#F8FAFC] p-1 gap-1">
            {(['while', 'for'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => resetWith(() => setLoopMode(m))}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  loopMode === m
                    ? 'bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1E293B]'
                }`}
              >
                {m} loop
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Row */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
            <span className="block text-xs font-semibold text-slate-600 mb-2">
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
                      ? 'border-sky-500 bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-[#1E293B] hover:border-sky-300'
                  }`}
                >
                  ₹{d}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
            <label htmlFor="cash-notes" className="block text-xs font-semibold text-slate-600">
              Number of Notes (0–20)
            </label>
            <input
              id="cash-notes"
              type="number"
              min={0}
              max={20}
              value={numNotes}
              onChange={(e) => resetWith(() => setNumNotes(Number(e.target.value)))}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm font-bold text-[#1E293B] tabular-nums focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
            <label htmlFor="cash-target" className="block text-xs font-semibold text-slate-600">
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
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-sm font-bold text-[#1E293B] tabular-nums focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Cash Counter Machine Visual */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] p-5 space-y-4">
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
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600">
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

            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-3.5 text-center">
              <span className="text-xs font-semibold text-slate-600">Optical Counter</span>
              <div
                className={`mt-2 flex h-12 w-24 items-center justify-center rounded-xl border-2 font-mono text-sm font-extrabold transition-all ${
                  runner.activeStep?.kind === 'assign' &&
                  runner.activeStep.codeLine.includes('total = total')
                    ? `${noteColors} scale-105 shadow-sm`
                    : 'border-dashed border-slate-300 bg-slate-50 text-slate-400'
                }`}
              >
                <Banknote className="mr-1 h-4 w-4" aria-hidden="true" />₹{denomination}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center">
              <span className="text-xs font-semibold text-slate-600">Counted Stack</span>
              <p className="mt-2 font-mono text-xl font-bold text-emerald-700 tabular-nums">
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
                  ? 'border-amber-200 bg-amber-50 text-amber-900'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-900'
              }`}
            >
              {safeNotes === 0 ? (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                  Empty input (0 notes): Loop condition was False immediately — ₹0 counted.
                </>
              ) : hitTargetEarly ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  Target ₹{safeTarget.toLocaleString('en-IN')} reached after {counted} notes ({remaining} notes left uncounted).
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
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
