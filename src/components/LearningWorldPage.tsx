import React, { useState, lazy, Suspense } from 'react';
import {
  ArrowRight,
  Award,
  Box,
  CheckCircle2,
  Compass,
  Flame,
  GitBranch,
  Lock,
  Play,
  Repeat,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  GamesHubTabId,
  LearningProgress,
  MissionDef,
  SectionId,
  TopicId,
} from '../types';
import {
  TOPIC_BASICS_LESSONS,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
} from '../data/curriculumData';
import {
  LEARNING_MISSIONS,
  UPCOMING_PYTHON_ROADMAP,
  XP_REWARDS,
  getLearnerLevel,
} from '../data/ecosystemData';
import { computeStreakDays } from '../hooks/useProgress';
import { CodeBlock } from './CodeBlock';
import { DailyQuestCard } from './DailyQuestCard';

const LearnSection = lazy(() =>
  import('./LearnSection').then((m) => ({ default: m.LearnSection }))
);

interface LearningWorldPageProps {
  activeTopic: TopicId;
  onChangeTopic: (topic: TopicId) => void;
  progress: LearningProgress;
  onToggleLesson: (lessonId: string) => void;
  onCompleteMission: (
    missionId: string,
    title: string,
    topic: TopicId,
    xpReward: number,
    linkedLessonId?: string
  ) => void;
  onCompleteDailyQuest: (
    questId: string,
    title: string,
    topic: TopicId,
    xpReward: number
  ) => void;
  onNavigate: (section: SectionId) => void;
  onOpenGamesTab: (tab: GamesHubTabId) => void;
  onOpenInSandbox: (code: string) => void;
}

type WorldTab = 'map' | 'missions' | 'lessons' | 'daily-quest';

