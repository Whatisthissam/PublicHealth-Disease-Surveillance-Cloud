const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboardController');
const { authenticate } = require('../middlewares/auth');

router.get('/stats', authenticate, getStats);

module.exports = router;
