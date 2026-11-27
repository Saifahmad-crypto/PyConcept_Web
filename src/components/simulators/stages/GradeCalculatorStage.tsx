import React, { useState, useMemo, useEffect } from 'react';
import { Award, GraduationCap, CheckCircle2, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const GradeCalculatorStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [marks, setMarks] = useState<number>(85);

  const code = useMemo(
    () =>
      [
        `marks = ${marks}`,
        `if marks >= 90:`,
        `    grade = "A+"`,
        `    status = "Outstanding Performance!"`,
        `    print("Grade A+: Shandaar! Highest marks bracket")`,
        `elif marks >= 80:`,
        `    grade = "A"`,
        `    status = "Excellent Work!"`,
        `    print("Grade A: Bohat badiya! Great consistency")`,
        `elif marks >= 70:`,
        `    grade = "B"`,
        `    status = "Good Job!"`,
        `    print("Grade B: Achha score hai, thoda aur push karo")`,
        `elif marks >= 60:`,
        `    grade = "C"`,
        `    status = "Above Average"`,
        `    print("Grade C: Average se upar, concepts review karo")`,
        `elif marks >= 40:`,
        `    grade = "D"`,
        `    status = "Pass"`,
        `    print("Grade D: Passing marks mil gaye, practice badhao")`,
        `else:`,
        `    grade = "F"`,
        `    status = "Needs Improvement"`,
        `    print("Grade F: Repeat required, basics clear karo")`,
      ].join('\n'),
    [marks]
  );

  const runner = useSimulatorRunner(code);

  const [reactiveMode, setReactiveMode] = useState(true);
  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  const currentGrade = String(
    runner.activeStep?.variables.grade ??
      (marks >= 90
        ? 'A+'
        : marks >= 80
        ? 'A'
        : marks >= 70
        ? 'B'
        : marks >= 60
        ? 'C'
        : marks >= 40
        ? 'D'
        : 'F')
  );

  const currentStatus = String(
    runner.activeStep?.variables.status ??
      (marks >= 90
        ? 'Outstanding Performance!'
        : marks >= 80
        ? 'Excellent Work!'
        : marks >= 70
        ? 'Good Job!'
        : marks >= 60
        ? 'Above Average'
        : marks >= 40
        ? 'Pass'
        : 'Needs Improvement')
  );

  const handleSliderChange = (val: number) => {
    setReactiveMode(true);
    setMarks(val);
  };

  const getGradeColor = (g: string) => {
    switch (g) {
      case 'A+':
        return 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/30';
      case 'A':
        return 'text-green-500 border-green-500/40 bg-green-500/10 dark:bg-green-950/30';
      case 'B':
        return 'text-blue-500 border-blue-500/40 bg-blue-500/10 dark:bg-blue-950/30';
      case 'C':
        return 'text-amber-500 border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/30';
      case 'D':
        return 'text-orange-500 border-orange-500/40 bg-orange-500/10 dark:bg-orange-950/30';
      default:
        return 'text-red-500 border-red-500/40 bg-red-500/10 dark:bg-red-950/30';
    }
  };

  const gradeTiers = [
    { label: 'A+ (90-100)', min: 90, grade: 'A+' },
    { label: 'A (80-89)', min: 80, grade: 'A' },
    { label: 'B (70-79)', min: 70, grade: 'B' },
    { label: 'C (60-69)', min: 60, grade: 'C' },
    { label: 'D (40-59)', min: 40, grade: 'D' },
    { label: 'F (< 40)', min: 0, grade: 'F' },
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
      initialVariables={{ marks, grade: currentGrade, status: currentStatus }}
      initialExplanation="Marks slider adjust karo aur dekho kaise Python ka if-elif-else ladder top-to-bottom pehli matching condition execute karta hai."
    >
      <div className="space-y-6">
        {/* Preset Buttons & Slider Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
              Student Marks &amp; Report Card
            </h2>
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
              Python marks check karta hai: pehla true branch execute hota hai aur baki elif skip ho jaate hain.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Topper (95)', val: 95 },
              { label: 'Merit (82)', val: 82 },
              { label: 'Average (68)', val: 68 },
              { label: 'Borderline (42)', val: 42 },
              { label: 'Fail (32)', val: 32 },
            ].map((preset) => (
              <button
                key={preset.val}
                type="button"
                onClick={() => handleSliderChange(preset.val)}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  marks === preset.val
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-red-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Marks Slider Card */}
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-[#100303] dark:text-[#f0eaea] uppercase tracking-wider font-mono">
              <GraduationCap className="w-4 h-4 text-red-500" />
              <span>Marks Secured: {marks} / 100</span>
            </label>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              {marks}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={marks}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#8A8585] dark:text-[#9a8585]">
            <span>0 (Fail)</span>
            <span>40 (Pass Mark)</span>
            <span>70 (Grade B)</span>
            <span>90 (Grade A+)</span>
            <span>100 (Max)</span>
          </div>
        </div>

        {/* Visual Report Card + Slab Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Visual Grade Shield */}
          <div className="md:col-span-5 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-gradient-to-br from-white via-white to-red-50/20 dark:from-[#140404] dark:to-[#090101] p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
            
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-2">
              Assigned Grade
            </span>
            
            <div
              className={`w-24 h-24 rounded-3xl border-2 flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 ${getGradeColor(
                currentGrade
              )}`}
            >
              <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">
                {currentGrade}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <h3 className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                {currentStatus}
              </h3>
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585] font-mono">
                Evaluated at Line: {runner.activeStep?.line ?? 'Ready'}
              </p>
            </div>
          </div>

          {/* Conditional Ladder Flow & Tier Highlighting */}
          <div className="md:col-span-7 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#100303] p-5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5DFDF]/60 dark:border-[#3a1a1a]">
              <span className="text-xs font-bold uppercase font-mono tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-red-500" />
                <span>if-elif-else Ladder Hierarchy</span>
              </span>
              <span className="text-[10px] font-mono text-stone-500">First matching branch wins</span>
            </div>

            <div className="space-y-2">
              {gradeTiers.map((tier) => {
                const isActive = currentGrade === tier.grade;
                return (
                  <div
                    key={tier.grade}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-mono transition-all ${
                      isActive
                        ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-bold shadow-xs scale-[1.01]'
                        : 'border-[#E5DFDF]/50 dark:border-[#2a1010] bg-stone-50/50 dark:bg-[#150707] text-[#8A8585] dark:text-[#9a8585]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-red-500 animate-pulse' : 'bg-stone-300 dark:bg-stone-700'
                        }`}
                      />
                      <span>
                        {tier.min > 0 ? `marks >= ${tier.min}` : 'else (fail)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-sans font-medium text-[11px] opacity-80">{tier.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          isActive
                            ? 'bg-red-600 text-white'
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {tier.grade}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
