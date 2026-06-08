const pool = require('../config/pool');
const createId = require('../utils/id');
const {
  InvariantError,
  NotFoundError,
} = require('../utils/errors');

const ApplicationsService = {
  async verifyUserExists(userId) {
    const query = {
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('User tidak valid');
    }
  },

  async verifyJobExists(jobId) {
    const query = {
      text: 'SELECT id FROM jobs WHERE id = $1',
      values: [jobId],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Job tidak valid');
    }
  },

  async verifyApplicationNotExists(userId, jobId) {
    const query = {
      text: `
        SELECT id
        FROM applications
        WHERE user_id = $1 AND job_id = $2
      `,
      values: [userId, jobId],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('User sudah pernah melamar job ini');
    }
  },

  async addApplication(payload, loggedInUserId) {
    const {
      job_id,
      status = 'pending',
    } = payload;

    const userId = payload.user_id || loggedInUserId;

    await this.verifyUserExists(userId);
    await this.verifyJobExists(job_id);
    await this.verifyApplicationNotExists(userId, job_id);

    const id = createId('application');

    const query = {
      text: `
        INSERT INTO applications (id, user_id, job_id, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_id, job_id, status
      `,
      values: [id, userId, job_id, status],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Application gagal ditambahkan');
    }

    return result.rows[0];
  },

  async getApplications() {
    const query = {
      text: `
        SELECT
          a.id,
          a.user_id,
          a.job_id,
          a.status,
          a.created_at,
          a.updated_at,
          u.name AS user_name,
          u.email AS user_email,
          j.title AS job_title
        FROM applications a
        JOIN users u ON u.id = a.user_id
        JOIN jobs j ON j.id = a.job_id
        ORDER BY a.created_at DESC
      `,
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async getApplicationById(id) {
    const query = {
      text: `
        SELECT
          a.id,
          a.user_id,
          a.job_id,
          a.status,
          a.created_at,
          a.updated_at,
          u.name AS user_name,
          u.email AS user_email,
          j.title AS job_title
        FROM applications a
        JOIN users u ON u.id = a.user_id
        JOIN jobs j ON j.id = a.job_id
        WHERE a.id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Application tidak ditemukan');
    }

    return result.rows[0];
  },

  async getApplicationsByUserId(userId) {
    const query = {
      text: `
        SELECT
          a.id,
          a.user_id,
          a.job_id,
          a.status,
          a.created_at,
          a.updated_at,
          u.name AS user_name,
          u.email AS user_email,
          j.title AS job_title
        FROM applications a
        JOIN users u ON u.id = a.user_id
        JOIN jobs j ON j.id = a.job_id
        WHERE a.user_id = $1
        ORDER BY a.created_at DESC
      `,
      values: [userId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async getApplicationsByJobId(jobId) {
    const query = {
      text: `
        SELECT
          a.id,
          a.user_id,
          a.job_id,
          a.status,
          a.created_at,
          a.updated_at,
          u.name AS user_name,
          u.email AS user_email,
          j.title AS job_title
        FROM applications a
        JOIN users u ON u.id = a.user_id
        JOIN jobs j ON j.id = a.job_id
        WHERE a.job_id = $1
        ORDER BY a.created_at DESC
      `,
      values: [jobId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async updateApplicationStatusById(id, status) {
    const query = {
      text: `
        UPDATE applications
        SET status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      `,
      values: [status, id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Application tidak ditemukan');
    }
  },

  async deleteApplicationById(id) {
    const query = {
      text: `
        DELETE FROM applications
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Application tidak ditemukan');
    }
  },
};

module.exports = ApplicationsService;