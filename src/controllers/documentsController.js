const path = require('path');

const DocumentsService = require('../services/documentsService');

const DocumentsController = {
  async uploadDocument(req, res, next) {
    try {
      const document = await DocumentsService.addDocument(req.user.id, req.file);

      return res.status(201).json({
        status: 'success',
        data: document,
      });
    } catch (error) {
      return next(error);
    }
  },

  async getDocuments(req, res, next) {
    try {
      const documents = await DocumentsService.getDocuments();

      return res.status(200).json({
        status: 'success',
        data: {
          documents,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getDocumentById(req, res, next) {
    try {
      const { id } = req.params;

      const document = await DocumentsService.getDocumentById(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${document.originalName}"`,
      );

      return res.sendFile(path.resolve(document.filePath), (error) => {
        if (error) {
          return next(error);
        }

        return null;
      });
    } catch (error) {
      return next(error);
    }
  },

  async deleteDocumentById(req, res, next) {
    try {
      const { id } = req.params;

      await DocumentsService.deleteDocumentById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Document berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = DocumentsController;