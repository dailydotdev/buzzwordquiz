import { FastifyInstance } from 'fastify';
import { redis } from '../redis';
import { LEADERBOARD_SIZE } from './sessions';

type LeaderboardRow = {
  id: string;
  name: string;
  date: string;
  score: number;
};

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.get(
    '/',
    async (): Promise<{ leaderboard: LeaderboardRow[] }> => {
      const rawResponse = await redis
        .pipeline()
        .leaderboard('leaderboard.score.index', LEADERBOARD_SIZE)
        .exec();
      return {
        leaderboard: rawResponse[0][1].map(
          (res) => JSON.parse(res) as LeaderboardRow,
        ),
      };
    },
  );
}
