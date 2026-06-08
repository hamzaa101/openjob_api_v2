const UsersService = require("../services/usersService");
const CacheService = require("../cache/cacheService");

const UsersController = {
  async createUser(req, res, next) {
    try {
      const id = await UsersService.addUser(req.body);

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

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = `users:${id}`;

      const cachedUser = await CacheService.get(cacheKey);

      if (cachedUser) {
        res.setHeader("X-Data-Source", "cache");

        return res.status(200).json({
          status: "success",
          data: cachedUser,
        });
      }

      const user = await UsersService.getUserById(id);

      await CacheService.set(cacheKey, user);

      res.setHeader("X-Data-Source", "database");

      return res.status(200).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = UsersController;
