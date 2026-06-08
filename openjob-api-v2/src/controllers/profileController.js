const UsersService = require('../services/usersService');
const ApplicationsService = require('../services/applicationsService');
const BookmarksService = require('../services/bookmarksService');

const ProfileController = {
  async getProfile(req, res, next) {
    try {
      const user = await UsersService.getUserById(req.user.id);

      return res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  },

  async getProfileApplications(req, res, next) {
    try {
      const applications = await ApplicationsService.getApplicationsByUserId(req.user.id);

      return res.status(200).json({
        status: 'success',
        data: {
          applications,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getProfileBookmarks(req, res, next) {
    try {
      const bookmarks = await BookmarksService.getBookmarksByUserId(req.user.id);

      return res.status(200).json({
        status: 'success',
        data: {
          bookmarks,
        },
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = ProfileController;