const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
  },
});

redisClient.on('error', (error) => {
  console.error('Redis Client Error:', error.message);
});

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('Redis connected');
  }
};

module.exports = {
  redisClient,
  connectRedis,
};