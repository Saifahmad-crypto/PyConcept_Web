import React, {
  createContext,
  useContext,
  useSyncExternalStore,
  useMemo,
} from 'react';
import { Gauge, Sparkles } from 'lucide-react';

export const BASE_STEP_MS = 800;
export const MIN_SPEED_MS = 200; // 5.00 FPS (4x)
export const MAX_SPEED_MS = 3200; // 0.31 FPS (0.25x)
export const MIN_MULTIPLIER = 0.25;
export const MAX_MULTIPLIER = 4;

const SPEED_STORAGE_KEY = 'pyverse_sim_speed_ms';
const BRANCH_PAUSE_STORAGE_KEY = 'pyverse_sim_pause_branches';

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

export function clampSpeedMs(ms: number): number {
  if (!Number.isFinite(ms)) return BASE_STEP_MS;
  return Math.max(MIN_SPEED_MS, Math.min(MAX_SPEED_MS, Math.round(ms)));
}

export function multiplierToSpeedMs(multiplier: number): number {
  return clampSpeedMs(BASE_STEP_MS / clampMultiplier(multiplier));
}

export function speedMsToMultiplier(speedMs: number): number {
  if (!speedMs || speedMs <= 0) return 1;
  return clampMultiplier(BASE_STEP_MS / speedMs);
}

export function speedMsToFps(speedMs: number): number {
  const safe = clampSpeedMs(speedMs);
  return Math.round((1000 / safe) * 100) / 100;
}

export function fpsToSpeedMs(fps: number): number {
  if (!Number.isFinite(fps) || fps <= 0) return BASE_STEP_MS;
  return clampSpeedMs(1000 / fps);
}

/**
 * Scales a base UI animation duration (designed for 1x = 800ms/step)
 * proportionally with the active simulator playback speed.
 */
export function scaleAnimationMs(baseMs: number, speedMs: number): number {
  const scale = speedMs / BASE_STEP_MS;
  return Math.max(80, Math.min(2400, Math.round(baseMs * scale)));
}

// ---------------------------------------------------------------------------
// Shared Simulator Frame-Rate / Speed Store (synced across all simulator instances)
// ---------------------------------------------------------------------------

interface SharedSpeedState {
  speedMs: number;
  pauseOnBranches: boolean;
}

function readInitialSharedSpeedState(): SharedSpeedState {
  let speedMs = BASE_STEP_MS;
  let pauseOnBranches = true;
  if (typeof window !== 'undefined') {
    try {
      const rawSpeed = window.localStorage.getItem(SPEED_STORAGE_KEY);
      if (rawSpeed !== null) {
        const parsed = Number(rawSpeed);
        if (Number.isFinite(parsed)) {
          speedMs = clampSpeedMs(parsed);
        }
      }
      const rawBranch = window.localStorage.getItem(BRANCH_PAUSE_STORAGE_KEY);
      if (rawBranch === 'false') {
        pauseOnBranches = false;
      } else if (rawBranch === 'true') {
        pauseOnBranches = true;
      }
    } catch {
      // Ignore storage read restrictions
    }
  }
  return { speedMs, pauseOnBranches };
}

let sharedSpeedState: SharedSpeedState = readInitialSharedSpeedState();
const speedListeners = new Set<() => void>();

function notifySpeedListeners() {
  speedListeners.forEach((listener) => listener());
}

function persistSharedSpeedState(next: SharedSpeedState) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SPEED_STORAGE_KEY, String(next.speedMs));
      window.localStorage.setItem(BRANCH_PAUSE_STORAGE_KEY, String(next.pauseOnBranches));
    } catch {
      // Ignore storage write restrictions
    }
  }
}

export function setSharedSimulatorSpeedMs(nextMs: number) {
  const clamped = clampSpeedMs(nextMs);
  if (sharedSpeedState.speedMs === clamped) return;
  sharedSpeedState = { ...sharedSpeedState, speedMs: clamped };
  persistSharedSpeedState(sharedSpeedState);
  notifySpeedListeners();
}

export function setSharedSimulatorMultiplier(nextMultiplier: number) {
  setSharedSimulatorSpeedMs(multiplierToSpeedMs(nextMultiplier));
}

export function setSharedSimulatorFps(nextFps: number) {
  setSharedSimulatorSpeedMs(fpsToSpeedMs(nextFps));
}

export function setSharedPauseOnBranches(next: boolean) {
  if (sharedSpeedState.pauseOnBranches === next) return;
  sharedSpeedState = { ...sharedSpeedState, pauseOnBranches: next };
  persistSharedSpeedState(sharedSpeedState);
  notifySpeedListeners();
}

export function toggleSharedPauseOnBranches() {
  setSharedPauseOnBranches(!sharedSpeedState.pauseOnBranches);
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === SPEED_STORAGE_KEY && event.newValue !== null) {
      const parsed = clampSpeedMs(Number(event.newValue));
      if (parsed !== sharedSpeedState.speedMs) {
        sharedSpeedState = { ...sharedSpeedState, speedMs: parsed };
        notifySpeedListeners();
      }
    } else if (event.key === BRANCH_PAUSE_STORAGE_KEY && event.newValue !== null) {
      const parsed = event.newValue !== 'false';
      if (parsed !== sharedSpeedState.pauseOnBranches) {
        sharedSpeedState = { ...sharedSpeedState, pauseOnBranches: parsed };
        notifySpeedListeners();
      }
    }
  });
}

