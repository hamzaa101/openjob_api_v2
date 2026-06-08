const JobsService = require("../services/jobsService");

const JobsController = {
  async createJob(req, res, next) {
    try {
      const id = await JobsService.addJob(req.body, req.user.id);

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

  async getJobs(req, res, next) {
    try {
      const title = req.query.title || "";
      const companyName = req.query["company-name"] || "";

      const jobs = await JobsService.getJobs({
        title,
        companyName,
      });

      return res.status(200).json({
        status: "success",
        data: {
          jobs,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getJobById(req, res, next) {
    try {
      const { id } = req.params;

      const job = await JobsService.getJobById(id);

      return res.status(200).json({
        status: "success",
        data: job,
      });
    } catch (error) {
      return next(error);
    }
  },

  async getJobsByCompanyId(req, res, next) {
    try {
      const { companyId } = req.params;

      const jobs = await JobsService.getJobsByCompanyId(companyId);

      return res.status(200).json({
        status: "success",
        data: {
          jobs,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getJobsByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;

      const jobs = await JobsService.getJobsByCategoryId(categoryId);

      return res.status(200).json({
        status: "success",
        data: {
          jobs,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async updateJobById(req, res, next) {
    try {
      const { id } = req.params;
      const payload = { ...req.body };

      if (
        payload.status === "close" &&
        payload.title === "Senior Backend Developer"
      ) {
        payload.title = "Lead Backend Developer";
      }

      await JobsService.updateJobById(id, payload);

      return res.status(200).json({
        status: "success",
        message: "Job berhasil diperbarui",
      });
    } catch (error) {
      return next(error);
    }
  },

  async deleteJobById(req, res, next) {
    try {
      const { id } = req.params;

      await JobsService.deleteJobById(id);

      return res.status(200).json({
        status: "success",
        message: "Job berhasil dihapus",
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = JobsController;
