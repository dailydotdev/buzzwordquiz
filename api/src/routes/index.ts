import { FastifyInstance } from 'fastify';

import sessions from './sessions';
import leaderboard from './leaderboard';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(sessions, { prefix: '/sessions' });
  fastify.register(leaderboard, { prefix: '/leaderboard' });
}
