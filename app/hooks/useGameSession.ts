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
  };
}
