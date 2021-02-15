import Redis, { RedisOptions, Pipeline } from 'ioredis';

declare module 'ioredis' {
  interface Pipeline {
    sortedTrim: (key: string, value: string | number) => Pipeline;
    leaderboard: (key: string, value: string | number) => Pipeline;
  }
}

export const redisOptions: RedisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT, 10),
  password: process.env.REDIS_PASS,
};

export const redis = new Redis(redisOptions);

redis.defineCommand('sortedTrim', {
  numberOfKeys: 1,
  lua: `
    local index = -(ARGV[1]+1)
    local keys = redis.call("zrange", KEYS[1], 0, index)
    redis.call("del", unpack(keys))
    redis.call("zrem", KEYS[1], unpack(keys))
  `,
});

redis.defineCommand('leaderboard', {
  numberOfKeys: 1,
  lua: `
    local keys = redis.call("zrevrange", KEYS[1], 0, ARGV[1])
    if next(keys) == nil then
      return {}
    end
    return redis.call("mget", unpack(keys))
  `,
});
