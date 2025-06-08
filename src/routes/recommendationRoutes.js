const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { ensureAuthenticated } = require('../middlewares/auth');
const jwtAuth = require('../middlewares/jwtAuth');

// router.use(ensureAuthenticated);
router.use(jwtAuth);

router.post('/add', jwtAuth, recommendationController.createRecommendation);
router.get('/', jwtAuth, recommendationController.getRecommendations);

module.exports = router;
