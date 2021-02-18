import { FastifyInstance, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import AnswerBodySchema from '../../schemas/answerBody.json';
import { AnswerBodySchema as AnswerBodySchemaInterface } from '../../types/answerBody';
import CompleteBodySchema from '../../schemas/completeBody.json';
import { CompleteBodySchema as CompleteBodySchemaInterface } from '../../types/completeBody';

import {
  generateLettersFromAnswer,
  getNextQuestion,
  getQuestionsCount,
  getWordsLengths,
  Question,
} from '../models/question';
import { redis } from '../redis';
import { CachedSession, sessionIdToKey } from '../models/session';
import { preValidationHookHandler } from 'fastify/types/hooks';

const jwtSign = promisify(jwt.sign);

const JWT_TTL = 10 * 60;
export const MAX_SKIPS = 3;
export const SESSION_DURATION = 90;
export const LEADERBOARD_SIZE = 100;

interface UnansweredQuestion {
  logo: string;
  letters: string[];
  words: number[];
}

interface Session {
  id: string;
  startedAt: Date;
  score: number;
  skips: number;
  maxSkips: number;
  duration: number;
  nextQuestion: UnansweredQuestion;
}

const getReplySessionFromCacheAndNextQuestion = (
  cachedSession: CachedSession,
  nextQuestion: Question,
): Session => ({
  id: cachedSession.id,
  startedAt: new Date(cachedSession.startedAt),
  score: cachedSession.score,
  skips: cachedSession.skips,
  maxSkips: cachedSession.maxSkips,
  duration: cachedSession.duration,
  nextQuestion: {
    logo: nextQuestion.logo,
    letters: generateLettersFromAnswer(nextQuestion.answer),
    words: getWordsLengths(nextQuestion.answer),
  },
});

const fetchNextQuestAndUpdateCache = async (
  request: FastifyRequest,
): Promise<Question> => {
  const sessionId = request.gameSession.id;
  const key = sessionIdToKey(sessionId);
  request.gameSession.previousQuestions.push(request.gameSession.nextAnswer);
  const nextQuestion = await getNextQuestion(
    request.gameSession.questionsCount,
    request.gameSession.previousQuestions,
  );
  request.gameSession.questionsCount -= 1;
  request.gameSession.nextAnswer = nextQuestion.answer;
  await redis.set(key, JSON.stringify(request.gameSession));
  return nextQuestion;
};

const validateSession: preValidationHookHandler = async (request, reply) => {
  if (
    !request.gameSession ||
    request.gameSession.ended ||
    Date.now() - new Date(request.gameSession.startedAt).getTime() >
      (request.gameSession.duration + 1) * 1000
  ) {
    return reply.status(401).send();
  }
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.post(
    '/',
    async (): Promise<{ token: string; session: Session }> => {
      const sessionId = uuidv4();
      const startedAt = new Date();
      const token = (await jwtSign(
        { sessionId, exp: Math.floor(Date.now() / 1000) + JWT_TTL },
        process.env.JWT_KEY,
      )) as string;
      const questionsCount = await getQuestionsCount();
      const nextQuestion = await getNextQuestion(questionsCount, []);
      const key = sessionIdToKey(sessionId);
      const cachedSession: CachedSession = {
        id: sessionId,
        startedAt: startedAt.toISOString(),
        score: 0,
        skips: 0,
        maxSkips: MAX_SKIPS,
        duration: SESSION_DURATION,
        nextAnswer: nextQuestion.answer,
        previousQuestions: [],
        questionsCount: questionsCount - 1,
        ended: false,
      };
      await redis
        .pipeline()
        .set(key, JSON.stringify(cachedSession))
        .expire(key, JWT_TTL)
        .exec();
      return {
        token,
        session: getReplySessionFromCacheAndNextQuestion(
          cachedSession,
          nextQuestion,
        ),
      };
    },
  );

  fastify.post<{ Body: AnswerBodySchemaInterface }>(
    '/answer',
    {
      schema: {
        body: AnswerBodySchema,
      },
      preValidation: validateSession,
    },
    async (request): Promise<{ session?: Session; correct: boolean }> => {
      if (
        request.body.answer.toLowerCase() ===
        request.gameSession.nextAnswer.toLowerCase()
      ) {
        request.gameSession.score += 1;
        const nextQuestion = await fetchNextQuestAndUpdateCache(request);
        return {
          correct: true,
          session: getReplySessionFromCacheAndNextQuestion(
            request.gameSession,
            nextQuestion,
          ),
        };
      }
      return { correct: false };
    },
  );

  fastify.post(
    '/skip',
    {
      preValidation: validateSession,
    },
    async (request, reply): Promise<{ session: Session }> => {
      if (request.gameSession.skips >= request.gameSession.maxSkips) {
        return reply.status(400).send();
      }
      request.gameSession.skips += 1;
      const nextQuestion = await fetchNextQuestAndUpdateCache(request);
      return {
        session: getReplySessionFromCacheAndNextQuestion(
          request.gameSession,
          nextQuestion,
        ),
      };
    },
  );

  fastify.post<{ Body: CompleteBodySchemaInterface }>(
    '/complete',
    {
      schema: {
        body: CompleteBodySchema,
      },
      preValidation: async (request, reply) => {
        if (!request.gameSession || request.gameSession.ended) {
          return reply.status(401).send();
        }
      },
    },
    async (request): Promise<{ sessionId: string; score: number }> => {
      const sessionId = request.gameSession.id;
      const key = sessionIdToKey(sessionId);
      request.gameSession.ended = true;
      const leaderboardKey = `leaderboard:${sessionId}`;
      let pipeline = redis
        .pipeline()
        .set(key, JSON.stringify(request.gameSession));
      if (request.body.name) {
        pipeline = pipeline
          .set(
            leaderboardKey,
            JSON.stringify({
              id: sessionId,
              name: request.body.name,
              date: request.gameSession.startedAt,
              score: request.gameSession.score,
            }),
          )
          .zadd(
            'leaderboard.score.index',
            request.gameSession.score,
            leaderboardKey,
          )
          .sortedTrim('leaderboard.score.index', LEADERBOARD_SIZE);
      }
      await pipeline.exec();

      return {
        sessionId,
        score: request.gameSession.score,
      };
    },
  );
}
