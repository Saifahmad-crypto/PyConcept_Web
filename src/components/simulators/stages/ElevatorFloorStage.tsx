import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Minus, Building2 } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

type DirectionMode = 'auto' | 'up' | 'down';

const FLOORS = [7, 6, 5, 4, 3, 2, 1, 0];

export const ElevatorFloorStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [startFloor, setStartFloor] = useState<number>(1);
  const [targetFloor, setTargetFloor] = useState<number>(5);
  const [direction, setDirection] = useState<DirectionMode>('auto');

  const computedStep =
    direction === 'up' ? 1 : direction === 'down' ? -1 : targetFloor >= startFloor ? 1 : -1;

  const code = useMemo(() => {
    return [
      `start = ${startFloor}`,
      `destination = ${targetFloor}`,
      `step = ${computedStep}`,
      `if start == destination:`,
      `    print("Already on floor", start)`,
      `else:`,
      `    for floor in range(start, destination + step, step):`,
      `        print("Elevator at floor", floor)`,
      `    print("Arrived at floor", destination)`,
    ].join('\n');
  }, [startFloor, targetFloor, computedStep]);

  const runner = useSimulatorRunner(code);

  const currentFloor = Number(
    runner.activeStep?.variables.floor ?? startFloor
  );
  const activePass = runner.activeStep?.loopVar?.iteration ?? 0;

  const handleResettingChange = (fn: () => void) => {
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
      initialVariables={{ start: startFloor, destination: targetFloor, step: computedStep }}
      initialExplanation='Choose starting and destination floors, then press Play or Next Step to watch range() step the elevator one floor per iteration.'
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Building Elevator Shaft (Floors 0–7)
            </h2>
            <p className="text-xs text-slate-500">
              Watch how <code className="font-mono text-sky-700">range(start, stop, step)</code> generates each floor.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              handleResettingChange(() => {
                setStartFloor(3);
                setTargetFloor(3);
                setDirection('auto');
              })
            }
            className="rounded-lg border border-slate-200 bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-sky-300"
          >
            Test Same Floor (3 → 3)
          </button>
        </div>

        {/* Building Shaft + Control Panel */}
        <div className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] p-4 sm:grid-cols-12">
          {/* Elevator Shaft */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:col-span-7">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#1E293B]">
                <Building2 className="h-4 w-4 text-sky-600" aria-hidden="true" />
                Live Shaft View
              </span>
              <span className="inline-flex items-center gap-1 font-mono font-bold text-violet-700 tabular-nums">
                {startFloor === targetFloor ? (
                  <>
                    <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    Stationary
                  </>
                ) : computedStep > 0 ? (
                  <>
                    <ArrowUp className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />
                    Going Up
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3.5 w-3.5 text-violet-600" aria-hidden="true" />
                    Going Down
                  </>
                )}
              </span>
            </div>

            <div className="relative space-y-1.5 rounded-xl border border-slate-200 bg-[#F8FAFC] p-3">
              {FLOORS.map((f) => {
                const isCabinHere = currentFloor === f;
                const isDest = targetFloor === f;
                const isStart = startFloor === f;
                return (
                  <div
                    key={f}
                    className={`flex h-9 items-center justify-between rounded-lg border px-3 transition-all duration-300 ${
                      isCabinHere
                        ? 'border-sky-400 bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-sm'
                        : isDest
                        ? 'border-violet-300 bg-violet-50 text-violet-900'
                        : 'border-slate-200/70 bg-white text-slate-600'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold tabular-nums">
                      Floor {f}
                    </span>

                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      {isStart && !isCabinHere && (
                        <span className="text-slate-500">Start</span>
                      )}
                      {isDest && !isCabinHere && (
                        <span className="font-semibold text-violet-700">Target</span>
                      )}
                      {isCabinHere && (
                        <span className="font-bold">
                          CABIN HERE{activePass > 0 ? ` · iter #${activePass}` : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Floor Selectors & Readout */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:col-span-5">
            <div className="rounded-xl bg-[#0F172A] p-4 text-center text-white">
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Current Floor
              </span>
              <p className="mt-1 font-mono text-4xl font-extrabold text-sky-300 tabular-nums">
                {currentFloor}
              </p>
            </div>

            <div>
              <label htmlFor="elev-start" className="block text-xs font-semibold text-slate-600">
                Starting Floor: <span className="font-mono text-[#1E293B]">{startFloor}</span>
              </label>
              <select
                id="elev-start"
                value={startFloor}
                onChange={(e) =>
                  handleResettingChange(() => setStartFloor(Number(e.target.value)))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs font-semibold text-[#1E293B] focus:border-sky-500 focus:outline-none"
              >
                {FLOORS.slice().reverse().map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="elev-dest" className="block text-xs font-semibold text-slate-600">
                Destination Floor: <span className="font-mono text-[#1E293B]">{targetFloor}</span>
              </label>
              <select
                id="elev-dest"
                value={targetFloor}
                onChange={(e) =>
                  handleResettingChange(() => setTargetFloor(Number(e.target.value)))
                }
                className="mt-1 w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 font-mono text-xs font-semibold text-[#1E293B] focus:border-sky-500 focus:outline-none"
              >
                {FLOORS.slice().reverse().map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-600 mb-1.5">
                Step Direction
              </span>
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-[#F8FAFC] p-1">
                {(
                  [
                    { id: 'auto', label: 'Auto' },
                    { id: 'up', label: 'Up (+1)' },
                    { id: 'down', label: 'Down (-1)' },
                  ] as Array<{ id: DirectionMode; label: string }>
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleResettingChange(() => setDirection(d.id))}
                    className={`rounded-lg py-1.5 text-[11px] font-semibold transition-all ${
                      direction === d.id
                        ? 'bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#1E293B]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
