const express = require('express');

const ApplicationsController = require('../controllers/applicationsController');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  ApplicationPayloadSchema,
  UpdateApplicationStatusPayloadSchema,
} = require('../validators');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  validate(ApplicationPayloadSchema),
  ApplicationsController.createApplication,
);

router.get('/', ApplicationsController.getApplications);

router.get('/user/:userId', ApplicationsController.getApplicationsByUserId);
router.get('/job/:jobId', ApplicationsController.getApplicationsByJobId);

router.get('/:id', ApplicationsController.getApplicationById);

router.put(
  '/:id',
  validate(UpdateApplicationStatusPayloadSchema),
  ApplicationsController.updateApplicationStatusById,
);

router.delete('/:id', ApplicationsController.deleteApplicationById);

module.exports = router;