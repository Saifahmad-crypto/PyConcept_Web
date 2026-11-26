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
}

type FilterOption = 'all' | SimulatorCategory;

const SIMULATOR_ICONS: Record<SimulatorId, React.ReactNode> = {
  'traffic-signal': <TrafficCone className="h-6 w-6 text-sky-600" aria-hidden="true" />,
  'atm-decision': <Landmark className="h-6 w-6 text-violet-600" aria-hidden="true" />,
  'smart-ac': <ThermometerSnowflake className="h-6 w-6 text-sky-600" aria-hidden="true" />,
  'shopping-discount': <ShoppingBag className="h-6 w-6 text-violet-600" aria-hidden="true" />,
  'elevator-floor': <Building2 className="h-6 w-6 text-sky-600" aria-hidden="true" />,
  'countdown-timer': <Timer className="h-6 w-6 text-violet-600" aria-hidden="true" />,
  'parking-scanner': <CarFront className="h-6 w-6 text-sky-600" aria-hidden="true" />,
  'atm-cash-counter': <Banknote className="h-6 w-6 text-violet-600" aria-hidden="true" />,
};

export const SimulatorsHub: React.FC<SimulatorsHubProps> = ({ onSelectSimulator }) => {
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
    return (
      <article
        key={sim.id}
        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
      >
        <div>
          <div className="flex items-start justify-between gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isCond
                  ? 'border-sky-200/80 bg-[#F0F9FF]'
                  : 'border-violet-200/80 bg-[#F5F3FF]'
              }`}
            >
              {SIMULATOR_ICONS[sim.id]}
            </div>
            <span className="font-mono text-xs font-semibold text-slate-500">
              {sim.number} · {sim.difficulty}
            </span>
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-[#1E293B] group-hover:text-sky-700 transition-colors">
            {sim.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {sim.shortDescription}
          </p>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4 space-y-4">
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-600">Python concepts: </span>
            <span className="font-mono font-semibold text-violet-700">
              {sim.concepts.join(' · ')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelectSimulator(sim.id)}
            className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 hover:shadow-md"
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
      <div className="mb-8 border-b border-slate-200 pb-8">
        <p className="text-xs font-semibold text-sky-700">
          PyVerse Interactive Simulators
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-[#1E293B] text-balance sm:text-4xl lg:text-[2.75rem]">
          Learn Python Through Real Life
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          Explore 8 hands-on real-world systems powered by step-by-step Python execution. Adjust live
          inputs, watch variables update in real time, and see how every line drives the simulation.
        </p>

        {/* Category Filter Tabs + Search */}
        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex flex-wrap rounded-xl border border-slate-200 bg-[#F8FAFC] p-1 gap-1">
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
                    ? 'bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#1E293B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title or concept..."
              aria-label="Filter simulators"
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-[#1E293B] placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        </div>
      </div>

      {/* Empty Search State */}
      {!showConditionals && !showLoops && (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-display text-base font-bold text-[#1E293B]">
            No matching simulators found
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try clearing your search or switching back to All Simulators.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setFilter('all');
            }}
            className="mt-4 inline-flex items-center rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold text-[#1E293B] hover:border-sky-300"
          >
            Show All 8 Simulators
          </button>
        </div>
      )}

      {/* Category A: Conditional Statement Simulators */}
      {showConditionals && (
        <section className="mb-12">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0F9FF] text-sky-700">
              <GitBranch className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">
                Conditional Statement Simulators
              </h2>
              <p className="text-xs text-slate-500">
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F3FF] text-violet-700">
              <Repeat className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[#1E293B]">
                Loop Simulators
              </h2>
              <p className="text-xs text-slate-500">
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
