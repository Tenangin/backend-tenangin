const express = require('express');
const router = express.Router();
const clinicsController = require('../controllers/clinicsController');

router.get('/', clinicsController.getClinics);

module.exports = router;
