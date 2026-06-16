const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/usersController');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin'), getAll);
router.get('/:id', authenticate, authorize('admin'), getById);
router.post('/', authenticate, authorize('admin'), create);
router.put('/:id', authenticate, authorize('admin'), update);
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
