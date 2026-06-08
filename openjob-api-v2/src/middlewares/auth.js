const TokenManager = require('../utils/tokenManager');
const { AuthenticationError } = require('../utils/errors');

const authenticate = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return next(new AuthenticationError('Missing authentication'));
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new AuthenticationError('Format token tidak valid'));
  }

  try {
    const payload = TokenManager.verifyAccessToken(token);

    req.user = {
      id: payload.id,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authenticate;