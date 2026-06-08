const fs = require('fs');
const path = require('path');

const pool = require('../config/pool');
const createId = require('../utils/id');
const {
  InvariantError,
  NotFoundError,
} = require('../utils/errors');

const DocumentsService = {
  async addDocument(userId, file) {
    if (!file) {
      throw new InvariantError('File is required');
    }

    const id = createId('document');

    const query = {
      text: `
        INSERT INTO documents (
          id,
          user_id,
          file_name,
          original_name,
          mime_type,
          file_path
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `,
      values: [
        id,
        userId,
        file.filename,
        file.originalname,
        file.mimetype,
        file.path,
      ],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new InvariantError('Document gagal ditambahkan');
    }

    return {
      documentId: result.rows[0].id,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  },

  async getDocuments() {
    const query = {
      text: `
        SELECT
          d.id,
          d.user_id,
          d.file_name,
          d.original_name,
          d.mime_type,
          d.file_path,
          d.created_at,
          u.name AS user_name,
          u.email AS user_email
        FROM documents d
        JOIN users u ON u.id = d.user_id
        ORDER BY d.created_at DESC
      `,
    };

    const result = await pool.query(query);

    return result.rows.map((document) => ({
      id: document.id,
      user_id: document.user_id,
      filename: document.file_name,
      originalName: document.original_name,
      mimeType: document.mime_type,
      created_at: document.created_at,
      user_name: document.user_name,
      user_email: document.user_email,
    }));
  },

  async getDocumentById(id) {
    const query = {
      text: `
        SELECT
          id,
          user_id,
          file_name,
          original_name,
          mime_type,
          file_path,
          created_at
        FROM documents
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Document tidak ditemukan');
    }

    const document = result.rows[0];
    const absolutePath = path.resolve(document.file_path);

    if (!fs.existsSync(absolutePath)) {
      throw new NotFoundError('File document tidak ditemukan');
    }

    return {
      id: document.id,
      userId: document.user_id,
      filename: document.file_name,
      originalName: document.original_name,
      mimeType: document.mime_type,
      filePath: absolutePath,
      createdAt: document.created_at,
    };
  },

  async deleteDocumentById(id) {
    const document = await this.getDocumentById(id);

    const query = {
      text: `
        DELETE FROM documents
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Document tidak ditemukan');
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
  },
};

module.exports = DocumentsService;