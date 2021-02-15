import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { mocked } from 'ts-jest/utils';
import appFunc from '../../src';
import { getNextQuestion, getQuestionsCount } from '../../src/models/question';
import {
  LEADERBOARD_SIZE,
  MAX_SKIPS,
  SESSION_DURATION,
} from '../../src/routes/sessions';
import { CachedSession, sessionIdToKey } from '../../src/models/session';
import { redis } from '../../src/redis';

let app: FastifyInstance;

beforeAll(async () => {
  app = await appFunc();
  return app.ready();
});

afterAll(() => app.close());

let token: string;
let session: CachedSession;

const initiateSession = async () => {
  mocked(getQuestionsCount).mockResolvedValueOnce(10);
  mocked(getNextQuestion).mockResolvedValueOnce({
    answer: 'redis',
    logo: 'https://redis.io',
  });
  const res = await request(app.server).post('/sessions').expect(200);
  token = res.body.token;
  session = res.body.session;
};

describe('POST /sessions', () => {
  const path = '/sessions';

  it('should initiate new session and return the first question', async () => {
    mocked(getQuestionsCount).mockResolvedValueOnce(10);
    mocked(getNextQuestion).mockResolvedValueOnce({
      answer: 'redis',
      logo: 'https://redis.io',
    });
    const res = await request(app.server).post(path).expect(200);
    expect(res.body).toEqual({
      token: expect.any(String),
      session: {
        id: expect.any(String),
        startedAt: expect.any(String),
        score: 0,
        skips: 0,
        maxSkips: MAX_SKIPS,
        duration: SESSION_DURATION,
        nextQuestion: {
          logo: 'https://redis.io',
          letters: expect.anything(),
          words: [5],
        },
      },
    });
    expect(getNextQuestion).toBeCalledWith(10, []);
  });
});

describe('POST /sessions/answer', () => {
  const path = '/sessions/answer';

  beforeEach(initiateSession);

  it('should increase score on correct answer', async () => {
    mocked(getQuestionsCount).mockResolvedValueOnce(9);
    mocked(getNextQuestion).mockResolvedValueOnce({
      answer: 'mongodb',
      logo: 'https://mongodb.com',
    });
    const res = await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send({ answer: 'redis' })
      .expect(200);
    expect(res.body).toEqual({
      correct: true,
      session: {
        ...session,
        score: 1,
        nextQuestion: {
          logo: 'https://mongodb.com',
          letters: expect.anything(),
          words: [7],
        },
      },
    });
    expect(getNextQuestion).toBeCalledWith(9, ['redis']);
  });

  it('should do nothing on wrong answer', async () => {
    const res = await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send({ answer: 'mysql' })
      .expect(200);
    expect(res.body).toEqual({
      correct: false,
    });
  });

  it('should return 401 when session has ended', async () => {
    const key = sessionIdToKey(session.id);
    const cachedSession = JSON.parse(await redis.get(key)) as CachedSession;
    await redis.set(key, JSON.stringify({ ...cachedSession, ended: true }));
    await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('should return 401 on bad authorization', async () => {
    await request(app.server).post(path).send({ answer: 'mysql' }).expect(401);
  });

  it('should return 400 on empty request', async () => {
    await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });
});

describe('POST /sessions/skip', () => {
  const path = '/sessions/skip';

  beforeEach(initiateSession);

  it('should skip question', async () => {
    mocked(getQuestionsCount).mockResolvedValueOnce(9);
    mocked(getNextQuestion).mockResolvedValueOnce({
      answer: 'mongodb',
      logo: 'https://mongodb.com',
    });
    const res = await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toEqual({
      session: {
        ...session,
        skips: 1,
        nextQuestion: {
          logo: 'https://mongodb.com',
          letters: expect.anything(),
          words: [7],
        },
      },
    });
    expect(getNextQuestion).toBeCalledWith(9, ['redis']);
  });

  it('should not allow to skip above maximum', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const i of new Array(MAX_SKIPS)) {
      mocked(getQuestionsCount).mockResolvedValueOnce(9);
      mocked(getNextQuestion).mockResolvedValueOnce({
        answer: 'mongodb',
        logo: 'https://mongodb.com',
      });
      await request(app.server)
        .post(path)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    }
    await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);
  });

  it('should return 401 on bad authorization', async () => {
    await request(app.server).post(path).expect(401);
  });

  it('should return 401 when session has ended', async () => {
    const key = sessionIdToKey(session.id);
    const cachedSession = JSON.parse(await redis.get(key)) as CachedSession;
    await redis.set(key, JSON.stringify({ ...cachedSession, ended: true }));
    await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});

describe('POST /sessions/complete', () => {
  const path = '/sessions/complete';

  beforeEach(initiateSession);

  it('should complete the session and add to leaderboard', async () => {
    const res = await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ido' })
      .expect(200);
    expect(res.body).toEqual({
      sessionId: session.id,
      score: 0,
    });
    const leaderboard = JSON.parse(
      await redis.get(`leaderboard:${session.id}`),
    );
    expect(leaderboard).toEqual({
      id: session.id,
      date: session.startedAt,
      name: 'Ido',
      score: 0,
    });
  });

  it('should complete the session and not add to leaderboard', async () => {
    const res = await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: undefined })
      .expect(200);
    expect(res.body).toEqual({
      sessionId: session.id,
      score: 0,
    });
    const leaderboard = JSON.parse(
      await redis.get(`leaderboard:${session.id}`),
    );
    expect(leaderboard).toEqual(null);
  });

  it('should trim leaderboard', async () => {
    const pipeline = [...new Array(LEADERBOARD_SIZE)].reduce(
      (pipeline, value, index) => {
        const key = `leaderboard:${index}`;
        return pipeline
          .set(
            key,
            JSON.stringify({
              id: index,
              name: `Leader${index}`,
              date: new Date().toISOString(),
              score: index + 1,
            }),
          )
          .zadd('leaderboard.score.index', index + 1, key);
      },
      redis.pipeline(),
    );
    await pipeline.exec();
    const res = await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ido' })
      .expect(200);
    expect(res.body).toEqual({
      sessionId: session.id,
      score: 0,
    });
    const leaderboard = JSON.parse(
      await redis.get(`leaderboard:${session.id}`),
    );
    expect(leaderboard).toEqual(null);
  });

  it('should return 401 on bad authorization', async () => {
    await request(app.server).post(path).expect(401);
  });

  it('should return 401 when session has ended', async () => {
    const key = sessionIdToKey(session.id);
    const cachedSession = JSON.parse(await redis.get(key)) as CachedSession;
    await redis.set(key, JSON.stringify({ ...cachedSession, ended: true }));
    await request(app.server)
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
