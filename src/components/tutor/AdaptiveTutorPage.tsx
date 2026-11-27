import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send,
  Plus,
  Trash2,
  MessageSquare,
  BookOpen,
  Lightbulb,
  Loader2,
  Code2,
  Target,
  CheckSquare,
  Sparkles,
  RotateCcw,
  AlertCircle,
  SlidersHorizontal,
  PanelLeft,
  X,
  ThumbsUp,
  RefreshCw,
  ArrowUpRight,
  Cpu,
  Check,
  ListOrdered,
  ShieldCheck,
} from 'lucide-react';
import {
  LearningProgress,
  SectionId,
  TopicId,
  TutorDifficulty,
  TutorMessage,
  TutorMode,
  TutorPracticeCard,
  TutorQuizCard,
  TutorSimulatorContext,
  TutorTopic,
} from '../../types';
import {
  TOPIC_BASICS_LESSONS,
  TOPIC_08_LESSONS,
  TOPIC_09_LESSONS,
} from '../../data/curriculumData';
import { useTutorChats } from '../../hooks/useTutorChats';
import { PyVerseLogo } from '../PyVerseLogo';
import { TutorMessageContent } from './TutorMessageContent';
import { PracticeQuestionCard, QuizQuestionCard } from './TutorInteractiveCards';
import {
  buildTutorApiUrl,
} from '../../utils/tutorClient';

interface AdaptiveTutorPageProps {
  progress: LearningProgress;
  onSetTopic: (topic: TutorTopic) => void;
  onSetDifficulty: (difficulty: TutorDifficulty) => void;
  onMarkUnderstood: (concept: string) => void;
  onMarkToReview: (concept: string) => void;
  onRemoveConcept: (concept: string) => void;
  onRecordPracticeAttempt: (success: boolean) => void;
  onResetProgress: () => void;
  onNavigate: (section: SectionId) => void;
  onOpenTopic: (topic: TopicId) => void;
  onOpenInPlayground: (code: string) => void;
  pendingSimulatorContext: TutorSimulatorContext | null;
  onConsumeSimulatorContext: () => void;
}

const LEARNING_TOPICS: TutorTopic[] = [
  'Python Basics',
  'Conditional Statements',
  'Loops',
];

const DIFFICULTIES: TutorDifficulty[] = ['Beginner', 'Guided', 'Intermediate'];

const MODES: Array<{ id: TutorMode; label: string; icon: React.ReactNode; desc: string }> = [
  {
    id: 'explain',
    label: 'Explain Simply',
    icon: <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Step-by-step plain-language explanations tailored to your pace.',
  },
  {
    id: 'example',
    label: 'Real-Life Examples',
    icon: <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Relatable everyday analogies mapped directly to short Python snippets.',
  },
  {
    id: 'line_by_line',
    label: 'Explain Line by Line',
    icon: <ListOrdered className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Trace what every single line does to variables and output in order.',
  },
  {
    id: 'debug',
    label: 'Debug My Code',
    icon: <Code2 className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Paste your Python code to spot syntax or logic issues by line number.',
  },
  {
    id: 'hint',
    label: 'Give Me a Hint',
    icon: <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Get a guiding nudge without spoiling the full solution right away.',
  },
  {
    id: 'practice',
    label: 'Practice With Me',
    icon: <Target className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Interactive coding tasks with 3 progressive hints before the solution.',
  },
  {
    id: 'quiz',
    label: 'Test My Knowledge',
    icon: <CheckSquare className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Adaptive multiple-choice & code-output checks with instant feedback.',
  },
  {
    id: 'simulator',
    label: 'Explain This Simulator',
    icon: <Cpu className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Connect PyVerse real-life simulators directly to the underlying Python logic.',
  },
  {
    id: 'review_solution',
    label: 'Review My Solution',
    icon: <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />,
    desc: 'Paste working code for edge-case checks, clarity feedback, and next steps.',
  },
];

