const Trainer = require('../models/Trainer');
const Booking = require('../models/Booking');
const User = require('../models/User');
const XPService = require('../services/XPService');
const AchievementService = require('../services/AchievementService');

const getTrainers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { specialty: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const trainers = await Trainer.find(query);
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.status(200).json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookSession = async (req, res) => {
  try {
    const { trainerId, timeSlot } = req.body;
    if (!trainerId || !timeSlot) {
      return res.status(400).json({ message: 'Trainer ID and time slot are required' });
    }

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new booking
    const booking = await Booking.create({
      userId: user._id,
      trainerId: trainer._id,
      trainerName: trainer.name,
      userName: user.name,
      userEmail: user.email,
      timeSlot,
      status: 'upcoming',
      date: new Date()
    });

    // Award XP (+40 XP)
    const result = XPService.addXP(user, XPService.REWARDS.BOOKING);
    user.level = result.user.level;
    user.xp = result.user.xp;
    user.xpToNextLevel = result.user.xpToNextLevel;

    // Check achievement for booking first session
    const bookingsCount = await Booking.countDocuments({ userId: user._id });
    let unlockedBadges = [];
    if (bookingsCount === 1) {
      // Unlock badge "Coached Athlete"
      if (!user.badges.includes('Coached Athlete')) {
        user.badges.push('Coached Athlete');
        unlockedBadges.push('Coached Athlete');
      }
    }

    await user.save();

    res.status(201).json({
      message: 'Booking successful',
      booking,
      xpGained: XPService.REWARDS.BOOKING,
      leveledUp: result.leveledUp,
      unlockedBadges
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ date: -1 });
    
    // Categorize
    const now = new Date();
    const upcoming = [];
    const past = [];
    const cancelled = [];
    const completed = [];

    bookings.forEach(b => {
      if (b.status === 'cancelled') {
        cancelled.push(b);
      } else if (b.status === 'completed') {
        completed.push(b);
      } else {
        // Evaluate if upcoming or past dynamically if status is 'upcoming' but date is past
        // Let's assume booking slot is on the day of date. For simplicity, check date.
        const diffHours = (now - new Date(b.date)) / (1000 * 60 * 60);
        if (diffHours > 24) {
          // auto mark completed
          b.status = 'completed';
          b.save();
          completed.push(b);
        } else {
          upcoming.push(b);
        }
      }
    });

    res.status(200).json({
      all: bookings,
      upcoming,
      past: [...past, ...completed],
      cancelled,
      completed
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrainers,
  getTrainerById,
  bookSession,
  getBookingHistory,
  cancelBooking
};
