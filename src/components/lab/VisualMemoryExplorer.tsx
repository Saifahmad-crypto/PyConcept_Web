import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  ArrowRight,
  Info,
  AlertCircle,
} from 'lucide-react';
import { tracePythonCode, formatPyLiteral } from '../../utils/pythonEngine';
import {
  AnimationSpeedController,
  useSharedSimulatorSpeed,
} from '../simulators/AnimationSpeedController';

const MEMORY_PRESETS = [
  {
    id: 'basic-bind',
    label: '1. Names & Types',
    code: `x = 10\nname = "Alex"\nscore = 95\nready = True`,
  },
  {
    id: 'rebind',
    label: '2. Reassignment',
    code: `score = 40\nbonus = 15\nscore = score + bonus\nname = "Maya"`,
  },
  {
    id: 'aliasing',
    label: '3. Shared Reference',
    code: `a = 100\nb = a\na = 250\nsum_val = a + b`,
  },
];

function inferPyType(val: unknown): { typeName: string; tone: string } {
  if (typeof val === 'boolean') {
    return { typeName: 'bool', tone: 'border-emerald-300 bg-emerald-50 text-emerald-800' };
  }
  if (typeof val === 'number') {
    return Number.isInteger(val)
      ? { typeName: 'int', tone: 'border-sky-300 bg-sky-50 text-sky-800' }
      : { typeName: 'float', tone: 'border-indigo-300 bg-indigo-50 text-indigo-800' };
  }
  if (typeof val === 'string') {
    return { typeName: 'str', tone: 'border-violet-300 bg-violet-50 text-violet-800' };
  }
  if (Array.isArray(val)) {
    return { typeName: 'list', tone: 'border-amber-300 bg-amber-50 text-amber-800' };
  }
  return { typeName: 'object', tone: 'border-slate-300 bg-slate-50 text-slate-800' };
}

