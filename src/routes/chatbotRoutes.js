const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { ensureAuthenticated } = require('../middlewares/auth');

router.use(ensureAuthenticated);

router.post('/sessions', chatbotController.createSession);
router.get('/sessions', chatbotController.getSessions);
router.get('/sessions/:sessionId/messages', chatbotController.getSessionMessages);
router.post('/sessions/:sessionId/messages', chatbotController.addMessage);

module.exports = router;
