import { useState, useEffect, useCallback } from 'react';
import { LearningProgress, SimulatorId, TutorDifficulty, TutorTopic } from '../types';

const STORAGE_KEY = 'pyverse_progress_v1';
const LEGACY_STORAGE_KEY = 'python_lab_progress_v1';

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

  // Streak is active if user practiced today or yesterday
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

function appendTodayDate(dates: string[]): string[] {
  const today = getLocalDateKey();
  if (dates.includes(today)) return dates;
  return [...dates, today].slice(-60);
}

const DEFAULT_PROGRESS: LearningProgress = {
  completedLessons: [],
  completedChallenges: [],
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
  activeTutorTopic: 'Python Basics',
  tutorDifficulty: 'Beginner',
  conceptsUnderstood: [],
  conceptsToReview: [],
  practiceAttempts: 0,
  practiceSuccesses: 0,
  recentTopics: ['Python Basics'],
};

function loadProgress(): LearningProgress {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LearningProgress>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
      quizScores: {
        conditionals: parsed.quizScores?.conditionals ?? null,
        loops: parsed.quizScores?.loops ?? null,
      },
      gameScores: parsed.gameScores ?? {},
      gameAttempts: parsed.gameAttempts ?? {},
      visitedSimulators: Array.isArray(parsed.visitedSimulators) ? parsed.visitedSimulators : [],
      simulatorRuns: typeof parsed.simulatorRuns === 'number' ? parsed.simulatorRuns : 0,
      sandboxRuns: typeof parsed.sandboxRuns === 'number' ? parsed.sandboxRuns : 0,
      activeDates: Array.isArray(parsed.activeDates) ? parsed.activeDates : [],
      activeTutorTopic: parsed.activeTutorTopic ?? 'Python Basics',
      tutorDifficulty: parsed.tutorDifficulty ?? 'Beginner',
      conceptsUnderstood: Array.isArray(parsed.conceptsUnderstood)
        ? parsed.conceptsUnderstood
        : [],
      conceptsToReview: Array.isArray(parsed.conceptsToReview) ? parsed.conceptsToReview : [],
      practiceAttempts: typeof parsed.practiceAttempts === 'number' ? parsed.practiceAttempts : 0,
      practiceSuccesses:
        typeof parsed.practiceSuccesses === 'number' ? parsed.practiceSuccesses : 0,
      recentTopics:
        Array.isArray(parsed.recentTopics) && parsed.recentTopics.length > 0
          ? parsed.recentTopics
          : ['Python Basics'],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<LearningProgress>(loadProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [progress]);

  const toggleLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      const exists = prev.completedLessons.includes(lessonId);
      return {
        ...prev,
        completedLessons: exists
          ? prev.completedLessons.filter((id) => id !== lessonId)
          : [...prev.completedLessons, lessonId],
        activeDates: exists ? prev.activeDates : appendTodayDate(prev.activeDates),
      };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        activeDates: appendTodayDate(prev.activeDates),
      };
    });
  }, []);

  const markChallengeComplete = useCallback((challengeId: string) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedChallenges.includes(challengeId);
      return {
        ...prev,
        completedChallenges: alreadyDone
          ? prev.completedChallenges
          : [...prev.completedChallenges, challengeId],
        activeDates: appendTodayDate(prev.activeDates),
      };
    });
  }, []);

  const recordQuizResult = useCallback(
    (topic: 'conditionals' | 'loops', score: number, total: number) => {
      setProgress((prev) => {
        const existing = prev.quizScores[topic];
        return {
          ...prev,
          quizScores: {
            ...prev.quizScores,
            [topic]: {
              bestScore: existing ? Math.max(existing.bestScore, score) : score,
              total,
              attempts: existing ? existing.attempts + 1 : 1,
              lastScore: score,
            },
          },
          activeDates: appendTodayDate(prev.activeDates),
        };
      });
    },
    []
  );

  const recordGameScore = useCallback((gameId: string, score: number, maxScore: number) => {
    setProgress((prev) => {
      const existing = prev.gameScores[gameId];
      const prevAttempts = prev.gameAttempts[gameId] ?? 0;
      return {
        ...prev,
        gameScores: {
          ...prev.gameScores,
          [gameId]: {
            bestScore: existing ? Math.max(existing.bestScore, score) : score,
            maxScore,
            completed: true,
          },
        },
        gameAttempts: {
          ...prev.gameAttempts,
          [gameId]: prevAttempts + 1,
        },
        activeDates: appendTodayDate(prev.activeDates),
      };
    });
  }, []);

  const recordSimulatorRun = useCallback((simulatorId: SimulatorId) => {
    setProgress((prev) => ({
      ...prev,
      visitedSimulators: prev.visitedSimulators.includes(simulatorId)
        ? prev.visitedSimulators
        : [...prev.visitedSimulators, simulatorId],
      simulatorRuns: prev.simulatorRuns + 1,
      activeDates: appendTodayDate(prev.activeDates),
    }));
  }, []);

  const recordSandboxRun = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      sandboxRuns: prev.sandboxRuns + 1,
      activeDates: appendTodayDate(prev.activeDates),
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
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return {
    progress,
    toggleLesson,
    markLessonComplete,
    markChallengeComplete,
    recordQuizResult,
    recordGameScore,
    recordSimulatorRun,
    recordSandboxRun,
    setTutorTopic,
    setTutorDifficulty,
    markConceptUnderstood,
    markConceptToReview,
    removeConceptTag,
    recordPracticeAttempt,
    resetProgress,
  };
}
