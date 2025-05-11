const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const { jwtAuth } = require('../middlewares/auth');

// router.use(jwtAuth);

router.post('/add', jwtAuth,journalController.createEntry);
router.get('/', jwtAuth, journalController.getEntries);

module.exports = router;
