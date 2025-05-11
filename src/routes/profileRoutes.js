const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { jwtAuth } = require('../middlewares/auth');

// Add JWT authentication middleware to protect profile routes
router.post('/add', jwtAuth, userController.createProfile);
router.get('/', jwtAuth, userController.getProfile);
router.put('/edit', jwtAuth, userController.updateProfile);

module.exports = router;
