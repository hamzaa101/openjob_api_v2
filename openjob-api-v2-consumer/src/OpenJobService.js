const { Pool } = require('pg');

class OpenJobService {
  constructor() {
    this._pool = new Pool();
  }

  async getApplicationNotificationData(applicationId) {
    const query = {
      text: `
        SELECT
          a.id AS application_id,
          a.created_at AS application_date,
          applicant.name AS applicant_name,
          applicant.email AS applicant_email,
          owner.id AS owner_id,
          owner.name AS owner_name,
          owner.email AS owner_email,
          j.id AS job_id,
          j.title AS job_title
        FROM applications a
        JOIN users applicant ON applicant.id = a.user_id
        JOIN jobs j ON j.id = a.job_id
        JOIN users owner ON owner.id = j.owner_id
        WHERE a.id = $1
      `,
      values: [applicationId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new Error('Data application atau pemilik job tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = OpenJobService;