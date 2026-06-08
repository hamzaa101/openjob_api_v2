require('dotenv').config();

const app = require('./app');
const { connectRedis } = require('./cache/redisClient');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectRedis();

    app.listen(port, host, () => {
      console.log(`Server berjalan pada http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Gagal menjalankan server:', error.message);
    process.exit(1);
  }
};

startServer();