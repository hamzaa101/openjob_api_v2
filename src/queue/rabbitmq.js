const amqp = require('amqplib');

const getRabbitMqUrl = () => {
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || 5672;
  const user = process.env.RABBITMQ_USER || 'guest';
  const password = process.env.RABBITMQ_PASSWORD || 'guest';

  return `amqp://${user}:${password}@${host}:${port}`;
};

const RabbitMQ = {
  async connect() {
    const connection = await amqp.connect(getRabbitMqUrl());
    const channel = await connection.createChannel();

    return {
      connection,
      channel,
    };
  },
};

module.exports = RabbitMQ;