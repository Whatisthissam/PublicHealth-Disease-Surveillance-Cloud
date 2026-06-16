const express = require('express');
const router = express.Router();
const { getMonitoringData, acknowledgeAlert, createAlert } = require('../controllers/monitoringController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, getMonitoringData);
router.put('/alerts/:id/acknowledge', authenticate, acknowledgeAlert);
router.post('/alerts', authenticate, authorize('admin', 'manager'), createAlert);

module.exports = router;
