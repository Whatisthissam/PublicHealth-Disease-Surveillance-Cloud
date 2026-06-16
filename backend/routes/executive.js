const express = require('express');
const router = express.Router();
const { getExecutiveSummary } = require('../controllers/executiveController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin', 'manager'), getExecutiveSummary);

module.exports = router;