export const LearningWorldPage: React.FC<LearningWorldPageProps> = ({
  activeTopic,
  onChangeTopic,
  progress,
  onToggleLesson,
  onCompleteMission,
  onCompleteDailyQuest,
  onNavigate,
  onOpenGamesTab,
  onOpenInSandbox,
}) => {
  const [worldTab, setWorldTab] = useState<WorldTab>('map');
  const [selectedMission, setSelectedMission] = useState<MissionDef | null>(null);
  const [missionAnswer, setMissionAnswer] = useState<number | null>(null);
  const [missionSubmitted, setMissionSubmitted] = useState(false);

  const levelInfo = getLearnerLevel(progress.xp);
  const streakDays = computeStreakDays(progress.activeDates);

  const basicsLessonsDone = TOPIC_BASICS_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const condLessonsDone = TOPIC_08_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  const loopsLessonsDone = TOPIC_09_LESSONS.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;

  const basicsMissions = LEARNING_MISSIONS.filter((m) => m.topic === 'basics');
  const condMissions = LEARNING_MISSIONS.filter((m) => m.topic === 'conditionals');
  const loopsMissions = LEARNING_MISSIONS.filter((m) => m.topic === 'loops');

  const countDoneMissions = (list: MissionDef[]) =>
    list.filter((m) => progress.completedMissions.includes(m.id)).length;

  const basicsDone = countDoneMissions(basicsMissions);
  const condDone = countDoneMissions(condMissions);
  const loopsDone = countDoneMissions(loopsMissions);

  // Real unlock progression (learners can still switch into any topic in Lesson View, while Adventure Map celebrates milestone mastery!)
  const levels = [
    {
      id: 'basics' as TopicId,
      num: 'Level 01',
      title: 'Python Basics',
      difficulty: 'Beginner',
      description: 'Variables, object references, core data types, f-strings, and 4-space blocks.',
      missionsTotal: basicsMissions.length,
      missionsDone: basicsDone,
      lessonsDone: basicsLessonsDone,
      lessonsTotal: TOPIC_BASICS_LESSONS.length,
      xpPool: basicsMissions.length * XP_REWARDS.mission,
      status:
        basicsDone === basicsMissions.length
          ? 'Completed'
          : basicsDone > 0 || basicsLessonsDone > 0
          ? 'In Progress'
          : 'Available',
      unlockText: 'Unlocked from the start',
      icon: Box,
      accent: 'from-[#E10906] to-[#C40705]',
    },
    {
      id: 'conditionals' as TopicId,
      num: 'Level 02',
      title: 'Conditional Statements',
      difficulty: 'Guided',
      description: 'if, if-else, elif ladders, nested checks, comparison & logical operators.',
      missionsTotal: condMissions.length,
      missionsDone: condDone,
      lessonsDone: condLessonsDone,
      lessonsTotal: TOPIC_08_LESSONS.length,
      xpPool: condMissions.length * XP_REWARDS.mission,
      status:
        condDone === condMissions.length
          ? 'Completed'
          : condDone > 0 || condLessonsDone > 0
          ? 'In Progress'
          : 'Available',
      unlockText: 'Available now · Recommended after 1+ Python Basics mission',
      icon: GitBranch,
      accent: 'from-[#E10906] to-[#C40705]',
    },
    {
      id: 'loops' as TopicId,
      num: 'Level 03',
      title: 'Loops & Iteration',
      difficulty: 'Applied',
      description: 'for loops, range(), while loops, break, continue, and nested loop grids.',
      missionsTotal: loopsMissions.length,
      missionsDone: loopsDone,
      lessonsDone: loopsLessonsDone,
      lessonsTotal: TOPIC_09_LESSONS.length,
      xpPool: loopsMissions.length * XP_REWARDS.mission,
      status:
        loopsDone === loopsMissions.length
          ? 'Completed'
          : loopsDone > 0 || loopsLessonsDone > 0
          ? 'In Progress'
          : 'Available',
      unlockText: 'Available now · Recommended after Conditionals',
      icon: Repeat,
      accent: 'from-[#E10906] to-[#C40705]',
    },
  ];

  const activeTopicMissions = LEARNING_MISSIONS.filter((m) => m.topic === activeTopic);

  const openMission = (mission: MissionDef) => {
    setSelectedMission(mission);
    const alreadyDone = progress.completedMissions.includes(mission.id);
    setMissionAnswer(alreadyDone ? mission.correctIndex : null);
    setMissionSubmitted(alreadyDone);
  };

  const submitMission = () => {
    if (!selectedMission || missionAnswer === null) return;
    setMissionSubmitted(true);
    if (missionAnswer === selectedMission.correctIndex) {
      onCompleteMission(
        selectedMission.id,
        selectedMission.title,
        selectedMission.topic,
        selectedMission.xpReward,
        selectedMission.linkedLessonId
      );
    }
  };

  return (
    <div>
      {/* Top Learning World Banner + XP / Level Bar */}
      <div className="border-b border-[#E5DFDF] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold text-[#E10906]">
                PyVerse Learning World
              </p>
              <h1 className="mt-1 font-display text-3xl font-extrabold text-[#100303] sm:text-4xl">
                Python Adventure Map &amp; Missions
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-[#8A8585]">
                Explore connected levels, solve interactive missions, claim your Daily Quest, and
                dive into visual lessons.
              </p>
            </div>

            {/* Live XP & Streak Pill-Free Readout Card */}
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#E5DFDF] bg-[#FBF5F9] px-4 py-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#100303]">
                  <Award className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
                  <span>
                    Lvl {levelInfo.current.level}: {levelInfo.current.title}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-[#E5DFDF]">
                    <div
                      className="h-full rounded-full bg-[#E10906]"
                      style={{ width: `${levelInfo.progressPercent}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#E10906] tabular-nums">
                    {progress.xp} XP
                  </span>
                </div>
              </div>

              <div className="h-8 w-px bg-[#E5DFDF]" aria-hidden="true" />

              <div className="text-xs">
                <span className="flex items-center gap-1 font-semibold text-[#100303] tabular-nums">
                  <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  {streakDays}d streak
                </span>
                <span className="font-mono text-[11px] text-[#8A8585] tabular-nums">
                  Best: {progress.longestStreak}d
                </span>
              </div>
            </div>
          </div>

          {/* World Sub-Navigation Tabs */}
          <div className="mt-5 inline-flex flex-wrap gap-1 rounded-2xl border border-[#E5DFDF] bg-[#FBF5F9] p-1">
            {(
              [
                { id: 'map', label: 'Adventure Map', icon: Compass },
                { id: 'missions', label: `Missions (${progress.completedMissions.length}/17)`, icon: Trophy },
                { id: 'lessons', label: 'Visual Lessons (6 Stages)', icon: Sparkles },
                { id: 'daily-quest', label: 'Daily Python Quest', icon: Flame },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = worldTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setWorldTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-[#E10906] text-white shadow-sm'
                      : 'text-[#8A8585] hover:bg-white hover:text-[#100303]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB 1: PYTHON ADVENTURE MAP */}
      {worldTab === 'map' && (
        <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {levels.map((lvl) => {
              const Icon = lvl.icon;
              const pct = Math.round(
                ((lvl.missionsDone + lvl.lessonsDone) /
                  Math.max(1, lvl.missionsTotal + lvl.lessonsTotal)) *
                  100
              );
              return (
                <div
                  key={lvl.id}
                  className="flex flex-col justify-between rounded-3xl border border-[#E5DFDF] bg-white p-6 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-bold text-[#E10906]">
                        {lvl.num} · {lvl.difficulty}
                      </span>
                      <span
                        className={`font-mono font-semibold ${
                          lvl.status === 'Completed'
                            ? 'text-emerald-700'
                            : lvl.status === 'In Progress'
                            ? 'text-[#E10906]'
                            : 'text-[#8A8585]'
                        }`}
                      >
                        {lvl.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${lvl.accent} text-white shadow-sm`}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-bold text-[#100303]">
                          {lvl.title}
                        </h2>
                        <span className="font-mono text-[11px] text-[#8A8585] tabular-nums">
                          {lvl.missionsDone}/{lvl.missionsTotal} missions · +{lvl.xpPool} XP pool
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-[#8A8585]">
                      {lvl.description}
                    </p>

                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] font-mono text-[#8A8585] tabular-nums">
                        <span>Mastery</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#F1EEEE]">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${lvl.accent} transition-all duration-300`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2.5 border-t border-[#F1EEEE] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        onChangeTopic(lvl.id);
                        setWorldTab('missions');
                      }}
                      className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#E10906] px-3.5 py-2 font-display text-xs font-semibold text-white shadow-xs hover:opacity-95"
                    >
                      <Play className="h-3.5 w-3.5" aria-hidden="true" />
                      {lvl.missionsDone > 0 ? 'Continue Missions' : 'Start Missions'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onChangeTopic(lvl.id);
                        setWorldTab('lessons');
                      }}
                      className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#E5DFDF] bg-[#FBF5F9] px-3.5 py-2 font-display text-xs font-semibold text-[#100303] hover:border-[#E10906]"
                    >
                      Lessons
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upcoming Python Expansion Roadmap (Honestly Marked — Not Fake Empty Lessons) */}
          <div className="rounded-3xl border border-[#E5DFDF] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1EEEE] pb-4">
              <div>
                <p className="text-xs font-semibold text-[#8A8585]">Curriculum Architecture</p>
                <h2 className="mt-0.5 font-display text-lg font-bold text-[#100303]">
                  Future Python Worlds (Planned Expansion)
                </h2>
              </div>
              <span className="font-mono text-xs text-[#8A8585]">
                Locked until future curriculum modules are added
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {UPCOMING_PYTHON_ROADMAP.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-[#E5DFDF] bg-[#FBF5F9] p-4 opacity-80"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E5DFDF] text-[#8A8585]">
                    <Lock className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#100303]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#8A8585]">{item.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOPIC MISSIONS */}
      {worldTab === 'missions' && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-[#E5DFDF] bg-white p-1">
              {(
                [
                  { id: 'basics', label: `01. Python Basics (${basicsDone}/${basicsMissions.length})` },
                  { id: 'conditionals', label: `02. Conditionals (${condDone}/${condMissions.length})` },
                  { id: 'loops', label: `03. Loops (${loopsDone}/${loopsMissions.length})` },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onChangeTopic(t.id);
                    setSelectedMission(null);
                  }}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTopic === t.id
                      ? 'bg-[#E10906] text-white shadow-xs'
                      : 'text-[#8A8585] hover:text-[#100303]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setWorldTab('lessons')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E10906] hover:text-[#E10906]"
            >
              Open Full Visual Lessons <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Mission List */}
            <div className="space-y-3 lg:col-span-5">
              {activeTopicMissions.map((m) => {
                const done = progress.completedMissions.includes(m.id);
                const active = selectedMission?.id === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => openMission(m)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${
                      active
                        ? 'border-[#E10906] bg-[#FFF1F1] shadow-xs'
                        : done
                        ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
                        : 'border-[#E5DFDF] bg-white hover:border-[#E10906]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="font-bold text-[#E10906]">{m.number}</span>
                        <span className="text-[#8A8585]">· +{m.xpReward} XP</span>
                      </div>
                      <p className="mt-0.5 truncate font-display text-sm font-bold text-[#100303]">
                        {m.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#8A8585]">{m.objective}</p>
                    </div>
                    {done && (
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 text-emerald-600"
                        aria-label="Mission completed"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Mission Workspace */}
            <div className="lg:col-span-7">
              {selectedMission ? (
                <div className="rounded-3xl border border-[#E5DFDF] bg-white p-6 shadow-sm space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F1EEEE] pb-4">
                    <div>
                      <span className="font-mono text-xs font-semibold text-[#E10906]">
                        Mission {selectedMission.number} · +{selectedMission.xpReward} XP
                      </span>
                      <h2 className="mt-1 font-display text-2xl font-bold text-[#100303]">
                        {selectedMission.title}
                      </h2>
                      <p className="mt-1 text-sm text-[#8A8585]">{selectedMission.objective}</p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-[#100303]">
                    {selectedMission.intro}
                  </p>

                  <CodeBlock title="mission_example.py" code={selectedMission.exampleCode} />

                  <div className="rounded-2xl border border-[#F1EEEE] bg-[#FFF1F1]/70 p-4 space-y-3">
                    <p className="font-display text-sm font-bold text-[#100303]">
                      Mission Check: {selectedMission.prompt}
                    </p>

                    <div className="space-y-2">
                      {selectedMission.options.map((opt, idx) => {
                        const chosen = missionAnswer === idx;
                        const isCorrect = idx === selectedMission.correctIndex;
                        let cls =
                          'border-[#E5DFDF] bg-white text-[#100303] hover:border-[#E10906]';
                        if (missionSubmitted) {
                          if (isCorrect) {
                            cls = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold';
                          } else if (chosen) {
                            cls = 'border-rose-300 bg-rose-50 text-rose-900';
                          }
                        } else if (chosen) {
                          cls = 'border-[#E10906] bg-[#FFF1F1] font-semibold';
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (missionSubmitted && missionAnswer !== selectedMission.correctIndex) {
                                setMissionSubmitted(false);
                              }
                              setMissionAnswer(idx);
                            }}
                            className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left font-mono text-xs sm:text-sm transition-colors ${cls}`}
                          >
                            <span>{opt}</span>
                            {missionSubmitted && isCorrect && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                            )}
                            {missionSubmitted && chosen && !isCorrect && (
                              <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={submitMission}
                        disabled={missionAnswer === null}
                        className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#E10906] px-4 py-2 font-display text-xs font-semibold text-white shadow-sm disabled:opacity-40"
                      >
                        Complete Mission
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenInSandbox(selectedMission.exampleCode)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E5DFDF] bg-white px-3.5 py-2 text-xs font-semibold text-[#100303] hover:border-[#E10906]"
                      >
                        Try Example in Studio
                      </button>
                    </div>

                    {missionSubmitted && (
                      <p
                        className={`rounded-xl border px-3.5 py-2.5 text-xs ${
                          missionAnswer === selectedMission.correctIndex
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                            : 'border-rose-200 bg-rose-50 text-rose-900'
                        }`}
                      >
                        {missionAnswer === selectedMission.correctIndex
                          ? `Mission Complete! ${selectedMission.explanation}`
                          : 'Not quite — review the example above and try another option.'}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#E5DFDF] bg-white p-8 text-center">
                  <Compass className="h-10 w-10 text-[#E10906]" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-lg font-bold text-[#100303]">
                    Select a Mission to Begin
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-[#8A8585]">
                    Pick any mission on the left to study the concept, inspect the Python snippet,
                    and earn XP for completing the check.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FULL 6-STAGE VISUAL LESSONS (PRESERVED) */}
      {worldTab === 'lessons' && (
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-12 text-center font-mono text-xs text-[#8A8585]">
              Loading Visual Lessons...
            </div>
          }
        >
          <LearnSection
            activeTopic={activeTopic}
            onChangeTopic={onChangeTopic}
            completedLessons={progress.completedLessons}
            onToggleLesson={onToggleLesson}
            onNavigate={onNavigate}
            onOpenGamesTab={onOpenGamesTab}
            onOpenInSandbox={onOpenInSandbox}
          />
        </Suspense>
      )}

      {/* TAB 4: DAILY PYTHON QUEST */}
      {worldTab === 'daily-quest' && (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <DailyQuestCard
            completedDailyQuests={progress.completedDailyQuests}
            onCompleteDailyQuest={onCompleteDailyQuest}
          />
        </div>
      )}
    </div>
  );
};
