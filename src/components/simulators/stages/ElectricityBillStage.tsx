import React, { useState, useMemo, useEffect } from 'react';
import { Zap, IndianRupee, Layers, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const ElectricityBillStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [units, setUnits] = useState<number>(240);

  const code = useMemo(
    () =>
      [
        `units = ${units}`,
        `fixed_charge = 50`,
        `if units <= 100:`,
        `    rate_per_unit = 3.0`,
        `    energy_charge = units * rate_per_unit`,
        `    slab = "Slab 1 (0-100 units @ Rs 3.0)"`,
        `elif units <= 200:`,
        `    rate_per_unit = 4.5`,
        `    energy_charge = (100 * 3.0) + ((units - 100) * 4.5)`,
        `    slab = "Slab 2 (101-200 units @ Rs 4.5)"`,
        `elif units <= 300:`,
        `    rate_per_unit = 6.0`,
        `    energy_charge = (100 * 3.0) + (100 * 4.5) + ((units - 200) * 6.0)`,
        `    slab = "Slab 3 (201-300 units @ Rs 6.0)"`,
        `else:`,
        `    rate_per_unit = 8.0`,
        `    energy_charge = (100 * 3.0) + (100 * 4.5) + (100 * 6.0) + ((units - 300) * 8.0)`,
        `    slab = "Slab 4 (301+ units @ Rs 8.0)"`,
        `total_bill = energy_charge + fixed_charge`,
        `print(f"Total Bill for {units} units: Rs {total_bill} (incl Rs {fixed_charge} fixed)")`,
      ].join('\n'),
    [units]
  );

  const runner = useSimulatorRunner(code);

  const [reactiveMode, setReactiveMode] = useState(true);
  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  // Compute live estimates
  const computeBill = (u: number) => {
    const fixed = 50;
    let energy = 0;
    let s = '';
    if (u <= 100) {
      energy = u * 3.0;
      s = 'Slab 1 (0-100 units @ Rs 3.0)';
    } else if (u <= 200) {
      energy = 100 * 3.0 + (u - 100) * 4.5;
      s = 'Slab 2 (101-200 units @ Rs 4.5)';
    } else if (u <= 300) {
      energy = 100 * 3.0 + 100 * 4.5 + (u - 200) * 6.0;
      s = 'Slab 3 (201-300 units @ Rs 6.0)';
    } else {
      energy = 100 * 3.0 + 100 * 4.5 + 100 * 6.0 + (u - 300) * 8.0;
      s = 'Slab 4 (301+ units @ Rs 8.0)';
    }
    return { energy, total: energy + fixed, slab: s };
  };

  const currentEst = computeBill(units);
  const currentTotal = Number(runner.activeStep?.variables.total_bill ?? currentEst.total);
  const currentEnergy = Number(runner.activeStep?.variables.energy_charge ?? currentEst.energy);
  const currentSlab = String(runner.activeStep?.variables.slab ?? currentEst.slab);

  const handleSliderChange = (u: number) => {
    setReactiveMode(true);
    setUnits(u);
  };

  const slabs = [
    { name: 'Slab 1 (0 - 100)', rate: '₹3.0 / unit', condition: 'units <= 100', active: units <= 100 },
    { name: 'Slab 2 (101 - 200)', rate: '₹4.5 / unit', condition: 'units <= 200', active: units > 100 && units <= 200 },
    { name: 'Slab 3 (201 - 300)', rate: '₹6.0 / unit', condition: 'units <= 300', active: units > 200 && units <= 300 },
    { name: 'Slab 4 (301+)', rate: '₹8.0 / unit', condition: 'else (> 300)', active: units > 300 },
  ];

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
      initialVariables={{ units, fixed_charge: 50, energy_charge: currentEnergy, total_bill: currentTotal }}
      initialExplanation="Electricity units slider drag karo. Python if-elif-else chain se pata lagata hai ki kaunsa slab rate apply hoga aur cumulative bill calculate karta hai."
    >
      <div className="space-y-6">
        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
              Power Meter &amp; Tariff Slabs
            </h2>
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
              Real-world electricity companies progressive slabs use karti hain taaki kam consumption par bill sasta rahe.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Low (65 units)', val: 65 },
              { label: 'Moderate (150 units)', val: 150 },
              { label: 'Medium (240 units)', val: 240 },
              { label: 'Heavy AC (420 units)', val: 420 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => handleSliderChange(preset.val)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  units === preset.val
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-red-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Meter Units Slider */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-[#100303] dark:text-[#f0eaea] uppercase tracking-wider font-mono">
              <Zap className="w-4 h-4 text-amber-500 fill-current" />
              <span>Electricity Consumed: {units} Units (kWh)</span>
            </label>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              {units} kWh
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={600}
            step={5}
            value={units}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#8A8585] dark:text-[#9a8585]">
            <span>10 units (Slab 1)</span>
            <span>100 units</span>
            <span>200 units (Slab 2)</span>
            <span>300 units (Slab 3)</span>
            <span>600 units (Slab 4)</span>
          </div>
        </div>

        {/* Bill Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Total Bill Card */}
          <div className="md:col-span-5 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-gradient-to-br from-white via-white to-amber-50/20 dark:from-[#140404] dark:to-[#090101] p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-1">
              Final Electricity Bill
            </span>

            <div className="my-2 flex items-baseline gap-1 text-[#100303] dark:text-[#f0eaea]">
              <span className="text-2xl font-bold font-mono">₹</span>
              <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-red-600 dark:text-red-500">
                {currentTotal.toFixed(2)}
              </span>
            </div>

            <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {currentSlab}
            </p>

            <div className="w-full mt-4 pt-3 border-t border-[#E5DFDF]/60 dark:border-[#3a1a1a] text-[11px] font-mono text-stone-500 space-y-1">
              <div className="flex justify-between">
                <span>Energy Charges:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">₹{currentEnergy.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fixed Meter Rent:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">₹50.00</span>
              </div>
            </div>
          </div>

          {/* Slabs Progression Table */}
          <div className="md:col-span-7 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-2.5">
            <span className="text-xs font-bold uppercase font-mono tracking-wider text-stone-600 dark:text-stone-300 block pb-1 border-b border-[#E5DFDF]/60 dark:border-[#3a1a1a]">
              Tariff Slabs &amp; elif Conditions
            </span>

            <div className="space-y-2">
              {slabs.map((slab, idx) => (
                <div
                  key={slab.name}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition-all ${
                    slab.active
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold shadow-xs scale-[1.01]'
                      : 'border-stone-200 dark:border-[#2a1010] bg-stone-50/50 dark:bg-[#150707] text-[#8A8585] dark:text-[#9a8585]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        slab.active ? 'bg-amber-500 animate-pulse' : 'bg-stone-300 dark:bg-stone-700'
                      }`}
                    />
                    <div>
                      <p className="font-bold">{slab.name}</p>
                      <p className="text-[10px] text-stone-500 font-sans">{slab.condition}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold">{slab.rate}</span>
                    {slab.active && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">
                        Current Tier
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
