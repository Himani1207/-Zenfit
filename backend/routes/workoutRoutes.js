const express = require('express');
const router = express.Router();
const {
  getExercises,
  getWorkoutSessions,
  getWorkoutSessionById,
  toggleFavoriteSession,
  getFavoriteSessions,
  getWorkoutHistory,
  completeWorkoutSession,
  getWorkoutPrograms,
  getWorkoutProgramById,
  enrollInWorkoutProgram,
  getUserWorkoutProgramProgress,
  completeWorkoutProgramDay
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

// Exercises & Sessions
router.get('/exercises', protect, getExercises);
router.get('/sessions', protect, getWorkoutSessions);
router.get('/sessions/:id', protect, getWorkoutSessionById);
router.post('/sessions/:id/complete', protect, completeWorkoutSession);

// Favorites & History
router.post('/sessions/favorite', protect, toggleFavoriteSession);
router.get('/favorites', protect, getFavoriteSessions);
router.get('/history', protect, getWorkoutHistory);

// Workout Programs
router.get('/programs', protect, getWorkoutPrograms);
router.post('/programs/enroll', protect, enrollInWorkoutProgram);
router.get('/programs/progress', protect, getUserWorkoutProgramProgress);
router.get('/programs/:id', protect, getWorkoutProgramById);
router.post('/programs/:programId/complete-day', protect, completeWorkoutProgramDay);

// Fallback old endpoint for backward compatibility (maps to getExercises)
router.get('/', protect, getExercises);
router.post('/favorite', protect, toggleFavoriteSession);

module.exports = router;
