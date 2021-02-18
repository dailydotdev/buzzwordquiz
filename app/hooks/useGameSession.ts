import { useState } from 'react';

export interface UnansweredQuestion {
  logo: string;
  letters: string[];
  words: number[];
}

export interface Session {
  id: string;
  startedAt: Date;
  score: number;
  skips: number;
  maxSkips: number;
  duration: number;
  nextQuestion: UnansweredQuestion;
}

type UseGameSessionReturn = {
  token: string;
  session: Session;
  startSession: () => Promise<{ token: string; session: Session }>;
  sendAnswer: (
    answer: string,
  ) => Promise<{ correct: boolean; session?: Session }>;
  skipQuestion: () => Promise<{ session: Session }>;
  completeSession: (
    name: string,
  ) => Promise<{ sessionId: string; score: number }>;
};

export default function useGameSession(): UseGameSessionReturn {
  const [session, setSession] = useState<Session>(null);
  const [token, setToken] = useState<string>(null);

  return {
    token,
    session,
    startSession: async () => {
      const res = await fetch('/api/sessions', { method: 'POST' });
      const body = (await res.json()) as { token: string; session: Session };
      setToken(body.token);
      setSession(body.session);
      return body;
    },
    sendAnswer: async (answer) => {
      const res = await fetch('/api/sessions/answer', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answer }),
      });
      const body = (await res.json()) as {
        correct: boolean;
        session?: Session;
      };
      if (body.session) {
        setSession(body.session);
      }
      return body;
    },
    skipQuestion: async () => {
      const res = await fetch('/api/sessions/skip', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const body = (await res.json()) as { session: Session };
      if (body.session) {
        setSession(body.session);
      }
      return body;
    },
    completeSession: async (name) => {
      const res = await fetch('/api/sessions/complete', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      return res.json();
    },
  };
}
