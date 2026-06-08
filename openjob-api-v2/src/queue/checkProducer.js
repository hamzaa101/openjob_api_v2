require('dotenv').config();

const { ProducerService } = require('./producer');

const checkProducer = async () => {
  try {
    await ProducerService.sendMessage({
      application_id: 'application-test-123',
    });

    console.log('Message berhasil dikirim ke RabbitMQ');
  } catch (error) {
    console.error('Gagal mengirim message:', error.message);
  }
};

checkProducer();