const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/casesController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, getAll);
router.get('/:id', authenticate, getById);
router.post('/', authenticate, authorize('admin', 'manager', 'staff'), create);
router.put('/:id', authenticate, authorize('admin', 'manager', 'staff'), update);
router.delete('/:id', authenticate, authorize('admin', 'manager'), remove);

module.exports = router;
