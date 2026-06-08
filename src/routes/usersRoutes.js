const express = require('express');

const UsersController = require('../controllers/usersController');
const validate = require('../middlewares/validate');
const { UserPayloadSchema } = require('../validators');

const router = express.Router();

router.post('/', validate(UserPayloadSchema), UsersController.createUser);
router.get('/:id', UsersController.getUserById);

module.exports = router;