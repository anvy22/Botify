const express = require('express');
const router = express.Router();


const chatController = require('../controllers/chat.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.post('/create-bot', AuthMiddleware.userAuth ,chatController.createBot);

module.exports = router;