import React, { useState } from 'react';
import { X, BookMarked, Terminal, Copy, Check } from 'lucide-react';
import { TopicId } from '../types';

interface CheatSheetModalProps {
  isOpen: boolean;
  initialTopic?: TopicId;
  onClose: () => void;
  onTryInSandbox?: (code: string) => void;
}

const SHEETS: Record<
  TopicId,
  {
    title: string;
    items: Array<{ label: string; syntax: string; note: string }>;
  }
> = {
  basics: {
    title: 'Python Basics Quick Reference',
    items: [
      {
        label: 'Variables & Assignment',
        syntax: 'name = "Maya"\nscore = 92\nready = True',
        note: 'Single = stores a value inside a named box.',
      },
      {
        label: 'Core Data Types',
        syntax: '42        # int (whole number)\n3.14      # float (decimal)\n"Hello"   # str (text)\nTrue      # bool (True or False)',
        note: 'Text always goes inside quotes; True/False start with capitals.',
      },
      {
        label: 'print() & f-strings',
        syntax: 'print(f"Score: {score}/100")',
        note: 'Put f before the quote to insert variables inside { }.',
      },
      {
        label: 'Math & Modulo',
        syntax: 'total = 10 + 5 * 2   # 20\nrem = 17 % 5         # 2 (remainder)',
        note: 'Modulo % checks divisibility (n % 2 == 0 means even).',
      },
    ],
  },
  conditionals: {
    title: 'Conditional Statements Reference',
    items: [
      {
        label: 'if / elif / else',
        syntax: 'if marks >= 90:\n    print("A")\nelif marks >= 75:\n    print("B")\nelse:\n    print("Pass")',
        note: 'Always end headers with : and indent body by 4 spaces.',
      },
      {
        label: 'Comparison Operators',
        syntax: '==   !=   >   <   >=   <=',
        note: 'Use == to compare equality; never single = inside if.',
      },
      {
        label: 'Logical Operators',
        syntax: 'if age >= 18 and has_id:\nif is_vip or total >= 100:\nif not is_locked:',
        note: 'and requires both True; or needs at least one True.',
      },
    ],
  },
  loops: {
    title: 'Loops Quick Reference',
    items: [
      {
        label: 'for + range()',
        syntax: 'for i in range(1, 6):\n    print(i)  # prints 1, 2, 3, 4, 5',
        note: 'range(start, stop, step) always stops BEFORE stop.',
      },
      {
        label: 'while Loop',
        syntax: 'count = 1\nwhile count <= 3:\n    print(count)\n    count += 1',
        note: 'Always update the loop variable so it does not run forever.',
      },
      {
        label: 'break & continue',
        syntax: 'if x == 3: continue  # skip this pass\nif x == 5: break     # exit loop now',
        note: 'continue skips one iteration; break exits the loop immediately.',
      },
    ],
  },
};

export const CheatSheetModal: React.FC<CheatSheetModalProps> = ({
  isOpen,
  initialTopic = 'conditionals',
  onClose,
  onTryInSandbox,
}) => {
  const [tab, setTab] = useState<TopicId>(initialTopic);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const current = SHEETS[tab];

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      // Ignore clipboard failures cleanly
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#100303]/45 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cheat-sheet-title"
    >
      <div className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E10906] text-white">
              <BookMarked className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="cheat-sheet-title" className="font-display text-lg font-bold text-[#100303] dark:text-[#f0eaea]">
                Python Quick Cheat Sheet
              </h2>
              <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">Instant syntax cards you can copy or test</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303]"
            aria-label="Close cheat sheet"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-6 py-2.5">
          <div className="inline-flex rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-1">
            {(
              [
                { id: 'basics', label: '01. Basics' },
                { id: 'conditionals', label: '02. Conditionals' },
                { id: 'loops', label: '03. Loops' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'bg-[#E10906] text-white shadow-xs'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
          <h3 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">{current.title}</h3>
          {current.items.map((item, idx) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.syntax, idx)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#8A8585] dark:text-[#9a8585] hover:border-[#E10906]"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                  {onTryInSandbox && (
                    <button
                      type="button"
                      onClick={() => {
                        onTryInSandbox(item.syntax);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#2563EB] px-2.5 py-1 text-[11px] font-semibold text-white hover:opacity-95"
                    >
                      <Terminal className="h-3 w-3" />
                      Try
                    </button>
                  )}
                </div>
              </div>
              <pre className="mt-2.5 overflow-x-auto rounded-xl bg-[#100303] p-3 font-mono text-xs text-sky-200">
                {item.syntax}
              </pre>
              <p className="mt-2 text-xs text-[#8A8585] dark:text-[#9a8585]">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
