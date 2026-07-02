const express = require('express');
const router = express.Router();
const { signup, login, verifyToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', protect, verifyToken);

module.exports = router;
