const express = require('express');

const JobsController = require('../controllers/jobsController');
const BookmarksController = require('../controllers/bookmarksController');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { JobPayloadSchema } = require('../validators');

const router = express.Router();

router.get('/', JobsController.getJobs);
router.get('/company/:companyId', JobsController.getJobsByCompanyId);
router.get('/category/:categoryId', JobsController.getJobsByCategoryId);

router.post(
  '/:jobId/bookmark',
  authenticate,
  BookmarksController.createBookmark,
);

router.get(
  '/:jobId/bookmark/:id',
  authenticate,
  BookmarksController.getBookmarkById,
);

router.delete(
  '/:jobId/bookmark',
  authenticate,
  BookmarksController.deleteBookmark,
);

router.get('/:id', JobsController.getJobById);

router.post(
  '/',
  authenticate,
  validate(JobPayloadSchema),
  JobsController.createJob,
);

router.put(
  '/:id',
  authenticate,
  validate(JobPayloadSchema),
  JobsController.updateJobById,
);

router.delete(
  '/:id',
  authenticate,
  JobsController.deleteJobById,
);

module.exports = router;