require('dotenv').config();

const RabbitMQ = require('./queue/rabbitmq');
const { QUEUE_NAME } = require('./queue/producer');
const JobsService = require('./services/jobsService');
const MailService = require('./mail/mailService');

const startConsumer = async () => {
  try {
    const { connection, channel } = await RabbitMQ.connect();

    await channel.assertQueue(QUEUE_NAME, {
      durable: true,
    });

    await channel.prefetch(1);

    console.log(`Consumer berjalan. Menunggu message dari queue: ${QUEUE_NAME}`);

    channel.consume(
      QUEUE_NAME,
      async (message) => {
        if (!message) {
          return;
        }

        try {
          const payload = JSON.parse(message.content.toString());

          console.log('Message diterima dari RabbitMQ:', payload);

          if (!payload.application_id) {
            throw new Error('Payload tidak memiliki application_id');
          }

          const notificationData = await JobsService.getJobOwnerByApplicationId(
            payload.application_id,
          );

          const mailInfo = await MailService.sendApplicationNotification({
            ownerEmail: notificationData.owner_email,
            ownerName: notificationData.owner_name,
            applicantName: notificationData.applicant_name,
            applicantEmail: notificationData.applicant_email,
            applicationDate: notificationData.application_date,
            jobTitle: notificationData.job_title,
          });

          console.log('Email notifikasi berhasil dikirim.');
          console.log(`Owner email: ${notificationData.owner_email}`);
          console.log(`Applicant: ${notificationData.applicant_name} <${notificationData.applicant_email}>`);
          console.log(`Message ID: ${mailInfo.messageId}`);

          const previewUrl = nodemailerPreviewUrl(mailInfo);
          if (previewUrl) {
            console.log(`Preview URL: ${previewUrl}`);
          }

          channel.ack(message);
        } catch (error) {
          console.error('Gagal memproses message:', error.message);

          channel.nack(message, false, false);
        }
      },
      {
        noAck: false,
      },
    );

    process.on('SIGINT', async () => {
      console.log('Menutup consumer...');

      await channel.close();
      await connection.close();

      process.exit(0);
    });
  } catch (error) {
    console.error('Consumer gagal dijalankan:', error.message);
    process.exit(1);
  }
};

const nodemailerPreviewUrl = (mailInfo) => {
  try {
    const nodemailer = require('nodemailer');
    return nodemailer.getTestMessageUrl(mailInfo);
  } catch (error) {
    return null;
  }
};

startConsumer();