import request from 'supertest';

import appFunc from '../src';
import { FastifyInstance } from 'fastify';

describe('health check', () => {
  let app: FastifyInstance;

  beforeAll(() => {
    app = appFunc();
    return app.ready();
  });

  afterAll(() => app.close());

  it('should return status code 200', () =>
    request(app.server)
      .get('/health')
      .expect('content-type', 'application/health+json; charset=utf-8')
      .expect(200, { status: 'ok' }));
});
