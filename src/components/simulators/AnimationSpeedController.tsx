import React, { createContext, useContext } from 'react';
import { Gauge, Sparkles } from 'lucide-react';

export const BASE_STEP_MS = 800;
export const MIN_MULTIPLIER = 0.25;
export const MAX_MULTIPLIER = 4;

export const SPEED_PRESETS: Array<{ label: string; multiplier: number }> = [
  { label: '0.25x', multiplier: 0.25 },
  { label: '0.5x', multiplier: 0.5 },
  { label: '1x', multiplier: 1 },
  { label: '2x', multiplier: 2 },
  { label: '4x', multiplier: 4 },
];

export function clampMultiplier(mult: number): number {
  const clamped = Math.max(MIN_MULTIPLIER, Math.min(MAX_MULTIPLIER, mult));
  return Math.round(clamped * 100) / 100;
}

export function multiplierToSpeedMs(multiplier: number): number {
  return Math.round(BASE_STEP_MS / clampMultiplier(multiplier));
}

export function speedMsToMultiplier(speedMs: number): number {
  if (!speedMs || speedMs <= 0) return 1;
  return clampMultiplier(BASE_STEP_MS / speedMs);
}

/**
 * Scales a base UI animation duration (designed for 1x = 800ms/step)
 * proportionally with the active simulator playback speed.
 */
export function scaleAnimationMs(baseMs: number, speedMs: number): number {
  const scale = speedMs / BASE_STEP_MS;
  return Math.max(80, Math.min(2400, Math.round(baseMs * scale)));
}

export interface SimulatorSpeedContextValue {
  speedMs: number;
  multiplier: number;
  scaleMs: (baseMs: number) => number;
}

export const SimulatorSpeedContext = createContext<SimulatorSpeedContextValue>({
  speedMs: BASE_STEP_MS,
  multiplier: 1,
  scaleMs: (baseMs: number) => baseMs,
});

export function useSimulatorSpeed() {
  return useContext(SimulatorSpeedContext);
}

interface AnimationSpeedControllerProps {
  speedMs: number;
  onChangeSpeedMs: (nextMs: number) => void;
  totalSteps?: number;
  currentStep?: number;
  pauseOnBranches?: boolean;
  onTogglePauseOnBranches?: () => void;
  compact?: boolean;
}

export const AnimationSpeedController: React.FC<AnimationSpeedControllerProps> = ({
  speedMs,
  onChangeSpeedMs,
  totalSteps,
  currentStep = 0,
  pauseOnBranches,
  onTogglePauseOnBranches,
  compact = false,
}) => {
  const multiplier = speedMsToMultiplier(speedMs);
  const remainingSteps =
    typeof totalSteps === 'number' ? Math.max(0, totalSteps - currentStep) : null;
  const remainingSeconds =
    remainingSteps !== null ? ((remainingSteps * speedMs) / 1000).toFixed(1) : null;

  const paceLabel =
    multiplier <= 0.4
      ? 'Deep Study'
      : multiplier < 0.9
      ? 'Slow Pace'
      : multiplier <= 1.25
      ? 'Normal'
      : multiplier <= 2.25
      ? 'Fast'
      : 'Turbo';

  return (
    <div
      className={`flex flex-wrap items-center gap-2.5 ${
        compact
          ? 'rounded-xl border border-slate-200 bg-[#F8FAFC] px-3 py-2'
          : 'rounded-xl border border-slate-200 bg-[#F8FAFC] px-3.5 py-2'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <Gauge className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
        <label
          htmlFor={compact ? 'compact-speed-slider' : 'sim-speed-slider'}
          className="text-xs font-semibold text-[#1E293B]"
        >
          Speed
        </label>
        <span className="font-mono text-xs font-bold text-[#2563EB] tabular-nums">
          {multiplier % 1 === 0 ? `${multiplier}.0x` : `${multiplier}x`}
        </span>
      </div>

      <input
        id={compact ? 'compact-speed-slider' : 'sim-speed-slider'}
        type="range"
        min={MIN_MULTIPLIER}
        max={MAX_MULTIPLIER}
        step={0.25}
        value={multiplier}
        aria-label="Animation playback speed multiplier"
        onChange={(e) => onChangeSpeedMs(multiplierToSpeedMs(Number(e.target.value)))}
        className="w-24 sm:w-28 accent-[#2563EB] cursor-pointer"
      />

      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
        {SPEED_PRESETS.map((preset) => {
          const active = Math.abs(multiplier - preset.multiplier) < 0.08;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChangeSpeedMs(multiplierToSpeedMs(preset.multiplier))}
              className={`rounded-md px-2 py-1 font-mono text-[11px] font-semibold transition-all whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#8B5CF6] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {!compact && (
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#64748B]">
          <span className="font-mono tabular-nums">
            {paceLabel} · {speedMs}ms/step
          </span>
          {remainingSeconds !== null && remainingSteps !== null && remainingSteps > 0 && (
            <span className="font-mono text-slate-500 tabular-nums">
              · ~{remainingSeconds}s left
            </span>
          )}
        </div>
      )}

      {onTogglePauseOnBranches && (
        <button
          type="button"
          onClick={onTogglePauseOnBranches}
          aria-pressed={Boolean(pauseOnBranches)}
          title="Automatically slow down briefly when evaluating if/elif or loop conditions"
          className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors whitespace-nowrap ${
            pauseOnBranches
              ? 'border-violet-300 bg-violet-50 text-violet-800'
              : 'border-slate-200 bg-white text-[#64748B] hover:text-[#1E293B]'
          }`}
        >
          <Sparkles className="h-3 w-3 text-[#8B5CF6]" aria-hidden="true" />
          Smart Branch Pause: {pauseOnBranches ? 'On' : 'Off'}
        </button>
      )}
    </div>
  );
};
