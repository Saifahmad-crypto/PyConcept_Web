import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Pause, Box } from 'lucide-react';
import {
  AnimationSpeedController,
  BASE_STEP_MS,
  scaleAnimationMs,
} from './simulators/AnimationSpeedController';

/**
 * 1. Interactive Variable Memory Box & Type Inspector (Topic: Python Basics)
 */
export const VariableBoxVisualizer: React.FC = () => {
  const [preset, setPreset] = useState<'int' | 'float' | 'str' | 'bool'>('int');
  const [customText, setCustomText] = useState('18');

  const handleSelectPreset = (kind: 'int' | 'float' | 'str' | 'bool') => {
    setPreset(kind);
    if (kind === 'int') setCustomText('18');
    if (kind === 'float') setCustomText('94.5');
    if (kind === 'str') setCustomText('"PyVerse"');
    if (kind === 'bool') setCustomText('True');
  };

  const detectType = (raw: string): { typeName: string; color: string; hint: string } => {
    const trimmed = raw.trim();
    if (trimmed === 'True' || trimmed === 'False') {
      return {
        typeName: 'bool',
        color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
        hint: 'Boolean flag — only True or False (always capitalized).',
      };
    }
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length >= 2) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'") && trimmed.length >= 2)
    ) {
      return {
        typeName: 'str',
        color: 'text-violet-700 border-violet-200 bg-violet-50',
        hint: 'String — text wrapped inside matching quotes.',
      };
    }
    if (/^-?\d+$/.test(trimmed)) {
      return {
        typeName: 'int',
        color: 'text-sky-700 border-sky-200 bg-sky-50',
        hint: 'Integer — whole number without a decimal point.',
      };
    }
    if (/^-?\d+\.\d+$/.test(trimmed)) {
      return {
        typeName: 'float',
        color: 'text-indigo-700 border-indigo-200 bg-indigo-50',
        hint: 'Float — number with a decimal point.',
      };
    }
    return {
      typeName: 'Syntax check',
      color: 'text-amber-700 border-amber-200 bg-amber-50',
      hint: 'Wrap text in quotes like "Maya", or type a number / True / False.',
    };
  };

  const detected = detectType(customText);

  return (
    <div className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-[#F0F9FF] to-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-bold text-[#1E293B]">
            Interactive Variable Memory Box
          </p>
          <p className="text-xs text-[#64748B]">
            Click a type or type any Python literal to see how Python labels the box.
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          {(['int', 'float', 'str', 'bool'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleSelectPreset(k)}
              className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-all ${
                preset === k
                  ? 'bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 items-center gap-5 md:grid-cols-12">
        <div className="space-y-2 md:col-span-5">
          <label
            htmlFor="var-box-input"
            className="block text-xs font-semibold text-[#1E293B]"
          >
            Assign <code className="font-mono text-[#2563EB]">my_var =</code>
          </label>
          <input
            id="var-box-input"
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-[#1E293B] focus:border-[#2563EB] focus:outline-none"
          />
          <pre className="rounded-xl bg-[#0F172A] p-3 font-mono text-xs text-slate-200">
            my_var = {customText || '...'}
            {'\n'}
            <span className="text-sky-300">print</span>(type(my_var))  # &lt;class &apos;{detected.typeName}&apos;&gt;
          </pre>
        </div>

        {/* Visual Memory Box */}
        <div className="flex flex-col items-center justify-center md:col-span-7">
          <div className="w-full max-w-sm rounded-2xl border-2 border-dashed border-sky-300 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-mono font-bold text-[#2563EB]">
                <Box className="h-3.5 w-3.5" aria-hidden="true" />
                Label: my_var
              </span>
              <span className={`rounded-lg border px-2 py-0.5 font-mono text-[11px] font-bold ${detected.color}`}>
                {detected.typeName}
              </span>
            </div>
            <div className="mt-3 rounded-xl bg-[#F8FAFC] py-4 text-center font-mono text-xl font-extrabold text-[#1E293B]">
              {customText || '(empty)'}
            </div>
            <p className="mt-2.5 text-center text-xs text-[#64748B]">{detected.hint}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Interactive Comparison Balance Scale SVG (Topic: Conditionals)
 */
interface ComparisonScaleProps {
  leftVal: number;
  rightVal: number;
}

export const ComparisonScaleSVG: React.FC<ComparisonScaleProps> = ({
  leftVal,
  rightVal,
}) => {
  const diff = leftVal - rightVal;
  const tiltDeg = Math.max(-14, Math.min(14, -diff * 0.6));
  const relation =
    leftVal > rightVal
      ? `${leftVal} > ${rightVal} (True)`
      : leftVal < rightVal
      ? `${leftVal} < ${rightVal} (True)`
      : `${leftVal} == ${rightVal} (Balanced!)`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-display font-bold text-[#1E293B]">
          Comparison Balance Scale
        </span>
        <span className="font-mono font-bold text-[#2563EB] tabular-nums">
          {relation}
        </span>
      </div>

      <svg
        viewBox="0 0 320 135"
        className="mx-auto mt-2 h-auto w-full max-w-[320px]"
        role="img"
        aria-label={`Comparison scale between ${leftVal} and ${rightVal}`}
      >
        {/* Base */}
        <path d="M 120 124 L 200 124 L 160 95 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="160" y1="36" x2="160" y2="98" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />

        {/* Tilting Beam Group */}
        <g transform={`rotate(${tiltDeg} 160 40)`} className="transition-transform duration-300">
          <line x1="56" y1="40" x2="264" y2="40" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
          {/* Left Pan */}
          <line x1="68" y1="40" x2="68" y2="66" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="34" y="66" width="68" height="32" rx="8" fill="#EFF6FF" stroke="#38BDF8" strokeWidth="2" />
          <text x="68" y="86" textAnchor="middle" className="fill-[#1E293B] font-mono text-[12px] font-bold">
            a = {leftVal}
          </text>

          {/* Right Pan */}
          <line x1="252" y1="40" x2="252" y2="66" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="218" y="66" width="68" height="32" rx="8" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="2" />
          <text x="252" y="86" textAnchor="middle" className="fill-[#1E293B] font-mono text-[12px] font-bold">
            b = {rightVal}
          </text>
        </g>

        <circle cx="160" cy="40" r="5" fill="#2563EB" />
      </svg>
    </div>
  );
};

/**
 * 3. Interactive Loop Execution Timeline Stepper (Topic: Loops)
 */
export const LoopTimelineStepper: React.FC = () => {
  const [maxN, setMaxN] = useState(5);
  const [stepIndex, setStepIndex] = useState(0); // 0 .. maxN
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(BASE_STEP_MS);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= maxN) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);
    return () => clearInterval(timer);
  }, [playing, maxN, speedMs]);

  const iterations = Array.from({ length: maxN }, (_, idx) => idx + 1);
  const runningTotal = iterations
    .slice(0, stepIndex)
    .reduce((acc, v) => acc + v, 0);

  return (
    <div className="rounded-2xl border border-violet-200/80 bg-gradient-to-br from-[#F5F3FF]/70 via-white to-[#F0F9FF] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-bold text-[#1E293B]">
            Loop Iteration Timeline &amp; Accumulator Tracker
          </p>
          <p className="text-xs text-[#64748B]">
            Watch <code className="font-mono text-[#8B5CF6]">total += i</code> accumulate step by step.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-medium text-[#1E293B]">
            Passes:
            <select
              value={maxN}
              onChange={(e) => {
                setPlaying(false);
                setMaxN(Number(e.target.value));
                setStepIndex(0);
              }}
              className="ml-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1 font-mono text-xs font-semibold"
            >
              {[3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  1..{n}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              if (stepIndex >= maxN) setStepIndex(0);
              setPlaying((p) => !p);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] px-3 py-1.5 text-xs font-semibold text-white"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'Pause' : stepIndex >= maxN ? 'Replay' : 'Play'}
          </button>

          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStepIndex((s) => Math.min(maxN, s + 1));
            }}
            disabled={stepIndex >= maxN}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1E293B] disabled:opacity-40"
          >
            Next Pass
          </button>

          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStepIndex(0);
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-[#64748B]"
            aria-label="Reset loop timeline"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Timeline Track */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="rounded-xl bg-[#0F172A] p-3.5 font-mono text-xs text-slate-200 md:col-span-4">
          <div className={stepIndex === 0 ? 'text-sky-300 font-bold' : ''}>total = 0</div>
          <div>
            <span className="text-violet-300">for</span> i{' '}
            <span className="text-violet-300">in</span>{' '}
            <span className="text-sky-300">range</span>(1, {maxN + 1}):
          </div>
          <div className={`pl-4 ${stepIndex > 0 && stepIndex <= maxN ? 'text-emerald-300 font-bold' : ''}`}>
            total += i
          </div>
          <div className="mt-2 border-t border-slate-800 pt-2 text-[11px] text-slate-400">
            Current: <span className="text-white font-bold">total = {runningTotal}</span>
            {stepIndex > 0 && (
              <span className="ml-2 text-violet-300">(i = {stepIndex})</span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 md:col-span-8">
          <AnimationSpeedController
            speedMs={speedMs}
            onChangeSpeedMs={setSpeedMs}
            compact
          />

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {iterations.map((n, idx) => {
              const active = idx + 1 === stepIndex;
              const completed = idx + 1 < stepIndex;
              const partialSum = (n * (n + 1)) / 2;
              return (
                <div
                  key={n}
                  style={{ transitionDuration: `${scaleAnimationMs(240, speedMs)}ms` }}
                  className={`rounded-xl border p-2.5 text-center font-mono transition-all ${
                    active
                      ? 'border-violet-500 bg-gradient-to-br from-[#2563EB] to-[#8B5CF6] text-white shadow-md scale-[1.03]'
                      : completed
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  <div className="text-[10px]">i = {n}</div>
                  <div className="mt-0.5 text-xs font-bold tabular-nums">
                    {idx + 1 <= stepIndex ? `sum=${partialSum}` : 'waiting'}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#64748B]">
            {stepIndex === 0
              ? 'Click Play or Next Pass to trace each iteration.'
              : stepIndex < maxN
              ? `Iteration ${stepIndex}: added ${stepIndex} to total → running total is ${runningTotal}.`
              : `Loop complete after ${maxN} passes! Final total = ${runningTotal}.`}
          </p>
        </div>
      </div>
    </div>
  );
};
