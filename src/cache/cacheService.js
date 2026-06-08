const { redisClient } = require('./redisClient');

const ONE_HOUR_IN_SECONDS = 60 * 60;

const CacheService = {
  async set(key, value, expirationInSeconds = ONE_HOUR_IN_SECONDS) {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expirationInSeconds,
    });
  },

  async get(key) {
    const value = await redisClient.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  },

  async delete(key) {
    await redisClient.del(key);
  },

  async deleteMany(keys) {
    if (!keys || keys.length === 0) {
      return;
    }

    await redisClient.del(keys);
  },

  async deleteByPattern(pattern) {
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  },

  async flushAll() {
    await redisClient.flushAll();
  },
};

module.exports = CacheService;