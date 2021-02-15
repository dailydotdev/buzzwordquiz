import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { CachedSession, sessionIdToKey } from '../models/session';
import { FastifyPluginAsync } from 'fastify';
import { redis } from '../redis';

declare module 'fastify' {
  interface FastifyRequest {
    gameSession: CachedSession;
  }
}

interface AuthPayload {
  sessionId: string;
}

const verifyJwt = (token: string): Promise<AuthPayload | null> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) {
        return reject(err);
      }
      return resolve(payload as AuthPayload | null);
    });
  });

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('gameSession', null);

  fastify.addHook('preValidation', async (request) => {
    try {
      if (request.headers.authorization?.startsWith('Bearer')) {
        const token = request.headers.authorization.replace('Bearer ', '');
        const payload = await verifyJwt(token);
        if (payload) {
          const session = await redis.get(sessionIdToKey(payload.sessionId));
          if (session) {
            request.gameSession = JSON.parse(session) as CachedSession;
          }
        }
      }
    } catch (err) {
      // JWT is invalid - no need to do anything just not authorize
    }
  });
};

export default fp(authPlugin, '3.x');
