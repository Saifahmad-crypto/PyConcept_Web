import React, { useState, useMemo, Suspense, lazy } from 'react';
import { CreditCard, ShieldCheck, ShieldAlert, Banknote, Lock, Loader2 } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';
import { scaleAnimationMs } from '../AnimationSpeedController';

const AtmDecision3D = lazy(() => import('./AtmDecision3D'));

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

export const AtmDecisionStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [enteredPin, setEnteredPin] = useState<string>('1234');
  const [balanceInput, setBalanceInput] = useState<number>(5000);
  const [amountInput, setAmountInput] = useState<number>(2000);

  const sanitizedPin = /^\d+$/.test(enteredPin.trim()) ? Number(enteredPin.trim()) : 0;
  const safeBalance = Math.max(0, Math.round(Number(balanceInput) || 0));
  const safeAmount = Math.round(Number(amountInput) || 0);

  const code = useMemo(
    () =>
      [
        `correct_pin = 1234`,
        `entered_pin = ${sanitizedPin}`,
        `balance = ${safeBalance}`,
        `amount = ${safeAmount}`,
        `if entered_pin == correct_pin:`,
        `    print("PIN verified. Checking balance...")`,
        `    if amount > 0 and amount <= balance:`,
        `        balance = balance - amount`,
        `        print("Approved! Dispensing", amount)`,
        `        print("New Balance:", balance)`,
        `    else:`,
        `        if amount <= 0:`,
        `            print("Invalid amount. Enter > 0.")`,
        `        else:`,
        `            print("Insufficient balance!")`,
        `else:`,
        `    print("Wrong PIN! Card rejected.")`,
      ].join('\n'),
    [sanitizedPin, safeBalance, safeAmount]
  );

  const runner = useSimulatorRunner(code);
  const stepLine = runner.activeStep?.line ?? 0;
  const currentBalance = Number(runner.activeStep?.variables.balance ?? safeBalance);
  const lastOutput = runner.activeStep?.outputLines.join(' | ') ?? '';

  const atmPhase = (() => {
    if (runner.stepIndex === 0) return 'ready';
    if (lastOutput.includes('Wrong PIN')) return 'wrong-pin';
    if (lastOutput.includes('Insufficient balance')) return 'insufficient';
    if (lastOutput.includes('Invalid amount')) return 'invalid-amount';
    if (lastOutput.includes('Approved')) return 'approved';
    if (stepLine >= 5 && stepLine <= 6) return 'pin-check';
    if (stepLine >= 7) return 'balance-check';
    return 'inserting';
  })();

  const applyPreset = (pin: string, bal: number, amt: number) => {
    setEnteredPin(pin);
    setBalanceInput(bal);
    setAmountInput(amt);
    runner.reset();
  };

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
      initialVariables={{
        correct_pin: 1234,
        entered_pin: sanitizedPin,
        balance: safeBalance,
        amount: safeAmount,
      }}
      initialExplanation='Enter a demo PIN (correct sample PIN: 1234), demo balance, and withdrawal amount, then press Play or Next Step to trace nested if-else checks.'
      scene3D={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
                3D Interactive ATM Machine
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#9a8585]">
                Real-time 3D ATM cabinet. Evaluates PIN verification and dispenses currency notes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-lg border px-2.5 py-1 text-xs font-mono font-bold ${
                atmPhase === 'approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : atmPhase === 'wrong-pin'
                  ? 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300'
                  : 'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/40 dark:text-sky-300'
              }`}>
                Phase: {atmPhase.toUpperCase()}
              </span>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex h-[380px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#100303] text-slate-300">
                <Loader2 className="h-8 w-8 animate-spin text-[#E10906]" />
                <span className="text-xs font-medium">Loading 3D ATM Scene...</span>
              </div>
            }
          >
            <AtmDecision3D
              phase={atmPhase}
              enteredPin={enteredPin}
              balance={currentBalance}
              amount={safeAmount}
              isApproved={atmPhase === 'approved'}
              isWrongPin={atmPhase === 'wrong-pin'}
            />
          </Suspense>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Demo ATM Terminal
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9a8585]">
              Sample/demo data only (Demo PIN: <strong className="font-mono text-[#1E293B]">1234</strong>). No real banking info is stored.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset('1234', 5000, 2000)}
              className="rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#100303] dark:text-[#f0eaea] hover:border-sky-300"
            >
              Valid ₹2000
            </button>
            <button
              type="button"
              onClick={() => applyPreset('9999', 5000, 2000)}
              className="rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#100303] dark:text-[#f0eaea] hover:border-rose-300"
            >
              Wrong PIN
            </button>
            <button
              type="button"
              onClick={() => applyPreset('1234', 1500, 3000)}
              className="rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#100303] dark:text-[#f0eaea] hover:border-amber-300"
            >
              Over Balance
            </button>
          </div>
        </div>

        {/* Interactive ATM Machine Body */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            {/* ATM Screen & Card Slot */}
            <div className="space-y-4 md:col-span-7">
              <div className="rounded-2xl border border-slate-300 dark:border-[#4a2525] bg-[#0F172A] p-5 text-white shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                  <span className="font-mono font-semibold text-sky-300">PYVERSE DEMO ATM</span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    Balance: ₹{currentBalance.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-4 flex min-h-[116px] flex-col items-center justify-center text-center space-y-2">
                  {atmPhase === 'ready' && (
                    <>
                      <CreditCard className="h-8 w-8 text-sky-400" aria-hidden="true" />
                      <p className="font-display text-base font-bold">Insert Demo Card &amp; Run</p>
                      <p className="text-xs text-slate-400">
                        Press Play or Next Step to begin verification.
                      </p>
                    </>
                  )}
                  {atmPhase === 'inserting' && (
                    <>
                      <CreditCard className="h-8 w-8 text-sky-300 animate-bounce" aria-hidden="true" />
                      <p className="font-display text-base font-bold text-sky-200">
                        Reading Demo Card...
                      </p>
                    </>
                  )}
                  {(atmPhase === 'pin-check' || atmPhase === 'balance-check') && (
                    <>
                      <Lock className="h-8 w-8 text-violet-300" aria-hidden="true" />
                      <p className="font-display text-base font-bold text-violet-200">
                        {atmPhase === 'pin-check' ? 'Verifying Demo PIN...' : 'Checking Balance & Amount...'}
                      </p>
                    </>
                  )}
                  {atmPhase === 'approved' && (
                    <>
                      <ShieldCheck className="h-9 w-9 text-emerald-400" aria-hidden="true" />
                      <p className="font-display text-lg font-bold text-emerald-300">
                        Approved! Dispensing ₹{safeAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="font-mono text-xs text-slate-300 tabular-nums">
                        Updated Demo Balance: ₹{currentBalance.toLocaleString('en-IN')}
                      </p>
                    </>
                  )}
                  {(atmPhase === 'wrong-pin' ||
                    atmPhase === 'insufficient' ||
                    atmPhase === 'invalid-amount') && (
                    <>
                      <ShieldAlert className="h-9 w-9 text-rose-400" aria-hidden="true" />
                      <p className="font-display text-lg font-bold text-rose-300">
                        {atmPhase === 'wrong-pin'
                          ? 'Wrong PIN — Card Rejected'
                          : atmPhase === 'insufficient'
                          ? 'Insufficient Balance'
                          : 'Invalid Withdrawal Amount'}
                      </p>
                      <p className="text-xs text-slate-300">
                        {atmPhase === 'wrong-pin'
                          ? 'Outer if entered_pin == correct_pin evaluated to False.'
                          : 'Nested condition rejected the withdrawal request.'}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Card Slot & Cash Dispenser Visual */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3 text-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#9a8585]">
                    <span>Card Slot</span>
                    <span className="font-mono font-semibold text-[#1E293B]">
                      {atmPhase === 'wrong-pin'
                        ? 'Ejected'
                        : runner.stepIndex > 0
                        ? 'Card Accepted'
                        : 'Ready'}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      style={{ transitionDuration: `${scaleAnimationMs(450, runner.speedMs)}ms` }}
                      className={`h-full transition-all ${
                        atmPhase === 'wrong-pin'
                          ? 'w-1/4 bg-rose-50 dark:bg-rose-950/400'
                          : runner.stepIndex > 0
                          ? 'w-full bg-gradient-to-r from-[#E10906] to-[#8B5CF6]'
                          : 'w-1/3 bg-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3 text-xs">
                  <div className="flex items-center justify-between text-slate-500 dark:text-[#9a8585]">
                    <span>Cash Tray</span>
                    <span className="font-mono font-semibold text-[#1E293B]">
                      {atmPhase === 'approved' ? `₹${safeAmount}` : 'Closed'}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                    <Banknote className="h-4 w-4" aria-hidden="true" />
                    <span>{atmPhase === 'approved' ? 'Dispensed' : 'Idle'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Input Controls */}
            <div className="space-y-3 rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 md:col-span-5">
              <p className="text-xs font-semibold text-[#1E293B]">Demo Transaction Inputs</p>

              <div>
                <label htmlFor="atm-pin" className="block text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
                  Demo PIN (Try 1234 or 9999)
                </label>
                <input
                  id="atm-pin"
                  type="text"
                  maxLength={6}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value.replace(/\D/g, ''));
                    runner.reset();
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-3 py-2 font-mono text-sm font-bold text-[#1E293B] focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="atm-balance" className="block text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
                  Demo Account Balance (₹)
                </label>
                <input
                  id="atm-balance"
                  type="number"
                  min={0}
                  max={100000}
                  step={500}
                  value={balanceInput}
                  onChange={(e) => {
                    setBalanceInput(Number(e.target.value));
                    runner.reset();
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-3 py-2 font-mono text-sm font-bold text-[#1E293B] tabular-nums focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="atm-amount" className="block text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
                  Withdrawal Amount (₹)
                </label>
                <input
                  id="atm-amount"
                  type="number"
                  min={-500}
                  max={100000}
                  step={500}
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(Number(e.target.value));
                    runner.reset();
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-3 py-2 font-mono text-sm font-bold text-[#1E293B] tabular-nums focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
