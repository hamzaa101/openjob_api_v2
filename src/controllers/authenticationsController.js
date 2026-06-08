const UsersService = require("../services/usersService");
const AuthenticationsService = require("../services/authenticationsService");
const TokenManager = require("../utils/tokenManager");

const AuthenticationsController = {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UsersService.verifyUserCredential(email, password);

      const accessToken = TokenManager.generateAccessToken({
        id: user.id,
      });

      const refreshToken = TokenManager.generateRefreshToken({
        id: user.id,
      });

      await AuthenticationsService.addRefreshToken(refreshToken);

      return res.status(200).json({
        status: "success",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async refreshAccessToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      await AuthenticationsService.verifyRefreshToken(refreshToken);

      const payload = TokenManager.verifyRefreshToken(refreshToken);

      const accessToken = TokenManager.generateAccessToken({
        id: payload.id,
      });

      return res.status(200).json({
        status: "success",
        data: {
          accessToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;

      await AuthenticationsService.deleteRefreshToken(refreshToken);

      return res.status(200).json({
        status: "success",
        message: "Refresh token berhasil dihapus",
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = AuthenticationsController;
