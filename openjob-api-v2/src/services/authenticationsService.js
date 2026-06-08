const pool = require('../config/pool');
const { InvariantError } = require('../utils/errors');

const AuthenticationsService = {
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications (token) VALUES ($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Refresh token tidak ditemukan di database');
    }
  },

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await pool.query(query);
  },
};

module.exports = AuthenticationsService;