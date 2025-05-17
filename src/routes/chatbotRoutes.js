const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { ensureAuthenticated } = require('../middlewares/auth');
const { jwtAuth } =  require('../middlewares/auth');

// router.use(ensureAuthenticated);

router.post('/sessions', jwtAuth, chatbotController.createSession);
router.get('/sessions', jwtAuth, chatbotController.getSessions);
router.get('/sessions/:sessionId/messages', jwtAuth, chatbotController.getSessionMessages);
router.post('/sessions/:sessionId/messages', jwtAuth, chatbotController.addMessage);

module.exports = router;