function makeId(prefix = 'msg'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const AdaptiveTutorPage: React.FC<AdaptiveTutorPageProps> = ({
  progress,
  onSetTopic,
  onSetDifficulty,
  onMarkUnderstood,
  onMarkToReview,
  onRemoveConcept,
  onRecordPracticeAttempt,
  onResetProgress,
  onNavigate,
  onOpenTopic,
  onOpenInPlayground,
  pendingSimulatorContext,
  onConsumeSimulatorContext,
}) => {
  const {
    sessions,
    activeSession,
    createNewChat,
    selectChat,
    updateSessionMeta,
    appendMessage,
    updateMessage,
    clearAllChats,
  } = useTutorChats(progress.activeTutorTopic);

  const [mode, setMode] = useState<TutorMode>(activeSession?.mode ?? 'explain');
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tutorHealth, setTutorHealth] = useState<{ configured: boolean; model: string } | null>(
    null
  );
  const [errorState, setErrorState] = useState<{
    message: string;
    retryAction?: () => void;
  } | null>(null);
  const [attachedSimContext, setAttachedSimContext] =
    useState<TutorSimulatorContext | null>(null);

  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);
  const [confirmClearChats, setConfirmClearChats] = useState(false);
  const [confirmResetProg, setConfirmResetProg] = useState(false);
  const [newConceptInput, setNewConceptInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;
    fetch(buildTutorApiUrl('/api/tutor/health'))
      .then(async (res) => {
        if (!res.ok) return null;
        try {
          return (await res.json()) as { configured?: boolean; model?: string };
        } catch {
          return null;
        }
      })
      .then((data) => {
        if (!active) return;
        if (data && typeof data.configured === 'boolean') {
          setTutorHealth({
            configured: data.configured,
            model: data.model || 'gemini-3.1-flash-lite',
          });
        } else {
          setTutorHealth({ configured: true, model: 'gemini-3.1-flash-lite' });
        }
      })
      .catch(() => {
        if (!active) return;
        setTutorHealth({ configured: true, model: 'gemini-3.1-flash-lite' });
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession.messages.length, isLoading]);

  const buildLearnerContextPayload = useCallback(
    () => ({
      activeTopic: progress.activeTutorTopic,
      difficulty: progress.tutorDifficulty,
      xp: progress.xp,
      completedLessons: progress.completedLessons,
      completedMissions: progress.completedMissions,
      completedChallenges: progress.completedChallenges,
      completedBugHunts: progress.completedBugHunts,
      conceptsUnderstood: progress.conceptsUnderstood,
      conceptsToReview: progress.conceptsToReview,
      quizScores: progress.quizScores,
      practiceAttempts: progress.practiceAttempts,
      practiceSuccesses: progress.practiceSuccesses,
    }),
    [progress]
  );

  const streamTutorReply = useCallback(
    async (
      targetSessionId: string,
      historyMessages: TutorMessage[],
      activeMode: TutorMode,
      simCtx: TutorSimulatorContext | null
    ) => {
      setIsLoading(true);
      setErrorState(null);

      const assistantMsgId = makeId('ai');
      appendMessage(targetSessionId, {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        mode: activeMode,
      });

      const controller = new AbortController();
      abortRef.current = controller;
      let accumulated = '';

      try {
        const response = await fetch(buildTutorApiUrl('/api/tutor/stream'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            messages: historyMessages.map((m) => ({ role: m.role, content: m.content })),
            mode: activeMode,
            learnerContext: buildLearnerContextPayload(),
            simulatorContext: simCtx,
          }),
        });

        if (!response.ok) {
          let errMsg = 'Unable to reach PyVerse AI Tutor.';
          try {
            const errJson = (await response.json()) as { message?: string };
            if (errJson.message) errMsg = errJson.message;
          } catch { /* ignore */ }
          throw new Error(errMsg);
        }

        if (!response.body) throw new Error('Streaming response body unavailable.');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';
          for (const evt of events) {
            const line = evt.split('\n').find((l) => l.startsWith('data: '));
            if (!line) continue;
            const payload = JSON.parse(line.slice(6)) as {
              type: 'chunk' | 'done' | 'error'; text?: string; message?: string;
            };
            if (payload.type === 'chunk' && payload.text) {
              accumulated += payload.text;
              updateMessage(targetSessionId, assistantMsgId, (prev) => ({ ...prev, content: accumulated }));
            } else if (payload.type === 'error') {
              throw new Error(payload.message || 'AI Tutor encountered an error.');
            }
          }
        }

        if (!accumulated.trim()) {
          updateMessage(targetSessionId, assistantMsgId, (prev) => ({
            ...prev,
            content: 'I did not receive a complete response. Please try asking again.',
            isError: true,
          }));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected connection error.';
        updateMessage(targetSessionId, assistantMsgId, (prev) => ({
          ...prev,
          content: accumulated || `Error: ${message}`,
          isError: true,
        }));
        setErrorState({
          message,
          retryAction: () => { streamTutorReply(targetSessionId, historyMessages, activeMode, simCtx); },
        });
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [appendMessage, buildLearnerContextPayload, updateMessage]
  );

  const sendUserMessage = useCallback(
    async (
      rawText: string,
      overrideMode?: TutorMode,
      overrideSessionId?: string,
      overrideSimCtx?: TutorSimulatorContext | null
    ) => {
      const trimmed = rawText.trim();
      if (!trimmed || isLoading) return;

      const targetSessionId = overrideSessionId ?? activeSession.id;
      const effectiveMode = overrideMode ?? mode;
      const simCtx =
        overrideSimCtx !== undefined ? overrideSimCtx : attachedSimContext;

      const userMsg: TutorMessage = {
        id: makeId('usr'),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
        mode: effectiveMode,
        simulatorContext: simCtx,
      };

      const baseHistory =
        overrideSessionId && overrideSessionId !== activeSession.id
          ? []
          : activeSession.messages;

      appendMessage(targetSessionId, userMsg);
      setInputText('');

      await streamTutorReply(
        targetSessionId,
        [...baseHistory, userMsg],
        effectiveMode,
        simCtx
      );
    },
    [
      activeSession.id,
      activeSession.messages,
      appendMessage,
      attachedSimContext,
      isLoading,
      mode,
      streamTutorReply,
    ]
  );

  // Handle incoming Simulator handoff ("Ask AI Tutor about this step")
  useEffect(() => {
    if (!pendingSimulatorContext) return;
    const simCtx = pendingSimulatorContext;
    onConsumeSimulatorContext();

    const inferredTopic: TutorTopic =
      simCtx.category === 'loops' ? 'Loops' : 'Conditional Statements';
    onSetTopic(inferredTopic);
    setMode('simulator');
    setAttachedSimContext(simCtx);

    const newSid = createNewChat(inferredTopic, 'simulator');
    updateSessionMeta(newSid, {
      title: `${simCtx.simulatorTitle} Help`,
      topic: inferredTopic,
      mode: 'simulator',
    });

    const linePart = simCtx.currentLine
      ? `on Line ${simCtx.currentLine} (${simCtx.activeCodeLine ?? ''})`
      : 'at the initial step';
    const prompt = `I am using the ${simCtx.simulatorTitle} and I'm ${linePart}. Can you explain what Python is doing at this exact step, why the variables/condition have these values, and what happens next?`;

    window.setTimeout(() => {
      void sendUserMessage(prompt, 'simulator', newSid, simCtx);
    }, 40);
  }, [
    pendingSimulatorContext,
    onConsumeSimulatorContext,
    onSetTopic,
    createNewChat,
    updateSessionMeta,
    sendUserMessage,
  ]);

  const handleGeneratePractice = async (
    difficultyAdjustment: 'simpler' | 'same' | 'harder' = 'same',
    focusRequest?: string
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorState(null);
    setMode('practice');

    const userMsg: TutorMessage = {
      id: makeId('usr'),
      role: 'user',
      content:
        focusRequest ||
        `Give me a ${difficultyAdjustment === 'harder' ? 'harder ' : difficultyAdjustment === 'simpler' ? 'simpler ' : ''}practice question on ${progress.activeTutorTopic}.`,
      timestamp: Date.now(),
      mode: 'practice',
    };
    appendMessage(activeSession.id, userMsg);

    try {
      const res = await fetch(buildTutorApiUrl('/api/tutor/practice'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learnerContext: buildLearnerContextPayload(), focusRequest, difficultyAdjustment }),
      });
      const data = (await res.json()) as { question?: Omit<TutorPracticeCard, 'hintsRevealed' | 'solutionRevealed'>; message?: string };
      if (!res.ok || !data.question) throw new Error(data.message || 'Could not generate a practice question.');
      const practiceData = data.question;

      const aiMsg: TutorMessage = {
        id: makeId('ai'),
        role: 'assistant',
        content: `Here is a tailored **${progress.activeTutorTopic}** practice task. Try solving it first — use the progressive hints if you get stuck!`,
        timestamp: Date.now(),
        mode: 'practice',
        practiceCard: { ...practiceData, hintsRevealed: 0, solutionRevealed: false },
      };
      appendMessage(activeSession.id, aiMsg);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate practice question.';
      setErrorState({ message, retryAction: () => void handleGeneratePractice(difficultyAdjustment, focusRequest) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuiz = async (
    difficultyAdjustment: 'simpler' | 'same' | 'harder' = 'same',
    focusRequest?: string
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorState(null);
    setMode('quiz');

    const userMsg: TutorMessage = {
      id: makeId('usr'),
      role: 'user',
      content:
        focusRequest ||
        `Test my understanding of ${progress.activeTutorTopic} with a ${
          difficultyAdjustment === 'harder' ? 'harder ' : difficultyAdjustment === 'simpler' ? 'simpler ' : ''
        }question.`,
      timestamp: Date.now(),
      mode: 'quiz',
    };
    appendMessage(activeSession.id, userMsg);

    try {
      const res = await fetch(buildTutorApiUrl('/api/tutor/quiz'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learnerContext: buildLearnerContextPayload(), focusRequest, difficultyAdjustment }),
      });
      const data = (await res.json()) as { quiz?: TutorQuizCard; message?: string };
      if (!res.ok || !data.quiz) throw new Error(data.message || 'Could not generate a quiz question.');
      const quizData: TutorQuizCard = { ...data.quiz, submitted: false };

      const aiMsg: TutorMessage = {
        id: makeId('ai'),
        role: 'assistant',
        content: `Quick check on **${quizData.concept}**: pick the best answer below.`,
        timestamp: Date.now(),
        mode: 'quiz',
        quizCard: quizData,
      };
      appendMessage(activeSession.id, aiMsg);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate quiz question.';
      setErrorState({ message, retryAction: () => void handleGenerateQuiz(difficultyAdjustment, focusRequest) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (
    msg: TutorMessage,
    kind: 'helpful' | 'confused' | 'harder'
  ) => {
    updateMessage(activeSession.id, msg.id, (prev) => ({
      ...prev,
      feedbackGiven: kind,
    }));

    if (kind === 'helpful') {
      onMarkUnderstood(progress.activeTutorTopic);
      return;
    }

    if (kind === 'confused') {
      onMarkToReview(progress.activeTutorTopic);
      if (progress.tutorDifficulty !== 'Beginner') {
        onSetDifficulty('Beginner');
      }
      void sendUserMessage(
        "I'm still confused by that explanation. Can you simplify it using a smaller everyday analogy and shorter steps?"
      );
      return;
    }

    if (kind === 'harder') {
      if (progress.tutorDifficulty === 'Beginner') onSetDifficulty('Guided');
      else if (progress.tutorDifficulty === 'Guided') onSetDifficulty('Intermediate');
      void sendUserMessage(
        'I understood that! Can you give me a slightly harder follow-up example or challenge on this topic?'
      );
    }
  };

  // Recommended Next Step derived from real PyVerse progress
  const nextBasicsLesson = TOPIC_BASICS_LESSONS.find(
    (l) => !progress.completedLessons.includes(l.id)
  );
  const nextT8Lesson = TOPIC_08_LESSONS.find(
    (l) => !progress.completedLessons.includes(l.id)
  );
  const nextT9Lesson = TOPIC_09_LESSONS.find(
    (l) => !progress.completedLessons.includes(l.id)
  );
  const recommendedAction = (() => {
    if (progress.conceptsToReview.length > 0) {
      const concept = progress.conceptsToReview[0];
      return {
        label: `Revise "${concept}"`,
        sub: 'Marked as needing improvement',
        onClick: () => {
          setMode('explain');
          void sendUserMessage(
            `Help me revise ${concept} with a simple step-by-step example.`,
            'explain'
          );
        },
      };
    }
    if (progress.activeTutorTopic === 'Python Basics' && nextBasicsLesson) {
      return {
        label: `Lesson ${nextBasicsLesson.number}: ${nextBasicsLesson.title}`,
        sub: 'Topic 01 · Python Basics',
        onClick: () => onOpenTopic('basics'),
      };
    }
    if (progress.activeTutorTopic === 'Loops' && nextT9Lesson) {
      return {
        label: `Lesson ${nextT9Lesson.number}: ${nextT9Lesson.title}`,
        sub: 'Topic 09 · Loops',
        onClick: () => onOpenTopic('loops'),
      };
    }
    if (nextT8Lesson) {
      return {
        label: `Lesson ${nextT8Lesson.number}: ${nextT8Lesson.title}`,
        sub: 'Topic 08 · Conditional Statements',
        onClick: () => onOpenTopic('conditionals'),
      };
    }
    if (nextBasicsLesson) {
      return {
        label: `Lesson ${nextBasicsLesson.number}: ${nextBasicsLesson.title}`,
        sub: 'Topic 01 · Python Basics',
        onClick: () => onOpenTopic('basics'),
      };
    }
    return {
      label: 'Try Real-Life Simulators',
      sub: 'Apply conditionals & loops interactively',
      onClick: () => onNavigate('simulators'),
    };
  })();

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'practice' && !inputText.trim()) return;
      void sendUserMessage(inputText);
    }
  };

  const renderLeftSidebarContent = () => (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="space-y-4">
        {/* Branding */}
        <div className="flex items-center justify-between border-b border-[#F1EEEE] dark:border-[#2a1212] pb-3">
          <div>
            <PyVerseLogo size="sm" />
            <p className="mt-1 text-[11px] font-medium text-[#8A8585] dark:text-[#9a8585]">
              Adaptive AI Tutor
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const id = createNewChat(progress.activeTutorTopic, mode);
              selectChat(id);
              setAttachedSimContext(null);
              setMobileLeftOpen(false);
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-[#E10906] px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:opacity-95 whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            New Chat
          </button>
        </div>

        {/* Learning Topics */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8A8585] dark:text-[#9a8585]">
            Learning Topics
          </p>
          <div className="space-y-1">
            {LEARNING_TOPICS.map((t) => {
              const active = progress.activeTutorTopic === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    onSetTopic(t);
                    updateSessionMeta(activeSession.id, { topic: t });
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs font-medium transition-all ${
                    active
                      ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] font-semibold text-[#100303] dark:text-[#f0eaea]'
                      : 'border-transparent bg-transparent text-[#8A8585] dark:text-[#9a8585] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                  }`}
                >
                  <span>{t}</span>
                  {active && <Check className="h-3.5 w-3.5 text-[#E10906]" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat History */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#8A8585] dark:text-[#9a8585]">
            Chat History
          </p>
          <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
            {sessions.map((sess) => {
              const active = sess.id === activeSession.id;
              return (
                <button
                  key={sess.id}
                  type="button"
                  onClick={() => {
                    selectChat(sess.id);
                    setMode(sess.mode);
                    setMobileLeftOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                    active
                      ? 'bg-[#FFF1F1] dark:bg-[#2a0808] font-semibold text-[#100303] dark:text-[#f0eaea] border border-[#E5DFDF] dark:border-[#3a1a1a]'
                      : 'text-[#8A8585] dark:text-[#9a8585] hover:bg-[#FBF5F9] dark:hover:bg-[#221010] dark:bg-[#0f0303] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#8A8585] dark:text-[#9a8585]" aria-hidden="true" />
                  <span className="truncate">{sess.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* My Learning Progress */}
        <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#100303] dark:text-[#f0eaea]">My Learning Progress</span>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="text-[11px] font-semibold text-[#E10906] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg bg-white dark:bg-[#1a0808] p-2 border border-[#E5DFDF]/70 dark:border-[#3a1a1a]/70">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Total XP</span>
              <p className="font-mono font-bold text-[#E10906] tabular-nums">
                {progress.xp} XP
              </p>
            </div>
            <div className="rounded-lg bg-white dark:bg-[#1a0808] p-2 border border-[#E5DFDF]/70 dark:border-[#3a1a1a]/70">
              <span className="text-[#8A8585] dark:text-[#9a8585]">Lessons</span>
              <p className="font-mono font-bold text-[#100303] dark:text-[#f0eaea] tabular-nums">
                {progress.completedLessons.length} /{' '}
                {TOPIC_BASICS_LESSONS.length + TOPIC_08_LESSONS.length + TOPIC_09_LESSONS.length}
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] p-3 text-xs space-y-1.5">
          <p className="font-semibold text-[#100303] dark:text-[#f0eaea]">Recommended Next Step</p>
          <p className="text-[11px] text-[#8A8585] dark:text-[#9a8585]">{recommendedAction.sub}</p>
          <button
            type="button"
            onClick={recommendedAction.onClick}
            className="inline-flex items-center gap-1 font-semibold text-[#E10906] hover:text-[#E10906]"
          >
            {recommendedAction.label}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Clear Chat History */}
      <div className="border-t border-[#F1EEEE] dark:border-[#2a1212] pt-3">
        {confirmClearChats ? (
          <div className="rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 p-2.5 text-xs space-y-2">
            <p className="font-medium text-rose-900 dark:text-rose-200">Clear all chat history?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllChats(progress.activeTutorTopic);
                  setConfirmClearChats(false);
                }}
                className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmClearChats(false)}
                className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#100303] dark:text-[#f0eaea]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClearChats(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-2 text-xs font-medium text-[#8A8585] dark:text-[#9a8585] transition-colors hover:border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Clear Chat History
          </button>
        )}
      </div>
    </div>
  );

  const renderContextPanelContent = () => (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
          Adaptive Learning Context
        </h3>
        <p className="mt-0.5 text-[11px] text-[#8A8585] dark:text-[#9a8585]">
          Sent with every message so the tutor adapts to your pace.
        </p>
      </div>

      {/* Topic & Difficulty */}
      <div className="space-y-3 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5">
        <div>
          <span className="text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585]">Current Topic</span>
          <p className="mt-0.5 font-display text-sm font-bold text-[#100303] dark:text-[#f0eaea]">
            {progress.activeTutorTopic}
          </p>
        </div>

        <div>
          <span className="block text-[11px] font-semibold text-[#8A8585] dark:text-[#9a8585] mb-1.5">
            Difficulty Level
          </span>
          <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-1">
            {DIFFICULTIES.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onSetDifficulty(lvl)}
                className={`rounded-md py-1 text-[11px] font-semibold transition-all ${
                  progress.tutorDifficulty === lvl
                    ? 'bg-[#E10906] text-white'
                    : 'text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Concepts Already Understood */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
            Concepts Understood
          </span>
          <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300 tabular-nums">
            {progress.conceptsUnderstood.length}
          </span>
        </div>

        {progress.conceptsUnderstood.length === 0 ? (
          <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
            Concepts appear here when you answer checks or click Helpful.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {progress.conceptsUnderstood.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onRemoveConcept(c)}
                title="Click to remove"
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
              >
                {c}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newConceptInput.trim()) {
              onMarkUnderstood(newConceptInput);
              setNewConceptInput('');
            }
          }}
          className="flex gap-1.5 pt-1"
        >
          <input
            type="text"
            value={newConceptInput}
            onChange={(e) => setNewConceptInput(e.target.value)}
            placeholder="Mark concept understood..."
            className="min-w-0 flex-1 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 text-[11px] text-[#100303] dark:text-[#f0eaea] focus:border-[#E10906] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] px-2.5 py-1 text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906]"
          >
            Add
          </button>
        </form>
      </div>

      {/* Concepts Needing Improvement */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#100303] dark:text-[#f0eaea]">
            Needs Improvement
          </span>
          <span className="font-mono text-[11px] text-amber-700 dark:text-amber-300 tabular-nums">
            {progress.conceptsToReview.length}
          </span>
        </div>

        {progress.conceptsToReview.length === 0 ? (
          <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">
            No revision areas flagged yet.
          </p>
        ) : (
          <div className="space-y-1.5">
            {progress.conceptsToReview.map((c) => (
              <div
                key={c}
                className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 text-[11px] text-amber-950 dark:text-amber-100"
              >
                <span className="font-medium truncate">{c}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => void handleGeneratePractice('simpler', `Practice ${c}`)}
                    className="font-semibold text-[#E10906] hover:underline"
                  >
                    Practice
                  </button>
                  <button
                    type="button"
                    onClick={() => onMarkUnderstood(c)}
                    className="font-semibold text-emerald-700 dark:text-emerald-300 hover:underline"
                  >
                    Got it
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Next Lesson */}
      <div className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-3.5 text-xs space-y-2">
        <span className="font-semibold text-[#100303] dark:text-[#f0eaea]">Suggested Next Lesson</span>
        <p className="text-[#8A8585] dark:text-[#9a8585]">{recommendedAction.label}</p>
        <button
          type="button"
          onClick={recommendedAction.onClick}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-3 py-1.5 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808]"
        >
          Open Lesson / Activity
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Local Storage Disclosure & Reset */}
      <div className="border-t border-[#E5DFDF] dark:border-[#3a1a1a] pt-3 space-y-2.5">
        <p className="text-[11px] leading-relaxed text-[#8A8585] dark:text-[#9a8585]">
          Progress and chat history are saved locally in this browser and are not automatically synced across devices.
        </p>

        {confirmResetProg ? (
          <div className="rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 p-2.5 text-xs space-y-2">
            <p className="font-medium text-rose-900 dark:text-rose-200">Reset all PyVerse progress?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmResetProg(false);
                }}
                className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmResetProg(false)}
                className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#100303] dark:text-[#f0eaea]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmResetProg(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3 py-2 text-xs font-medium text-[#8A8585] dark:text-[#9a8585] hover:border-rose-300 hover:text-rose-700"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset Learning Progress
          </button>
        )}
      </div>
    </div>
  );

  const activeModeInfo = MODES.find((m) => m.id === mode) ?? MODES[0];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
      {/* Mobile/Tablet Controls Strip */}
      <div className="mb-4 flex items-center justify-between gap-2 xl:hidden">
        <button
          type="button"
          onClick={() => setMobileLeftOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] shadow-xs lg:hidden"
        >
          <PanelLeft className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
          Chats &amp; Topics
        </button>
        <div className="hidden lg:block text-xs font-medium text-[#8A8585] dark:text-[#9a8585]">
          Topic: <strong className="text-[#100303] dark:text-[#f0eaea]">{progress.activeTutorTopic}</strong> · Level:{' '}
          <strong className="text-[#E10906]">{progress.tutorDifficulty}</strong>
        </div>
        <button
          type="button"
          onClick={() => setMobileRightOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2 text-xs font-semibold text-[#100303] dark:text-[#f0eaea] shadow-xs"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#E10906]" aria-hidden="true" />
          Learning Context
        </button>
      </div>

      {/* Main 3-Column Adaptive Tutor Shell */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
        {/* LEFT SIDEBAR (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-sm sticky top-20 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
          {renderLeftSidebarContent()}
        </aside>

        {/* CENTER CONVERSATION AREA */}
        <section className="lg:col-span-9 xl:col-span-6 flex flex-col rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] shadow-sm overflow-hidden min-h-[640px]">
          {/* Mode Switcher Bar */}
          <div className="border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              {MODES.map((m) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setMode(m.id);
                      updateSessionMeta(activeSession.id, { mode: m.id });
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#E10906] text-white shadow-xs'
                        : 'border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:border-[#E10906] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                    }`}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#8A8585] dark:text-[#9a8585]">{activeModeInfo.desc}</p>
          </div>

          {/* Attached Simulator Context Banner */}
          {attachedSimContext && (
            <div className="flex items-center justify-between gap-3 border-b border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-4 py-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Cpu className="h-4 w-4 shrink-0 text-[#E10906]" aria-hidden="true" />
                <span className="truncate text-sky-950 dark:text-sky-100">
                  <strong>Simulator Context:</strong> {attachedSimContext.simulatorTitle}
                  {attachedSimContext.currentLine
                    ? ` (Line ${attachedSimContext.currentLine})`
                    : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAttachedSimContext(null)}
                className="shrink-0 font-semibold text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]"
              >
                Clear
              </button>
            </div>
          )}

          {/* Conversation Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 max-h-[540px]">
            {activeSession.messages.length === 0 ? (
              <div className="space-y-5 py-4">
                <div className="rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-gradient-to-br from-[#FFF1F1] dark:from-[#2a0808] to-white dark:to-[#1a0808] p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#E10906]">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Welcome to PyVerse Adaptive AI Tutor
                  </div>
                  <h2 className="mt-1.5 font-display text-xl font-bold text-[#100303] dark:text-[#f0eaea]">
                    Think. Code. Experiment. — Let&apos;s learn at your pace.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#8A8585] dark:text-[#9a8585]">
                    I adapt to your current topic (
                    <strong className="text-[#100303] dark:text-[#f0eaea]">{progress.activeTutorTopic}</strong>) and
                    level (<strong className="text-[#E10906]">{progress.tutorDifficulty}</strong>). Ask
                    a question, paste Python code for line-by-line review, or try a practice
                    challenge with step-by-step hints.
                  </p>
                </div>

                <div>
                  <p className="mb-2.5 text-xs font-semibold text-[#8A8585] dark:text-[#9a8585]">
                    Quick Beginner Starters
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      ...(progress.xp === 0
                        ? [
                            {
                              label: 'Assess my Python starting level',
                              mode: 'quiz' as TutorMode,
                              action: () =>
                                void handleGenerateQuiz(
                                  'simpler',
                                  'Quick beginner diagnostic check on Python Basics'
                                ),
                            },
                          ]
                        : []),
                      {
                        label: 'What is Python?',
                        mode: 'explain' as TutorMode,
                        action: () => void sendUserMessage('What is Python?', 'explain'),
                      },
                      {
                        label: 'Explain if-else with a real-life example',
                        mode: 'example' as TutorMode,
                        action: () =>
                          void sendUserMessage(
                            'Explain if-else with a real-life example.',
                            'example'
                          ),
                      },
                      {
                        label: 'Trace a for loop line by line',
                        mode: 'line_by_line' as TutorMode,
                        action: () =>
                          void sendUserMessage(
                            'Walk me line by line through:\nfor i in range(1, 4):\n    print(i * 2)',
                            'line_by_line'
                          ),
                      },
                      {
                        label: 'Give me a practice question',
                        mode: 'practice' as TutorMode,
                        action: () => void handleGeneratePractice('same'),
                      },
                    ].map((starter) => (
                      <button
                        key={starter.label}
                        type="button"
                        onClick={starter.action}
                        className="rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3 text-left text-xs font-medium text-[#100303] dark:text-[#f0eaea] transition-colors hover:border-[#E10906] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808]"
                      >
                        {starter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              activeSession.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[94%] sm:max-w-[88%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? 'bg-[#E10906] text-white shadow-xs'
                          : msg.isError
                          ? 'border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                          : 'border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] text-[#100303] dark:text-[#f0eaea]'
                      }`}
                    >
                      {isUser ? (
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {msg.content}
                        </pre>
                      ) : (
                        <>
                          {msg.content ? (
                            <TutorMessageContent
                              content={msg.content}
                              onOpenInPlayground={onOpenInPlayground}
                            />
                          ) : (
                            <span className="inline-flex items-center gap-2 text-xs text-[#8A8585] dark:text-[#9a8585]">
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E10906]" aria-hidden="true" />
                              Thinking through the best way to explain...
                            </span>
                          )}

                          {msg.practiceCard && (
                            <PracticeQuestionCard
                              card={msg.practiceCard}
                              onRevealNextHint={() =>
                                updateMessage(activeSession.id, msg.id, (prev) =>
                                  prev.practiceCard
                                    ? {
                                        ...prev,
                                        practiceCard: {
                                          ...prev.practiceCard,
                                          hintsRevealed: Math.min(
                                            3,
                                            prev.practiceCard.hintsRevealed + 1
                                          ),
                                        },
                                      }
                                    : prev
                                )
                              }
                              onRevealSolution={() =>
                                updateMessage(activeSession.id, msg.id, (prev) =>
                                  prev.practiceCard
                                    ? {
                                        ...prev,
                                        practiceCard: {
                                          ...prev.practiceCard,
                                          solutionRevealed: true,
                                        },
                                      }
                                    : prev
                                )
                              }
                              onOpenInPlayground={onOpenInPlayground}
                              onDraftAttempt={(starter, title) => {
                                setMode('practice');
                                setInputText(
                                  `Here is my attempt for "${title}":\n\n${starter}`
                                );
                                textareaRef.current?.focus();
                              }}
                            />
                          )}

                          {msg.quizCard && (
                            <QuizQuestionCard
                              card={msg.quizCard}
                              onSubmitAnswer={(selectedIndex) => {
                                const right = selectedIndex === msg.quizCard!.correctIndex;
                                onRecordPracticeAttempt(right);
                                if (right) {
                                  onMarkUnderstood(msg.quizCard!.concept);
                                } else {
                                  onMarkToReview(msg.quizCard!.concept);
                                }
                                updateMessage(activeSession.id, msg.id, (prev) =>
                                  prev.quizCard
                                    ? {
                                        ...prev,
                                        quizCard: {
                                          ...prev.quizCard,
                                          selectedIndex,
                                          submitted: true,
                                        },
                                      }
                                    : prev
                                );
                              }}
                              onRequestFollowUp={(kind, concept) => {
                                if (kind === 'explain') {
                                  void sendUserMessage(
                                    `Why was that the right answer for ${concept}? Can you walk me through it simply?`,
                                    'explain'
                                  );
                                } else if (kind === 'harder') {
                                  if (progress.tutorDifficulty === 'Beginner')
                                    onSetDifficulty('Guided');
                                  else if (progress.tutorDifficulty === 'Guided')
                                    onSetDifficulty('Intermediate');
                                  void handleGenerateQuiz('harder', `Test me harder on ${concept}`);
                                } else {
                                  onSetDifficulty('Beginner');
                                  void handleGenerateQuiz('simpler', `Simpler check on ${concept}`);
                                }
                              }}
                              onOpenInPlayground={onOpenInPlayground}
                            />
                          )}
                        </>
                      )}
                    </div>

                    {/* Adaptive Feedback Controls on Assistant Replies */}
                    {!isUser && !msg.isError && msg.content && !isLoading && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 pl-1">
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg, 'helpful')}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors ${
                            msg.feedbackGiven === 'helpful'
                              ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200'
                              : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:text-[#100303] dark:hover:text-[#f0eaea]'
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                          Got it!
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg, 'confused')}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors ${
                            msg.feedbackGiven === 'confused'
                              ? 'border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200'
                              : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:text-amber-700'
                          }`}
                        >
                          <RefreshCw className="h-3 w-3" aria-hidden="true" />
                          Simplify
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(msg, 'harder')}
                          className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors ${
                            msg.feedbackGiven === 'harder'
                              ? 'border-[#E10906] bg-[#FFF1F1] dark:bg-[#2a0808] text-[#100303] dark:text-[#f0eaea]'
                              : 'border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] text-[#8A8585] dark:text-[#9a8585] hover:text-[#E10906]'
                          }`}
                        >
                          <Sparkles className="h-3 w-3" aria-hidden="true" />
                          Harder Challenge
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner with Retry */}
          {errorState && (
            <div className="mx-4 mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-900 dark:text-rose-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                <span>{errorState.message}</span>
              </div>
              {errorState.retryAction && (
                <button
                  type="button"
                  onClick={errorState.retryAction}
                  className="rounded-lg bg-rose-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-rose-50 dark:hover:bg-rose-950/400"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Message Input & Quick Action Chips */}
          <div className="border-t border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FBF5F9] dark:bg-[#0f0303] p-3.5 space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode('explain');
                  setInputText(`Explain simply in ${progress.activeTutorTopic}: `);
                  textareaRef.current?.focus();
                }}
                className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] disabled:opacity-40"
              >
                Explain Simply
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode('example');
                  setInputText(`Give me a real-life example for `);
                  textareaRef.current?.focus();
                }}
                className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] disabled:opacity-40"
              >
                Real-Life Example
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode('debug');
                  setInputText('Please debug my Python code:\n\n');
                  textareaRef.current?.focus();
                }}
                className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-2.5 py-1 text-[11px] font-medium text-[#100303] dark:text-[#f0eaea] hover:border-[#E10906] disabled:opacity-40"
              >
                Debug My Code
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode('hint');
                  setInputText('Give me a hint without spoiling the answer for: ');
                  textareaRef.current?.focus();
                }}
                className="rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-[11px] font-medium text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 disabled:opacity-40"
              >
                Give Me a Hint
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void handleGeneratePractice('same')}
                className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-2.5 py-1 text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808] disabled:opacity-40"
              >
                Practice Task
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => void handleGenerateQuiz('same')}
                className="rounded-lg border border-[#E5DFDF] dark:border-[#3a1a1a] bg-[#FFF1F1] dark:bg-[#2a0808] px-2.5 py-1 text-[11px] font-semibold text-[#100303] dark:text-[#f0eaea] hover:bg-[#FFF1F1] dark:hover:bg-[#2a0808] dark:bg-[#2a0808] disabled:opacity-40"
              >
                Test My Knowledge
              </button>
            </div>

            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={
                  mode === 'debug'
                    ? 'Paste your Python code here and press Send (Shift+Enter for new line)...'
                    : `Ask PyVerse AI Tutor about ${progress.activeTutorTopic}...`
                }
                aria-label="Message PyVerse AI Tutor"
                className="min-h-[46px] max-h-40 flex-1 resize-y rounded-xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] px-3.5 py-2.5 text-sm text-[#100303] dark:text-[#f0eaea] placeholder:text-[#8A8585] dark:placeholder:text-[#9a8585] focus:border-[#E10906] focus:outline-none focus:ring-2 focus:ring-[#E10906]/20"
              />
              <button
                type="button"
                disabled={isLoading || !inputText.trim()}
                onClick={() => void sendUserMessage(inputText)}
                className="inline-flex h-[46px] items-center gap-2 rounded-xl bg-[#E10906] px-4 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-40 shrink-0"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{isLoading ? 'Thinking...' : 'Send'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT CONTEXT PANEL (Desktop xl+) */}
        <aside className="hidden xl:block xl:col-span-3 rounded-2xl border border-[#E5DFDF] dark:border-[#3a1a1a] bg-white dark:bg-[#1a0808] p-4 shadow-sm sticky top-20 max-h-[calc(100vh-6.5rem)] overflow-y-auto">
          {renderContextPanelContent()}
        </aside>
      </div>

      {/* Mobile Left Drawer */}
      {mobileLeftOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileLeftOpen(false)}
          />
          <div className="relative z-10 h-full w-80 max-w-[85vw] overflow-y-auto bg-white dark:bg-[#1a0808] p-4 shadow-xl">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileLeftOpen(false)}
                aria-label="Close sidebar"
                className="rounded-lg p-1 text-[#8A8585] dark:text-[#9a8585] hover:bg-[#F1EEEE] dark:hover:bg-[#221010] dark:bg-[#221010]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderLeftSidebarContent()}
          </div>
        </div>
      )}

      {/* Collapsible Right Context Drawer (< xl) */}
      {mobileRightOpen && (
        <div className="fixed inset-0 z-50 flex justify-end xl:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40"
            onClick={() => setMobileRightOpen(false)}
          />
          <div className="relative z-10 h-full w-80 max-w-[85vw] overflow-y-auto bg-white dark:bg-[#1a0808] p-4 shadow-xl">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileRightOpen(false)}
                aria-label="Close learning context"
                className="rounded-lg p-1 text-[#8A8585] dark:text-[#9a8585] hover:bg-[#F1EEEE] dark:hover:bg-[#221010] dark:bg-[#221010]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderContextPanelContent()}
          </div>
        </div>
      )}
    </div>
  );
};
