const express = require('express');

const ProfileController = require('../controllers/profileController');
const authenticate = require('../middlewares/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', ProfileController.getProfile);
router.get('/applications', ProfileController.getProfileApplications);
router.get('/bookmarks', ProfileController.getProfileBookmarks);

module.exports = router;