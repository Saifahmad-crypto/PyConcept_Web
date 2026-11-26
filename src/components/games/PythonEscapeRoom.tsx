import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Play,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Trophy,
  RotateCcw,
  ShieldCheck,
  Share2,
} from 'lucide-react';
import { runPythonCode } from '../../utils/pythonEngine';
import { CodeBlock } from '../CodeBlock';
import { ScoreCardModal, ScoreCardData } from '../ScoreCardModal';

interface PythonEscapeRoomProps {
  completedEscapeRooms: string[];
  onCompleteRoom: (roomId: string, title: string) => void;
}

interface EscapeRoomDef {
  id: string;
  number: string;
  title: string;
  concept: string;
  story: string;
  mode: 'choice' | 'code';
  snippet?: string;
  prompt: string;
  options?: string[];
  correctOption?: number;
  starterCode?: string;
  expectedOutput?: string;
  hint: string;
  solutionExplanation: string;
  verifyCode?: (output: string, code: string) => { passed: boolean; message: string };
}

const VAULT_ROOMS: EscapeRoomDef[] = [
  {
    id: 'room-1-gate',
    number: 'Room 01',
    title: 'Entry Gate — Python Basics',
    concept: 'Variables & Assignment',
    story:
      'The steel vault door displays an incomplete security script. Pick the exact Python line that stores the numeric gate code 404 without a syntax or type error.',
    mode: 'choice',
    snippet: '# Gate Key Initialization\n___\nprint(gate_code + 10)  # Must print 414',
    prompt: 'Which line makes print(gate_code + 10) output 414?',
    options: [
      'gate_code = "404"',
      'gate_code == 404',
      'gate_code = 404',
      '404 = gate_code',
    ],
    correctOption: 2,
    hint: 'To add 10 mathematically, gate_code must be an int (no quotes) assigned with single =.',
    solutionExplanation:
      'gate_code = 404 creates an integer variable so gate_code + 10 cleanly evaluates to 414.',
  },
  {
    id: 'room-2-decision',
    number: 'Room 02',
    title: 'Decision Chamber — Conditionals',
    concept: 'if-elif-else & Logical Operators',
    story:
      'Sensors measure badge_level and biometric_ok. Write Python code so that when badge_level = 3 and biometric_ok = True, the chamber prints "CHAMBER OPEN".',
    mode: 'code',
    prompt:
      'Fix the if condition below so the door unlocks only when badge_level >= 3 AND biometric_ok is True.',
    starterCode: `badge_level = 3\nbiometric_ok = True\n\nif badge_level > 3 and biometric_ok:\n    print("CHAMBER OPEN")\nelse:\n    print("LOCKED")`,
    expectedOutput: 'CHAMBER OPEN',
    hint: 'Notice badge_level is 3, and ">" excludes 3! Use ">=" so badge_level 3 passes.',
    solutionExplanation:
      'Changing > to >= lets badge_level = 3 satisfy both sides of the and condition.',
    verifyCode: (output, code) => {
      const passed =
        output.trim() === 'CHAMBER OPEN' && /if\s+badge_level\s*>=\s*3/.test(code);
      return passed
        ? { passed: true, message: 'Chamber door clicked open!' }
        : {
            passed: false,
            message: 'Use >= 3 in the if statement so the program prints "CHAMBER OPEN".',
          };
    },
  },
  {
    id: 'room-3-loop',
    number: 'Room 03',
    title: 'Loop Corridor — Loops',
    concept: 'for loop & range()',
    story:
      'Four laser beams guard the corridor. Edit the range() loop so it disarms Laser 1, Laser 2, Laser 3, and Laser 4 in sequence.',
    mode: 'code',
    prompt: 'Print "Disarmed 1" through "Disarmed 4" using a for loop.',
    starterCode: `for laser in range(1, 4):\n    print("Disarmed", laser)`,
    expectedOutput: 'Disarmed 1\nDisarmed 2\nDisarmed 3\nDisarmed 4',
    hint: 'range(1, 4) stops at 3 because the stop bound is excluded. Increase 4 to 5!',
    solutionExplanation:
      'range(1, 5) produces 1, 2, 3, and 4—disarming all four corridor lasers.',
    verifyCode: (output, code) => {
      const passed =
        output.trim() === 'Disarmed 1\nDisarmed 2\nDisarmed 3\nDisarmed 4' &&
        /for\s+\w+\s+in\s+range/.test(code);
      return passed
        ? { passed: true, message: 'All 4 corridor lasers disarmed!' }
        : {
            passed: false,
            message: 'Make sure the for loop prints Disarmed 1, Disarmed 2, Disarmed 3, and Disarmed 4.',
          };
    },
  },
  {
    id: 'room-4-memory',
    number: 'Room 04',
    title: 'Memory Vault — Variables & Reassignment',
    concept: 'Object Rebinding & State Trace',
    story:
      'Read how labels change in memory below to deduce the exact final 2 numbers needed for the Memory Vault lock.',
    mode: 'choice',
    snippet: `a = 12\nb = a\na = 30\nb += 8\nprint(a, b)`,
    prompt: 'What exact pair of numbers does print(a, b) display?',
    options: ['30 38', '30 20', '12 20', '38 38'],
    correctOption: 1,
    hint: 'b copied the reference to 12 BEFORE a was rebound to 30. Then b += 8 adds 8 to 12.',
    solutionExplanation:
      'a becomes 30, while b still pointed to 12 so b += 8 evaluates to 20. Output: 30 20.',
  },
  {
    id: 'room-5-final',
    number: 'Room 05',
    title: 'Final Code Vault — Combined Challenge',
    concept: 'Loops + Conditionals Together',
    story:
      'Final lock! Combine a for loop and an if condition to sum ONLY the even numbers in [3, 4, 7, 10, 6] and print the secret vault total.',
    mode: 'code',
    prompt:
      'Complete the code so total adds even numbers only (4 + 10 + 6 = 20) and prints 20.',
    starterCode: `total = 0\nfor num in [3, 4, 7, 10, 6]:\n    if num % 2 == 1:\n        total += num\nprint(total)`,
    expectedOutput: '20',
    hint: 'num % 2 == 1 checks for ODD numbers! Change 1 to 0 so only EVEN numbers are added.',
    solutionExplanation:
      'Checking num % 2 == 0 selects 4, 10, and 6, summing them to 20 and opening the Golden Code Vault!',
    verifyCode: (output, code) => {
      const passed =
        output.trim() === '20' &&
        /for\s+\w+\s+in/.test(code) &&
        /if\s+/.test(code);
      return passed
        ? { passed: true, message: 'Vault Unlocked! You escaped The Python Code Vault!' }
        : {
            passed: false,
            message: 'Use a for loop + if condition to print the final sum 20.',
          };
    },
  },
];

