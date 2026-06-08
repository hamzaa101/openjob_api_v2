const express = require('express');

const AuthenticationsController = require('../controllers/authenticationsController');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  LoginPayloadSchema,
  RefreshTokenPayloadSchema,
} = require('../validators');

const router = express.Router();

router.post(
  '/',
  validate(LoginPayloadSchema),
  AuthenticationsController.login,
);

router.put(
  '/',
  validate(RefreshTokenPayloadSchema),
  AuthenticationsController.refreshAccessToken,
);

router.delete(
  '/',
  authenticate,
  validate(RefreshTokenPayloadSchema),
  AuthenticationsController.logout,
);

module.exports = router;