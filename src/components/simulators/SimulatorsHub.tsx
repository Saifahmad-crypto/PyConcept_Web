import React, { useState } from 'react';
import {
  ArrowRight,
  TrafficCone,
  Landmark,
  ThermometerSnowflake,
  ShoppingBag,
  Building2,
  Timer,
  CarFront,
  Banknote,
  Search,
  GitBranch,
  Repeat,
} from 'lucide-react';
import { SimulatorCategory, SimulatorId, SimulatorMeta } from '../../types';
import { SIMULATORS_CATALOG } from '../../simulators/simulatorsData';

interface SimulatorsHubProps {
  onSelectSimulator: (id: SimulatorId) => void;
  visitedSimulators?: string[];
}

type FilterOption = 'all' | SimulatorCategory;

const SIMULATOR_ICONS: Record<SimulatorId, React.ReactNode> = {
  'traffic-signal': <TrafficCone className="h-6 w-6 text-[#E10906]" aria-hidden="true" />,
  'atm-decision': <Landmark className="h-6 w-6 text-[#E10906]" aria-hidden="true" />,
  'smart-ac': <ThermometerSnowflake className="h-6 w-6 text-[#E10906]" aria-hidden="true" />,
  'shopping-discount': <ShoppingBag className="h-6 w-6 text-[#E10906]" aria-hidden="true" />,
  'elevator-floor': <Building2 className="h-6 w-6 text-[#E10906]" aria-hidden="true" />,
  'countdown-timer': <Timer className="h-6 w-6 text-[#E10906]" aria-hidden="true" />,
  'parking-scanner': <CarFront className="h-6 w-6 text-[#E10906]" aria-hidden="true" />,
  'atm-cash-counter': <Banknote className="h-6 w-6 text-[#E10906]" aria-hidden="true" />,
};

export const SimulatorsHub: React.FC<SimulatorsHubProps> = ({
  onSelectSimulator,
  visitedSimulators = [],
}) => {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [query, setQuery] = useState<string>('');

  const q = query.trim().toLowerCase();
  const matchesQuery = (s: SimulatorMeta) =>
    !q ||
    s.title.toLowerCase().includes(q) ||
    s.shortDescription.toLowerCase().includes(q) ||
    s.concepts.some((c) => c.toLowerCase().includes(q));

  const conditionalSims = SIMULATORS_CATALOG.filter(
    (s) => s.category === 'conditionals' && matchesQuery(s)
  );
  const loopSims = SIMULATORS_CATALOG.filter(
    (s) => s.category === 'loops' && matchesQuery(s)
  );

  const showConditionals = (filter === 'all' || filter === 'conditionals') && conditionalSims.length > 0;
  const showLoops = (filter === 'all' || filter === 'loops') && loopSims.length > 0;

  const renderCard = (sim: SimulatorMeta) => {
    const isCond = sim.category === 'conditionals';
    const isExplored = visitedSimulators.includes(sim.id);
    return (
      <article
        key={sim.id}
        className="group flex flex-col justify-between rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E10906] hover:shadow-md"
      >
        <div>
          <div className="flex items-start justify-between gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isCond
                  ? 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808]'
                  : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808]'
              }`}
            >
              {SIMULATOR_ICONS[sim.id]}
            </div>
            <div className="text-right font-mono text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
              <div>
                {sim.number} · {sim.difficulty}
              </div>
              {isExplored && (
                <div className="mt-0.5 text-[11px] font-semibold text-emerald-700">
                  ✓ Explored
                </div>
              )}
            </div>
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea] group-hover:text-[#E10906] transition-colors">
            {sim.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#8A8585] dark:text-[#9a8585]">
            {sim.shortDescription}
          </p>
        </div>

        <div className="mt-5 border-t border-[#F1EEEE] dark:border-[#2a1212] pt-4 space-y-4">
          <div className="text-xs text-[#8A8585] dark:text-[#9a8585]">
            <span className="font-medium text-[#100303] dark:text-[#f0eaea]">Python concepts: </span>
            <span className="font-mono font-semibold text-[#E10906]">
              {sim.concepts.join(' · ')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectSimulator(sim.id)}
            className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[#E10906] px-4 py-2 font-display text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 hover:shadow-md"
          >
            Start Simulator
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Hub Header */}
      <div className="mb-8 border-b border-[#E5DFDF] dark:border-[#3a1a1a] pb-8">
        <p className="text-xs font-semibold text-[#E10906]">
          PyVerse Interactive Simulators
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] dark:text-[#f0eaea] text-balance sm:text-4xl lg:text-[2.75rem]">
          Learn Python Through Real Life
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#8A8585] dark:text-[#9a8585]">
          Explore 8 hands-on real-world systems powered by step-by-step Python execution. Adjust live
          inputs, watch variables update in real time, and see how every line drives the simulation.
        </p>

        {/* Category Filter Tabs + Search */}
        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex flex-wrap rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-1 gap-1">
            {(
              [
                { id: 'all', label: 'All Simulators (8)' },
                { id: 'conditionals', label: 'Conditional Statements (4)' },
                { id: 'loops', label: 'Loops (4)' },
              ] as Array<{ id: FilterOption; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-[#E10906] text-white shadow-sm'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8585] dark:text-[#9a8585]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title or concept..."
              aria-label="Filter simulators"
              className="w-full rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] py-2 pl-9 pr-3 text-xs text-[#100303] dark:text-[#f0eaea] placeholder:text-[#8A8585] dark:placeholder:text-[#9a8585] focus:border-[#E10906] focus:outline-none focus:ring-2 focus:ring-[#E10906]/20"
            />
          </div>
        </div>
      </div>

      {/* Empty Search State */}
      {!showConditionals && !showLoops && (
        <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-10 text-center">
          <p className="font-display text-base font-bold text-[#100303] dark:text-[#f0eaea]">
            No matching simulators found
          </p>
          <p className="mt-1 text-xs text-[#8A8585] dark:text-[#9a8585]">
            Try clearing your search or switching back to All Simulators.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
            className="mt-4 inline-flex items-center rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-4 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]"
          >
            Show All 8 Simulators
          </button>
        </div>
      )}

      {/* Category A: Conditional Statement Simulators */}
      {showConditionals && (
        <section className="mb-12">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF1F1] dark:bg-[#2a0808] text-[#E10906]">
              <GitBranch className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">
                Conditional Statement Simulators
              </h2>
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                if · elif · else · nested conditions · comparison &amp; logical operators
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {conditionalSims.map(renderCard)}
          </div>
        </section>
      )}

      {/* Category B: Loop Simulators */}
      {showLoops && (
        <section>
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF1F1] dark:bg-[#2a0808] text-[#E10906]">
              <Repeat className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">
                Loop Simulators
              </h2>
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
                for · while · range() · accumulation · break · continue
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loopSims.map(renderCard)}
          </div>
        </section>
      )}
    </div>
  );
};
