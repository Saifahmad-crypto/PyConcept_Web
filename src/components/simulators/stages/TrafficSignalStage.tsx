import React, { useState, useMemo } from 'react';
import { OctagonAlert, Clock, Navigation } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';
import { scaleAnimationMs } from '../AnimationSpeedController';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

type SignalColor = 'red' | 'yellow' | 'green';

export const TrafficSignalStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [signal, setSignal] = useState<SignalColor>('red');

  const code = useMemo(
    () =>
      [
        `signal = "${signal}"`,
        `action = "IDLE"`,
        `if signal == "red":`,
        `    action = "STOP"`,
        `    print("Red light: Stop behind the line")`,
        `elif signal == "yellow":`,
        `    action = "WAIT"`,
        `    print("Yellow light: Slow down and wait")`,
        `elif signal == "green":`,
        `    action = "GO"`,
        `    print("Green light: Safe to proceed")`,
        `else:`,
        `    action = "CAUTION"`,
        `    print("Invalid signal")`,
      ].join('\n'),
    [signal]
  );

  const runner = useSimulatorRunner(code);

  const currentAction = String(
    runner.activeStep?.variables.action ?? 'IDLE'
  );
  const currentSignalVar = String(
    runner.activeStep?.variables.signal ?? signal
  ) as SignalColor;

  const handleSelectSignal = (next: SignalColor) => {
    setSignal(next);
    runner.setStepIndex(0);
    window.setTimeout(() => {
      runner.play();
    }, 30);
  };

  const isCarsMoving = currentAction === 'GO';
  const isCarsSlowing = currentAction === 'WAIT';
  const isPedestrianCrossing = currentAction === 'STOP';

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
      onPrevStep={runner.prevStep}
      onJumpToStep={runner.jumpToStep}
      onReset={runner.reset}
      onChangeSpeed={runner.setSpeedMs}
      onBackToHub={onBackToHub}
      initialVariables={{ signal, action: 'IDLE' }}
      initialExplanation='Select a traffic light color or press Play / Next Step to see how Python evaluates if-elif-else top to bottom.'
    >
      <div className="space-y-5">
        {/* Input Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Road Intersection Control
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9a8585]">
              Switch the traffic signal to trigger conditional branching.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] p-1 gap-1">
            {(['red', 'yellow', 'green'] as SignalColor[]).map((sig) => {
              const active = signal === sig;
              const activeCls =
                sig === 'red'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : sig === 'yellow'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm';
              return (
                <button
                  key={sig}
                  type="button"
                  onClick={() => handleSelectSignal(sig)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                    active ? activeCls : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#1E293B]'
                  }`}
                >
                  {sig}
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Intersection Canvas */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-gradient-to-b from-[#FFF1F1] dark:from-[#2a0808] to-[#E0F2FE]/60 p-4 sm:p-5">
          {/* Status Banner (Icon + Text — never hue-only) */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-white/95 dark:bg-[#1a0808]/95 px-4 py-2.5 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-[#1E293B]">
              {currentAction === 'STOP' ? (
                <OctagonAlert className="h-4 w-4 text-rose-600" aria-hidden="true" />
              ) : currentAction === 'WAIT' ? (
                <Clock className="h-4 w-4 text-amber-600" aria-hidden="true" />
              ) : (
                <Navigation className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              )}
              <span>
                Vehicle Command:{' '}
                <strong className="font-mono">
                  {currentAction === 'IDLE' ? 'Awaiting Execution' : currentAction}
                </strong>
              </span>
            </div>
            <span className="font-mono text-xs text-[#8A8585] dark:text-[#9a8585]">
              Pedestrian Crosswalk:{' '}
              <strong className={isPedestrianCrossing ? 'text-emerald-700' : 'text-[#100303] dark:text-[#f0eaea]'}>
                {isPedestrianCrossing ? 'WALK SAFE' : 'WAIT AT CURB'}
              </strong>
            </span>
          </div>

          {/* SVG Intersection Scene */}
          <svg
            viewBox="0 0 640 280"
            className="w-full rounded-xl border border-slate-200 dark:border-[#3a1a1a]/80 bg-[#ECFDF5]/60"
            role="img"
            aria-label={`Traffic intersection showing ${currentSignalVar} signal and vehicles ${currentAction}`}
          >
            {/* Sky/Park Backdrop & Sidewalks */}
            <rect x="0" y="0" width="640" height="280" fill="#F1F5F9" />
            <rect x="0" y="70" width="640" height="145" fill="#334155" />

            {/* Sidewalk curbs */}
            <rect x="0" y="62" width="640" height="8" fill="#CBD5E1" />
            <rect x="0" y="215" width="640" height="8" fill="#CBD5E1" />

            {/* Dashed Road Lane Centerline */}
            <line
              x1="0"
              y1="142"
              x2="640"
              y2="142"
              stroke="#F8FAFC"
              strokeWidth="3"
              strokeDasharray="18 14"
              opacity="0.7"
            />

            {/* Stop Line */}
            <rect x="275" y="72" width="7" height="141" fill="#FFFFFF" opacity="0.9" />

            {/* Pedestrian Zebra Crosswalk */}
            {[80, 102, 124, 146, 168, 190].map((yPos) => (
              <rect key={yPos} x="300" y={yPos} width="54" height="12" rx="2" fill="#FFFFFF" opacity="0.92" />
            ))}

            {/* Animated Pedestrian */}
            <g
              style={{
                transform: isPedestrianCrossing
                  ? 'translate(327px, 130px)'
                  : 'translate(327px, 38px)',
                transition: `transform ${scaleAnimationMs(650, runner.speedMs)}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <circle cx="0" cy="-10" r="8" fill="#E10906" stroke="#FFFFFF" strokeWidth="2" />
              <rect x="-7" y="-1" width="14" height="18" rx="5" fill="#8B5CF6" />
              <text
                x="0"
                y="-23"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill="#1E293B"
              >
                {isPedestrianCrossing ? 'WALK' : 'WAIT'}
              </text>
            </g>

            {/* Vehicle 1 (Top Lane — Sky Blue EV) */}
            <g
              style={{
                transform: isCarsMoving
                  ? 'translateX(440px)'
                  : isCarsSlowing
                  ? 'translateX(198px)'
                  : 'translateX(185px)',
                transition: isCarsMoving
                  ? `transform ${scaleAnimationMs(1200, runner.speedMs)}ms linear`
                  : `transform ${scaleAnimationMs(650, runner.speedMs)}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <rect x="10" y="88" width="74" height="34" rx="8" fill="#E10906" />
              <rect x="24" y="93" width="38" height="24" rx="4" fill="#E0F2FE" />
              <circle cx="24" cy="123" r="6" fill="#0F172A" />
              <circle cx="68" cy="123" r="6" fill="#0F172A" />
              {/* Brake lights when stopped or slowing */}
              {!isCarsMoving && (
                <rect x="8" y="93" width="4" height="24" rx="2" fill="#F43F5E" />
              )}
              {/* Headlights */}
              <rect x="82" y="93" width="4" height="7" rx="1" fill="#FEF08A" />
              <rect x="82" y="110" width="4" height="7" rx="1" fill="#FEF08A" />
            </g>

            {/* Vehicle 2 (Bottom Lane — Violet Sedan) */}
            <g
              style={{
                transform: isCarsMoving
                  ? 'translateX(490px)'
                  : isCarsSlowing
                  ? 'translateX(135px)'
                  : 'translateX(120px)',
                transition: isCarsMoving
                  ? `transform ${scaleAnimationMs(1350, runner.speedMs)}ms linear`
                  : `transform ${scaleAnimationMs(650, runner.speedMs)}ms cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <rect x="10" y="160" width="78" height="34" rx="8" fill="#8B5CF6" />
              <rect x="24" y="165" width="40" height="24" rx="4" fill="#EDE9FE" />
              <circle cx="25" cy="195" r="6" fill="#0F172A" />
              <circle cx="72" cy="195" r="6" fill="#0F172A" />
              {!isCarsMoving && (
                <rect x="8" y="165" width="4" height="24" rx="2" fill="#F43F5E" />
              )}
              <rect x="86" y="165" width="4" height="7" rx="1" fill="#FEF08A" />
              <rect x="86" y="182" width="4" height="7" rx="1" fill="#FEF08A" />
            </g>

            {/* Traffic Signal Pole & 3-Light Housing */}
            <rect x="442" y="20" width="8" height="46" rx="3" fill="#475569" />
            <rect x="422" y="10" width="48" height="114" rx="14" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />

            {/* Red Light */}
            <circle
              cx="446"
              cy="34"
              r="13"
              fill={currentSignalVar === 'red' ? '#EF4444' : '#3F1D24'}
              stroke={currentSignalVar === 'red' ? '#FCA5A5' : '#1E293B'}
              strokeWidth="2.5"
            />
            {/* Yellow Light */}
            <circle
              cx="446"
              cy="67"
              r="13"
              fill={currentSignalVar === 'yellow' ? '#F59E0B' : '#3B2D16'}
              stroke={currentSignalVar === 'yellow' ? '#FDE68A' : '#1E293B'}
              strokeWidth="2.5"
            />
            {/* Green Light */}
            <circle
              cx="446"
              cy="100"
              r="13"
              fill={currentSignalVar === 'green' ? '#10B981' : '#123328'}
              stroke={currentSignalVar === 'green' ? '#6EE7B7' : '#1E293B'}
              strokeWidth="2.5"
            />

            {/* Signal Label Badge on SVG */}
            <rect x="484" y="42" width="136" height="48" rx="10" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="552" y="62" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748B">
              ACTIVE SIGNAL
            </text>
            <text
              x="552"
              y="80"
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={
                currentSignalVar === 'red'
                  ? '#DC2626'
                  : currentSignalVar === 'yellow'
                  ? '#D97706'
                  : '#059669'
              }
            >
              {currentSignalVar.toUpperCase()}
            </text>
          </svg>
        </div>
      </div>
    </SimulatorShell>
  );
};
