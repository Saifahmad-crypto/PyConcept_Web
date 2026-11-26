import { useState, useEffect, useCallback } from 'react';
import { TutorChatSession, TutorMessage, TutorMode, TutorTopic } from '../types';

const CHATS_STORAGE_KEY = 'pyverse_tutor_chats_v1';

function makeId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptySession(
  topic: TutorTopic = 'Python Basics',
  mode: TutorMode = 'learn'
): TutorChatSession {
  return {
    id: makeId('chat'),
    title: 'New Python Session',
    topic,
    mode,
    updatedAt: Date.now(),
    messages: [],
  };
}

function loadSessions(fallbackTopic: TutorTopic): {
  sessions: TutorChatSession[];
  activeId: string;
} {
  try {
    const raw = window.localStorage.getItem(CHATS_STORAGE_KEY);
    if (!raw) {
      const first = createEmptySession(fallbackTopic, 'learn');
      return { sessions: [first], activeId: first.id };
    }
    const parsed = JSON.parse(raw) as {
      sessions?: TutorChatSession[];
      activeId?: string;
    };
    if (Array.isArray(parsed.sessions) && parsed.sessions.length > 0) {
      const validActive = parsed.sessions.some((s) => s.id === parsed.activeId)
        ? parsed.activeId!
        : parsed.sessions[0].id;
      return { sessions: parsed.sessions, activeId: validActive };
    }
  } catch {
    // Fallback cleanly
  }
  const first = createEmptySession(fallbackTopic, 'learn');
  return { sessions: [first], activeId: first.id };
}

export function useTutorChats(defaultTopic: TutorTopic) {
  const [state, setState] = useState<{
    sessions: TutorChatSession[];
    activeId: string;
  }>(() => loadSessions(defaultTopic));

  useEffect(() => {
    try {
      window.localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [state]);

  const activeSession =
    state.sessions.find((s) => s.id === state.activeId) ?? state.sessions[0];

  const createNewChat = useCallback((topic: TutorTopic, mode: TutorMode) => {
    const next = createEmptySession(topic, mode);
    setState((prev) => ({
      sessions: [next, ...prev.sessions].slice(0, 25),
      activeId: next.id,
    }));
    return next.id;
  }, []);

  const selectChat = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      activeId: id,
    }));
  }, []);

  const updateSessionMeta = useCallback(
    (sessionId: string, patch: Partial<Pick<TutorChatSession, 'title' | 'topic' | 'mode'>>) => {
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === sessionId ? { ...s, ...patch, updatedAt: Date.now() } : s
        ),
      }));
    },
    []
  );

  const appendMessage = useCallback((sessionId: string, msg: TutorMessage) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => {
        if (s.id !== sessionId) return s;
        const shouldRetitle =
          s.messages.length === 0 && msg.role === 'user' && msg.content.trim().length > 0;
        const autoTitle = shouldRetitle
          ? msg.content.trim().replace(/\s+/g, ' ').slice(0, 42) +
            (msg.content.trim().length > 42 ? '...' : '')
          : s.title;
        return {
          ...s,
          title: autoTitle,
          updatedAt: Date.now(),
          messages: [...s.messages, msg],
        };
      }),
    }));
  }, []);

  const updateMessage = useCallback(
    (
      sessionId: string,
      messageId: string,
      updater: (prev: TutorMessage) => TutorMessage
    ) => {
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            updatedAt: Date.now(),
            messages: s.messages.map((m) => (m.id === messageId ? updater(m) : m)),
          };
        }),
      }));
    },
    []
  );

  const clearAllChats = useCallback((topic: TutorTopic) => {
    const fresh = createEmptySession(topic, 'learn');
    setState({ sessions: [fresh], activeId: fresh.id });
  }, []);

  return {
    sessions: state.sessions,
    activeSession,
    createNewChat,
    selectChat,
    updateSessionMeta,
    appendMessage,
    updateMessage,
    clearAllChats,
  };
}
