const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendApplicationNotification(payload) {
    const {
      ownerEmail,
      ownerName,
      applicantName,
      applicantEmail,
      applicationDate,
      jobTitle,
    } = payload;

    const formattedDate = new Date(applicationDate).toLocaleString('id-ID', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const message = {
      from: `"OpenJob" <${process.env.MAIL_USER}>`,
      to: ownerEmail,
      subject: `Lamaran Baru untuk ${jobTitle}`,
      text: `
Halo ${ownerName},

Ada kandidat baru yang melamar pada lowongan "${jobTitle}".

Detail pelamar:
Nama pelamar: ${applicantName}
Email pelamar: ${applicantEmail}
Tanggal lamaran: ${formattedDate}

Salam,
OpenJob
      `.trim(),
      html: `
        <p>Halo ${ownerName},</p>

        <p>Ada kandidat baru yang melamar pada lowongan <strong>${jobTitle}</strong>.</p>

        <p>Detail pelamar:</p>
        <ul>
          <li><strong>Nama pelamar:</strong> ${applicantName}</li>
          <li><strong>Email pelamar:</strong> ${applicantEmail}</li>
          <li><strong>Tanggal lamaran:</strong> ${formattedDate}</li>
        </ul>

        <p>Salam,<br/>OpenJob</p>
      `,
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;