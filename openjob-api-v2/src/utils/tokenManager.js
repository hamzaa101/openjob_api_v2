const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('./errors');

const TokenManager = {
  generateAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '3h',
    });
  },

  generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  },

  verifyAccessToken(token) {
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      return payload;
    } catch (error) {
      throw new AuthenticationError('Access token tidak valid');
    }
  },

  verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return payload;
    } catch (error) {
      throw new AuthenticationError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;