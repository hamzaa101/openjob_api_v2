const express = require('express');

const BookmarksController = require('../controllers/bookmarksController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, BookmarksController.getBookmarks);

module.exports = router;