const pool = require("../config/pool");
const createId = require("../utils/id");
const { InvariantError, NotFoundError } = require("../utils/errors");

const BookmarksService = {
  async verifyJobExists(jobId) {
    const query = {
      text: "SELECT id FROM jobs WHERE id = $1",
      values: [jobId],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Job tidak valid");
    }
  },

  async addBookmark(userId, jobId) {
    await this.verifyJobExists(jobId);

    const existingQuery = {
      text: `
        SELECT id
        FROM bookmarks
        WHERE user_id = $1 AND job_id = $2
      `,
      values: [userId, jobId],
    };

    const existingResult = await pool.query(existingQuery);

    if (existingResult.rowCount > 0) {
      return existingResult.rows[0].id;
    }

    const id = createId("bookmark");

    const query = {
      text: `
        INSERT INTO bookmarks (id, user_id, job_id)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      values: [id, userId, jobId],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Bookmark gagal ditambahkan");
    }

    return result.rows[0].id;
  },

  async getBookmarksByUserId(userId) {
    const query = {
      text: `
        SELECT
          b.id,
          b.user_id,
          b.job_id,
          b.created_at,
          j.title AS job_title,
          j.description AS job_description,
          j.job_type,
          j.experience_level,
          j.location_type,
          j.location_city,
          j.salary_min,
          j.salary_max,
          j.is_salary_visible,
          j.status,
          j.company_id,
          c.name AS company_name,
          j.category_id,
          cat.name AS category_name
        FROM bookmarks b
        JOIN jobs j ON j.id = b.job_id
        JOIN companies c ON c.id = j.company_id
        JOIN categories cat ON cat.id = j.category_id
        WHERE b.user_id = $1
        ORDER BY b.created_at DESC
      `,
      values: [userId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async getBookmarkById(userId, jobId, bookmarkId) {
    const query = {
      text: `
        SELECT
          b.id,
          b.user_id,
          b.job_id,
          b.created_at,
          j.title AS job_title,
          j.description AS job_description,
          j.job_type,
          j.experience_level,
          j.location_type,
          j.location_city,
          j.salary_min,
          j.salary_max,
          j.is_salary_visible,
          j.status,
          j.company_id,
          c.name AS company_name,
          j.category_id,
          cat.name AS category_name
        FROM bookmarks b
        JOIN jobs j ON j.id = b.job_id
        JOIN companies c ON c.id = j.company_id
        JOIN categories cat ON cat.id = j.category_id
        WHERE b.id = $1
          AND b.user_id = $2
          AND b.job_id = $3
      `,
      values: [bookmarkId, userId, jobId],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Bookmark tidak ditemukan");
    }

    return result.rows[0];
  },

  async deleteBookmarkByUserAndJob(userId, jobId) {
    const query = {
      text: `
        DELETE FROM bookmarks
        WHERE user_id = $1 AND job_id = $2
        RETURNING id
      `,
      values: [userId, jobId],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Bookmark tidak ditemukan");
    }
  },
};

module.exports = BookmarksService;
