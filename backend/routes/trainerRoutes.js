const express = require('express');
const router = express.Router();
const {
  getTrainers,
  getTrainerById,
  bookSession,
  getBookingHistory,
  cancelBooking
} = require('../controllers/trainerController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTrainers);
router.get('/:id', protect, getTrainerById);
router.post('/book', protect, bookSession);
router.get('/bookings/history', protect, getBookingHistory);
router.put('/bookings/:id/cancel', protect, cancelBooking);

module.exports = router;
