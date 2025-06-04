const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/default-token', authController.getDefaultToken);

// Existing Google OAuth with passport
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback, authController.googleAuthSuccess);

// New Supabase OAuth login route
router.get('/login/google', authController.loginWithGoogleSupabase);
router.get('/google/callback', authController.googleCallbackHandler);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
