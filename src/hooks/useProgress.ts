import { useState, useEffect, useCallback } from 'react';
import {
  ActivityRecord,
  ActivityType,
  LearningProgress,
  LessonNote,
  SavedSnippet,
  SimulatorId,
  TopicId,
  TutorDifficulty,
  TutorTopic,
  UserPreferences,
  XPHistoryEntry,
} from '../types';
import { XP_REWARDS } from '../data/ecosystemData';

const STORAGE_KEY_V2 = 'pyverse_progress_v2';
const LEGACY_STORAGE_KEYS = ['pyverse_progress_v1', 'python_lab_progress_v1'];

export function getLocalDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeStreakDays(activeDates: string[]): number {
  if (!activeDates || activeDates.length === 0) return 0;
  const set = new Set(activeDates);
  const today = new Date();
  const todayKey = getLocalDateKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);

  const cursor = set.has(todayKey)
    ? new Date(today)
    : set.has(yesterdayKey)
    ? yesterday
    : null;

  if (!cursor) return 0;

  let streak = 0;
  while (set.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeLongestStreak(activeDates: string[]): number {
  if (!activeDates || activeDates.length === 0) return 0;
  const sorted = Array.from(new Set(activeDates)).sort();
  let best = 0;
  let run = 0;
  let prevTime: number | null = null;

  for (const key of sorted) {
    const parts = key.split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) continue;
    const dt = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
    if (prevTime !== null && Math.round((dt - prevTime) / 86400000) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prevTime = dt;
  }
  return best;
}

function appendTodayDate(dates: string[]): string[] {
  const today = getLocalDateKey();
  if (dates.includes(today)) return dates;
  return [...dates, today].slice(-90);
}

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredMode: 'guided',
  fontSize: 'normal',
  reducedMotion: false,
  soundEffects: false,
};

const DEFAULT_PROGRESS: LearningProgress = {
  version: 2,
  xp: 0,
  xpHistory: [],
  activities: {},
  completedLessons: [],
  completedMissions: [],
  completedChallenges: [],
  completedBugHunts: [],
  completedEscapeRooms: [],
  completedDailyQuests: [],
  understoodFlashcards: [],
  quizScores: {
    conditionals: null,
    loops: null,
  },
  gameScores: {},
  gameAttempts: {},
  visitedSimulators: [],
  simulatorRuns: 0,
  sandboxRuns: 0,
  activeDates: [],
  longestStreak: 0,
  activeTutorTopic: 'Python Basics',
  tutorDifficulty: 'Beginner',
  conceptsUnderstood: [],
  conceptsToReview: [],
  practiceAttempts: 0,
  practiceSuccesses: 0,
  recentTopics: ['Python Basics'],
  savedSnippets: [],
  bookmarkedLessons: [],
  lessonNotes: {},
  preferences: DEFAULT_PREFERENCES,
};

function recordUniqueActivity(
  prev: LearningProgress,
  opts: {
    activityId: string;
    type: ActivityType;
    title: string;
    topic: TopicId | 'mixed';
    xpReward: number;
    score?: number;
    maxScore?: number;
    markDate?: boolean;
  }
): LearningProgress {
  const existing = prev.activities[opts.activityId];
  const alreadyRewarded = Boolean(existing && existing.xpAwarded > 0);
  const xpToAdd = alreadyRewarded ? 0 : opts.xpReward;
  const now = Date.now();

  const updatedRecord: ActivityRecord = {
    id: opts.activityId,
    type: opts.type,
    title: opts.title,
    topic: opts.topic,
    completed: true,
    score: opts.score ?? existing?.score,
    maxScore: opts.maxScore ?? existing?.maxScore,
    xpAwarded: existing ? existing.xpAwarded || xpToAdd : xpToAdd,
    timestamp: now,
    attempts: (existing?.attempts ?? 0) + 1,
  };

  const nextDates = opts.markDate !== false ? appendTodayDate(prev.activeDates) : prev.activeDates;
  const nextLongest = Math.max(prev.longestStreak, computeLongestStreak(nextDates));

  const nextHistory: XPHistoryEntry[] =
    xpToAdd > 0
      ? [
          {
            id: `xp-${now}-${Math.random().toString(36).slice(2, 6)}`,
            activityId: opts.activityId,
            label: opts.title,
            amount: xpToAdd,
            timestamp: now,
          },
          ...prev.xpHistory,
        ].slice(0, 40)
      : prev.xpHistory;

  return {
    ...prev,
    xp: prev.xp + xpToAdd,
    xpHistory: nextHistory,
    activities: {
      ...prev.activities,
      [opts.activityId]: updatedRecord,
    },
    activeDates: nextDates,
    longestStreak: nextLongest,
  };
}

