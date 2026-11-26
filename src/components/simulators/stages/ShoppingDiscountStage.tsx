import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Tag, Receipt } from 'lucide-react';
import { SimulatorMeta } from '../../../types';
import { useSimulatorRunner } from '../../../simulators/useSimulatorRunner';
import { SimulatorShell } from '../SimulatorShell';
import { scaleAnimationMs } from '../AnimationSpeedController';

interface Props {
  meta: SimulatorMeta;
  onBackToHub: () => void;
}

interface CatalogItem {
  id: string;
  name: string;
  price: number;
}

const CATALOG: CatalogItem[] = [
  { id: 'hoodie', name: 'PyVerse Hoodie', price: 1500 },
  { id: 'keyboard', name: 'Logic Keyboard', price: 3500 },
  { id: 'hub', name: 'USB-C Dev Hub', price: 1000 },
  { id: 'notebook', name: 'Algorithm Notebook', price: 500 },
];

export const ShoppingDiscountStage: React.FC<Props> = ({ meta, onBackToHub }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({
    hoodie: 1,
    keyboard: 1,
    hub: 0,
    notebook: 0,
  });
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [reactiveMode, setReactiveMode] = useState<boolean>(true);

  const cartTotal = CATALOG.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] ?? 0),
    0
  );
  const effectiveAmount = customAmount !== null ? Math.max(0, customAmount) : cartTotal;

  const code = useMemo(
    () =>
      [
        `amount = ${effectiveAmount}`,
        `if amount >= 5000:`,
        `    discount_rate = 20`,
        `    print("20% Discount unlocked!")`,
        `elif amount >= 2000:`,
        `    discount_rate = 10`,
        `    print("10% Discount unlocked!")`,
        `else:`,
        `    discount_rate = 0`,
        `    print("No discount (spend >= 2000)")`,
        `discount = amount * discount_rate / 100`,
        `final_bill = amount - discount`,
        `print("Final Bill:", final_bill)`,
      ].join('\n'),
    [effectiveAmount]
  );

  const runner = useSimulatorRunner(code);

  useEffect(() => {
    if (reactiveMode) {
      runner.setStepIndex(runner.steps.length);
    }
  }, [code, reactiveMode, runner.steps.length]);

  const updateQty = (id: string, delta: number) => {
    setReactiveMode(true);
    setCustomAmount(null);
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  };

  const applyPresetAmount = (amt: number) => {
    setReactiveMode(true);
    setCustomAmount(amt);
  };

  const vars = runner.activeStep?.variables;
  const shownRate = Number(
    vars?.discount_rate ?? (effectiveAmount >= 5000 ? 20 : effectiveAmount >= 2000 ? 10 : 0)
  );
  const shownDiscount = Number(vars?.discount ?? (effectiveAmount * shownRate) / 100);
  const shownFinal = Number(vars?.final_bill ?? effectiveAmount - shownDiscount);
  const tierProgress = Math.min(100, Math.round((effectiveAmount / 5000) * 100));

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
      initialVariables={{ amount: effectiveAmount }}
      initialExplanation='Modify cart quantities or test exact boundaries like ₹2,000 and ₹5,000, or press Reset + Play to step through the discount conditions.'
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-base font-bold text-[#1E293B]">
              Online Store Checkout
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9a8585]">
              Rules: ₹5,000+ = 20% off · ₹2,000+ = 10% off · Below ₹2,000 = 0% off.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[1500, 2000, 5000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => applyPresetAmount(amt)}
                className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition-colors ${
                  effectiveAmount === amt
                    ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                    : 'border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-slate-300'
                }`}
              >
                Test ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Cart Items + Bill Summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="space-y-2.5 md:col-span-7">
            {CATALOG.map((item) => {
              const qty = quantities[item.id] ?? 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-3.5 py-2.5"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#1E293B]">{item.name}</p>
                    <p className="font-mono text-xs text-slate-500 dark:text-[#9a8585] tabular-nums">
                      ₹{item.price.toLocaleString('en-IN')} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, -1)}
                      aria-label={`Decrease ${item.name} quantity`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#100303] dark:text-[#f0eaea] hover:bg-[#F1EEEE] dark:hover:bg-[#221010] dark:bg-[#221010]"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center font-mono text-xs font-bold text-[#1E293B] tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.id, 1)}
                      aria-label={`Increase ${item.name} quantity`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#100303] dark:text-[#f0eaea] hover:border-sky-300 hover:bg-[#F0F9FF]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Direct Amount Override */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2.5">
              <label htmlFor="custom-cart-amt" className="text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
                Or enter custom amount (₹):
              </label>
              <input
                id="custom-cart-amt"
                type="number"
                min={0}
                max={100000}
                step={100}
                value={effectiveAmount}
                onChange={(e) => {
                  setReactiveMode(true);
                  setCustomAmount(Math.max(0, Number(e.target.value) || 0));
                }}
                className="w-28 rounded-lg border border-slate-200 dark:border-[#3a1a1a] bg-[#F8FAFC] dark:bg-[#1a0808] px-2.5 py-1.5 text-right font-mono text-xs font-bold text-[#1E293B] tabular-nums focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Discount Tier & Final Bill */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-[#3a1a1a] bg-gradient-to-br from-[#F8FAFC] to-[#F0F9FF] p-4 md:col-span-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1E293B]">
                <span className="inline-flex items-center gap-1.5">
                  <ShoppingCart className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                  Order Summary
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-violet-700 dark:text-violet-300">
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  {shownRate}% OFF
                </span>
              </div>

              {/* Tier Progress Meter */}
              <div>
                <div className="flex justify-between font-mono text-[10px] text-slate-500 dark:text-[#9a8585] mb-1">
                  <span>₹0</span>
                  <span>₹2k (10%)</span>
                  <span>₹5k (20%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#E10906] to-[#8B5CF6] transition-all"
                    style={{
                      width: `${tierProgress}%`,
                      transitionDuration: `${scaleAnimationMs(300, runner.speedMs)}ms`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-200 dark:border-[#3a1a1a] pt-3 text-xs">
              <div className="flex justify-between text-[#8A8585] dark:text-[#9a8585]">
                <span>Cart Amount</span>
                <span className="font-mono font-semibold text-[#1E293B] tabular-nums">
                  ₹{effectiveAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 dark:text-emerald-300">
                <span>Discount ({shownRate}%)</span>
                <span className="font-mono font-semibold tabular-nums">
                  -₹{shownDiscount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-[#3a1a1a] pt-2 text-sm font-bold text-[#1E293B]">
                <span className="inline-flex items-center gap-1.5">
                  <Receipt className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                  Final Bill
                </span>
                <span className="font-mono text-lg text-sky-700 dark:text-sky-300 tabular-nums">
                  ₹{shownFinal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulatorShell>
  );
};