function subscribeSharedSpeed(listener: () => void) {
  speedListeners.add(listener);
  return () => {
    speedListeners.delete(listener);
  };
}

function getSharedSpeedSnapshot(): SharedSpeedState {
  return sharedSpeedState;
}

export function useSharedSimulatorSpeed() {
  const snapshot = useSyncExternalStore(
    subscribeSharedSpeed,
    getSharedSpeedSnapshot,
    getSharedSpeedSnapshot
  );

  return {
    speedMs: snapshot.speedMs,
    multiplier: speedMsToMultiplier(snapshot.speedMs),
    fps: speedMsToFps(snapshot.speedMs),
    pauseOnBranches: snapshot.pauseOnBranches,
    setSpeedMs: setSharedSimulatorSpeedMs,
    setMultiplier: setSharedSimulatorMultiplier,
    setFps: setSharedSimulatorFps,
    setPauseOnBranches: setSharedPauseOnBranches,
    togglePauseOnBranches: toggleSharedPauseOnBranches,
  };
}

// ---------------------------------------------------------------------------
// React Context + Provider (carries effective scaled speed & helpers to stages)
// ---------------------------------------------------------------------------

export interface SimulatorSpeedContextValue {
  speedMs: number;
  multiplier: number;
  fps: number;
  pauseOnBranches: boolean;
  scaleMs: (baseMs: number) => number;
  setSpeedMs: (nextMs: number) => void;
  setMultiplier: (nextMultiplier: number) => void;
  setFps: (nextFps: number) => void;
  setPauseOnBranches: (next: boolean) => void;
}

export const SimulatorSpeedContext = createContext<SimulatorSpeedContextValue>({
  speedMs: BASE_STEP_MS,
  multiplier: 1,
  fps: speedMsToFps(BASE_STEP_MS),
  pauseOnBranches: true,
  scaleMs: (baseMs: number) => baseMs,
  setSpeedMs: setSharedSimulatorSpeedMs,
  setMultiplier: setSharedSimulatorMultiplier,
  setFps: setSharedSimulatorFps,
  setPauseOnBranches: setSharedPauseOnBranches,
});

export const SimulatorSpeedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const shared = useSharedSimulatorSpeed();

  const value = useMemo<SimulatorSpeedContextValue>(
    () => ({
      speedMs: shared.speedMs,
      multiplier: shared.multiplier,
      fps: shared.fps,
      pauseOnBranches: shared.pauseOnBranches,
      scaleMs: (baseMs: number) => scaleAnimationMs(baseMs, shared.speedMs),
      setSpeedMs: shared.setSpeedMs,
      setMultiplier: shared.setMultiplier,
      setFps: shared.setFps,
      setPauseOnBranches: shared.setPauseOnBranches,
    }),
    [
      shared.speedMs,
      shared.multiplier,
      shared.fps,
      shared.pauseOnBranches,
      shared.setSpeedMs,
      shared.setMultiplier,
      shared.setFps,
      shared.setPauseOnBranches,
    ]
  );

  return (
    <SimulatorSpeedContext.Provider value={value}>
      {children}
    </SimulatorSpeedContext.Provider>
  );
};

export function useSimulatorSpeed() {
  return useContext(SimulatorSpeedContext);
}

interface AnimationSpeedControllerProps {
  speedMs?: number;
  onChangeSpeedMs?: (nextMs: number) => void;
  totalSteps?: number;
  currentStep?: number;
  pauseOnBranches?: boolean;
  onTogglePauseOnBranches?: () => void;
  compact?: boolean;
}

export const AnimationSpeedController: React.FC<AnimationSpeedControllerProps> = ({
  speedMs: propSpeedMs,
  onChangeSpeedMs,
  totalSteps,
  currentStep = 0,
  pauseOnBranches: propPauseOnBranches,
  onTogglePauseOnBranches,
  compact = false,
}) => {
  const shared = useSharedSimulatorSpeed();
  const speedMs = propSpeedMs ?? shared.speedMs;
  const pauseOnBranches = propPauseOnBranches ?? shared.pauseOnBranches;

  const handleSpeedChange = (nextMs: number) => {
    const clamped = clampSpeedMs(nextMs);
    if (onChangeSpeedMs) {
      onChangeSpeedMs(clamped);
    } else {
      shared.setSpeedMs(clamped);
    }
  };

  const handleBranchToggle = onTogglePauseOnBranches ?? shared.togglePauseOnBranches;

  const multiplier = speedMsToMultiplier(speedMs);
  const fps = speedMsToFps(speedMs);
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
          Frame Rate
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
        aria-label="Simulation frame rate speed multiplier"
        onChange={(e) => handleSpeedChange(multiplierToSpeedMs(Number(e.target.value)))}
        className="w-24 sm:w-28 accent-[#2563EB] cursor-pointer"
      />

      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
        {SPEED_PRESETS.map((preset) => {
          const active = Math.abs(multiplier - preset.multiplier) < 0.08;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSpeedChange(multiplierToSpeedMs(preset.multiplier))}
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
            {paceLabel} · {fps.toFixed(2)} FPS · {speedMs}ms/step
          </span>
          {remainingSeconds !== null && remainingSteps !== null && remainingSteps > 0 && (
            <span className="font-mono text-slate-500 tabular-nums">
              · ~{remainingSeconds}s left
            </span>
          )}
        </div>
      )}

      {(onTogglePauseOnBranches || !compact) && (
        <button
          type="button"
          onClick={handleBranchToggle}
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
