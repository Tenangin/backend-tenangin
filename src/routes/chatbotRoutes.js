const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { ensureAuthenticated } = require('../middlewares/auth');
const { jwtAuth } =  require('../middlewares/auth');

// router.use(ensureAuthenticated);
// chatbot sessions
router.post('/sessions', jwtAuth, chatbotController.createSession); // create session
router.get('/sessions/:id', jwtAuth, chatbotController.getSessionsByUsersId); //get session by user id => dapetin semua session dari users
router.put('/sessions/edit/:id', jwtAuth, chatbotController.updateSessionByUserId); // update session by user id
router.delete('/sessions/:idSession', jwtAuth, chatbotController.deleteSessionById); // delete session by id

// chatbot messages
router.get('/sessions/:sessionId/messages', jwtAuth, chatbotController.getMessagesBySessionsId);
router.post('/sessions/:sessionId/messages', jwtAuth, chatbotController.addMessage);

module.exports = router;
