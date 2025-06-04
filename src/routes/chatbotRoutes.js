const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { ensureAuthenticated } = require('../middlewares/auth');
const { jwtAuth } =  require('../middlewares/auth');

// router.use(ensureAuthenticated);

router.post('/sessions', jwtAuth, chatbotController.createSession);
router.get('/sessions/:id', jwtAuth, chatbotController.getSessionsByUsersId);
router.put('/sessions/edit/:id', jwtAuth, chatbotController.updateSessionByUserId);
router.get('/sessions/:sessionId/messages', jwtAuth, chatbotController.getMessagesBySessionsId);
router.post('/sessions/:sessionId/messages', jwtAuth, chatbotController.addMessage);

module.exports = router;
