class Listener {
  constructor(openJobService, mailSender) {
    this._openJobService = openJobService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const payload = JSON.parse(message.content.toString());

      if (!payload.application_id) {
        throw new Error('Payload tidak memiliki application_id');
      }

      const data = await this._openJobService.getApplicationNotificationData(
        payload.application_id,
      );

      const result = await this._mailSender.sendApplicationNotification({
        ownerEmail: data.owner_email,
        ownerName: data.owner_name,
        applicantName: data.applicant_name,
        applicantEmail: data.applicant_email,
        applicationDate: data.application_date,
        jobTitle: data.job_title,
      });

      console.log('Email notifikasi berhasil dikirim.');
      console.log(`Owner email: ${data.owner_email}`);
      console.log(`Applicant: ${data.applicant_name} <${data.applicant_email}>`);
      console.log(`Message ID: ${result.messageId}`);
    } catch (error) {
      console.error('Gagal memproses message:', error.message);
    }
  }
}

module.exports = Listener;