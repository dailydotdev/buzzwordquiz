import request from 'supertest';
import { FastifyInstance } from 'fastify';
import appFunc from '../../src';
import { LEADERBOARD_SIZE } from '../../src/routes/sessions';
import { redis } from '../../src/redis';

let app: FastifyInstance;

beforeAll(async () => {
  app = await appFunc();
  return app.ready();
});

afterAll(() => app.close());

const date = new Date(0);

describe('GET /leaderboard', () => {
  const path = '/leaderboard';

  it('should truncate leaderboard and return sorted by score', async () => {
    const pipeline = [...new Array(LEADERBOARD_SIZE + 20)].reduce(
      (pipeline, value, index) => {
        const key = `leaderboard:${index}`;
        return pipeline
          .set(
            key,
            JSON.stringify({
              id: index,
              name: `Leader${index}`,
              date: date.toISOString(),
              score: index + 1,
            }),
          )
          .zadd('leaderboard.score.index', index + 1, key);
      },
      redis.pipeline(),
    );
    await pipeline.exec();

    const res = await request(app.server).get(path).expect(200);
    expect(res.body).toMatchSnapshot();
  });

  it('should return leaderboard even if not fully filled', async () => {
    const pipeline = [...new Array(5)].reduce((pipeline, value, index) => {
      const key = `leaderboard:${index}`;
      return pipeline
        .set(
          key,
          JSON.stringify({
            id: index,
            name: `Leader${index}`,
            date: date.toISOString(),
            score: index + 1,
          }),
        )
        .zadd('leaderboard.score.index', index + 1, key);
    }, redis.pipeline());
    await pipeline.exec();

    const res = await request(app.server).get(path).expect(200);
    expect(res.body).toMatchSnapshot();
  });

  it('should return empty leaderboard', async () => {
    const res = await request(app.server).get(path).expect(200);
    expect(res.body).toMatchSnapshot({ leaderboard: [] });
  });
});
