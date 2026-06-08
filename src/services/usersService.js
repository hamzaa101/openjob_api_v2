const bcrypt = require('bcrypt');

const pool = require('../config/pool');
const createId = require('../utils/id');
const {
  InvariantError,
  AuthenticationError,
  NotFoundError,
} = require('../utils/errors');

const UsersService = {
  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      throw new InvariantError('Email sudah digunakan');
    }
  },

  async addUser(payload) {
    const { name, email, password, role } = payload;

    await this.verifyNewEmail(email);

    const id = createId('user');
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: `
        INSERT INTO users (id, name, email, password, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      values: [id, name, email, hashedPassword, role],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('User gagal ditambahkan');
    }

    return result.rows[0].id;
  },

  async getUserById(id) {
    const query = {
      text: `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  },

  async getUserByEmail(email) {
    const query = {
      text: `
        SELECT id, name, email, password, role
        FROM users
        WHERE email = $1
      `,
      values: [email],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthenticationError('Email atau password salah');
    }

    return result.rows[0];
  },

  async verifyUserCredential(email, password) {
    const user = await this.getUserByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError('Email atau password salah');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};

module.exports = UsersService;