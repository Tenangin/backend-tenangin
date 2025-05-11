const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { jwtAuth } = require('../middlewares/auth');

router.post('/add', jwtAuth, assessmentController.createAssessment);
router.get('/', jwtAuth, assessmentController.getAssessments);

module.exports = router;
