import { useState, useMemo, useCallback } from 'react';
import { tracePythonCode, PythonTraceStep } from '../utils/pythonEngine';

export function useSimulatorRunner(code: string) {
  const trace = useMemo(() => tracePythonCode(code), [code]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(800);

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
    setSpeedMs,
    play,
    pause,
    nextStep,
    reset,
    jumpToEnd,
  };
}
