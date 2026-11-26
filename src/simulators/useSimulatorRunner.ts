import { useState, useMemo, useCallback, useEffect } from 'react';
import { tracePythonCode, PythonTraceStep } from '../utils/pythonEngine';
import {
  BASE_STEP_MS,
  multiplierToSpeedMs,
  speedMsToMultiplier,
} from '../components/simulators/AnimationSpeedController';

const SPEED_STORAGE_KEY = 'pyverse_sim_speed_ms';

function loadSavedSpeedMs(): number {
  try {
    const raw = window.localStorage.getItem(SPEED_STORAGE_KEY);
    if (raw) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed) && parsed >= 200 && parsed <= 3200) {
        return Math.round(parsed);
      }
    }
  } catch {
    // Ignore storage read issues
  }
  return BASE_STEP_MS;
}

export function useSimulatorRunner(code: string) {
  const trace = useMemo(() => tracePythonCode(code), [code]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMsState] = useState<number>(loadSavedSpeedMs);

  useEffect(() => {
    try {
      window.localStorage.setItem(SPEED_STORAGE_KEY, String(speedMs));
    } catch {
      // Ignore storage write issues
    }
  }, [speedMs]);

  const setSpeedMs = useCallback((ms: number) => {
    const safe = Math.max(200, Math.min(3200, Math.round(ms)));
    setSpeedMsState(safe);
  }, []);

  const speedMultiplier = speedMsToMultiplier(speedMs);

  const setSpeedMultiplier = useCallback(
    (mult: number) => {
      setSpeedMs(multiplierToSpeedMs(mult));
    },
    [setSpeedMs]
  );

  const steps: PythonTraceStep[] = trace.steps;
  const activeStep: PythonTraceStep | null =
    stepIndex > 0 && stepIndex <= steps.length ? steps[stepIndex - 1] : null;

  const play = useCallback(() => {
    setStepIndex((prev) => (prev >= steps.length ? 0 : prev));
    setIsPlaying(true);
  }, [steps.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const nextStep = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, steps.length));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const jumpToStep = useCallback(
    (index: number) => {
      setIsPlaying(false);
      setStepIndex(Math.max(0, Math.min(index, steps.length)));
    },
    [steps.length]
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    setStepIndex(0);
  }, []);

  const jumpToEnd = useCallback(() => {
    setIsPlaying(false);
    setStepIndex(steps.length);
  }, [steps.length]);

  return {
    trace,
    steps,
    stepIndex,
    setStepIndex,
    activeStep,
    isPlaying,
    speedMs,
    speedMultiplier,
    setSpeedMs,
    setSpeedMultiplier,
    play,
    pause,
    nextStep,
    prevStep,
    jumpToStep,
    reset,
    jumpToEnd,
  };
}
