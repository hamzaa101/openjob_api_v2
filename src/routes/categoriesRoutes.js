const express = require('express');

const CategoriesController = require('../controllers/categoriesController');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { CategoryPayloadSchema } = require('../validators');

const router = express.Router();

router.get('/', CategoriesController.getCategories);
router.get('/:id', CategoriesController.getCategoryById);

router.post(
  '/',
  authenticate,
  validate(CategoryPayloadSchema),
  CategoriesController.createCategory,
);

router.put(
  '/:id',
  authenticate,
  validate(CategoryPayloadSchema),
  CategoriesController.updateCategoryById,
);

router.delete(
  '/:id',
  authenticate,
  CategoriesController.deleteCategoryById,
);

module.exports = router;