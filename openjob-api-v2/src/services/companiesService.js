const pool = require('../config/pool');
const createId = require('../utils/id');
const { InvariantError, NotFoundError } = require('../utils/errors');

const CompaniesService = {
  async addCompany(payload) {
    const { name, location, description = null } = payload;

    const id = createId('company');

    const query = {
      text: `
        INSERT INTO companies (id, name, location, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `,
      values: [id, name, location, description],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Company gagal ditambahkan');
    }

    return result.rows[0].id;
  },

  async getCompanies() {
    const query = {
      text: `
        SELECT id, name, location, description, created_at, updated_at
        FROM companies
        ORDER BY created_at DESC
      `,
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async getCompanyById(id) {
    const query = {
      text: `
        SELECT id, name, location, description, created_at, updated_at
        FROM companies
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Company tidak ditemukan');
    }

    return result.rows[0];
  },

  async updateCompanyById(id, payload) {
    const { name, location, description = null } = payload;

    const query = {
      text: `
        UPDATE companies
        SET name = $1,
            location = $2,
            description = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id
      `,
      values: [name, location, description, id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Company tidak ditemukan');
    }
  },

  async deleteCompanyById(id) {
    const query = {
      text: `
        DELETE FROM companies
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Company tidak ditemukan');
    }
  },
};

module.exports = CompaniesService;