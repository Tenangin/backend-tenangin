const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { ensureAuthenticated } = require('../middlewares/auth');

router.use(ensureAuthenticated);

router.post('/', reminderController.createReminder);
router.get('/', reminderController.getReminders);

module.exports = router;
