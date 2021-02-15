import '../src/config';
import { redis } from '../src/redis';

jest.mock('../src/models/question', () => ({
  ...jest.requireActual('../src/models/question'),
  getQuestionsCount: jest.fn(),
  getNextQuestion: jest.fn(),
}));

afterEach(() => redis.flushall());

afterAll(async () => {
  redis.disconnect();
});
