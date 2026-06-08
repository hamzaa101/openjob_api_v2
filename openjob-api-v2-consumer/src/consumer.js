require('dotenv').config();

const amqp = require('amqplib');
const OpenJobService = require('./OpenJobService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const QUEUE_NAME = 'application_notifications';

const getRabbitMqUrl = () => {
  const host = process.env.RABBITMQ_HOST || 'localhost';
  const port = process.env.RABBITMQ_PORT || 5672;
  const user = process.env.RABBITMQ_USER || 'guest';
  const password = process.env.RABBITMQ_PASSWORD || 'guest';

  return `amqp://${user}:${password}@${host}:${port}`;
};

const init = async () => {
  const openJobService = new OpenJobService();
  const mailSender = new MailSender();
  const listener = new Listener(openJobService, mailSender);

  const connection = await amqp.connect(getRabbitMqUrl());
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, {
    durable: true,
  });

  console.log(`Consumer berjalan. Menunggu message dari queue: ${QUEUE_NAME}`);

  channel.consume(QUEUE_NAME, listener.listen, {
    noAck: true,
  });
};

init();