const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { ensureAuthenticated, jwtAuth} = require('../middlewares/auth');


// router.use(ensureAuthenticated);

router.post('/add', jwtAuth, reminderController.createReminder);
router.get('/', jwtAuth, reminderController.getReminders);

module.exports = router;
