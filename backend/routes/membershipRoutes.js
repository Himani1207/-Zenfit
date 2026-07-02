const express = require('express');
const router = express.Router();
const { upgradeMembership } = require('../controllers/membershipController');
const { protect } = require('../middleware/auth');

router.post('/upgrade', protect, upgradeMembership);

module.exports = router;
