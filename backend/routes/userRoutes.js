const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  toggleChecklist,
  logWater,
  getActivityTimeline,
  getActivityCalendar,
  getTodayDailyMission
} = require('../controllers/userController');
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/checklist/toggle', protect, toggleChecklist);
router.post('/water/log', protect, logWater);
router.get('/timeline', protect, getActivityTimeline);
router.get('/dashboard', protect, getDashboard);
router.get('/activity-calendar', protect, getActivityCalendar);
router.get('/daily-mission/today', protect, getTodayDailyMission);

module.exports = router;
