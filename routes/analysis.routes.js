const express = require('express');
const router = express.Router();

const analysisController = require('../controllers/analysis.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');

router.get('/getOverallAnalysis',AuthMiddleware.userAuth, analysisController.getOverallAnalysis);

router.get('/getChatbotsAnalysis',AuthMiddleware.userAuth, analysisController.getChatbotAnalysis);

router.get('/ChatbotGraphAnalysis',AuthMiddleware.userAuth, analysisController.ChatbotGraphAnalysis);

router.get('/ChatbotSpecificGraphAnalysis',AuthMiddleware.userAuth, analysisController.ChatbotSpecificGraphAnalysis);


module.exports = router;