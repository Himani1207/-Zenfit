const User = require('../models/User');
const BMIService = require('../services/BMIService');
const ProgressService = require('../services/ProgressService');
const XPService = require('../services/XPService');
const AchievementService = require('../services/AchievementService');
const ActivityService = require('../services/ActivityService');
const DailyMission = require('../models/DailyMission');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user.id)
      .select('-password')
      .populate('savedWorkouts');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check and reset streak if a day was missed
    user = await ActivityService.checkAndResetStreak(user);
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, age, height, weight, fitnessGoal } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (age) user.age = Number(age);
    
    let weightChanged = false;
    if (weight && Number(weight) !== user.weight) {
      user.weight = Number(weight);
      weightChanged = true;
      // Record weight history
      user.weightHistory.push({ weight: user.weight, date: new Date() });
    }
    
    if (height) user.height = Number(height);
    if (fitnessGoal) user.fitnessGoal = fitnessGoal;

    // Recalculate BMI
    user.bmi = BMIService.calculate(user.weight, user.height);

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleChecklist = async (req, res) => {
  try {
    const { item } = req.body; // 'workout', 'meal', 'water', 'stretch', 'sleep'
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await ProgressService.updateChecklist(user, item);
    user = result.user;
    await user.save();

    res.status(200).json({
      message: `${item} status updated`,
      checklist: user.checklist,
      weeklyCalendar: user.weeklyCalendar,
      streak: user.streak,
      level: user.level,
      xp: user.xp,
      xpToNextLevel: user.xpToNextLevel,
      xpGained: result.xpGained,
      leveledUp: result.leveledUp,
      unlockedBadges: result.unlockedBadges,
      dailyMission: result.dailyMission,
      missionCompletedNow: result.missionCompletedNow
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logWater = async (req, res) => {
  try {
    const { amount } = req.body; // e.g. 250 (ml)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.waterIntake = (user.waterIntake || 0) + Number(amount);
    
    // Check if water goal completed
    let xpGained = 0;
    let leveledUp = false;
    let unlockedBadges = [];

    // Ticking water in checklist if they exceed 2000 ml
    if (user.waterIntake >= 2000 && !user.checklist.water) {
      const result = await ProgressService.updateChecklist(user, 'water');
      Object.assign(user, result.user);
      xpGained = result.xpGained;
      leveledUp = result.leveledUp;
      unlockedBadges = result.unlockedBadges;
    } else {
      // Just award 5 XP for log
      const xpRes = XPService.addXP(user, 5);
      leveledUp = xpRes.leveledUp;
      xpGained = 5;
    }

    await user.save();
    res.status(200).json({
      message: 'Water logged successfully',
      waterIntake: user.waterIntake,
      checklist: user.checklist,
      streak: user.streak,
      level: user.level,
      xp: user.xp,
      xpGained,
      leveledUp,
      unlockedBadges
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityTimeline = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookings = [];

    // Compile dynamic history
    const timeline = [];

    // Add checklist achievements
    if (user.checklist.workout) {
      timeline.push({ time: 'Today', type: 'workout', text: 'Workout Completed' });
    }
    if (user.checklist.meal) {
      timeline.push({ time: 'Today', type: 'meal', text: 'Healthy Meals Tracked' });
    }
    if (user.waterIntake > 0) {
      timeline.push({ time: 'Today', type: 'water', text: `Log: Drank ${user.waterIntake}ml water` });
    }

    // Add bookings
    bookings.forEach(b => {
      const dateLabel = new Date(b.date).toDateString() === new Date().toDateString() ? 'Today' : 'This Week';
      timeline.push({
        time: dateLabel,
        type: 'booking',
        text: `Trainer Session Booked with ${b.trainerName} at ${b.timeSlot}`
      });
    });

    // Add weight updates
    user.weightHistory.slice(-3).forEach(wh => {
      const dateLabel = new Date(wh.date).toDateString() === new Date().toDateString() ? 'Today' : 'Yesterday';
      timeline.push({
        time: dateLabel,
        type: 'weight',
        text: `Weight Logged: ${wh.weight} kg`
      });
    });

    // Add badges
    user.badges.forEach(badge => {
      timeline.push({
        time: 'This Week',
        type: 'badge',
        text: `Achievement Unlocked: ${badge}`
      });
    });

    // Fallback if empty
    if (timeline.length === 0) {
      timeline.push({ time: 'Today', type: 'info', text: 'Started your fitness journey!' });
    }

    // Sort by type priority or just slice
    res.status(200).json({ timeline: timeline.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityCalendar = async (req, res) => {
  try {
    const logs = await DailyMission.find({ userId: req.user.id }).sort({ date: 1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTodayDailyMission = async (req, res) => {
  try {
    const mission = await ActivityService.getTodayMission(req.user.id);
    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  toggleChecklist,
  logWater,
  getActivityTimeline,
  getActivityCalendar,
  getTodayDailyMission
};
