const express = require('express');

const CompaniesController = require('../controllers/companiesController');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { CompanyPayloadSchema } = require('../validators');

const router = express.Router();

router.get('/', CompaniesController.getCompanies);
router.get('/:id', CompaniesController.getCompanyById);

router.post(
  '/',
  authenticate,
  validate(CompanyPayloadSchema),
  CompaniesController.createCompany,
);

router.put(
  '/:id',
  authenticate,
  validate(CompanyPayloadSchema),
  CompaniesController.updateCompanyById,
);

router.delete(
  '/:id',
  authenticate,
  CompaniesController.deleteCompanyById,
);

module.exports = router;