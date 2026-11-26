import { useState, useEffect, useCallback } from 'react';
import { LearningProgress, TopicId } from '../types';

const STORAGE_KEY = 'pyverse_progress_v1';
const LEGACY_STORAGE_KEY = 'python_lab_progress_v1';

const DEFAULT_PROGRESS: LearningProgress = {
  completedLessons: [],
  completedChallenges: [],
  quizScores: {
    conditionals: null,
    loops: null,
  },
  gameScores: {},
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
      };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  }, []);

  const markChallengeComplete = useCallback((challengeId: string) => {
    setProgress((prev) => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
      };
    });
  }, []);

  const recordQuizResult = useCallback((topic: TopicId, score: number, total: number) => {
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
      };
    });
  }, []);

  const recordGameScore = useCallback((gameId: string, score: number, maxScore: number) => {
    setProgress((prev) => {
      const existing = prev.gameScores[gameId];
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
      };
    });
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
    resetProgress,
  };
}
