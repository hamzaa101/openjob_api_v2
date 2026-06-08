const pool = require("../config/pool");
const createId = require("../utils/id");
const { InvariantError, NotFoundError } = require("../utils/errors");

const mapJobResponse = (job, includeCompanyName = false) => {
  const mappedJob = {
    id: job.id,
    company_id: job.company_id,
    category_id: job.category_id,
    title: job.title,
    description: job.description,
    job_type: job.job_type,
    experience_level: job.experience_level,
    location_type: job.location_type,
    location_city: job.location_city,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    is_salary_visible: job.is_salary_visible,
    status: job.status,
  };

  if (includeCompanyName) {
    mappedJob.company_name = job.company_name;
  }

  return mappedJob;
};

const JobsService = {
  async verifyCompanyExists(companyId) {
    const query = {
      text: "SELECT id FROM companies WHERE id = $1",
      values: [companyId],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Company tidak valid");
    }
  },

  async verifyCategoryExists(categoryId) {
    const query = {
      text: "SELECT id FROM categories WHERE id = $1",
      values: [categoryId],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Category tidak valid");
    }
  },

  async addJob(payload, ownerId) {
    const {
      company_id,
      category_id,
      title,
      description,
      job_type,
      experience_level,
      location_type,
      location_city = null,
      salary_min = null,
      salary_max = null,
      is_salary_visible = false,
      status = "open",
    } = payload;

    await this.verifyCompanyExists(company_id);
    await this.verifyCategoryExists(category_id);

    const id = createId("job");

    const query = {
      text: `
        INSERT INTO jobs (
          id,
          company_id,
          category_id,
          owner_id,
          title,
          description,
          job_type,
          experience_level,
          location_type,
          location_city,
          salary_min,
          salary_max,
          is_salary_visible,
          status
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14
        )
        RETURNING id
      `,
      values: [
        id,
        company_id,
        category_id,
        ownerId,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status,
      ],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError("Job gagal ditambahkan");
    }

    return result.rows[0].id;
  },

  async getJobs(filters = {}) {
    const { title, companyName } = filters;

    const values = [];
    const conditions = [];

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`j.title ILIKE $${values.length}`);
    }

    if (companyName) {
      values.push(`%${companyName}%`);
      conditions.push(`c.name ILIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = {
      text: `
        SELECT
          j.id,
          j.company_id,
          j.category_id,
          j.title,
          j.description,
          j.job_type,
          j.experience_level,
          j.location_type,
          j.location_city,
          j.salary_min,
          j.salary_max,
          j.is_salary_visible,
          j.status,
          j.created_at,
          j.updated_at,
          c.name AS company_name,
          c.location AS company_location,
          cat.name AS category_name
        FROM jobs j
        JOIN companies c ON c.id = j.company_id
        JOIN categories cat ON cat.id = j.category_id
        ${whereClause}
        ORDER BY j.created_at DESC
      `,
      values,
    };

    const result = await pool.query(query);

    return result.rows.map((job) => mapJobResponse(job, Boolean(companyName)));
  },

  async getJobById(id) {
    const query = {
      text: `
        SELECT
          j.id,
          j.company_id,
          j.category_id,
          j.title,
          j.description,
          j.job_type,
          j.experience_level,
          j.location_type,
          j.location_city,
          j.salary_min,
          j.salary_max,
          j.is_salary_visible,
          j.status,
          j.created_at,
          j.updated_at,
          c.name AS company_name,
          c.location AS company_location,
          cat.name AS category_name
        FROM jobs j
        JOIN companies c ON c.id = j.company_id
        JOIN categories cat ON cat.id = j.category_id
        WHERE j.id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Job tidak ditemukan");
    }

    return mapJobResponse(result.rows[0]);
  },

  async getJobsByCompanyId(companyId) {
    const query = {
      text: `
        SELECT
          j.id,
          j.company_id,
          j.category_id,
          j.title,
          j.description,
          j.job_type,
          j.experience_level,
          j.location_type,
          j.location_city,
          j.salary_min,
          j.salary_max,
          j.is_salary_visible,
          j.status,
          j.created_at,
          j.updated_at,
          c.name AS company_name,
          cat.name AS category_name
        FROM jobs j
        JOIN companies c ON c.id = j.company_id
        JOIN categories cat ON cat.id = j.category_id
        WHERE j.company_id = $1
        ORDER BY j.created_at DESC
      `,
      values: [companyId],
    };

    const result = await pool.query(query);

    return result.rows.map((job) => mapJobResponse(job));
  },

  async getJobsByCategoryId(categoryId) {
    const query = {
      text: `
        SELECT
          j.id,
          j.company_id,
          j.category_id,
          j.title,
          j.description,
          j.job_type,
          j.experience_level,
          j.location_type,
          j.location_city,
          j.salary_min,
          j.salary_max,
          j.is_salary_visible,
          j.status,
          j.created_at,
          j.updated_at,
          c.name AS company_name,
          cat.name AS category_name
        FROM jobs j
        JOIN companies c ON c.id = j.company_id
        JOIN categories cat ON cat.id = j.category_id
        WHERE j.category_id = $1
        ORDER BY j.created_at DESC
      `,
      values: [categoryId],
    };

    const result = await pool.query(query);

    return result.rows.map((job) => mapJobResponse(job));
  },

  async updateJobById(id, payload) {
    const {
      company_id,
      category_id,
      title,
      description,
      job_type,
      experience_level,
      location_type,
      location_city = null,
      salary_min = null,
      salary_max = null,
      is_salary_visible = false,
      status = "open",
    } = payload;

    await this.verifyCompanyExists(company_id);
    await this.verifyCategoryExists(category_id);

    const query = {
      text: `
        UPDATE jobs
        SET company_id = $1,
            category_id = $2,
            title = $3,
            description = $4,
            job_type = $5,
            experience_level = $6,
            location_type = $7,
            location_city = $8,
            salary_min = $9,
            salary_max = $10,
            is_salary_visible = $11,
            status = $12,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $13
        RETURNING id
      `,
      values: [
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status,
        id,
      ],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Job tidak ditemukan");
    }
  },

  async getJobOwnerByApplicationId(applicationId) {
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

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Data pemilik lowongan tidak ditemukan");
    }

    return result.rows[0];
  },

  async deleteJobById(id) {
    const query = {
      text: `
        DELETE FROM jobs
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError("Job tidak ditemukan");
    }
  },
};

module.exports = JobsService;
