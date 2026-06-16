const express = require('express');
const router = express.Router();
const { login, getProfile, logout, register } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

router.post('/login', login);
router.post('/register', register);
router.get('/profile', authenticate, getProfile);
router.post('/logout', authenticate, logout);

module.exports = router;
