const RabbitMQ = require('./rabbitmq');

const QUEUE_NAME = 'application_notifications';

const ProducerService = {
  async sendMessage(message) {
    const { connection, channel } = await RabbitMQ.connect();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );

    await channel.close();
    await connection.close();
  },
};

module.exports = {
  ProducerService,
  QUEUE_NAME,
};