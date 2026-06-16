const express = require('express');
const router = express.Router();
const { getAll, updateStatus, create, getAuditLog } = require('../controllers/workflowController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, getAll);
router.post('/', authenticate, authorize('admin', 'manager'), create);
router.put('/:id/status', authenticate, updateStatus);
router.get('/audit-log', authenticate, authorize('admin', 'manager'), getAuditLog);

module.exports = router;