function migrateLegacyProgress(parsed: Partial<LearningProgress>): LearningProgress {
  const completedLessons = Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [];
  const completedChallenges = Array.isArray(parsed.completedChallenges)
    ? parsed.completedChallenges
    : [];
  const visitedSimulators = Array.isArray(parsed.visitedSimulators) ? parsed.visitedSimulators : [];
  const activeDates = Array.isArray(parsed.activeDates) ? parsed.activeDates : [];

  // Recompute initial XP cleanly from existing completed items during v1->v2 migration only
  let migratedXp = typeof parsed.xp === 'number' ? parsed.xp : 0;
  const migratedActivities: Record<string, ActivityRecord> =
    parsed.activities && typeof parsed.activities === 'object' ? { ...parsed.activities } : {};

  if (typeof parsed.version !== 'number' || parsed.version < 2) {
    const now = Date.now();
    for (const lid of completedLessons) {
      const aid = `lesson:${lid}`;
      if (!migratedActivities[aid]) {
        migratedActivities[aid] = {
          id: aid,
          type: 'lesson',
          title: `Lesson ${lid}`,
          topic: lid.startsWith('b-') ? 'basics' : lid.startsWith('c-') ? 'conditionals' : 'loops',
          completed: true,
          xpAwarded: XP_REWARDS.lesson,
          timestamp: now,
          attempts: 1,
        };
        migratedXp += XP_REWARDS.lesson;
      }
    }
    for (const cid of completedChallenges) {
      const aid = `challenge:${cid}`;
      if (!migratedActivities[aid]) {
        migratedActivities[aid] = {
          id: aid,
          type: 'challenge',
          title: `Challenge ${cid}`,
          topic: cid.startsWith('ch-c') ? 'conditionals' : 'loops',
          completed: true,
          xpAwarded: XP_REWARDS.challenge,
          timestamp: now,
          attempts: 1,
        };
        migratedXp += XP_REWARDS.challenge;
      }
    }
    for (const sid of visitedSimulators) {
      const aid = `sim:${sid}`;
      if (!migratedActivities[aid]) {
        migratedActivities[aid] = {
          id: aid,
          type: 'simulator',
          title: `Simulator ${sid}`,
          topic: 'mixed',
          completed: true,
          xpAwarded: XP_REWARDS.simulator,
          timestamp: now,
          attempts: 1,
        };
        migratedXp += XP_REWARDS.simulator;
      }
    }
  }

  return {
    version: 2,
    xp: migratedXp,
    xpHistory: Array.isArray(parsed.xpHistory) ? parsed.xpHistory : [],
    activities: migratedActivities,
    completedLessons,
    completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
    completedChallenges,
    completedBugHunts: Array.isArray(parsed.completedBugHunts) ? parsed.completedBugHunts : [],
    completedEscapeRooms: Array.isArray(parsed.completedEscapeRooms)
      ? parsed.completedEscapeRooms
      : [],
    completedDailyQuests: Array.isArray(parsed.completedDailyQuests)
      ? parsed.completedDailyQuests
      : [],
    understoodFlashcards: Array.isArray(parsed.understoodFlashcards)
      ? parsed.understoodFlashcards
      : [],
    quizScores: {
      conditionals: parsed.quizScores?.conditionals ?? null,
      loops: parsed.quizScores?.loops ?? null,
    },
    gameScores: parsed.gameScores ?? {},
    gameAttempts: parsed.gameAttempts ?? {},
    visitedSimulators,
    simulatorRuns: typeof parsed.simulatorRuns === 'number' ? parsed.simulatorRuns : 0,
    sandboxRuns: typeof parsed.sandboxRuns === 'number' ? parsed.sandboxRuns : 0,
    activeDates,
    longestStreak: Math.max(
      typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
      computeLongestStreak(activeDates)
    ),
    activeTutorTopic: parsed.activeTutorTopic ?? 'Python Basics',
    tutorDifficulty: parsed.tutorDifficulty ?? 'Beginner',
    conceptsUnderstood: Array.isArray(parsed.conceptsUnderstood) ? parsed.conceptsUnderstood : [],
    conceptsToReview: Array.isArray(parsed.conceptsToReview) ? parsed.conceptsToReview : [],
    practiceAttempts: typeof parsed.practiceAttempts === 'number' ? parsed.practiceAttempts : 0,
    practiceSuccesses: typeof parsed.practiceSuccesses === 'number' ? parsed.practiceSuccesses : 0,
    recentTopics:
      Array.isArray(parsed.recentTopics) && parsed.recentTopics.length > 0
        ? parsed.recentTopics
        : ['Python Basics'],
    savedSnippets: Array.isArray(parsed.savedSnippets) ? parsed.savedSnippets : [],
    bookmarkedLessons: Array.isArray(parsed.bookmarkedLessons) ? parsed.bookmarkedLessons : [],
    lessonNotes:
      parsed.lessonNotes && typeof parsed.lessonNotes === 'object' ? parsed.lessonNotes : {},
    preferences: {
      ...DEFAULT_PREFERENCES,
      ...(parsed.preferences ?? {}),
    },
  };
}

