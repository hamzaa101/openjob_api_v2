const pool = require('../config/pool');
const createId = require('../utils/id');
const { InvariantError, NotFoundError } = require('../utils/errors');

const CategoriesService = {
  async addCategory(payload) {
    const { name } = payload;

    const id = createId('category');

    const query = {
      text: `
        INSERT INTO categories (id, name)
        VALUES ($1, $2)
        RETURNING id
      `,
      values: [id, name],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Category gagal ditambahkan');
    }

    return result.rows[0].id;
  },

  async getCategories() {
    const query = {
      text: `
        SELECT id, name, created_at, updated_at
        FROM categories
        ORDER BY created_at DESC
      `,
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async getCategoryById(id) {
    const query = {
      text: `
        SELECT id, name, created_at, updated_at
        FROM categories
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Category tidak ditemukan');
    }

    return result.rows[0];
  },

  async updateCategoryById(id, payload) {
    const { name } = payload;

    const query = {
      text: `
        UPDATE categories
        SET name = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      `,
      values: [name, id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Category tidak ditemukan');
    }
  },

  async deleteCategoryById(id) {
    const query = {
      text: `
        DELETE FROM categories
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Category tidak ditemukan');
    }
  },
};

module.exports = CategoriesService;