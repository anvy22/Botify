const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middlewares/auth.middleware');
const activityController = require('../controllers/activity.controller');


router.get('/recentActivities',AuthMiddleware.userAuth, activityController.recentActivities); 


module.exports = router;