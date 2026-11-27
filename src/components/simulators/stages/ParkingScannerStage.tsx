import React, { useState, useMemo, Suspense, lazy } from 'react';
import { Car, CheckCircle2, Ban, Search, Loader2 } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';
import { scaleAnimationMs } from '../AnimationSpeedController';

const ParkingScanner3D = lazy(() => import('./ParkingScanner3D'));

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

type SlotStatus = 'Occupied' | 'Available';

const DEFAULT_SLOTS: SlotStatus[] = [
  'Occupied',
  'Occupied',
  'Available',
  'Occupied',
  'Available',
  'Occupied',
  'Available',
  'Occupied',
];

export const ParkingScannerStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [slots, setSlots] = useState<SlotStatus[]>(DEFAULT_SLOTS);
  const [loopStyle, setLoopStyle] = useState<'for' | 'while'>('for');

  const slotsLiteral = `[${slots.map((s) => `"${s}"`).join(', ')}]`;

  const code = useMemo(() => {
    if (loopStyle === 'for') {
      return [
        `slots = ${slotsLiteral}`,
        `found_slot = -1`,
        `for i in range(len(slots)):`,
        `    status = slots[i]`,
        `    if status == "Occupied":`,
        `        print("Slot", i + 1, "occupied -> continue")`,
        `        continue`,
        `    found_slot = i + 1`,
        `    print("Slot", found_slot, "available -> break!")`,
        `    break`,
        `if found_slot == -1:`,
        `    print("Parking lot is FULL!")`,
      ].join('\n');
    }
    return [
      `slots = ${slotsLiteral}`,
      `i = 0`,
      `found_slot = -1`,
      `while i < len(slots):`,
      `    status = slots[i]`,
      `    if status == "Occupied":`,
      `        print("Slot", i + 1, "occupied -> continue")`,
      `        i = i + 1`,
      `        continue`,
      `    found_slot = i + 1`,
      `    print("Slot", found_slot, "available -> break!")`,
      `    break`,
      `if found_slot == -1:`,
      `    print("Parking lot is FULL!")`,
    ].join('\n');
  }, [slotsLiteral, loopStyle]);

  const runner = useSimulatorRunner(code);

  const rawIdx = runner.activeStep?.variables.i;
  const activeScanIndex = typeof rawIdx === 'number' ? rawIdx : -1;
  const foundSlot = Number(runner.activeStep?.variables.found_slot ?? -1);
  const isFullResult =
    runner.stepIndex >= runner.steps.length &&
    runner.steps.length > 0 &&
    foundSlot === -1;

  // Track which slots have already been skipped via continue up to current stepIndex
  const skippedIndices = useMemo(() => {
    const set = new Set<number>();
    for (let s = 0; s < runner.stepIndex; s++) {
      const st = runner.steps[s];
      if (st?.kind === 'continue' && typeof st.variables.i === 'number') {
        // In while mode, i was incremented just before continue; in for mode, i is current index
        const idx = loopStyle === 'while' ? st.variables.i - 1 : st.variables.i;
        if (idx >= 0) set.add(idx);
      }
    }
    return set;
  }, [runner.stepIndex, runner.steps, loopStyle]);

  const toggleSlot = (idx: number) => {
    setSlots((prev) =>
      prev.map((val, i) => (i === idx ? (val === 'Occupied' ? 'Available' : 'Occupied') : val))
    );
    runner.reset();
  };

  const applyPreset = (next: SlotStatus[]) => {
    setSlots(next);
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
      initialVariables={{ slots, found_slot: -1 }}
      initialExplanation='Click any parking bay to toggle Occupied/Available, choose for or while mode, and press Play to watch continue skip full bays and break stop at the first free bay.'
      scene3D={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
                3D Interactive Parking Lot
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#9a8585]">
                Top-down drone scanner tracks active bay iteration. Free slot halts via break.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2.5 py-1 text-xs font-mono font-bold text-sky-700 dark:text-sky-300">
                Scanning: {activeScanIndex >= 0 ? `Slot ${activeScanIndex + 1}` : 'Idle'}
              </span>
              <span className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                Found: {foundSlot > 0 ? `Slot ${foundSlot}` : 'None'}
              </span>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex h-[380px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#100303] text-slate-300">
                <Loader2 className="h-8 w-8 animate-spin text-[#E10906]" />
                <span className="text-xs font-medium">Loading 3D Parking Scene...</span>
              </div>
            }
          >
            <ParkingScanner3D
              slots={slots}
              activeScanIndex={activeScanIndex}
              foundSlot={foundSlot}
            />
          </Suspense>

          {/* Quick Slot Toggle Bar under 3D */}
          <div className="rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-slate-50 dark:bg-[#120404] p-3">
            <span className="block text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585] mb-2">
              Toggle Bays (Click to switch Occupied / Available):
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {slots.map((st, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleSlot(i)}
                  className={`rounded-lg py-1.5 px-1 text-center font-mono text-[10px] font-bold border transition-all ${
                    st === 'Occupied'
                      ? 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  S{i + 1}: {st === 'Occupied' ? '🚗 Full' : '🟢 Free'}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Top-View Parking Lot (Click Any Bay to Toggle)
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9a8585]">
              Scanner inspects slots 1–8 sequentially using <code className="font-mono text-sky-700 dark:text-sky-300">continue</code> &amp; <code className="font-mono text-violet-700 dark:text-violet-300">break</code>.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] p-1 gap-1">
            {(['for', 'while'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setLoopStyle(mode);
                  runner.reset();
                }}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  loopStyle === mode
                    ? 'bg-gradient-to-r from-[#E10906] to-[#8B5CF6] text-white shadow-xs'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#1E293B]'
                }`}
              >
                {mode} loop
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset(DEFAULT_SLOTS)}
              className="rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-sky-300"
            >
              Default Lot
            </button>
            <button
              type="button"
              onClick={() => applyPreset(Array(8).fill('Occupied'))}
              className="rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-rose-300"
            >
              All Occupied (Edge Case)
            </button>
            <button
              type="button"
              onClick={() =>
                applyPreset([
                  'Available',
                  'Occupied',
                  'Occupied',
                  'Available',
                  'Occupied',
                  'Occupied',
                  'Occupied',
                  'Occupied',
                ])
              }
              className="rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-emerald-300"
            >
              Slot 1 Free
            </button>
          </div>

          <div className="text-xs font-semibold">
            {foundSlot > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Found Available: Slot {foundSlot} (break!)
              </span>
            ) : isFullResult ? (
              <span className="inline-flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
                <Ban className="h-4 w-4" aria-hidden="true" />
                Parking Lot Full (0 Available)
              </span>
            ) : activeScanIndex >= 0 ? (
              <span className="inline-flex items-center gap-1.5 text-sky-700 dark:text-sky-300">
                <Search className="h-4 w-4" aria-hidden="true" />
                Scanning Slot {activeScanIndex + 1}...
              </span>
            ) : (
              <span className="text-slate-500 dark:text-[#9a8585]">Ready to scan</span>
            )}
          </div>
        </div>

        {/* Top-View Parking Area Grid */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-[#1E293B] p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slots.map((status, idx) => {
              const slotNum = idx + 1;
              const isScanning =
                activeScanIndex === idx &&
                foundSlot === -1 &&
                runner.stepIndex < runner.steps.length;
              const isWinner = foundSlot === slotNum;
              const wasSkipped = skippedIndices.has(idx);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleSlot(idx)}
                  style={{ transitionDuration: `${scaleAnimationMs(240, runner.speedMs)}ms` }}
                  className={`relative flex min-h-[112px] flex-col items-center justify-between rounded-xl border-2 p-3 text-center transition-all ${
                    isWinner
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/400/20 shadow-md shadow-emerald-500/20'
                      : isScanning
                      ? 'border-sky-400 bg-sky-50 dark:bg-sky-950/400/20 ring-2 ring-violet-400/50'
                      : status === 'Occupied'
                      ? 'border-slate-600 bg-[#190909]/90 hover:border-slate-500'
                      : 'border-emerald-500/50 bg-emerald-950/30 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex w-full items-center justify-between font-mono text-[11px] font-bold">
                    <span className="text-slate-300">P{slotNum}</span>
                    {isWinner ? (
                      <span className="text-emerald-300">BREAK</span>
                    ) : isScanning ? (
                      <span className="text-sky-300">SCAN</span>
                    ) : wasSkipped ? (
                      <span className="text-amber-300">SKIPPED</span>
                    ) : null}
                  </div>

                  {status === 'Occupied' ? (
                    <Car className="h-8 w-8 text-rose-400" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
                  )}

                  <span
                    className={`font-mono text-[11px] font-semibold ${
                      status === 'Occupied' ? 'text-rose-300' : 'text-emerald-300'
                    }`}
                  >
                    {status}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-center font-mono text-[11px] text-slate-400">
            DRIVE LANE · Click any bay above to toggle Occupied / Available
          </p>
        </div>
      </div>
    </SimulatorShell>
  );
};
