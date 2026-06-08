const BookmarksService = require("../services/bookmarksService");
const CacheService = require("../cache/cacheService");

const BookmarksController = {
  async createBookmark(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      const id = await BookmarksService.addBookmark(userId, jobId);

      await CacheService.delete(`bookmarks:user:${userId}`);

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

  async getBookmarks(req, res, next) {
    try {
      const userId = req.user.id;
      const cacheKey = `bookmarks:user:${userId}`;

      const cachedBookmarks = await CacheService.get(cacheKey);

      if (cachedBookmarks) {
        res.setHeader("X-Data-Source", "cache");

        return res.status(200).json({
          status: "success",
          data: {
            bookmarks: cachedBookmarks,
          },
        });
      }

      const bookmarks = await BookmarksService.getBookmarksByUserId(userId);

      await CacheService.set(cacheKey, bookmarks);

      res.setHeader("X-Data-Source", "database");

      return res.status(200).json({
        status: "success",
        data: {
          bookmarks,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async getBookmarkById(req, res, next) {
    try {
      const { jobId, id } = req.params;
      const userId = req.user.id;

      const bookmark = await BookmarksService.getBookmarkById(
        userId,
        jobId,
        id,
      );

      return res.status(200).json({
        status: "success",
        data: bookmark,
      });
    } catch (error) {
      return next(error);
    }
  },

  async deleteBookmark(req, res, next) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      await BookmarksService.deleteBookmarkByUserAndJob(userId, jobId);

      await CacheService.delete(`bookmarks:user:${userId}`);

      return res.status(200).json({
        status: "success",
        message: "Bookmark berhasil dihapus",
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = BookmarksController;
