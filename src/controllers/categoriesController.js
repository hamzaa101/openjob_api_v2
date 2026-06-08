const CategoriesService = require('../services/categoriesService');

const CategoriesController = {
  async createCategory(req, res, next) {
    try {
      const id = await CategoriesService.addCategory(req.body);

      return res.status(201).json({
        status: 'success',
        data: {
          id,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getCategories(req, res, next) {
    try {
      const categories = await CategoriesService.getCategories();

      return res.status(200).json({
        status: 'success',
        data: {
          categories,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      const category = await CategoriesService.getCategoryById(id);

      return res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      return next(error);
    }
  },

  async updateCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      await CategoriesService.updateCategoryById(id, req.body);

      return res.status(200).json({
        status: 'success',
        message: 'Category berhasil diperbarui',
      });
    } catch (error) {
      return next(error);
    }
  },

  async deleteCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      await CategoriesService.deleteCategoryById(id);

      return res.status(200).json({
        status: 'success',
        message: 'Category berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = CategoriesController;