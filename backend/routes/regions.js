const express = require('express');
const router = express.Router();
const { getRegions } = require('../controllers/regionsController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, getRegions);

module.exports = router;
