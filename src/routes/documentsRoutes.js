const express = require('express');

const DocumentsController = require('../controllers/documentsController');
const authenticate = require('../middlewares/auth');
const uploadDocument = require('../middlewares/upload');

const router = express.Router();

router.get('/', DocumentsController.getDocuments);
router.get('/:id', DocumentsController.getDocumentById);

router.post(
  '/',
  authenticate,
  uploadDocument,
  DocumentsController.uploadDocument,
);

router.delete(
  '/:id',
  authenticate,
  DocumentsController.deleteDocumentById,
);

module.exports = router;