import React, { useState, useMemo, useEffect } from 'react';
import { Fan, Snowflake, Thermometer, Power } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';
import { scaleAnimationMs } from '../AnimationSpeedController';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const SmartAcStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [temperature, setTemperature] = useState<number>(31);

  const code = useMemo(
    () =>
      [
        `temperature = ${temperature}`,
        `threshold = 28`,
        `is_hot = temperature > threshold`,
        `if is_hot:`,
        `    ac_status = "ON"`,
        `    print("Room is warm -> AC switched ON")`,
        `else:`,
        `    ac_status = "OFF"`,
        `    print("Temp <= 28C -> AC stays OFF")`,
      ].join('\n'),
    [temperature]
  );

  const runner = useSimulatorRunner(code);

  // Sync reactive slider changes immediately to evaluated state while still letting Play/Reset step line-by-line
  const [reactiveMode, setReactiveMode] = useState(true);
  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  const currentAcStatus = String(
    runner.activeStep?.variables.ac_status ?? (temperature > 28 ? 'ON' : 'OFF')
  );
  const currentIsHot = runner.activeStep?.variables.is_hot;
  const acRunning = currentAcStatus === 'ON';

  const handleSliderChange = (nextTemp: number) => {
    setReactiveMode(true);
    setTemperature(nextTemp);
  };

  const thermometerPct = Math.round(((temperature - 16) / (40 - 16)) * 100);
  const thresholdPct = Math.round(((28 - 16) / (40 - 16)) * 100);

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
      initialVariables={{ temperature, threshold: 28 }}
      initialExplanation='Move the room temperature slider or press Reset + Play to watch Python evaluate whether temperature > 28.'
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Smart Climate Room
            </h2>
            <p className="text-xs text-slate-500">
              AC activates only when temperature is strictly greater than 28°C.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '22°C Cool', val: 22 },
              { label: '28°C Boundary', val: 28 },
              { label: '34°C Warm', val: 34 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => handleSliderChange(preset.val)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  temperature === preset.val
                    ? 'border-sky-400 bg-[#F0F9FF] text-sky-700'
                    : 'border-slate-200 bg-[#F8FAFC] text-slate-600 hover:border-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Smart Room */}
        <div className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] p-5 sm:grid-cols-12">
          {/* AC Unit + Room Status */}
          <div className="space-y-4 sm:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      acRunning
                        ? 'bg-gradient-to-br from-[#0EA5E9] to-[#8B5CF6] text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Fan
                      className={`h-5 w-5 ${acRunning ? 'animate-spin' : ''}`}
                      style={
                        acRunning
                          ? { animationDuration: `${scaleAnimationMs(1100, runner.speedMs)}ms` }
                          : undefined
                      }
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">SMART AC UNIT</p>
                    <p className="font-display text-base font-bold text-[#1E293B]">
                      {acRunning ? 'AC ON · Cooling Active' : 'AC OFF · Standby'}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold ${
                    acRunning
                      ? 'border-sky-200 bg-[#F0F9FF] text-sky-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <Power className="h-3.5 w-3.5" aria-hidden="true" />
                  {currentAcStatus}
                </span>
              </div>

              {/* Airflow Visualization */}
              <div className="mt-5 rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Snowflake
                      className={`h-4 w-4 ${acRunning ? 'text-sky-500' : 'text-slate-400'}`}
                      aria-hidden="true"
                    />
                    {acRunning
                      ? 'Cool airflow circulating into room'
                      : 'Vents closed — ambient room air'}
                  </span>
                  <span className="font-mono font-semibold text-[#1E293B]">
                    is_hot = {currentIsHot === undefined ? String(temperature > 28) : currentIsHot ? 'True' : 'False'}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((bar) => (
                    <div
                      key={bar}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        acRunning
                          ? 'bg-gradient-to-r from-[#38BDF8] to-[#8B5CF6] animate-pulse'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Labeled Temperature Slider */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="ac-temp-slider" className="font-semibold text-[#1E293B]">
                  Room Temperature: <span className="font-mono text-sky-700 tabular-nums">{temperature}°C</span>
                </label>
                <span className="font-mono text-slate-500">Range: 16°C – 40°C</span>
              </div>
              <input
                id="ac-temp-slider"
                type="range"
                min={16}
                max={40}
                step={1}
                value={temperature}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="mt-3 w-full accent-[#0EA5E9] cursor-pointer"
              />
              <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-500">
                <span>16°C Cool</span>
                <span className="font-semibold text-violet-700">28°C Cutoff</span>
                <span>40°C Hot</span>
              </div>
            </div>
          </div>

          {/* Live Thermometer Column */}
          <div className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:col-span-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Thermometer className="h-4 w-4 text-rose-500" aria-hidden="true" />
              Thermometer
            </div>

            <div className="relative my-3 flex h-44 w-12 items-end justify-center rounded-full border-2 border-slate-200 bg-slate-100 p-1.5">
              {/* 28°C Threshold Marker */}
              <div
                className="absolute inset-x-0 border-t-2 border-dashed border-violet-500 z-10"
                style={{ bottom: `${thresholdPct}%` }}
                title="28°C Threshold"
              />
              <div
                className={`w-full rounded-full transition-all ${
                  temperature > 28
                    ? 'bg-gradient-to-t from-amber-500 to-rose-500'
                    : 'bg-gradient-to-t from-[#0EA5E9] to-[#38BDF8]'
                }`}
                style={{
                  height: `${Math.max(10, thermometerPct)}%`,
                  transitionDuration: `${scaleAnimationMs(300, runner.speedMs)}ms`,
                }}
              />
            </div>

            <div className="text-center">
              <p className="font-mono text-2xl font-extrabold text-[#1E293B] tabular-nums">
                {temperature}°C
              </p>
              <p className="text-[11px] font-medium text-slate-500">
                {temperature > 28 ? 'Above 28°C' : temperature === 28 ? 'Exactly 28°C (<= 28)' : '28°C or below'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