export const VisualMemoryExplorer: React.FC = () => {
  const [code, setCode] = useState(MEMORY_PRESETS[0].code);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { speedMs, setSpeedMs } = useSharedSimulatorSpeed();
  const trace = useMemo(() => tracePythonCode(code), [code]);
  const steps = trace.steps;

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [code]);

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIndex((prev) => Math.min(prev + 1, steps.length));
    }, speedMs);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length, speedMs]);

  const activeStep = stepIndex > 0 && stepIndex <= steps.length ? steps[stepIndex - 1] : null;
  const prevStep = stepIndex > 1 && stepIndex <= steps.length ? steps[stepIndex - 2] : null;
  const currentVars = activeStep ? activeStep.variables : {};

  // Group variable names pointing to identical immutable literal values to illustrate Python name->object reference sharing
  const groupedObjects = useMemo(() => {
    const groups = new Map<
      string,
      { key: string; formatted: string; raw: unknown; names: string[] }
    >();
    Object.entries(currentVars).forEach(([varName, val]) => {
      const formatted = formatPyLiteral(val as never);
      const key = `${typeof val}:${formatted}`;
      const existing = groups.get(key);
      if (existing) {
        existing.names.push(varName);
      } else {
        groups.set(key, { key, formatted, raw: val, names: [varName] });
      }
    });
    return Array.from(groups.values());
  }, [currentVars]);

  const codeLines = code.split('\n');

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold text-[#2563EB]">Visual Learning Tool</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E293B]">
            Visual Memory Explorer (Names &amp; Object References)
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#64748B]">
            Step through Python assignments to see how variable names point to typed value objects
            in memory—and how reassignment rebinds a name to a new object.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {MEMORY_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setCode(p.code)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                code === p.code
                  ? 'border-[#2563EB] bg-[#F0F9FF] text-[#2563EB]'
                  : 'border-slate-200 bg-[#F8FAFC] text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Editable Code + Execution Stepper */}
        <div className="space-y-4 lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#0F172A] shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#1E293B] px-4 py-2.5 text-xs text-slate-200">
              <span className="font-mono font-semibold">memory_trace.py</span>
              <span className="font-mono text-sky-300 tabular-nums">
                {activeStep ? `Line ${activeStep.line}` : 'Before execution'}
              </span>
            </div>

            <div className="p-3">
              <textarea
                aria-label="Memory explorer Python code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={7}
                spellCheck={false}
                className="w-full resize-y rounded-xl border border-slate-800 bg-[#0B1120] p-3 font-mono text-sm leading-6 text-slate-100 focus:border-sky-500 focus:outline-none"
              />
            </div>

            {/* Active Line Preview Strip */}
            <div className="border-t border-slate-800 bg-[#0B1120] px-4 py-2.5 font-mono text-xs">
              <span className="text-slate-400">Active Line: </span>
              <span className="text-emerald-300">
                {activeStep
                  ? `${activeStep.line}: ${codeLines[activeStep.line - 1] ?? ''}`
                  : 'Press Step Forward or Run'}
              </span>
            </div>
          </div>

          {trace.error && (
            <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
              <div>
                <p className="font-bold">
                  {trace.error.type} on line {trace.error.line}
                </p>
                <p className="mt-0.5">{trace.error.message}</p>
              </div>
            </div>
          )}

          {/* Playback Controls */}
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isPlaying) setIsPlaying(false);
                  else {
                    if (stepIndex >= steps.length) setStepIndex(0);
                    setIsPlaying(true);
                  }
                }}
                disabled={steps.length === 0}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-xs disabled:opacity-40"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isPlaying ? 'Pause' : stepIndex >= steps.length && steps.length > 0 ? 'Replay' : 'Run'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex((s) => Math.max(0, s - 1));
                }}
                disabled={stepIndex <= 0}
                className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#1E293B] disabled:opacity-40"
              >
                <SkipBack className="h-3.5 w-3.5 text-[#2563EB]" />
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex((s) => Math.min(steps.length, s + 1));
                }}
                disabled={stepIndex >= steps.length}
                className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-[#1E293B] disabled:opacity-40"
              >
                <SkipForward className="h-3.5 w-3.5 text-[#2563EB]" />
                Step
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex(0);
                }}
                className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-[#64748B]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>

              <span className="ml-auto font-mono text-xs font-semibold text-[#64748B] tabular-nums">
                {stepIndex}/{steps.length}
              </span>
            </div>

            <AnimationSpeedController
              speedMs={speedMs}
              onChangeSpeedMs={setSpeedMs}
              totalSteps={steps.length}
              currentStep={stepIndex}
              compact
            />
          </div>
        </div>

        {/* Right: Names -> Object References Diagram + Explanation */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="font-display text-base font-bold text-[#1E293B]">
                Names &amp; Object Reference Diagram
              </h3>
              <span className="font-mono text-xs text-[#64748B]">
                {Object.keys(currentVars).length} active binding(s)
              </span>
            </div>

            {groupedObjects.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#64748B]">
                No variables bound yet. Click <strong>Step</strong> or <strong>Run</strong> to see
                Python bind variable names to objects.
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {groupedObjects.map((group) => {
                  const meta = inferPyType(group.raw);
                  const anyChanged = group.names.some(
                    (n) =>
                      !prevStep ||
                      formatPyLiteral(prevStep.variables[n] as never) !== group.formatted
                  );

                  return (
                    <div
                      key={group.key}
                      className={`flex flex-col items-stretch justify-between gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center ${
                        anyChanged
                          ? 'border-sky-300 bg-[#F0F9FF]/70'
                          : 'border-slate-200 bg-[#F8FAFC]'
                      }`}
                    >
                      {/* Variable Name Labels */}
                      <div className="flex flex-wrap items-center gap-2">
                        {group.names.map((name) => (
                          <div
                            key={name}
                            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-mono text-sm font-bold text-[#1E293B] shadow-xs"
                          >
                            {name}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#2563EB]">
                        <span className="font-mono text-[11px] font-medium text-[#64748B]">
                          references
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </div>

                      {/* Typed Value Object */}
                      <div
                        className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-2.5 ${meta.tone}`}
                      >
                        <div>
                          <span className="block font-mono text-[10px] font-bold uppercase opacity-75">
                            {meta.typeName} object
                          </span>
                          <span className="font-mono text-base font-extrabold">
                            {group.formatted}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-sky-100 bg-[#F0F9FF] p-4 text-xs leading-relaxed text-[#1E293B]">
              <p className="font-bold text-[#2563EB]">Step Explanation</p>
              <p className="mt-1">
                {activeStep
                  ? activeStep.explanation
                  : 'Python variables are labels (names) attached to value objects, not fixed physical memory boxes. Setting b = a shares the reference until a is reassigned.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-[#64748B]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" aria-hidden="true" />
            <span>
              Conceptual model: supports variable assignments, reassignments, numbers, strings,
              Booleans, lists, and arithmetic expressions via PyVerse&apos;s educational execution
              tracer.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