export const PythonEscapeRoom: React.FC<PythonEscapeRoomProps> = ({
  completedEscapeRooms,
  onCompleteRoom,
}) => {
  const [activeRoomIdx, setActiveRoomIdx] = useState<number>(() => {
    const firstUnsolved = VAULT_ROOMS.findIndex((r) => !completedEscapeRooms.includes(r.id));
    return firstUnsolved === -1 ? 0 : firstUnsolved;
  });

  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    VAULT_ROOMS.forEach((r) => {
      if (r.starterCode) map[r.id] = r.starterCode;
    });
    return map;
  });
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{
    passed: boolean;
    message: string;
    output?: string;
  } | null>(null);
  const [scoreCardData, setScoreCardData] = useState<ScoreCardData | null>(null);

  const room = VAULT_ROOMS[activeRoomIdx];
  const solvedCount = VAULT_ROOMS.filter((r) => completedEscapeRooms.includes(r.id)).length;
  const vaultUnlocked = solvedCount === VAULT_ROOMS.length;

  const isRoomUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedEscapeRooms.includes(VAULT_ROOMS[idx - 1].id);
  };

  const selectRoom = (idx: number) => {
    if (!isRoomUnlocked(idx)) return;
    setActiveRoomIdx(idx);
    setSelectedOpt(null);
    setShowHint(false);
    setFeedback(null);
  };

  const handleSolveChoice = () => {
    if (selectedOpt === null) return;
    if (selectedOpt === room.correctOption) {
      onCompleteRoom(room.id, room.title);
      if (activeRoomIdx === VAULT_ROOMS.length - 1) {
        onCompleteRoom('vault-complete', 'Escaped The Python Code Vault');
      }
      setFeedback({
        passed: true,
        message: `Key accepted! ${room.solutionExplanation}`,
      });
    } else {
      setFeedback({
        passed: false,
        message: 'Incorrect code key. Use the hint or trace carefully and try again!',
      });
    }
  };

  const handleRunRoomCode = () => {
    const code = codeInputs[room.id] ?? room.starterCode ?? '';
    const res = runPythonCode(code);
    if (!res.success) {
      setFeedback({
        passed: false,
        message: `${res.error?.type || 'Error'} on Line ${res.error?.line || 1}: ${
          res.error?.message || 'Check syntax.'
        }`,
        output: res.output,
      });
      return;
    }

    const check = room.verifyCode
      ? room.verifyCode(res.output, code)
      : { passed: true, message: 'Code verified!' };

    setFeedback({
      passed: check.passed,
      message: check.passed ? `${check.message} ${room.solutionExplanation}` : check.message,
      output: res.output,
    });

    if (check.passed) {
      onCompleteRoom(room.id, room.title);
      if (solvedCount + (completedEscapeRooms.includes(room.id) ? 0 : 1) >= VAULT_ROOMS.length) {
        onCompleteRoom('vault-complete', 'Escaped The Python Code Vault');
      }
    }
  };

  const roomSolved = completedEscapeRooms.includes(room.id);

  return (
    <div className="space-y-6">
      {/* Vault Banner */}
      <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 bg-white dark:bg-[#1a0808] p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#E10906]">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              5-Stage Interactive Python Escape Mission
            </div>
            <h2 className="font-display text-2xl font-extrabold text-[#100303] dark:text-[#f0eaea] sm:text-3xl">
              The Python Code Vault
            </h2>
            <p className="text-sm text-[#8A8585] dark:text-[#9a8585]">
              Unlock all 5 rooms sequentially using variables, conditionals, loops, memory tracing, and combined logic.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-5 py-3 text-center shadow-xs">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8585] dark:text-[#9a8585]">
              Vault Progress
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold text-[#E10906] tabular-nums">
              {solvedCount} / {VAULT_ROOMS.length}
            </p>
          </div>
        </div>

        {/* 5-Room Visual Progression Map */}
        <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-5">
          {VAULT_ROOMS.map((rm, idx) => {
            const unlocked = isRoomUnlocked(idx);
            const solved = completedEscapeRooms.includes(rm.id);
            const active = idx === activeRoomIdx;
            return (
              <button
                key={rm.id}
                type="button"
                disabled={!unlocked}
                onClick={() => selectRoom(idx)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  active
                    ? 'border-[#E10906] bg-white dark:bg-[#1a0808] shadow-md ring-2 ring-[#E10906]/30'
                    : solved
                    ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 hover:border-emerald-300'
                    : unlocked
                    ? 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] hover:border-[#E10906]'
                    : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="font-mono text-[#8A8585] dark:text-[#9a8585]">{rm.number}</span>
                  {solved ? (
                    <Unlock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-label="Unlocked" />
                  ) : unlocked ? (
                    <KeyRound className="h-4 w-4 text-[#E10906]" aria-label="Ready" />
                  ) : (
                    <Lock className="h-4 w-4 text-[#8A8585] dark:text-[#9a8585]" aria-label="Locked" />
                  )}
                </div>
                <p className="mt-1.5 font-display text-xs font-bold text-[#100303] dark:text-[#f0eaea] line-clamp-2">
                  {rm.title.split('—')[0].trim()}
                </p>
                <p className="mt-0.5 text-[11px] text-[#8A8585] dark:text-[#9a8585] truncate">{rm.concept}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vault Completion Celebration */}
      {vaultUnlocked && (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Trophy className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-emerald-950 dark:text-emerald-100">
                Vault Mastered! All 5 Rooms Unlocked
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-200">
                You earned the Escape Room Solver badge and +120 XP vault bonus! Feel free to replay any room below.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setScoreCardData({
                  title: 'The Python Code Vault',
                  category: 'Escape Room',
                  score: 5,
                  maxScore: 5,
                  topic: 'Vault Master',
                });
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#E10906] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#C40705]"
            >
              <Share2 className="h-4 w-4" />
              Share Score Card
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Code Vault Cleared
            </span>
          </div>
        </div>
      )}

      {/* Active Room Stage */}
      <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-semibold text-[#E10906]">
              {room.number} · {room.concept}
            </span>
            <h3 className="mt-1 font-display text-2xl font-bold text-[#100303] dark:text-[#f0eaea]">
              {room.title}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#8A8585] dark:text-[#9a8585]">{room.story}</p>
          </div>
          {roomSolved && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Room Unlocked
            </span>
          )}
        </div>

        <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-4 py-3 text-sm font-semibold text-[#100303] dark:text-[#f0eaea]">
          Mission Objective: {room.prompt}
        </div>

        {room.mode === 'choice' ? (
          <div className="space-y-4">
            {room.snippet && (
              <CodeBlock code={room.snippet} title="vault_lock.py" showCopy={false} compact />
            )}

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {room.options?.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedOpt(idx);
                    setFeedback(null);
                  }}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left font-mono text-xs sm:text-sm transition-all ${
                    selectedOpt === idx
                      ? 'border-[#E10906] bg-[#EFF6FF] dark:bg-sky-950/40 font-semibold text-[#100303] dark:text-[#f0eaea] ring-1 ring-[#38BDF8]'
                      : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]'
                  }`}
                >
                  <span className="font-bold text-[#8A8585] dark:text-[#9a8585]">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={selectedOpt === null}
                onClick={handleSolveChoice}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-40"
              >
                <Unlock className="h-4 w-4" aria-hidden="true" />
                Submit Door Key
              </button>
              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {showHint ? 'Hide Hint' : 'Room Hint'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="overflow-hidden rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] lg:col-span-8">
                <div className="flex items-center justify-between border-b border-[#2C1616] bg-[#190909] px-4 py-2 text-xs text-[#CFC8C8]">
                  <span className="font-mono font-medium">room_terminal.py</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeInputs((prev) => ({
                        ...prev,
                        [room.id]: room.starterCode ?? '',
                      }));
                      setFeedback(null);
                    }}
                    className="inline-flex items-center gap-1 text-[#CFC8C8] hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" aria-hidden="true" />
                    Reset
                  </button>
                </div>
                <textarea
                  aria-label="Escape room Python editor"
                  value={codeInputs[room.id] ?? ''}
                  onChange={(e) =>
                    setCodeInputs((prev) => ({ ...prev, [room.id]: e.target.value }))
                  }
                  spellCheck={false}
                  rows={7}
                  className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-6 text-[#FBF5F9] focus:outline-none"
                />
              </div>

              <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#100303] p-4 lg:col-span-4">
                <p className="text-xs font-semibold text-[#CFC8C8]">Target Unlock Output</p>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-emerald-300">
                  {room.expectedOutput}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRunRoomCode}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-[#E10906] px-5 py-2 text-xs font-semibold text-white shadow-sm"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Run &amp; Unlock Door
              </button>
              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-4 py-2 text-xs font-semibold text-amber-900 dark:text-amber-200"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {showHint ? 'Hide Hint' : 'Room Hint'}
              </button>
            </div>
          </div>
        )}

        {showHint && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 p-3.5 text-xs text-amber-950 dark:text-amber-100">
            <strong>Hint:</strong> {room.hint}
          </div>
        )}

        {feedback && (
          <div
            className={`rounded-xl border p-4 text-xs sm:text-sm ${
              feedback.passed
                ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                : 'border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 font-semibold">
                {feedback.passed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    {room.number} Unlocked!
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                    Not Unlocked Yet
                  </>
                )}
              </span>

              {feedback.passed && activeRoomIdx < VAULT_ROOMS.length - 1 && (
                <button
                  type="button"
                  onClick={() => selectRoom(activeRoomIdx + 1)}
                  className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/400"
                >
                  Enter {VAULT_ROOMS[activeRoomIdx + 1].number} →
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[#100303] dark:text-[#f0eaea]">{feedback.message}</p>
            {feedback.output && (
              <pre className="mt-2.5 rounded-xl bg-[#100303] p-3 font-mono text-xs text-emerald-300">
                Your Output:{'\n'}
                {feedback.output}
              </pre>
            )}
          </div>
        )}
      </div>

      {scoreCardData && (
        <ScoreCardModal
          data={scoreCardData}
          onClose={() => setScoreCardData(null)}
        />
      )}
    </div>
  );
};
