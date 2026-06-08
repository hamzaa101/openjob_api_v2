const ApplicationsService = require("../services/applicationsService");
const CacheService = require("../cache/cacheService");
const { ProducerService } = require("../queue/producer");

const ApplicationsController = {
  async createApplication(req, res, next) {
    try {
      const application = await ApplicationsService.addApplication(
        req.body,
        req.user.id,
      );

      const userId = application.user_id;
      const jobId = application.job_id;

      await CacheService.deleteMany([
        `applications:user:${userId}`,
        `applications:job:${jobId}`,
      ]);

      ProducerService.sendMessage({
        application_id: application.id,
      }).catch((error) => {
        console.error("Gagal publish application message:", error.message);
      });

      return res.status(201).json({
        status: "success",
        data: application,
      });
    } catch (error) {
      return next(error);
    }
  },

  async getApplications(req, res, next) {
    try {
      const applications = await ApplicationsService.getApplications();
      const mappedApplications = applications.map(mapApplicationResponse);

      return res.status(200).json({
        status: "success",
        data: {
          applications: mappedApplications,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getApplicationById(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = `applications:${id}`;

      const cachedApplication = await CacheService.get(cacheKey);

      if (cachedApplication) {
        res.setHeader("X-Data-Source", "cache");

        return res.status(200).json({
          status: "success",
          data: cachedApplication,
        });
      }

      const application = await ApplicationsService.getApplicationById(id);

      await CacheService.set(cacheKey, application);

      res.setHeader("X-Data-Source", "database");

      return res.status(200).json({
        status: "success",
        data: mapApplicationResponse(application),
      });
    } catch (error) {
      return next(error);
    }
  },

  async getApplicationsByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const cacheKey = `applications:user:${userId}`;

      const cachedApplications = await CacheService.get(cacheKey);

      if (cachedApplications) {
        res.setHeader("X-Data-Source", "cache");

        return res.status(200).json({
          status: "success",
          data: {
            applications: cachedApplications,
          },
        });
      }

      const applications = await ApplicationsService.getApplicationsByUserId(userId);
      const mappedApplications = applications.map(mapApplicationResponse);

      await CacheService.set(cacheKey, applications);

      res.setHeader("X-Data-Source", "database");

      return res.status(200).json({
        status: "success",
        data: {
          applications: mappedApplications,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getApplicationsByJobId(req, res, next) {
    try {
      const { jobId } = req.params;
      const cacheKey = `applications:job:${jobId}`;

      const cachedApplications = await CacheService.get(cacheKey);

      if (cachedApplications) {
        res.setHeader("X-Data-Source", "cache");

        return res.status(200).json({
          status: "success",
          data: {
            applications: cachedApplications,
          },
        });
      }

      const applications = await ApplicationsService.getApplicationsByJobId(jobId);
      const mappedApplications = applications.map(mapApplicationResponse);

      await CacheService.set(cacheKey, applications);

      res.setHeader("X-Data-Source", "database");

      return res.status(200).json({
        status: "success",
        data: {
          applications: mappedApplications,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async updateApplicationStatusById(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const application = await ApplicationsService.getApplicationById(id);

      await ApplicationsService.updateApplicationStatusById(id, status);

      await CacheService.deleteMany([
        `applications:${id}`,
        `applications:user:${application.user_id}`,
        `applications:job:${application.job_id}`,
      ]);

      return res.status(200).json({
        status: "success",
        message: "Application berhasil diperbarui",
      });
    } catch (error) {
      return next(error);
    }
  },

  async deleteApplicationById(req, res, next) {
    try {
      const { id } = req.params;

      const application = await ApplicationsService.getApplicationById(id);

      await ApplicationsService.deleteApplicationById(id);

      await CacheService.deleteMany([
        `applications:${id}`,
        `applications:user:${application.user_id}`,
        `applications:job:${application.job_id}`,
      ]);

      return res.status(200).json({
        status: "success",
        message: "Application berhasil dihapus",
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = ApplicationsController;
