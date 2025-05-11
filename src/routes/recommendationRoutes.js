const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { ensureAuthenticated } = require('../middlewares/auth');

router.use(ensureAuthenticated);

router.post('/', recommendationController.createRecommendation);
router.get('/', recommendationController.getRecommendations);

module.exports = router;
