export type CachedSession = {
  id: string;
  startedAt: string;
  score: number;
  skips: number;
  maxSkips: number;
  duration: number;
  nextAnswer: string;
  previousQuestions: string[];
  questionsCount: number;
  ended: boolean;
};

export const sessionIdToKey = (id: string): string => `sessions:${id}`;
