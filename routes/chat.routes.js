const express = require('express');
const router = express.Router();


const chatController = require('../controllers/chat.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.post('/create-bot', AuthMiddleware.userAuth ,chatController.createBot);

router.post('/generate',chatController.generateResponse);

router.get('/list-bots', AuthMiddleware.userAuth ,chatController.listBots);

router.get('/get-bot/:id', AuthMiddleware.userAuth ,chatController.getBot);

router.post('/update-bot',AuthMiddleware.userAuth,chatController.updateBot)

router.post('/delete-bot',AuthMiddleware.userAuth,chatController.deleteBot);

router.post('/activate-bot',AuthMiddleware.userAuth,chatController.activateBot);

router.get('/get-logs',AuthMiddleware.userAuth,chatController.getLogs)

router.get('/get-overall-logs',AuthMiddleware.userAuth,chatController.getUserLog)

module.exports = router;