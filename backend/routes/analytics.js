const express = require('express');
const router = express.Router();
const { getAnalytics, getReports, createReport } = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/data', authenticate, getAnalytics);
router.get('/reports', authenticate, getReports);
router.post('/reports', authenticate, authorize('admin', 'manager'), createReport);

module.exports = router;