function loadProgress(): LearningProgress {
  try {
    let raw = window.localStorage.getItem(STORAGE_KEY_V2);
    if (!raw) {
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        const legacy = window.localStorage.getItem(legacyKey);
        if (legacy) {
          raw = legacy;
          break;
        }
      }
    }
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return migrateLegacyProgress(parsed);
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [progress]);

  // Apply font-size & reduced-motion accessibility preferences at root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.dataset.fontSize = progress.preferences.fontSize;
    root.dataset.reducedMotion = progress.preferences.reducedMotion ? 'true' : 'false';
  }, [progress.preferences]);

  const toggleLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      if (exists) {
        return {
          ...prev,
          completedLessons: prev.completedLessons.filter((id) => id !== lessonId),
        };
      }
      const topic: TopicId = lessonId.startsWith('b-')
        ? 'basics'
        : lessonId.startsWith('c-')
        ? 'conditionals'
        : 'loops';
      const updated = recordUniqueActivity(prev, {
        activityId: `lesson:${lessonId}`,
        type: 'lesson',
        title: `Completed Lesson ${lessonId}`,
        topic,
        xpReward: XP_REWARDS.lesson,
      });
      return {
        ...updated,
        completedLessons: [...updated.completedLessons, lessonId],
      };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const topic: TopicId = lessonId.startsWith('b-')
        ? 'basics'
        : lessonId.startsWith('c-')
        ? 'conditionals'
        : 'loops';
      const updated = recordUniqueActivity(prev, {
        activityId: `lesson:${lessonId}`,
        type: 'lesson',
        title: `Completed Lesson ${lessonId}`,
        topic,
        xpReward: XP_REWARDS.lesson,
      });
      return {
        ...updated,
        completedLessons: [...updated.completedLessons, lessonId],
      };
    });
  }, []);

  const completeMission = useCallback(
    (missionId: string, title: string, topic: TopicId, xpReward: number, linkedLessonId?: string) => {
      setProgress((prev) => {
        let next = recordUniqueActivity(prev, {
          activityId: `mission:${missionId}`,
          type: 'mission',
          title: `Mission: ${title}`,
          topic,
          xpReward,
        });
        if (!next.completedMissions.includes(missionId)) {
          next = {
            ...next,
            completedMissions: [...next.completedMissions, missionId],
          };
        }
        if (linkedLessonId && !next.completedLessons.includes(linkedLessonId)) {
          next = {
            ...next,
            completedLessons: [...next.completedLessons, linkedLessonId],
          };
        }
        return next;
      });
    },
    []
  );

  const completeDailyQuest = useCallback(
    (questId: string, title: string, topic: TopicId, xpReward: number) => {
      setProgress((prev) => {
        if (prev.completedDailyQuests.includes(questId)) {
          return prev;
        }
        const next = recordUniqueActivity(prev, {
          activityId: `daily:${questId}`,
          type: 'daily-quest',
          title: `Daily Quest: ${title}`,
          topic,
          xpReward,
        });
        return {
          ...next,
          completedDailyQuests: [...next.completedDailyQuests, questId],
        };
      });
    },
    []
  );

  const markChallengeComplete = useCallback((challengeId: string) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedChallenges.includes(challengeId);
      const topic: TopicId = challengeId.startsWith('ch-c') ? 'conditionals' : 'loops';
      const next = recordUniqueActivity(prev, {
        activityId: `challenge:${challengeId}`,
        type: 'challenge',
        title: `Solved Challenge ${challengeId}`,
        topic,
        xpReward: XP_REWARDS.challenge,
      });
      return {
        ...next,
        completedChallenges: alreadyDone
          ? next.completedChallenges
          : [...next.completedChallenges, challengeId],
      };
    });
  }, []);

  const completeBugHunt = useCallback((bugId: string, title: string, topic: TopicId, xpReward: number) => {
    setProgress((prev) => {
      const next = recordUniqueActivity(prev, {
        activityId: `bug:${bugId}`,
        type: 'bug-hunt',
        title: `Bug Fixed: ${title}`,
        topic,
        xpReward,
      });
      return {
        ...next,
        completedBugHunts: next.completedBugHunts.includes(bugId)
          ? next.completedBugHunts
          : [...next.completedBugHunts, bugId],
      };
    });
  }, []);

  const completeEscapeRoom = useCallback((roomId: string, title: string) => {
    setProgress((prev) => {
      const next = recordUniqueActivity(prev, {
        activityId: `escape:${roomId}`,
        type: 'escape-room',
        title: `Escape Room: ${title}`,
        topic: 'mixed',
        xpReward: roomId === 'vault-complete' ? XP_REWARDS.escapeRoom : 35,
      });
      return {
        ...next,
        completedEscapeRooms: next.completedEscapeRooms.includes(roomId)
          ? next.completedEscapeRooms
          : [...next.completedEscapeRooms, roomId],
      };
    });
  }, []);

  const toggleFlashcardUnderstood = useCallback((cardId: string) => {
    setProgress((prev) => {
      const exists = prev.understoodFlashcards.includes(cardId);
      return {
        ...prev,
        understoodFlashcards: exists
          ? prev.understoodFlashcards.filter((id) => id !== cardId)
          : [...prev.understoodFlashcards, cardId],
        activeDates: exists ? prev.activeDates : appendTodayDate(prev.activeDates),
      };
    });
  }, []);

  const recordQuizResult = useCallback(
    (topic: 'conditionals' | 'loops', score: number, total: number) => {
      setProgress((prev) => {
        const existing = prev.quizScores[topic];
        const passedThreshold = score >= Math.ceil(total * 0.6);
        const next = passedThreshold
          ? recordUniqueActivity(prev, {
              activityId: `quiz:${topic}`,
              type: 'quiz',
              title: `${topic === 'conditionals' ? 'Conditionals' : 'Loops'} Topic Quiz`,
              topic,
              score,
              maxScore: total,
              xpReward: XP_REWARDS.quiz,
            })
          : {
              ...prev,
              activeDates: appendTodayDate(prev.activeDates),
            };
        return {
          ...next,
          quizScores: {
            ...next.quizScores,
            [topic]: {
              bestScore: existing ? Math.max(existing.bestScore, score) : score,
              total,
              attempts: existing ? existing.attempts + 1 : 1,
              lastScore: score,
            },
          },
        };
      });
    },
    []
  );

  const recordGameScore = useCallback((gameId: string, score: number, maxScore: number) => {
    setProgress((prev) => {
      const existing = prev.gameScores[gameId];
      const prevAttempts = prev.gameAttempts[gameId] ?? 0;
      const next = recordUniqueActivity(prev, {
        activityId: `game:${gameId}`,
        type: 'game',
        title: `Completed Game: ${gameId}`,
        topic: gameId.startsWith('cond') ? 'conditionals' : 'loops',
        score,
        maxScore,
        xpReward: XP_REWARDS.game,
      });
      return {
        ...next,
        gameScores: {
          ...next.gameScores,
          [gameId]: {
            bestScore: existing ? Math.max(existing.bestScore, score) : score,
            maxScore,
            completed: true,
          },
        },
        gameAttempts: {
          ...next.gameAttempts,
          [gameId]: prevAttempts + 1,
        },
      };
    });
  }, []);

  const recordSimulatorRun = useCallback((simulatorId: SimulatorId) => {
    setProgress((prev) => {
      const next = recordUniqueActivity(prev, {
        activityId: `sim:${simulatorId}`,
        type: 'simulator',
        title: `Ran Simulator: ${simulatorId}`,
        topic:
          simulatorId === 'traffic-signal' ||
          simulatorId === 'atm-decision' ||
          simulatorId === 'smart-ac' ||
          simulatorId === 'shopping-discount'
            ? 'conditionals'
            : 'loops',
        xpReward: XP_REWARDS.simulator,
      });
      return {
        ...next,
        visitedSimulators: next.visitedSimulators.includes(simulatorId)
          ? next.visitedSimulators
          : [...next.visitedSimulators, simulatorId],
        simulatorRuns: next.simulatorRuns + 1,
      };
    });
  }, []);

  const recordSandboxRun = useCallback(() => {
    setProgress((prev) => {
      const next = recordUniqueActivity(prev, {
        activityId: 'sandbox:first-run',
        type: 'sandbox',
        title: 'Executed Code in Coding Studio',
        topic: 'basics',
        xpReward: XP_REWARDS.sandboxFirstRun,
      });
      return {
        ...next,
        sandboxRuns: next.sandboxRuns + 1,
      };
    });
  }, []);

  const saveSnippet = useCallback((title: string, code: string) => {
    const cleanTitle = title.trim() || 'Untitled Snippet';
    setProgress((prev) => {
      const snippet: SavedSnippet = {
        id: `snip-${Date.now()}`,
        title: cleanTitle,
        code,
        updatedAt: Date.now(),
      };
      return {
        ...prev,
        savedSnippets: [snippet, ...prev.savedSnippets].slice(0, 15),
      };
    });
  }, []);

  const deleteSnippet = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      savedSnippets: prev.savedSnippets.filter((s) => s.id !== id),
    }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setProgress((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...patch,
      },
    }));
  }, []);

  const setTutorTopic = useCallback((topic: TutorTopic) => {
    setProgress((prev) => ({
      ...prev,
      activeTutorTopic: topic,
      recentTopics: [topic, ...prev.recentTopics.filter((t) => t !== topic)].slice(0, 5),
    }));
  }, []);

  const setTutorDifficulty = useCallback((difficulty: TutorDifficulty) => {
    setProgress((prev) => ({
      ...prev,
      tutorDifficulty: difficulty,
    }));
  }, []);

  const markConceptUnderstood = useCallback((concept: string) => {
    const clean = concept.trim();
    if (!clean) return;
    setProgress((prev) => ({
      ...prev,
      conceptsUnderstood: prev.conceptsUnderstood.includes(clean)
        ? prev.conceptsUnderstood
        : [...prev.conceptsUnderstood, clean].slice(-15),
      conceptsToReview: prev.conceptsToReview.filter(
        (c) => c.toLowerCase() !== clean.toLowerCase()
      ),
      activeDates: appendTodayDate(prev.activeDates),
    }));
  }, []);

  const markConceptToReview = useCallback((concept: string) => {
    const clean = concept.trim();
    if (!clean) return;
    setProgress((prev) => ({
      ...prev,
      conceptsToReview: prev.conceptsToReview.includes(clean)
        ? prev.conceptsToReview
        : [...prev.conceptsToReview, clean].slice(-15),
      conceptsUnderstood: prev.conceptsUnderstood.filter(
        (c) => c.toLowerCase() !== clean.toLowerCase()
      ),
    }));
  }, []);

  const removeConceptTag = useCallback((concept: string) => {
    setProgress((prev) => ({
      ...prev,
      conceptsUnderstood: prev.conceptsUnderstood.filter((c) => c !== concept),
      conceptsToReview: prev.conceptsToReview.filter((c) => c !== concept),
    }));
  }, []);

  const recordPracticeAttempt = useCallback((success: boolean) => {
    setProgress((prev) => ({
      ...prev,
      practiceAttempts: prev.practiceAttempts + 1,
      practiceSuccesses: prev.practiceSuccesses + (success ? 1 : 0),
      activeDates: appendTodayDate(prev.activeDates),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    try {
      window.localStorage.removeItem(STORAGE_KEY_V2);
      for (const legacyKey of LEGACY_STORAGE_KEYS) {
        window.localStorage.removeItem(legacyKey);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const importProgress = useCallback((raw: unknown): boolean => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return false;
    }
    const normalized = migrateLegacyProgress(raw as Partial<LearningProgress>);
    setProgress(normalized);
    return true;
  }, []);

  const toggleBookmark = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const current = prev.bookmarkedLessons ?? [];
      const exists = current.includes(lessonId);
      const nextBookmarks = exists
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId];
      return {
        ...prev,
        bookmarkedLessons: nextBookmarks,
      };
    });
  }, []);

  const saveLessonNote = useCallback(
    (lessonId: string, topic: TopicId, title: string, note: string) => {
      setProgress((prev) => {
        const nextNotes = { ...(prev.lessonNotes ?? {}) };
        if (!note.trim()) {
          delete nextNotes[lessonId];
        } else {
          nextNotes[lessonId] = {
            lessonId,
            topic,
            title,
            note: note.trim(),
            updatedAt: Date.now(),
          };
        }
        return {
          ...prev,
          lessonNotes: nextNotes,
        };
      });
    },
    []
  );

  const deleteLessonNote = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const nextNotes = { ...(prev.lessonNotes ?? {}) };
      delete nextNotes[lessonId];
      return {
        ...prev,
        lessonNotes: nextNotes,
      };
    });
  }, []);

  return {
    progress,
    toggleLesson,
    markLessonComplete,
    completeMission,
    completeDailyQuest,
    markChallengeComplete,
    completeBugHunt,
    completeEscapeRoom,
    toggleFlashcardUnderstood,
    recordQuizResult,
    recordGameScore,
    recordSimulatorRun,
    recordSandboxRun,
    saveSnippet,
    deleteSnippet,
    updatePreferences,
    setTutorTopic,
    setTutorDifficulty,
    markConceptUnderstood,
    markConceptToReview,
    removeConceptTag,
    recordPracticeAttempt,
    resetProgress,
    importProgress,
    toggleBookmark,
    saveLessonNote,
    deleteLessonNote,
  };
}
