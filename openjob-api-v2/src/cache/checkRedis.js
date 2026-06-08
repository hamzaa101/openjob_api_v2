require('dotenv').config();

const { connectRedis, redisClient } = require('./redisClient');
const CacheService = require('./cacheService');

const checkRedis = async () => {
  try {
    await connectRedis();

    await CacheService.set('test:key', {
      message: 'Redis cache berhasil',
    });

    const data = await CacheService.get('test:key');

    console.log(data);

    await CacheService.delete('test:key');

    console.log('Redis test selesai');
  } catch (error) {
    console.error('Redis test gagal:', error.message);
  } finally {
    await redisClient.quit();
  }
};

checkRedis();