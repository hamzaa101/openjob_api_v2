const CompaniesService = require("../services/companiesService");
const CacheService = require("../cache/cacheService");

const CompaniesController = {
  async createCompany(req, res, next) {
    try {
      const id = await CompaniesService.addCompany(req.body);

      await CacheService.deleteByPattern("companies:*");

      return res.status(201).json({
        status: "success",
        data: {
          id,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getCompanies(req, res, next) {
    try {
      const companies = await CompaniesService.getCompanies();

      return res.status(200).json({
        status: "success",
        data: {
          companies,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getCompanyById(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = `companies:${id}`;

      const cachedCompany = await CacheService.get(cacheKey);

      if (cachedCompany) {
        res.setHeader("X-Data-Source", "cache");

        return res.status(200).json({
          status: "success",
          data: cachedCompany,
        });
      }

      const company = await CompaniesService.getCompanyById(id);

      await CacheService.set(cacheKey, company);

      res.setHeader("X-Data-Source", "database");

      return res.status(200).json({
        status: "success",
        data: company,
      });
    } catch (error) {
      return next(error);
    }
  },

  async updateCompanyById(req, res, next) {
    try {
      const { id } = req.params;

      await CompaniesService.updateCompanyById(id, req.body);
      await CacheService.delete(`companies:${id}`);

      return res.status(200).json({
        status: "success",
        message: "Company berhasil diperbarui",
      });
    } catch (error) {
      return next(error);
    }
  },

  async deleteCompanyById(req, res, next) {
    try {
      const { id } = req.params;

      await CompaniesService.deleteCompanyById(id);
      await CacheService.delete(`companies:${id}`);

      return res.status(200).json({
        status: "success",
        message: "Company berhasil dihapus",
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = CompaniesController;
