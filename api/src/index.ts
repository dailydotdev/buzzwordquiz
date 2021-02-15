import fastify, { FastifyInstance } from 'fastify';
import fastJson from 'fast-json-stringify';
import fastifyHelmet from 'fastify-helmet';
import routes from './routes';
import auth from './middlewares/auth';

const stringifyHealthCheck = fastJson({
  type: 'object',
  properties: {
    status: {
      type: 'string',
    },
  },
});

export default function app(): FastifyInstance {
  const isProd = process.env.NODE_ENV === 'production';

  const app = fastify({
    logger: true,
    disableRequestLogging: true,
    trustProxy: isProd,
  });

  app.register(fastifyHelmet);
  app.register(auth);

  app.get('/health', (req, res) => {
    res.type('application/health+json');
    res.send(stringifyHealthCheck({ status: 'ok' }));
  });

  app.register(routes, { prefix: '/' });

  return app;
}
